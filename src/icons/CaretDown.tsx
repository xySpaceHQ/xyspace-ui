import { type SVGProps } from "react";

const CaretDown = (props: SVGProps<SVGSVGElement>) => {
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
        d="M11.375 5.25 7 9.625 2.625 5.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".875"
      />
    </svg>
  );
};

export default CaretDown;
