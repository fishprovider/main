import { Table as MTable, TableProps } from '@mantine/core';

import Cell from './Cell';
import Header from './Header';
import Row from './Row';
import TBody from './TBody';
import THead from './THead';

interface Props extends TableProps {
  children: React.ReactNode;
}

function Table({
  highlightOnHover = true,
  verticalSpacing = 0,
  horizontalSpacing = 0,
  children,
  ...rest
}: Props) {
  return (
    <MTable
      highlightOnHover={highlightOnHover}
      verticalSpacing={verticalSpacing}
      horizontalSpacing={horizontalSpacing}
      {...rest}
    >
      {children}
    </MTable>
  );
}

Table.Row = Row;
Table.Header = Header;
Table.Cell = Cell;
Table.THead = THead;
Table.TBody = TBody;

export default Table;
