import { type SVGProps } from "react";

const Database = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        stroke="CurrentColor"
        clipPath="url(#a)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M12 12c4.556 0 8.25-2.015 8.25-4.5S16.556 3 12 3 3.75 5.015 3.75 7.5 7.444 12 12 12" />
        <path d="M3.75 7.5V12c0 2.485 3.694 4.5 8.25 4.5s8.25-2.015 8.25-4.5V7.5" />
        <path d="M3.75 12v4.5c0 2.485 3.694 4.5 8.25 4.5s8.25-2.015 8.25-4.5V12" />
      </g>
    </svg>
  );
};

export default Database;
