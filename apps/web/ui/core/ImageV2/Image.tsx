import NextImage from 'next/image';

interface Props {
  alt: string;
  src: string;
  height?: number | `${number}`;
  width?: number | `${number}`;
  fill?: boolean | undefined;
}

function Image({
  alt,
  src,
  ...rest
}: Props) {
  return (
    <NextImage
      alt={alt}
      src={src}
      {...rest}
    />
  );
}

export default Image;
