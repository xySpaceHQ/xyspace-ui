import { type SVGProps } from "react";

const ListMagnifyingGlass = (props: SVGProps<SVGSVGElement>) => {
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
        d="M1.923 3.077h8.462M1.923 6.154h3.462M1.923 9.23h4.23m2.693-.768a1.538 1.538 0 1 0 0-3.077 1.538 1.538 0 0 0 0 3.077m1.088-.451 1.22 1.22"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".769"
      />
    </svg>
  );
};

export default ListMagnifyingGlass;
