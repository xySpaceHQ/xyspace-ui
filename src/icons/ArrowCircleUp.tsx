import { type SVGProps } from "react";

const ArrowCircleUp = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        fill="CurrentColor"
        d="M9 15.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5"
        opacity=".2"
      />
      <path
        stroke="CurrentColor"
        d="M9 15.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
      />
      <path
        stroke="CurrentColor"
        d="M6.75 8.438 9 6.188l2.25 2.25M9 11.813V6.187"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.125"
      />
    </svg>
  );
};

export default ArrowCircleUp;
