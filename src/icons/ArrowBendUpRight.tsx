import { type SVGProps } from "react";

const ArrowBendUpRight = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="#A3A5AA"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.067"
      >
        <path d="m11 9.5 3-3-3-3" />
        <path d="M2 12.5a6 6 0 0 1 6-6h6" />
      </g>
    </svg>
  );
};

export default ArrowBendUpRight;
