// FuturisticLines.js - Smoother Continuous Animation
import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { useSprings, animated, config } from '@react-spring/web';
import './styles.css';

// --- Configuration ---
const NUM_LINES = 40; // More lines for a busier, smoother look
const NUM_NODES = 50;
const NODE_SIZE = 4;

export const FuturisticLines = () => {
  const [lineStyles, setLineStyles] = useState([]);

  // Generate random node positions once
  const nodeProps = useMemo(
    () =>
      Array.from({ length: NUM_NODES }, () => {
        const x = Math.random() * 95 + 2.5;
        const y = Math.random() * 95 + 2.5;
        return {
          x,
          y,
          left: `${x}vw`,
          top: `${y}vh`,
          width: `${NODE_SIZE}px`,
          height: `${NODE_SIZE}px`,
        };
      }),
    []
  );

  // Node pulse animation
  const [nodeSprings, nodeApi] = useSprings(NUM_NODES, () => ({
    from: { scale: 1, boxShadow: '0 0 4px 1px rgba(255, 215, 0, 0.7)' },
    config: { ...config.wobbly, tension: 300, friction: 10 },
  }));

  // Line animation springs - slower and smoother
  const [lineSprings, lineApi] = useSprings(NUM_LINES, () => ({
    from: { opacity: 0, scaleX: 0 },
    config: { tension: 120, friction: 30 }, // slower and smoother
  }));

  // Function to animate a single line
  const animateLine = useCallback(
    (i) => {
      const startNodeIndex = Math.floor(Math.random() * NUM_NODES);
      let endNodeIndex;
      do {
        endNodeIndex = Math.floor(Math.random() * NUM_NODES);
      } while (startNodeIndex === endNodeIndex);

      const startNode = nodeProps[startNodeIndex];
      const endNode = nodeProps[endNodeIndex];

      const dx = endNode.x - startNode.x;
      const dy = endNode.y - startNode.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Update line style
      setLineStyles((currentStyles) => {
        const newStyles = [...currentStyles];
        newStyles[i] = {
          left: `${startNode.x}vw`,
          top: `${startNode.y}vh`,
          width: `${distance}vw`,
          transform: `rotate(${angle}deg)`,
        };
        return newStyles;
      });

      // Animate the line
      lineApi.start({
        to: async (next) => {
          await next({ opacity: 1, scaleX: 1, config: { tension: 120, friction: 30 } });
          await next({ opacity: 0, scaleX: 0, config: { tension: 80, friction: 50 }, delay: 1500 });
        },
        from: { opacity: 0, scaleX: 0 },
        onRest: () => {
          // Pulse the end node
          nodeApi.start((nodeIndex) => {
            if (nodeIndex === endNodeIndex) {
              return {
                to: [
                  { scale: 1.5, boxShadow: '0 0 10px 3px rgba(255, 215, 0, 1)' },
                  { scale: 1, boxShadow: '0 0 4px 1px rgba(255, 215, 0, 0.7)' },
                ],
              };
            }
          });
          // Random delay before re-animating
          setTimeout(() => animateLine(i), Math.random() * 2000 + 500);
        },
      });
    },
    [nodeProps, lineApi, nodeApi, setLineStyles]
  );

  // Kick off all line animations on mount
  useEffect(() => {
    for (let i = 0; i < NUM_LINES; i++) {
      setTimeout(() => animateLine(i), Math.random() * 2000);
    }
  }, [animateLine]);

  return (
    <div className="bg-container circuit-board-bg">
      {nodeSprings.map((animatedStyle, i) => (
        <animated.div
          key={`node-${i}`}
          className="circuit-node"
          style={{ ...nodeProps[i], ...animatedStyle }}
        />
      ))}
      {lineSprings.map(({ opacity, scaleX }, i) => {
        const style = lineStyles[i] || {};
        return (
          <animated.div
            key={`line-${i}`}
            className="circuit-trace"
            style={{
              ...style,
              transform: scaleX.to((s) => `${style.transform || ''} scaleX(${s})`),
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};
