import { type SVGProps } from "react";

const GlobeHemisphereEast = (props: SVGProps<SVGSVGElement>) => {
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
        <path d="M7 12.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5" />
        <path d="m10.086 11.248-.512-.512a.44.44 0 0 0-.199-.115l-1.172-.308a.437.437 0 0 1-.321-.486l.13-.886a.44.44 0 0 1 .265-.34l1.665-.693a.44.44 0 0 1 .463.082l1.353 1.236m-8.997.872.543-.357a.44.44 0 0 0 .196-.363l.011-1.981a.44.44 0 0 1 .074-.241L4.73 5.444a.44.44 0 0 1 .62-.11l1.084.712a.44.44 0 0 0 .316.079l1.72-.233a.44.44 0 0 0 .273-.148L9.956 4.33a.44.44 0 0 0 .107-.284V2.734" />
      </g>
    </svg>
  );
};

export default GlobeHemisphereEast;
