import { Tooltip as MTooltip, TooltipProps } from '@mantine/core';
import type { FloatingPosition } from '@mantine/core/lib/Floating';

interface Props extends TooltipProps {
  children: React.ReactNode;
  label: React.ReactNode;
  events?: {
    hover: boolean;
    focus: boolean;
    touch: boolean;
  };
  inline?: boolean;
  multiline?: boolean;
  withArrow?: boolean;
  position?: FloatingPosition;
}

function Tooltip({
  children,
  label,
  events = { hover: true, focus: true, touch: true },
  inline = true,
  multiline = true,
  withArrow = true,
  position,
  ...rest
}: Props) {
  return (
    <MTooltip
      label={label}
      events={events}
      inline={inline}
      multiline={multiline}
      withArrow={withArrow}
      position={position}
      {...rest}
    >
      <span>{children}</span>
    </MTooltip>
  );
}

export default Tooltip;
