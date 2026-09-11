import { type SVGProps } from "react";

const X = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      fill="none"
      viewBox="0 0 13 13"
      {...props}
    >
      <path
        stroke="currentColor"
        d="M9.615 2.692 2.692 9.615m6.923 0L2.692 2.692"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".667"
      />
    </svg>
  );
};

export default X;
