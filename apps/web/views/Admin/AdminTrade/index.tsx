import SymbolsSelect from '~components/price/SymbolsSelect';

import KeyLevelEditor from './KeyLevelEditor';
import TrendEditor from './TrendEditor';

function AdminTrade() {
  return (
    <>
      <SymbolsSelect />
      <TrendEditor />
      <KeyLevelEditor />
    </>
  );
}

export default AdminTrade;
