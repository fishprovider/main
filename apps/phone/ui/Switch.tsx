import { Switch as SwitchT, SwitchProps } from 'tamagui';

type Props = SwitchProps;

export default function Switch(props: Props) {
  return (
    <SwitchT
      theme="blue"
      {...props}
    />
  );
}

Switch.Thumb = SwitchT.Thumb;
