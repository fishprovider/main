import { FontAwesome } from '@expo/vector-icons';
import {
  Adapt, Select as SelectT, Sheet, Text,
} from 'tamagui';

interface Props {
  options: { value: string, label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Select({
  options, value, onChange, placeholder,
}: Props) {
  return (
    <SelectT value={value} onValueChange={onChange}>
      <SelectT.Trigger borderColor="black" iconAfter={<FontAwesome name="chevron-down" />}>
        <Text>{options.find((item) => item.value === value)?.label ?? placeholder}</Text>
      </SelectT.Trigger>

      <Adapt>
        <Sheet modal dismissOnSnapToBottom>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <SelectT.Content>
        <SelectT.Viewport>
          <SelectT.Group>
            {options.map((item, index) => (
              <SelectT.Item index={index} key={item.value} value={item.value}>
                <SelectT.ItemText>{item.label}</SelectT.ItemText>
              </SelectT.Item>
            ))}
          </SelectT.Group>
        </SelectT.Viewport>
      </SelectT.Content>
    </SelectT>
  );
}
