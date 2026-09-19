import { type SVGProps } from "react";

const Upload = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <g
        stroke="CurrentColor"
        clipPath="url(#a)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".984"
      >
        <path d="M6.125 11.375H3.937a3.061 3.061 0 0 1-.526-6.079 3.1 3.1 0 0 1 1.288.05M6.563 8.75 8.313 7l1.75 1.75m-1.75 2.625V7" />
        <path d="M4.375 7a4.375 4.375 0 1 1 6.125 4.01" />
      </g>
    </svg>
  );
};

export default Upload;
