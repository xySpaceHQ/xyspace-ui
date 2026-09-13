import { type SVGProps } from "react";

const ArrowBendUpLeft = (props: SVGProps<SVGSVGElement>) => {
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
        <path d="m5 9.5-3-3 3-3" />
        <path d="M14 12.5a6 6 0 0 0-6-6H2" />
      </g>
    </svg>
  );
};

export default ArrowBendUpLeft;
