import { type SVGProps } from "react";

const SidebarSimple = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2.75" width="12" height="10.5" rx="2" />
        <path d="M6.5 2.75v10.5" />
      </g>
    </svg>
  );
};

export default SidebarSimple;
