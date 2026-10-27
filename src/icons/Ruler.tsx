import { type SVGProps } from "react";


const Ruler = (props: SVGProps<SVGSVGElement>) => {
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
        d="m1.647 10.354 8.707-8.707a.5.5 0 0 1 .707 0l3.293 3.292a.5.5 0 0 1 0 .708l-8.707 8.707a.5.5 0 0 1-.707 0L1.647 11.06a.5.5 0 0 1 0-.707M8 4l2 2M6 6l2 2M4 8l2 2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default Ruler;
