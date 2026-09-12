import { type SVGProps } from "react";

const Rows = (props: SVGProps<SVGSVGElement>) => {
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
        d="M13 9H3a.5.5 0 0 0-.5.5V12a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.5A.5.5 0 0 0 13 9m0-5.5H3a.5.5 0 0 0-.5.5v2.5A.5.5 0 0 0 3 7h10a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Rows;
