// Calculates the Indian Air Quality Index (AQI) from PM2.5 concentration (µg/m³)
// Based on the CPCB (Central Pollution Control Board) standards.

const PM25_BREAKPOINTS = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },       // Good
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },    // Satisfactory
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },   // Moderate
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },  // Poor
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 }, // Very Poor
  { cLow: 251, cHigh: 1000, iLow: 401, iHigh: 500 } // Severe
];

export function calculateAQI(pm25: number): number {
  if (pm25 < 0) return 0;
  
  for (const bp of PM25_BREAKPOINTS) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }
  
  // If > 1000 (extreme), cap it or extrapolate
  return 500;
}

export function getAQICategory(aqi: number): { label: string, color: string } {
  if (aqi <= 50) return { label: 'Good', color: '#00B050' }; // green
  if (aqi <= 100) return { label: 'Satisfactory', color: '#92D050' }; // light green
  if (aqi <= 200) return { label: 'Moderate', color: '#FFFF00' }; // yellow
  if (aqi <= 300) return { label: 'Poor', color: '#FF9900' }; // orange
  if (aqi <= 400) return { label: 'Very Poor', color: '#FF0000' }; // red
  return { label: 'Severe', color: '#C00000' }; // dark red
}
