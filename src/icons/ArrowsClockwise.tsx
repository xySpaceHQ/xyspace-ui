import { type SVGProps } from "react";

const ArrowsClockwise = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      {...props}
    >
      <g
        stroke="CurrentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".875"
      >
        <path d="M7.517 4.295h2.148V2.148" />
        <path d="M9.665 4.295 8.399 3.03a3.94 3.94 0 0 0-5.535-.032M3.938 7.16H1.79v2.147" />
        <path d="m1.79 7.16 1.265 1.264a3.94 3.94 0 0 0 5.536.033" />
      </g>
    </svg>
  );
};

export default ArrowsClockwise;
