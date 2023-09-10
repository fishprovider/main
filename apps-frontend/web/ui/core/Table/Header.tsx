type Props = JSX.IntrinsicElements['th'];

function Header({ children, ...rest }: Props) {
  return (
    <th {...rest}>{children}</th>
  );
}

export default Header;
