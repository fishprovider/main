import { Image as MImage, ImageProps } from '@mantine/core';

interface Props extends ImageProps {
  src?: string | null;
  alt?: string;
  imageProps?: Record<string, any>;
  height?: number | string;
  width?: number | string;
}

function Image({
  alt,
  height = 'auto',
  width = 'auto',
  imageProps,
  ...rest
}: Props) {
  return (
    <MImage
      alt={alt}
      height={height}
      width={width}
      imageProps={{
        title: alt,
        loading: 'lazy',
        height,
        width,
        ...imageProps,
      }}
      {...rest}
    />
  );
}

export default Image;
