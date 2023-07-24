import { YStack, YStackProps } from 'tamagui';

interface Props extends YStackProps {
  center?: boolean;
}

export default function Stack({
  center,
  ...rest
}: Props) {
  return (
    <YStack
      space="$2"
      {...(center && {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      })}
      {...rest}
    />
  );
}
