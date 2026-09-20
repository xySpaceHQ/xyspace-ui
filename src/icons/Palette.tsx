import { type SVGProps } from "react";

const Palette = (props: SVGProps<SVGSVGElement>) => {
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
        d="M8 12a1.5 1.5 0 0 1 1.5-1.5h2.888a1.5 1.5 0 0 0 1.463-1.166A6 6 0 0 0 14 7.948C13.971 4.647 11.24 1.967 7.937 2A6 6 0 0 0 2 8c0 2.613 1.67 4.59 4 5.413A1.5 1.5 0 0 0 8 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        fill="CurrentColor"
        d="M8 5.5A.75.75 0 1 0 8 4a.75.75 0 0 0 0 1.5M5.25 7a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m0 3.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5m5.5-3.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
      />
    </svg>
  );
};

export default Palette;
