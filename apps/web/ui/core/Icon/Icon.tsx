import { ActionIcon, Loader } from '@mantine/core';
import type { FloatingPosition } from '@mantine/core/lib/Floating';

import Link from '~components/base/Link';
import Tooltip from '~ui/core/Tooltip';

import getIconComponent from './getIconComponent';

interface Props {
  name: string;
  size?: 'small' | 'medium' | 'large' | number;
  color?: string;
  loading?: boolean;
  button?: boolean;
  buttonProps?: any;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  href?: string;
  tooltip?: string;
  tooltipPosition?: FloatingPosition;
}

function Icon({
  name,
  size,
  color,
  loading,
  button,
  buttonProps,
  onClick,
  disabled,
  href,
  tooltip,
  tooltipPosition,
}: Props) {
  const iconComponent = loading
    ? <Loader size="xs" />
    : getIconComponent({ name, size, color });

  const buttonComponent = button
    ? (
      <ActionIcon
        onClick={onClick}
        disabled={loading || disabled}
        color={color}
        {...buttonProps}
      >
        {iconComponent}
      </ActionIcon>
    )
    : iconComponent;

  const linkComponent = href
    ? <Link href={href} variant="clean">{buttonComponent}</Link>
    : buttonComponent;

  const tooltipComponent = tooltip
    ? <Tooltip label={tooltip} position={tooltipPosition}>{linkComponent}</Tooltip>
    : linkComponent;

  return tooltipComponent;
}

export default Icon;
