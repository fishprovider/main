import { useEffect, useState } from 'react';

function useOnMount<T>(queryElement: () => T) {
  const [element, setElement] = useState<T>();

  useEffect(() => {
    const interval = setInterval(() => {
      const ele = queryElement();
      if (ele) {
        clearInterval(interval);
        setElement(ele);
      }
    }, 100);
    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // on mount only

  return element;
}

export default useOnMount;
