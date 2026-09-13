import { type SVGProps } from "react";

const Analysis = (props: SVGProps<SVGSVGElement>) => {
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
        d="M5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m-6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6-4v4m2-2H9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.067"
      />
    </svg>
  );
};
export default Analysis;
