import { type SVGProps } from "react";

const Info = (props: SVGProps<SVGSVGElement>) => {
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
        d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m-.5-6.5H8V11h.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.067"
      />
      <circle cx="7.875" cy="5.25" r="0.75" fill="CurrentColor" />
    </svg>
  );
};

export default Info;
