import React from "react";

function useD3(method) {
  const ref = React.useRef();

  React.useEffect(() => method(ref.current), [ref, method]);

  return [ref];
}

export default useD3;
