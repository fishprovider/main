type Props = JSX.IntrinsicElements['tbody'];

function TBody({ children, ...rest }: Props) {
  return (
    <tbody {...rest}>{children}</tbody>
  );
}

export default TBody;
