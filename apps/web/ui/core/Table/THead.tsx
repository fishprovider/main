type Props = JSX.IntrinsicElements['thead'];

function THead({ children, ...rest }: Props) {
  return (
    <thead {...rest}>{children}</thead>
  );
}

export default THead;
