type Props = JSX.IntrinsicElements['tr'];

function Row({ children, ...rest }: Props) {
  return (
    <tr {...rest}>{children}</tr>
  );
}

export default Row;
