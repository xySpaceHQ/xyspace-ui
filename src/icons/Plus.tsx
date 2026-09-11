import { type SVGProps } from "react";

const Plus = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="currentColor"
        d="M2.5 8h11M8 2.5v11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default Plus;
