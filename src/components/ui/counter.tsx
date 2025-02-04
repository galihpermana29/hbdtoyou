'use client';

import { useEffect, useState } from 'react';

interface CounterProps {
  endValue: number;
}

export default function Counter({ endValue }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < endValue) {
      const timer = setTimeout(
        () => {
          setCount((prev) => Math.min(prev + 1, endValue));
        },
        endValue > 300 ? 2 : 8
      );
      return () => clearTimeout(timer);
    }
  }, [count, endValue]);

  return <span className="text-black text-5xl font-bold">{count}+</span>;
}
