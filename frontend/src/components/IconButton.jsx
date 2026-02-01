import { useSpring, animated } from '@react-spring/web';

export default function IconButton({ icon, label, isActive, onClick }) {
  const [style, api] = useSpring(() => ({ scale: 1 }));

  // Highlight animation (opacity + slide-in)
  const highlightSpring = useSpring({
    opacity: isActive ? 1 : 0,
    x: isActive ? 0 : -10, // slight slide in
    config: { tension: 250, friction: 20 },
  });

  return (
    <div className="tooltip tooltip-right" data-tip={label || ''}>
      <div className="relative flex items-center justify-center">
        {/* Highlight rectangle behind the button */}
        <animated.div
          style={{
            opacity: highlightSpring.opacity,
            transform: highlightSpring.x.to(x => `translateX(${x}px)`),

          }}

          className="absolute h-12 w-12 rounded-r-2xl left-0  z-0 bg-red-600/70"
        />

        {/* The actual icon button */}
        <animated.button
          onMouseEnter={() => api.start({ scale: 1.1 })}
          onMouseLeave={() => api.start({ scale: 1 })}
          onMouseDown={() => api.start({ scale: 0.9 })}
          onMouseUp={() => api.start({ scale: 1 })}
          style={{
            transform: style.scale.to(s => `scale(${s})`),
          }}
          onClick={onClick}
          className={`relative btn btn-square bg-transparent border-none  z-10`}
        >
          {icon}
        </animated.button>
      </div>
    </div>
  );
}
