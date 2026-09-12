import { type SVGProps } from "react";

const LockSimple = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      fill="none"
      viewBox="0 0 8 8"
      {...props}
    >
      <path
        stroke="CurrentColor"
        d="M6.5 2.75h-5a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h5a.25.25 0 0 0 .25-.25V3a.25.25 0 0 0-.25-.25m-3.75 0v-1a1.25 1.25 0 0 1 2.5 0v1"
        clipPath="url(#a)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LockSimple;