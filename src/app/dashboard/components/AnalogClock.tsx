interface AnalogClockProps {
  time: Date
  city: string
}

export default function AnalogClock({ time, city }: AnalogClockProps) {
  // Calculate hand angles
  const secondAngle = (time.getSeconds() * 360) / 60
  const minuteAngle = ((time.getMinutes() + time.getSeconds() / 60) * 360) / 60
  const hourAngle = ((time.getHours() % 12 + time.getMinutes() / 60) * 360) / 12

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      <div className="text-sm font-medium text-gray-500 mb-2">{city}</div>
      <div className="relative w-24 h-24">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full border-2 border-[#006A71] bg-white">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-2 bg-[#006A71]"
              style={{
                transform: `rotate(${i * 30}deg) translateY(2px)`,
                transformOrigin: '50% calc(100% - 2px)',
                left: 'calc(50% - 2px)'
              }}
            />
          ))}
        </div>

        {/* Hour hand */}
        <div
          className="absolute w-1 h-3 bg-[#006A71] rounded-full"
          style={{
            height: '20%',
            width: '2px',
            transformOrigin: 'bottom center',
            transform: `rotate(${hourAngle}deg) translateY(-50%)`,
            bottom: '50%',
            left: 'calc(50% - 1px)'
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute w-1 h-4 bg-[#006A71] rounded-full"
          style={{
            height: '28%',
            width: '2px',
            transformOrigin: 'bottom center',
            transform: `rotate(${minuteAngle}deg) translateY(-50%)`,
            bottom: '50%',
            left: 'calc(50% - 1px)'
          }}
        />

        {/* Second hand */}
        <div
          className="absolute w-0.5 bg-red-500 rounded-full"
          style={{
            height: '30%',
            transformOrigin: 'bottom center',
            transform: `rotate(${secondAngle}deg) translateY(-50%)`,
            bottom: '50%',
            left: 'calc(50% - 0.5px)'
          }}
        />

        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-[#006A71] rounded-full" style={{ 
          top: 'calc(50% - 4px)', 
          left: 'calc(50% - 4px)'
        }} />
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true,
          timeZone: 'UTC'
        })}
      </div>
    </div>
  )
} 