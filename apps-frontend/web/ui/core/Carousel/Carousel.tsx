import { Carousel as MCarousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

interface Props {
  slides: React.ReactNode[];
}

export default function Carousel({ slides }: Props) {
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  return (
    <MCarousel
      mx="auto"
      draggable
      dragFree
      withIndicators
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      {slides.map((slide, index) => (
        <MCarousel.Slide key={index}>{slide}</MCarousel.Slide>
      ))}
    </MCarousel>
  );
}
