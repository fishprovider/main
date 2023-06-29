import { useToggle as useToggleM } from '@mantine/hooks';

const useToggle = (initialState = false) => useToggleM([initialState, !initialState]);

export default useToggle;
