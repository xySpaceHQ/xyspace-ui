import { type SVGProps } from "react";

const Eye = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      fill="none"
      viewBox="0 0 13 13"
      {...props}
    >
      <g
        stroke="CurrentColor"
        clipPath="url(#a)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".667"
      >
        <path d="M6.154 2.692C2.308 2.692.769 6.154.769 6.154s1.539 3.461 5.385 3.461 5.385-3.461 5.385-3.461S10 2.692 6.154 2.692" />
        <path d="M6.154 8.077a1.923 1.923 0 1 0 0-3.846 1.923 1.923 0 0 0 0 3.846" />
      </g>
    </svg>
  );
};

export default Eye;