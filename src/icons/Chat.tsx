import { type SVGProps } from "react";

const Chat = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
      {...props}
    >
      <path
        stroke="CurrentColor"
        d="M3.175 16.18a.563.563 0 0 1-.925-.43V4.5a.563.563 0 0 1 .563-.562h12.375a.56.56 0 0 1 .562.562v9a.56.56 0 0 1-.562.563H5.624z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default Chat;
