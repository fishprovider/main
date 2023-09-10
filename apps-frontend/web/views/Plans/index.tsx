import dynamic from 'next/dynamic';

const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

const Intro = dynamic(() => import('./Intro'));
const Compare = dynamic(() => import('./Compare'));

function Plans() {
  return (
    <>
      <ContentSection>
        <Intro />
      </ContentSection>
      <Compare />
    </>
  );
}

export default Plans;
