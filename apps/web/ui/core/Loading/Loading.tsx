// Important: Loading is used for lazy load, so keep it as minimal as possible

interface Props {
  src?: string;
  inline?: boolean;
  size?: number;
}

function Loading({
  src = '/logo.png',
  inline = false,
  size,
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`fp-loading ${inline ? 'fp-loading-inline' : ''}`}
      src={src}
      alt="Loading..."
      width={inline ? size || 30 : size || 60}
      height={inline ? size || 30 : size || 60}
    />
  );
}

export default Loading;
