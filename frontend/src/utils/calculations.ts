export function getRiskColor(score: number): {
  color: string;
  bg: string;
  border: string;
  level: string;
} {
  if (score <= 30) {
    return {
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.3)',
      level: 'EXCELLENT'
    };
  }
  if (score <= 50) {
    return {
      color: '#0EA89A',
      bg: 'rgba(14, 168, 154, 0.1)',
      border: 'rgba(14, 168, 154, 0.3)',
      level: 'GOOD'
    };
  }
  if (score <= 75) {
    return {
      color: '#E6A23C',
      bg: 'rgba(230, 162, 60, 0.1)',
      border: 'rgba(230, 162, 60, 0.3)',
      level: 'MODERATE'
    };
  }
  return {
    color: '#D95353',
    bg: 'rgba(217, 83, 83, 0.1)',
    border: 'rgba(217, 83, 83, 0.3)',
    level: 'CRITICAL'
  };
}
