import { type SVGProps } from "react";

const Circle = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill="CurrentColor"
          d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12"
          opacity=".2"
        />
        <path
          stroke="CurrentColor"
          d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default Circle;