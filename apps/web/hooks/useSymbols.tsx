import _ from 'lodash';
import { useEffect, useState } from 'react';

const useSymbols = (newSymbols: string[]) => {
  const [symbols, setSymbols] = useState(newSymbols);

  useEffect(() => {
    if (newSymbols.length !== symbols.length || _.difference(newSymbols, symbols).length) {
      setSymbols(newSymbols);
    }
  }, [newSymbols, symbols]);

  return symbols;
};

export default useSymbols;
