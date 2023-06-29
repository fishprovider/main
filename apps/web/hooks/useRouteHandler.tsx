import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Props {
  onStart?: (url: string) => void;
  onEnd?: (url: string) => void;
}

const useRouteHandler = ({ onStart, onEnd }: Props) => {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      setIsRouteChanging(true);
      if (onStart) onStart(url);
    };

    const handleRouteChangeEnd = (url: string) => {
      setIsRouteChanging(false);
      if (onEnd) onEnd(url);
    };

    const handleRouteChangeError = () => {
      setIsRouteChanging(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isRouteChanging;
};

export default useRouteHandler;
