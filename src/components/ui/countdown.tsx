'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ price = 10000 }: { price?: number }) {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) {
      window.location.reload();
    } // Stop if the countdown is complete

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount or timer end
  }, [timeLeft]);

  // Format the time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  };

  return (
    <div className="countdown-timer text-center">
      <p className="font-bold text-[18px]">RP. {price}</p>
      <p className="">{formatTime(timeLeft)}</p>
      {/* <p className="text-[12px] text-red-500">
        Please complete the payment before the countdown
      </p> */}
    </div>
  );
}
