import { type SVGProps } from "react";

const Question = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g stroke="CurrentColor" strokeWidth="1.2">
        <path fill="CurrentColor" d="M8 11.1a.15.15 0 0 1 0 .3.15.15 0 0 1 0-.3Z" />
        <path
          d="M8 9v-.5c1.104 0 2-.784 2-1.75S9.104 5 8 5s-2 .784-2 1.75V7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Question;
