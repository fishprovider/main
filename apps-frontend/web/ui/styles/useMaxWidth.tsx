import { useMediaQuery } from '@mantine/hooks';

const useMaxWidth = (maxWidth: string, initialValue?: boolean) => useMediaQuery(`(max-width: ${maxWidth})`, initialValue);

export default useMaxWidth;
