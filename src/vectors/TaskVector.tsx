import { type SVGProps } from "react";

const TaskVector = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="14"
      fill="none"
      viewBox="0 0 17 14"
      {...props}
    >
      <path
        fill="var(--surface-level-04)"
        stroke="var(--icon-active)"
        d="M14.975.6H1.225a.625.625 0 0 0-.625.625v11.25c0 .345.28.625.625.625h6.25L9.35 6.85l6.25-5.625A.625.625 0 0 0 14.975.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
};


export default TaskVector;