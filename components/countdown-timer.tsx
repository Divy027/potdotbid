import { useState, useEffect } from "react";

export function CountdownTimer({ endTime, migrated }: any) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  function calculateTimeLeft(endTime: any) {
    const difference = endTime - new Date().getTime();
    const time = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
    return difference > 0 ? time : null;
  }

  if (!migrated) {
    return <span className="text-red-400">Countdown will be calculated after migration</span>;
  }

  if (!timeLeft) {
    return <span className="text-red-400">Time's up!</span>;
  }

  return (
    <span>
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
}
