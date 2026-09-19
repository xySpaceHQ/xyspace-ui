import { type SVGProps } from "react";

const GridFour = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <g stroke="CurrentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.938 2.625H3.061a.44.44 0 0 0-.437.438v7.874c0 .242.196.438.438.438h7.874a.44.44 0 0 0 .438-.437V3.061a.44.44 0 0 0-.437-.437M7 2.625v8.75" />
        <path d="M2.625 7h8.75" strokeWidth="1.05" />
      </g>
    </svg>
  );
};

export default GridFour;