import React from "react";
import classnames from "classnames";

const Size = ({ className, children }) => {
  const ref = React.useRef();
  const [size, setSize] = React.useState([0, 0]);

  React.useEffect(() => {
    const listener = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize([width, height]);
      }
    };

    listener();
    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, [ref]);

  const [width, height] = size;

  return (
    <div ref={ref} className={classnames("w-full h-full", className)}>
      {children({ width, height })}
    </div>
  );
};

export { Size };
