import { type SVGProps } from "react";

const LineSegment = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="#656972"
        d="M4 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m8-8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-1.06-.44-5.88 5.88"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.067"
      />
    </svg>
  );
};
export default LineSegment;
