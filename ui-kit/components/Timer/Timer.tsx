import React, { useEffect, useState } from 'react';

export interface IProps {
  className?: string;
  units: string;
  maxTime: number;
  onTimerStart: () => void;
  onTimerEnd: () => void;
}

export default ({
  maxTime,
  units,
  className,
  onTimerEnd,
  onTimerStart,
}: IProps) => {
  const [time, setTime] = useState<number>(maxTime);

  useEffect(() => {
    if (!time) {
      return;
    }

    const interval = setTimeout(() => {
      setTime(time - 1);

      if (time - 1 <= 0) {
        clearTimeout(interval);
        onTimerEnd();
      }
    }, 1000);

    return () => {
      clearTimeout(interval);
    };
  }, [time]);

  useEffect(() => {
    onTimerStart();

    return () => {
      onTimerEnd();
    };
  }, []);

  if (time < 1) {
    return null;
  }

  return (
    <div className={className}>
      {time} {units}
    </div>
  );
};
