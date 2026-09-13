import { type SVGProps } from "react";

const ArrowUp = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="none"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        stroke="#656972"
        d="M7.385 12.462V2.307M3.23 6.462l4.155-4.154 4.154 4.154"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".738"
      />
    </svg>
  );
};

export default ArrowUp;