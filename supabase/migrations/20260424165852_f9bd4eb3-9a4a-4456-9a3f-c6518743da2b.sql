-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'tecnico', 'cliente');
CREATE TYPE public.device_type AS ENUM ('gateway', 'ambiental', 'suelo', 'viento', 'solar', 'luminosidad');
CREATE TYPE public.alert_level AS ENUM ('info', 'warning', 'critical', 'success');
CREATE TYPE public.sensor_kind AS ENUM ('ambient_temp','humidity','soil_temp','wind_speed','solar_radiation','solar_power','luminosity');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles (separate table to prevent privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Farms
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  area_hectares NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- Devices
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  device_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  device_type device_type NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT true,
  signal_strength INT DEFAULT 100,
  firmware_version TEXT DEFAULT '2.4.1',
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Sensor readings
CREATE TABLE public.sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  ambient_temp NUMERIC,
  humidity NUMERIC,
  soil_temp NUMERIC,
  wind_speed NUMERIC,
  wind_direction NUMERIC,
  solar_radiation NUMERIC,
  solar_power NUMERIC,
  luminosity NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_readings_farm_time ON public.sensor_readings(farm_id, recorded_at DESC);
CREATE INDEX idx_readings_device_time ON public.sensor_readings(device_id, recorded_at DESC);

-- Alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  level alert_level NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_alerts_farm_time ON public.alerts(farm_id, created_at DESC);

-- Thresholds
CREATE TABLE public.thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  sensor_kind sensor_kind NOT NULL,
  min_value NUMERIC,
  max_value NUMERIC,
  warning_min NUMERIC,
  warning_max NUMERIC,
  enabled BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(farm_id, sensor_kind)
);
ALTER TABLE public.thresholds ENABLE ROW LEVEL SECURITY;

-- RLS Policies: profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS: user_roles
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS: farms
CREATE POLICY "Owners view own farms" ON public.farms FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins view all farms" ON public.farms FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners insert farms" ON public.farms FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins manage farms" ON public.farms FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners update own farms" ON public.farms FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own farms" ON public.farms FOR DELETE USING (auth.uid() = owner_id);

-- RLS: devices (via farm ownership)
CREATE POLICY "View devices of own farms" ON public.devices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = devices.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Manage devices of own farms" ON public.devices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = devices.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

-- RLS: sensor_readings
CREATE POLICY "View readings of own farms" ON public.sensor_readings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = sensor_readings.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Public insert readings" ON public.sensor_readings FOR INSERT WITH CHECK (true);

-- RLS: alerts
CREATE POLICY "View alerts of own farms" ON public.alerts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = alerts.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Update alerts of own farms" ON public.alerts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = alerts.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Public insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);

-- RLS: thresholds
CREATE POLICY "View thresholds of own farms" ON public.thresholds FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = thresholds.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Manage thresholds of own farms" ON public.thresholds FOR ALL USING (
  EXISTS (SELECT 1 FROM public.farms WHERE farms.id = thresholds.farm_id AND (farms.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

-- Trigger: auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, organization)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), NEW.raw_user_meta_data->>'organization');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;