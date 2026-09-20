import { type SVGProps } from "react";

const ClockCounterClockwise = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g
        stroke="CurrentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      >
        <path d="M8 5v3l2.5 1.5m-6-3H2V4" />
        <path d="M4.225 12a5.5 5.5 0 1 0-.114-7.89C3.375 4.857 2.768 5.559 2 6.5" />
      </g>
    </svg>
  );
};
export default ClockCounterClockwise;
