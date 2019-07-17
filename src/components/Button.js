import React from "react";
import css from "astroturf";

css`
  .button {
    @apply bg-green-500;
  }
`;

const Button = () => <button className="button">Hello world</button>;

export default Button;
