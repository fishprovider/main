import dynamic from 'next/dynamic';

import { NotionPageProps } from '~components/view/NotionPage';

const PageSection = dynamic(() => import('~ui/layouts/PageSection'));
const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

const Intro = dynamic(() => import('./Intro'));
const Overview = dynamic(() => import('./Overview'));
const TopStrategies = dynamic(() => import('./TopStrategies'));
const HotNews = dynamic(() => import('./HotNews'));
const Gift = dynamic(() => import('./Gift'));
const CopyTrade = dynamic(() => import('./CopyTrade'));

function Home(props: NotionPageProps) {
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
      <PageSection variant="blue">
        <TopStrategies />
      </PageSection>
      <PageSection variant="light">
        <HotNews {...props} />
      </PageSection>
      <PageSection variant="blue">
        <ContentSection>
          <Gift />
        </ContentSection>
      </PageSection>
      <PageSection variant="light">
        <ContentSection>
          <CopyTrade />
        </ContentSection>
      </PageSection>
    </>
  );
}

export default Home;
