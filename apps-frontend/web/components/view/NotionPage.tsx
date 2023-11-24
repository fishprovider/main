import { apiPost } from '@fishprovider/cross/dist/libs/api';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type {
  CollectionViewPageBlock, ExtendedRecordMap, PageBlock, SearchParams, SearchResults,
} from 'notion-types';
import {
  estimatePageReadTimeAsHumanizedString, getCanonicalPageId, getPageTitle,
  parsePageId,
} from 'notion-utils';
import { Breadcrumbs, NotionRenderer, Search } from 'react-notion-x';

// import TweetEmbed from 'react-tweet-embed';
import Link from '~components/base/Link';
import LoadingSteps from '~components/base/LoadingSteps';
import { watchUserInfoController } from '~controllers/user.controller';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code));
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then((m) => m.Collection));
const Equation = dynamic(() => import('react-notion-x/build/third-party/equation').then((m) => m.Equation));
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), { ssr: false });
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false });

// function Tweet({ id }: { id: string }) {
//   return <TweetEmbed tweetId={id} />;
// }

// clone from react-notion-x/packages/react-notion-x/src/components/header.tsx
// add custom style to work with the main navbar
function Header({ block }: {
  block: CollectionViewPageBlock | PageBlock,
}) {
  return (
    <header
      className="notion-header"
      style={{
        zIndex: 100,
        top: 50,
      }}
    >
      <div className="notion-nav-header">
        <Breadcrumbs block={block} />
        <Search block={block} />
      </div>
    </header>
  );
}

export interface NotionPageProps {
  recordMap: ExtendedRecordMap
  pageId: string
  rootPageId?: string
  basePath?: string
  withMeta?: boolean
  withEstimateReadTime?: boolean
  fullPage?: boolean
}

export function NotionPage({
  recordMap,
  pageId: pageIdRaw,
  rootPageId,
  basePath,
  withMeta = true,
  withEstimateReadTime = true,
  fullPage = true,
}: NotionPageProps) {
  const {
    theme,
  } = watchUserInfoController((state) => ({
    theme: state.theme,
  }));

  // useEffect(() => {
  //   if (!recordMap) return;
  //   const block = recordMap.block[parsePageId(pageIdRaw)]?.value;
  //   if (!block) return;

  //   const urls = getPageImageUrls(recordMap, { mapImageUrl: (url) => url });
  //   apiPost('/notion/getSignedUrls', { urls, blockId: block.id }).then(console.log);
  // }, [pageIdRaw, recordMap]);

  const router = useRouter();
  if (router.isFallback) {
    return (
      <Stack align="center" py="xl">
        <Title size="h2">Loading</Title>
        <LoadingSteps />
      </Stack>
    );
  }

  if (!recordMap) {
    return null;
  }

  const searchNotion = (params: SearchParams) => apiPost<SearchResults>('/notion/search', params);
  const mapPageUrl = (pageId: string) => {
    const seoUrl = getCanonicalPageId(pageId, recordMap);
    if (basePath) return `/${basePath}/${seoUrl}`;
    return `${seoUrl}`;
  };
  const renderPageHeader = (pageId: string) => {
    const block = recordMap.block[pageId]?.value;
    if (!block) return null;

    if (withEstimateReadTime) {
      const time = estimatePageReadTimeAsHumanizedString(block, recordMap, {
        wordsPerMinute: 275,
        imageReadTimeInSeconds: 12,
      });
      return <Text>{`${time} read`}</Text>;
    }

    return null;
  };

  const title = getPageTitle(recordMap);
  const pageId = parsePageId(pageIdRaw);

  return (
    <>
      {withMeta && (
        <Head>
          <title>{title}</title>
          <meta name="description" content={`FishProvider ${title}`} />
        </Head>
      )}

      <NotionRenderer
        recordMap={recordMap}
        components={{
          // NOTE (transitive-bullshit 3/12/2023): I'm disabling next/image for
          // this repo for now because the amount of traffic started costing me
          // hundreds of dollars a month in Vercel image optimization costs.
          // I'll probably re-enable it in the future if I can find a better solution.
          // nextImage: Image,
          nextLink: Link,
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          // Tweet,
          Header,
        }}
        pageHeader={renderPageHeader(pageId)}
        fullPage={fullPage}
        rootPageId={rootPageId}
        searchNotion={searchNotion}
        mapPageUrl={mapPageUrl}
        darkMode={theme === 'dark'}
        isImageZoomable
        showTableOfContents
        previewImages
        // NOTE: custom images will only take effect if previewImages is true and
        // if the image has a valid preview image defined in recordMap.preview_images[src]
      />
    </>
  );
}
