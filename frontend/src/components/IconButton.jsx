import { useSpring, animated } from '@react-spring/web';

export default function IconButton({ icon, label, isActive, onClick }) {
  const [style, api] = useSpring(() => ({ scale: 1 }));

  return (
    <div className="tooltip tooltip-right" data-tip={label || ''}>
      <animated.button
        onMouseEnter={() => api.start({ scale: 1.1 })}
        onMouseLeave={() => api.start({ scale: 1 })}
        onMouseDown={() => api.start({ scale: 0.9 })}
        onMouseUp={() => api.start({ scale: 1 })}
        style={{ transform: style.scale.to(s => `scale(${s})`) }}
        onClick={onClick}
        className={`btn btn-square ${isActive ? 'btn-primary' : 'btn-ghost'}`}
      >
        {icon}
      </animated.button>
    </div>
  );
}
