import { type SVGProps } from "react";

const BoundingBox = (props: SVGProps<SVGSVGElement>) => {
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
        <path d="M11.242 2.333H9.545a.424.424 0 0 0-.424.425v1.696c0 .235.19.425.424.425h1.697c.235 0 .424-.19.424-.425V2.758a.424.424 0 0 0-.424-.425m-6.787 0H2.758a.424.424 0 0 0-.425.425v1.697c0 .234.19.424.425.424h1.697c.234 0 .424-.19.424-.424V2.758a.424.424 0 0 0-.424-.425m6.787 6.788H9.545a.424.424 0 0 0-.424.424v1.697c0 .235.19.425.424.425h1.697c.235 0 .424-.19.424-.425V9.545a.424.424 0 0 0-.424-.424" />
        <path
          d="M4.455 9.121H2.758a.424.424 0 0 0-.425.424v1.697c0 .235.19.425.425.425h1.697c.234 0 .424-.19.424-.425V9.545a.424.424 0 0 0-.424-.424m-.849 0V4.879m5.515 5.515H4.88m5.514-5.515V9.12M4.879 3.606H9.12"
          strokeWidth=".875"
        />
      </g>
    </svg>
  );
};

export default BoundingBox;
