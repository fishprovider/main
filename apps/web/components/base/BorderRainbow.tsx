import styled from '~ui/styles/styled';

interface Props {
  children: React.ReactNode;
  radius?: string;
  heightScale?: number;
}

const ContainerStyledDiv = styled('div')<Props>`
  position: relative;
  overflow: hidden;

  padding: 6px;
  border-radius: ${({ radius }) => radius};
`;

const RainbowStyledDiv = styled('div')<Props>`
  @keyframes spin{
    100% {
      transform: rotate(360deg);
    }
  }

  &:before{
    content: "";

    position: absolute;
    height: ${({ heightScale }) => (heightScale ? `${heightScale * 100}%` : '150%')};
    width: 150%;
    left: -25%;
    top: -25%;

    background: conic-gradient(
      #fd004c,
      #fe9000,
      #fff020,
      #3edf4b,
      #3363ff,
      #b102b7,
      #fd004c
    );
    animation: spin 1s infinite linear;
  }
`;

function BorderRainbow({
  children,
  radius,
  heightScale,
}: Props) {
  return (
    <ContainerStyledDiv radius={radius}>
      <RainbowStyledDiv heightScale={heightScale}>
        {children}
      </RainbowStyledDiv>
    </ContainerStyledDiv>
  );
}

export default BorderRainbow;
