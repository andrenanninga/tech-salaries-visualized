import React from "react";
import { GitCommit } from "react-feather";
import css from "astroturf";

css`
  .spin {
    animation: spin 1.2s ease-in-out infinite alternate;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg) scale(0.9);
      opacity: 0.4;
    }

    100% {
      transform: rotate(360deg);
      opacity: 1;
    }
  }
`;

const Loading = () => (
  <div className="flex flex-1 items-center justify-center text-indigo-500">
    <GitCommit className="spin" size={64} strokeWidth={1} />
  </div>
);

export { Loading };
