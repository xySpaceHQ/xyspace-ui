import { type SVGProps } from "react";

const DownloadSimple = (props: SVGProps<SVGSVGElement>) => {
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
        <path d="M8 9V2m5.5 7v4h-11V9" />
        <path d="M10.5 6.5 8 9 5.5 6.5" />
      </g>
    </svg>
  );
};

export default DownloadSimple;
