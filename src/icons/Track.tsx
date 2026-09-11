import { type SVGProps } from "react";

const Track = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 12.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5" />
        <path d="M3.5 7A3.5 3.5 0 0 1 7 3.5M10.5 7A3.5 3.5 0 0 1 7 10.5" />
        <path
          d="M7 8.313a1.313 1.313 0 1 0 0-2.626 1.313 1.313 0 0 0 0 2.625"
          strokeWidth="1.313"
        />
      </g>
    </svg>
  );
};

export default Track;
