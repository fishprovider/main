import { useMediaQuery } from '@mantine/hooks';

const useMaxWidth = (maxWidth: string) => useMediaQuery(`(max-width: ${maxWidth})`);

export default useMaxWidth;
