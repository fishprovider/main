import { SocialIcon } from 'react-social-icons';

import Link from '~components/base/Link';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import Tooltip from '~ui/core/Tooltip';

const commonKey = 'fishprovider';
const discordKey = 'KpHQjdhKmC';
const whatsAppChatKey = 'H2JDo9sPEKM0JpaIfqok3Q';
const zaloKey = 'autuht309';

interface CustomIconProps {
  name: string;
  url: string;
  icon: string;
  background?: string;
}

function CustomIcon({
  name, url, icon, background,
}: CustomIconProps) {
  return (
    <Tooltip label={name}>
      <Link href={url} target="_blank">
        <Image
          src={icon}
          alt={name}
          fit="contain"
          width={30}
          height={30}
          style={{
            borderRadius: '100%',
            ...background && {
              background,
            },
          }}
        />
      </Link>
    </Tooltip>
  );
}

interface DefaultIconProps {
  name: string;
  url: string;
  network?: string
}

function DefaultIcon({ name, url, network }: DefaultIconProps) {
  return (
    <Tooltip label={name}>
      <SocialIcon style={{ height: 30, width: 30 }} url={url} target="_blank" network={network} />
    </Tooltip>
  );
}

function Contacts() {
  return (
    <Stack>
      <Title size="h2">Our Contacts</Title>

      <Group spacing={4}>
        <Text span>Latest Updates</Text>
        <DefaultIcon name="Telegram" url={`https://t.me/${commonKey}`} network="telegram" />
        <DefaultIcon name="Discord" url={`https://discord.gg/${discordKey}`} />
        <DefaultIcon name="X (Twitter)" url={`https://twitter.com/${commonKey}`} network="x" />
        <DefaultIcon name="Facebook" url={`https://www.facebook.com/${commonKey}`} />
        <DefaultIcon name="Linkedin" url={`https://www.linkedin.com/company/${commonKey}`} />
        <DefaultIcon name="Tiktok" url={`https://www.tiktok.com/@${commonKey}`} />
        <DefaultIcon name="Instagram" url={`https://www.instagram.com/${commonKey}`} />
        <DefaultIcon name="Youtube" url={`https://www.youtube.com/@${commonKey}`} />
        <DefaultIcon name="Pinterest" url={`https://www.pinterest.com/${commonKey}`} />
        <DefaultIcon name="Reddit" url={`https://www.reddit.com/r/${commonKey}`} />
        <CustomIcon name="Quora" url={`https://${commonKey}.quora.com`} icon="/icons/quora.svg" />
        <DefaultIcon name="Medium" url={`https://www.medium.com/@${commonKey}`} />
        <DefaultIcon name="Tumblr" url={`https://www.tumblr.com/blog/${commonKey}`} />
        <DefaultIcon name="Mastodon" url={`https://mastodon.social/@${commonKey}`} />
        <DefaultIcon name="Github" url="https://github.com/orgs/fishprovider/discussions/categories/announcements" />
      </Group>

      <Group spacing={4}>
        <Text span>Chat and Email</Text>
        <DefaultIcon name="Telegram Chat" url={`https://t.me/${commonKey}chat`} network="telegram" />
        <DefaultIcon name="Discord" url={`https://discord.gg/${discordKey}`} />
        <DefaultIcon name="WhatsApp" url={`https://chat.whatsapp.com/${whatsAppChatKey}`} />
        <CustomIcon name="Zalo" url={`https://zalo.me/g/${zaloKey}`} icon="/icons/zalo.svg" />
        {/* <CustomIcon name="Viber" url={`https://invite.viber.com/?g2=${viberKey}`} icon="/icons/viber.png" /> */}
        {/* <CustomIcon name="Line" url={`https://line.me/R/ti/g/${lineKey}`} icon="/icons/line.svg" /> */}
        <DefaultIcon name="admin@fishprovider.com" url="mailto:admin@fishprovider.com" />
      </Group>

      <Group spacing={4}>
        <Text span>Our Portfolio</Text>
        <CustomIcon name="MyFxBook" url="https://www.myfxbook.com/members/FishProvider" icon="/icons/myfxbook-icon-only.png" background="black" />
        <CustomIcon name="CTrader" url="https://ctrader.com/u/FishProvider" icon="/icons/ctrader-logo-only.png" />
      </Group>
    </Stack>
  );
}

export default Contacts;
