import type { ExtendedRecordMap } from 'notion-types';

import { NotionPage } from '~components/view/NotionPage';
import OpenAI from '~components/view/OpenAI';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

export const getStaticProps = getDefaultStaticProps(notionPages.faq.rootId);

interface Props {
  recordMap: ExtendedRecordMap
  pageId: string
}

export default function Page({ pageId, recordMap }: Props) {
  return (
    <>
      <NotionPage
        recordMap={recordMap}
        pageId={pageId}
        rootPageId={notionPages.faq.rootId}
        basePath="faq"
      />
      <ContentSection>
        <Stack spacing="xs" py="xl">
          <Title size="h4">Still not resolve your problem, try asking here</Title>
          <OpenAI />
        </Stack>
      </ContentSection>
    </>
  );
}
