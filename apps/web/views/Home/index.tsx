import dynamic from 'next/dynamic';

const PageSection = dynamic(() => import('~ui/layouts/PageSection'));
const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

const Intro = dynamic(() => import('./Intro'));
const Overview = dynamic(() => import('./Overview'));
const TopStrategies = dynamic(() => import('./TopStrategies'));
const CopyTrade = dynamic(() => import('./CopyTrade'));
const Gift = dynamic(() => import('./Gift'));

function Home() {
  return (
    <>
      <PageSection variant="light" bg="/banner.png">
        <ContentSection>
          <Intro />
        </ContentSection>
      </PageSection>
      <PageSection variant="light">
        <Overview />
      </PageSection>
      <PageSection variant="dark">
        <TopStrategies />
      </PageSection>
      <PageSection variant="light">
        <ContentSection>
          <CopyTrade />
        </ContentSection>
      </PageSection>
      <PageSection variant="dark">
        <ContentSection>
          <Gift />
        </ContentSection>
      </PageSection>
    </>
  );
}

export default Home;
