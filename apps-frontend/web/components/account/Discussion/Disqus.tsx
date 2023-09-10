import { DiscussionEmbed } from 'disqus-react';

import Box from '~ui/core/Box';

interface Props {
  url: string;
  id: string;
  title: string;
}

function DisqusComments({ url, id, title }: Props) {
  return (
    <Box bg="white">
      <DiscussionEmbed
        shortname="fishprovider"
        config={{
          url,
          identifier: id,
          title,
        }}
      />
    </Box>
  );
}
export default DisqusComments;
