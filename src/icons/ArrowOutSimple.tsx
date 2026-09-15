import { type SVGProps } from "react";

const ArrowsOutSimple = (props: SVGProps<SVGSVGElement>) => {
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
        d="M10 3h3v3M9 7l4-4M6 13H3v-3m4-1-4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.067"
      />
    </svg>
  );
};
export default ArrowsOutSimple;
