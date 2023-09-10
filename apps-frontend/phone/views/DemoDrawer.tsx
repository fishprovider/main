import { useNavigation } from '@react-navigation/native';

import PushNotifDemo from '~components/PushNotifDemo';
import Button from '~ui/Button';
import Stack from '~ui/Stack';

export default function DemoDrawer() {
  const navigation = useNavigation<any>();
  return (
    <Stack center>
      <Button onPress={() => navigation.toggleDrawer()}>Toggle Drawer</Button>
      <PushNotifDemo />
    </Stack>
  );
}
