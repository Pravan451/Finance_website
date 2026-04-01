import { useState, useEffect } from 'react';

export default function useAnimatedCount(endInfo = 0, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const end = parseFloat(endInfo);
    if (isNaN(end)) return;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      
      // Easing out function (easeOutQuart)
      const easeOutQuart = 1 - Math.pow(1 - progressRatio, 4);
      setCount(end * easeOutQuart);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [endInfo, duration]);

  return count;
}
