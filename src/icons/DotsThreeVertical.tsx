import { type SVGProps } from "react";

const DotsThreeVertical = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      fill="none"
      viewBox="0 0 13 13"
      {...props}
    >
      <path
        stroke="CurrentColor"
        d="M6.154 6.73a.577.577 0 1 0 0-1.153.577.577 0 0 0 0 1.154Zm0-3.268a.577.577 0 1 0 0-1.154.577.577 0 0 0 0 1.154Zm0 6.538a.577.577 0 1 0 0-1.154.577.577 0 0 0 0 1.154Z"
        strokeWidth=".667"
      />
    </svg>
  );
};

export default DotsThreeVertical;