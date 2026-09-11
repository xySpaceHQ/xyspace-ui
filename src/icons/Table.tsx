import { type SVGProps } from "react";

const Table = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          stroke="currentColor"
          d="M1.75 3.063h10.5V10.5a.44.44 0 0 1-.437.438H2.188a.44.44 0 0 1-.438-.438zm0 2.625h10.5M1.75 8.313h10.5"
        />
        <path stroke="#3D3F44" d="M4.813 5.688v5.25" strokeWidth=".875" />
      </g>
    </svg>
  );
};
export default Table;
