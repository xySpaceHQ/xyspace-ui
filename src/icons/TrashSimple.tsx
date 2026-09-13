import { type SVGProps } from "react";

const TrashSimple = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="#B11B1D"
        d="M13.5 3.5h-11m3-2h5m2 2V13a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
};

export default TrashSimple;