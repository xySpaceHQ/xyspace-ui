import { type SVGProps } from "react";

const CaretUpDown = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="#3D3F44"
        d="m5 11 3 3 3-3M5 5l3-3 3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".8"
      />
    </svg>
  );
};

export default CaretUpDown;
