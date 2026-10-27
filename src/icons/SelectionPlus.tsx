import { type SVGProps } from "react";


const SelectionPlus = (props: SVGProps<SVGSVGElement>) => {
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
        d="M9 2.5H7m0 11h2m2.5-11H13a.5.5 0 0 1 .5.5v1.5m0 4.5V7m-11 0v2m2 4.5H3a.5.5 0 0 1-.5-.5v-1.5m2-9H3a.5.5 0 0 0-.5.5v1.5m11 7.5v3M12 13.5h3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default SelectionPlus;
