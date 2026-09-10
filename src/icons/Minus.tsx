import { type SVGProps } from "react";

const Minus = (props: SVGProps<SVGSVGElement>) => {
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
        d="M2.5 8h11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Minus;