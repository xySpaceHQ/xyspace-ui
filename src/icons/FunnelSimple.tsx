import { type SVGProps } from "react";

const FunnelSimple = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 14 14"
      {...props}
    >
      <path
        stroke="#3D3F44"
        d="M3.5 7.438h7M1.313 4.813h11.375m-7 5.25h2.625"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FunnelSimple;
