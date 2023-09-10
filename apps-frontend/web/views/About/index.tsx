import dynamic from 'next/dynamic';

const ContentSection = dynamic(() => import('~ui/layouts/ContentSection'));

const Intro = dynamic(() => import('./Intro'));
const Company = dynamic(() => import('./Company'));

function About() {
  return (
    <>
      <ContentSection>
        <Intro />
      </ContentSection>
      <Company />
    </>
  );
}

export default About;
