import { type SVGProps } from "react";

const Scan = (props: SVGProps<SVGSVGElement>) => {
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
        d="M11 2.5h2.5V5M5 13.5H2.5V11m11 0v2.5H11M2.5 5V2.5H5M11 5H5v6h6z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
};
export default Scan;