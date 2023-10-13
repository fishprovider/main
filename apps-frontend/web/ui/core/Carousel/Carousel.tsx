import { Carousel as MCarousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

interface Props {
  slides: React.ReactNode[];
}

export default function Carousel({ slides }: Props) {
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  return (
    <MCarousel
      mx="auto"
      loop
      draggable={false}
      dragFree={false}
      withIndicators={false}
      withControls
      controlSize={30}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      {slides.map((slide, index) => (
        <MCarousel.Slide key={index} maw="100%" px="md">{slide}</MCarousel.Slide>
      ))}
    </MCarousel>
  );
}
