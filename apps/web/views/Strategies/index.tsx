import dynamic from 'next/dynamic';

const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

const Intro = dynamic(() => import('./Intro'));

const StrategyCatalog = dynamic(() => import('./StrategyCatalog'));

function Strategies() {
  return (
    <>
      <ContentSection>
        <Intro />
      </ContentSection>
      <StrategyCatalog />
    </>
  );
}

export default Strategies;
