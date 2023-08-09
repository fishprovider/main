import type {
  // GetStaticPathsContext,
  GetStaticPropsContext,
} from 'next';
import { NotionAPI } from 'notion-client';
import type { ExtendedRecordMap } from 'notion-types';
import { getAllPagesInSpace, getCanonicalPageId } from 'notion-utils';

import { isProd } from '~utils';

import { getPreviewImageMap } from './notionPreviewImage';

const notion = new NotionAPI();

async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId);

  // comment this line to disable preview images
  (recordMap as any).preview_images = await getPreviewImageMap(recordMap);

  return recordMap;
}

export const getDefaultStaticProps = (
  rootId: string,
) => async (
  context: GetStaticPropsContext,
) => {
  const pageId = (context.params?.pageId as string) || rootId;
  const recordMap = await getPage(pageId);
  return {
    props: {
      pageId,
      recordMap,
    },
    revalidate: 10,
  };
};

export const getDefaultStaticPaths = (
  rootId: string,
  basePath: string,
) => async () => {
  // TODO: handle locale in context: GetStaticPathsContext,

  const enabled = true;
  if (isProd && enabled) {
    // This crawls all public pages starting from the given root page in order
    // for next.js to pre-generate all pages via static site generation (SSG).
    // This is a useful optimization but not necessary; you could just as easily
    // set paths to an empty array to not pre-generate any pages at build time.
    const pages = await getAllPagesInSpace(
      rootId,
      undefined,
      getPage,
    );

    const mapPageUrl = async (pageId: string) => {
      const recordMap = await getPage(pageId);
      const seoUrl = getCanonicalPageId(pageId, recordMap);
      return `/${basePath}/${seoUrl}`;
    };

    const pageUrls = await Promise.all(Object.keys(pages)
      .map((pageId) => mapPageUrl(pageId)));

    const paths = pageUrls.filter((path) => path && path !== '/');

    return {
      paths,
      fallback: true,
    };
  }

  return {
    paths: [],
    fallback: true,
  };
};
