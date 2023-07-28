import { XStack, type XStackProps } from 'tamagui';

type Props = XStackProps;

export default function Group(props: Props) {
  return (
    <XStack
      space="$2"
      alignItems="center"
      {...props}
    />
  );
}
