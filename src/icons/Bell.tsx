import { type SVGProps } from "react";

const Bell = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="CurrentColor"
        d="M6.75 13.5a2.25 2.25 0 0 0 4.5 0M3.937 7.313a5.062 5.062 0 1 1 10.126 0c0 2.518.583 4.542 1.047 5.343a.563.563 0 0 1-.485.844H3.375a.563.563 0 0 1-.484-.844c.464-.801 1.046-2.826 1.046-5.344"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".9"
      />
    </svg>
  );
};

export default Bell;
