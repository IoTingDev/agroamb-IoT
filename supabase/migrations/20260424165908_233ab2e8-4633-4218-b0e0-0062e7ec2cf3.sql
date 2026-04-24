DROP POLICY IF EXISTS "Public insert readings" ON public.sensor_readings;
DROP POLICY IF EXISTS "Public insert alerts" ON public.alerts;

CREATE POLICY "Insert readings for valid device" ON public.sensor_readings FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.devices d WHERE d.id = sensor_readings.device_id AND d.farm_id = sensor_readings.farm_id)
);

CREATE POLICY "Insert alerts for valid farm" ON public.alerts FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.farms f WHERE f.id = alerts.farm_id)
);