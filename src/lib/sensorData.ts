// Realistic sensor data simulator for AgroSense 4.0

export type SensorReading = {
  timestamp: number;
  ambientTemp: number;
  humidity: number;
  soilTemp: number;
  windSpeed: number;
  windDirection: number; // degrees 0-360
  solarRadiation: number; // W/m²
  solarPower: number; // W
};

const baseSeed = {
  ambientTemp: 24,
  humidity: 62,
  soilTemp: 19,
  windSpeed: 3.2,
  windDirection: 145,
  solarRadiation: 720,
  solarPower: 4200,
};

let state = { ...baseSeed };

function drift(value: number, range: number, min: number, max: number) {
  const next = value + (Math.random() - 0.5) * range;
  return Math.max(min, Math.min(max, next));
}

export function nextReading(): SensorReading {
  state.ambientTemp = drift(state.ambientTemp, 0.4, 18, 35);
  state.humidity = drift(state.humidity, 1.5, 35, 90);
  state.soilTemp = drift(state.soilTemp, 0.2, 15, 28);
  state.windSpeed = drift(state.windSpeed, 0.5, 0, 18);
  state.windDirection = (state.windDirection + (Math.random() - 0.5) * 15 + 360) % 360;
  state.solarRadiation = drift(state.solarRadiation, 40, 0, 1100);
  state.solarPower = state.solarRadiation * 5.8 + (Math.random() - 0.5) * 200;
  return { timestamp: Date.now(), ...state };
}

export function seedHistory(count = 30): SensorReading[] {
  const arr: SensorReading[] = [];
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    arr.push({ ...nextReading(), timestamp: now - i * 5000 });
  }
  return arr;
}

export function getStatus(reading: SensorReading): 'optimal' | 'warning' | 'critical' {
  if (reading.ambientTemp > 33 || reading.humidity < 40 || reading.windSpeed > 15) return 'critical';
  if (reading.ambientTemp > 30 || reading.humidity < 50 || reading.windSpeed > 10) return 'warning';
  return 'optimal';
}
