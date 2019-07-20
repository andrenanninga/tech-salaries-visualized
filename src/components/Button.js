import React from "react";
import classnames from "classnames";

const Button = () => (
  <button
    className={classnames(
      "bg-gray-200",
      "px-4",
      "py-1",
      "rounded-lg",
      "shadow",
      "font-semibold",
      "text-gray-800",
      "border-2",
      "border-white",
      "hover:border-gray-100",
      "hover:shadow-lg"
    )}
  >
    Hello world
  </button>
);

export default Button;
