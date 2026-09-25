import { type SVGProps } from "react";

const SelectionAll = (props: SVGProps<SVGSVGElement>) => {
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
        d="M6.923 1.923H5.385m0 8.462h1.538m1.923-8.462H10a.385.385 0 0 1 .385.385v1.154m0 3.461V5.385m-1.539 5H10a.385.385 0 0 0 .385-.385V8.846M1.923 5.385v1.538m1.539 3.462H2.308A.385.385 0 0 1 1.923 10V8.846m1.539-6.923H2.308a.385.385 0 0 0-.385.385v1.154m6.539.384H3.846v4.616h4.616z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SelectionAll;
