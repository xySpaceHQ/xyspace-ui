import { type SVGProps } from "react";

const MapCard = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="49"
      height="49"
      fill="none"
      viewBox="0 0 49 49"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <g filter="url(#a)">
        <g clipPath="url(#b)">
          <path
            fill="#fff"
            d="M10.873 11.494a9.48 9.48 0 0 1 11.705-6.542l12.545 3.55a9.48 9.48 0 0 1 6.54 11.706l-3.55 12.544a9.48 9.48 0 0 1-11.705 6.541l-12.544-3.55a9.48 9.48 0 0 1-6.541-11.705z"
          />
          <path
            fill="url(#b)"
            d="M10.303-4.988h50.728v49.29H10.303z"
            transform="rotate(15.803 10.303 -4.988)"
          />
        </g>
        <path
          stroke="#F9F9FA"
          d="M10.873 11.494a9.48 9.48 0 0 1 11.705-6.542l12.545 3.55a9.48 9.48 0 0 1 6.54 11.706l-3.55 12.544a9.48 9.48 0 0 1-11.705 6.541l-12.544-3.55a9.48 9.48 0 0 1-6.541-11.705z"
          strokeWidth="1.107"
        />
      </g>
      <defs>
        <pattern
          id="b"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00129 .00133)" xlinkHref="#d" />
        </pattern>
        <filter
          id="a"
          width="48.987"
          height="48.987"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="2.37" />
          <feGaussianBlur stdDeviation="2.37" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0431373 0 0 0 0 0.0431373 0 0 0 0.04 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2210_239"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2210_239"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default MapCard;