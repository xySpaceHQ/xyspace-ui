import { type SVGProps } from "react";

const Check = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        stroke="CurrentColor"
        d="M11.667 3.5 5.25 9.917 2.333 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Check;