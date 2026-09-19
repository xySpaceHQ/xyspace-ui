import { type SVGProps } from "react";

const Hexagon = (props: SVGProps<SVGSVGElement>) => {
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
        stroke="CurrentColor"
        d="m7.21 1.367 4.813 2.635a.44.44 0 0 1 .227.383v5.23a.44.44 0 0 1-.227.383L7.21 12.633a.44.44 0 0 1-.42 0L1.978 9.998a.44.44 0 0 1-.228-.383v-5.23a.44.44 0 0 1 .228-.383L6.79 1.367a.44.44 0 0 1 .42 0"
        clipPath="url(#a)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Hexagon;