import { type SVGProps } from "react";

const GpsFix = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="currentColor"
        clipPath="url(#a)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".667"
      >
        <path d="M8 15v-2m0 0A5 5 0 1 0 8 3a5 5 0 0 0 0 10M8 1v2M1 8h2m12 0h-2" />
        <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
      </g>
    </svg>
  );
};

export default GpsFix;
