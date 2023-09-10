import _ from 'lodash';
import { useEffect, useState } from 'react';

import Loading from '~ui/core/Loading';

function LoadingSteps() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((item) => item + 1);
    }, 1000);
    return clearInterval(intervalId);
  }, []);

  return (
    <>
      {_.range(count).map((item) => <Loading key={item} inline size={10 * (item + 1)} />)}
    </>
  );
}

export default LoadingSteps;
