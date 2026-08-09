import { NormalizedReading } from '../types/environment';

export interface IDWGridPoint {
  lat: number;
  lng: number;
  value: number | null;
}

export interface IDWResult {
  parameter: string;
  grid: IDWGridPoint[];
  bounds: {
    min_lat: number;
    max_lat: number;
    min_lng: number;
    max_lng: number;
  };
  unit: string;
  min: number;
  max: number;
}

export function calculateIDW(
  samples: NormalizedReading[],
  parameter: string = 'pm25',
  gridSize: number = 100,
  power: number = 2.0
): IDWResult | null {
  if (!samples || samples.length === 0) return null;

  // Group by coordinates to handle hovering/duplicate locations
  const spatialGroups = new Map<string, number[]>();
  
  samples.forEach(s => {
    const lat = Number(s.location.latitude.toFixed(5));
    const lng = Number(s.location.longitude.toFixed(5));
    const val = Number(s.sensors?.[parameter] || 0);
    
    const key = `${lat},${lng}`;
    if (!spatialGroups.has(key)) {
      spatialGroups.set(key, []);
    }
    spatialGroups.get(key)!.push(val);
  });

  const lats: number[] = [];
  const lngs: number[] = [];
  const vals: number[] = [];

  spatialGroups.forEach((valList, key) => {
    const [latStr, lngStr] = key.split(',');
    const avgVal = valList.reduce((a, b) => a + b, 0) / valList.length;
    lats.push(parseFloat(latStr));
    lngs.push(parseFloat(lngStr));
    vals.push(avgVal);
  });

  if (lats.length === 0) return null;

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // 10% geographic padding
  const latSpan = maxLat > minLat ? maxLat - minLat : 0.005;
  const lngSpan = maxLng > minLng ? maxLng - minLng : 0.005;
  const latPad = latSpan * 0.10;
  const lngPad = lngSpan * 0.10;

  const gridMinLat = minLat - latPad;
  const gridMaxLat = maxLat + latPad;
  const gridMinLng = minLng - lngPad;
  const gridMaxLng = maxLng + lngPad;

  const latStep = (gridMaxLat - gridMinLat) / Math.max(1, gridSize - 1);
  const lngStep = (gridMaxLng - gridMinLng) / Math.max(1, gridSize - 1);

  const grid: IDWGridPoint[] = [];
  const maxRadius = 0.003; // ~300 meters clipping

  for (let i = 0; i < gridSize; i++) {
    const cellLat = gridMinLat + (i * latStep);
    for (let j = 0; j < gridSize; j++) {
      const cellLng = gridMinLng + (j * lngStep);

      let numerator = 0;
      let denominator = 0;
      let exactMatchVal: number | null = null;
      let minDist = Infinity;

      for (let k = 0; k < lats.length; k++) {
        const sLat = lats[k];
        const sLng = lngs[k];
        const sVal = vals[k];

        // Euclidean distance
        const dx = cellLat - sLat;
        const dy = cellLng - sLng;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < minDist) {
          minDist = d;
        }

        if (d < 1e-6) {
          exactMatchVal = sVal;
          break;
        }

        const weight = 1.0 / Math.pow(d, power);
        numerator += weight * sVal;
        denominator += weight;
      }

      // Clip areas that are too far from any sensor
      if (minDist > maxRadius) {
        grid.push({ lat: cellLat, lng: cellLng, value: null });
        continue; // Skip calculating value here
      }

      let interpolated = 0;
      if (exactMatchVal !== null) {
        interpolated = exactMatchVal;
      } else if (denominator > 0) {
        interpolated = numerator / denominator;
      } else {
        interpolated = vals.reduce((a, b) => a + b, 0) / vals.length;
      }

      grid.push({
        lat: cellLat,
        lng: cellLng,
        value: interpolated
      });
    }
  }

  const validVals = grid.filter(g => g.value !== null).map(g => g.value as number);
  const resultMin = validVals.length ? Math.min(...validVals) : 0;
  const resultMax = validVals.length ? Math.max(...validVals) : 0;

  return {
    parameter,
    grid,
    unit: '',
    bounds: {
      min_lat: gridMinLat,
      max_lat: gridMaxLat,
      min_lng: gridMinLng,
      max_lng: gridMaxLng
    },
    min: resultMin,
    max: resultMax
  };
}
