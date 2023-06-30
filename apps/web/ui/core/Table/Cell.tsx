type Props = JSX.IntrinsicElements['td'];

function Cell({ children, ...rest }: Props) {
  return (
    <td {...rest}>{children}</td>
  );
}
export default Cell;
