import { Skeleton as MSkeleton, SkeletonProps } from '@mantine/core';

interface Props extends SkeletonProps {
  height?: number | string;
}

function Skeleton({ height, ...rest }: Props) {
  return (
    <MSkeleton
      height={height}
      {...rest}
    />
  );
}

export default Skeleton;
