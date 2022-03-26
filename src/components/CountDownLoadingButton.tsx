/* eslint-disable react/prop-types */
import { useEffect, useState, forwardRef } from "react";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

type Props = LoadingButtonProps & {
  countDownSeconds: number;
  countDownIsRunning: boolean;
  setCountDownStop: () => void;
};

const CountDownLoadingButton = forwardRef<HTMLButtonElement, Props>(
  function CountDownLoadingButton(
    { countDownSeconds, countDownIsRunning, setCountDownStop, ...props },
    ref
  ) {
    const [seconds, setSeconds] = useState(countDownSeconds);

    useEffect(() => {
      if (countDownIsRunning) {
        if (seconds === 0) {
          setCountDownStop();
          setSeconds(countDownSeconds);
        } else if (seconds > 0) {
          const timeoutId = setTimeout(() => setSeconds((s) => s - 1), 1000);
          return () => clearTimeout(timeoutId);
        }
      }
    }, [seconds, countDownIsRunning, countDownSeconds, setCountDownStop]);

    return (
      <LoadingButton
        disabled={countDownIsRunning && seconds > 0}
        ref={ref}
        {...props}
      >
        {countDownIsRunning && seconds > 0 ? `${seconds}秒` : props.children}
      </LoadingButton>
    );
  }
);

export default CountDownLoadingButton;
