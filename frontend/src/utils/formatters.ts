export function formatCoordinate(val: number, isLat: boolean): string {
  const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
  return `${Math.abs(val).toFixed(4)}° ${dir}`;
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
}

export function getParameterUnit(param: string): string {
  const map: Record<string, string> = {
    pm25: 'µg/m³',
    pm10: 'µg/m³',
    co2: 'ppm',
    temperature: '°C',
    humidity: '%',
    windSpeed: 'm/s'
  };
  return map[param] || '';
}

export function getParameterLabel(param: string): string {
  const map: Record<string, string> = {
    pm25: 'PM2.5 Particulate',
    pm10: 'PM10 Coarse',
    co2: 'Carbon Dioxide (CO₂)',
    temperature: 'Ambient Temperature',
    humidity: 'Relative Humidity',
    windSpeed: 'Wind Velocity'
  };
  return map[param] || param.toUpperCase();
}
