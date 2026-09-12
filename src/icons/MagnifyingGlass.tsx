import { type SVGProps } from "react";

const MagnifyingGlass = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="CurrentColor"
        d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10m3.536-1.464L14 14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default MagnifyingGlass;