import { useEffect } from 'react';

const useScript = (id: string, src: string, onLoad?: () => void) => {
  useEffect(() => {
    const existingScript = document.getElementById(id);
    if (existingScript) {
      if (onLoad) onLoad();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      if (onLoad) onLoad();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, src]);
};
export default useScript;
