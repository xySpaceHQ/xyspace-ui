import { type SVGProps } from "react";

const SubtractSquare = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="#656972"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.067"
      >
        <path d="M10 2.5H2.5V10H10z" />
        <path d="M10 6h3.5v7.5H6V10m4 0 3.5 3.5m-3.5-7 3.5 3.5m-7 0 3.5 3.5" />
      </g>
    </svg>
  );
};

export default SubtractSquare;
