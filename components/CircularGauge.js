// Reusable SVG Arc Score Gauge Component for Samridhi
// Exposes the CircularGauge React component globally

window.CircularGauge = ({ score = 72, size = 170, strokeWidth = 10 }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;
  
  // Determine colors and classification
  let color = '#FF5252'; // Red
  let statusText = 'HIGH RISK';
  let statusBg = 'bg-samridhi-danger/10';
  let statusBorder = 'border-samridhi-danger/30';

  if (score > 40 && score <= 70) {
    color = '#FFB300'; // Yellow
    statusText = 'MEDIUM RISK';
    statusBg = 'bg-samridhi-warning/10';
    statusBorder = 'border-samridhi-warning/30';
  } else if (score > 70) {
    color = '#00E676'; // Green
    statusText = 'LOW RISK';
    statusBg = 'bg-samridhi-success/10';
    statusBorder = 'border-samridhi-success/30';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Back track */}
          <circle
            className="text-samridhi-border"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          {/* Animated value track */}
          <circle
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 5px ${color}60)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-samridhi-textPrimary leading-none">{score}</span>
          <span className="text-[10px] tracking-wider text-samridhi-textMuted font-bold uppercase mt-1">Score</span>
        </div>
      </div>
      <div className="mt-3">
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${statusBg} ${statusBorder} border`} style={{ color }}>
          {statusText}
        </span>
      </div>
    </div>
  );
};
