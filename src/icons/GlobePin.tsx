import { type SVGProps } from "react";

const Globepin = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <g stroke="CurrentColor">
        <path d="M8.521 7.85a.44.44 0 0 1-.612 0c-.75-.728-1.756-1.54-1.265-2.72a1.72 1.72 0 0 1 1.571-1.047c.67 0 1.307.409 1.572 1.046.49 1.179-.513 1.995-1.266 2.72Z" />
        <path
          d="M8.215 5.785h.005"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11.861 7A4.861 4.861 0 1 1 2.14 7a4.861 4.861 0 0 1 9.722 0Z" />
        <path
          d="m5.542 8.458-1.945 1.945m4.861.972L2.625 5.542"
          strokeLinecap="round"
          strokeWidth=".875"
        />
      </g>
    </svg>
  );
};

export default Globepin;
