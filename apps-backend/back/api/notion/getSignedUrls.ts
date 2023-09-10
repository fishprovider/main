import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { NotionAPI } from 'notion-client';

const notion = new NotionAPI();

// public
const notionGetSignedUrls = async ({ data }: {
  data: {
    urls: string[],
    blockId: string,
  }
}) => {
  const { urls, blockId } = data;
  if (!urls?.length || !blockId) {
    return { error: ErrorType.badRequest };
  }

  const signedUrlRequests = urls.map((url) => ({
    permissionRecord: {
      table: 'block',
      id: blockId,
    },
    url,
  }));

  const result = await notion.getSignedFileUrls(signedUrlRequests);
  return { result };
};

export default notionGetSignedUrls;
