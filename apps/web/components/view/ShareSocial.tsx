import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import { isBrowser } from '~utils';

const url = isBrowser ? window.location.href : 'https://www.fishprovider.com';
const size = 30;

function ShareSocial() {
  return (
    <Stack align="center" py="xl" spacing="xs">
      <Title size="h4">Share now</Title>
      <Group spacing={0} position="center">
        <FacebookShareButton url={url}>
          <FacebookIcon round size={size} />
        </FacebookShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon round size={size} />
        </TwitterShareButton>
        <LinkedinShareButton url={url}>
          <LinkedinIcon round size={size} />
        </LinkedinShareButton>
        <TelegramShareButton url={url}>
          <TelegramIcon round size={size} />
        </TelegramShareButton>
        <FacebookMessengerShareButton url={url} appId="1088640068721244">
          <FacebookMessengerIcon round size={size} />
        </FacebookMessengerShareButton>
        <WhatsappShareButton url={url}>
          <WhatsappIcon round size={size} />
        </WhatsappShareButton>
        <LineShareButton url={url}>
          <LineIcon round size={size} />
        </LineShareButton>
        <ViberShareButton url={url}>
          <ViberIcon round size={size} />
        </ViberShareButton>
        <RedditShareButton url={url}>
          <RedditIcon round size={size} />
        </RedditShareButton>
        <PinterestShareButton url={url} media="https://www.fishprovider.com/logo.png">
          <PinterestIcon round size={size} />
        </PinterestShareButton>
        <VKShareButton url={url}>
          <VKIcon round size={size} />
        </VKShareButton>
        <TumblrShareButton url={url}>
          <TumblrIcon round size={size} />
        </TumblrShareButton>
        <WeiboShareButton url={url}>
          <WeiboIcon round size={size} />
        </WeiboShareButton>
        <EmailShareButton url={url}>
          <EmailIcon round size={size} />
        </EmailShareButton>
      </Group>
    </Stack>
  );
}

export default ShareSocial;
