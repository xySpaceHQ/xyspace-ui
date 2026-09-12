import { type SVGProps } from "react";

const Ellipse = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="4"
      height="4"
      fill="none"
      viewBox="0 0 4 4"
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="CurrentColor" />
    </svg>
  );
};

export default Ellipse;
