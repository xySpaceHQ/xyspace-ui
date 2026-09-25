import { type SVGProps } from "react";

const Rectangle = (props: SVGProps<SVGSVGElement>) => {
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
        fill="CurrentColor"
        d="M13.5 3h-11a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5"
        opacity=".2"
      />
      <path
        stroke="CurrentColor"
        d="M13.5 3h-11a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};


export default Rectangle;