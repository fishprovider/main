import { Avatar as MAvatar, AvatarProps } from '@mantine/core';

interface Props extends AvatarProps {
  src?: string | null;
  alt?: string;
  imageProps?: Record<string, any>;
}

function Avatar({
  alt,
  radius = 'xl',
  imageProps,
  children,
  ...rest
}: Props) {
  return (
    <MAvatar
      alt={alt}
      radius={radius}
      imageProps={{
        title: alt,
        loading: 'lazy',
        height: 'auto',
        width: 'auto',
        ...imageProps,
      }}
      {...rest}
    >
      {children}
    </MAvatar>
  );
}

Avatar.Group = MAvatar.Group;

export default Avatar;
