import { Popover as MPopover } from '@mantine/core';

interface Props {
  children: React.ReactNode,
  content: React.ReactNode,
}

function Popover({
  children,
  content,
}: Props) {
  return (
    <MPopover withinPortal withArrow>
      <MPopover.Target>
        <span>
          {children}
        </span>
      </MPopover.Target>
      <MPopover.Dropdown maw="100%" onClick={(e) => e.preventDefault()}>
        {content}
      </MPopover.Dropdown>
    </MPopover>
  );
}

export default Popover;
