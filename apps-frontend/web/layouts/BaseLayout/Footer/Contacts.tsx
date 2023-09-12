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
const whatsAppChatKey = 'Lr2M5zX4GTZEyZSES798xs';
const zaloKey = 'autuht309';
const lineKey = 'qeQpcnfzVs';
const viberKey = 'AQAwbzM9MBf3jlEffyPzHXOCz9faehdoci%2BrzPWzmcgkCY10b7HGUNFzPwq5VMDU';

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
}

function DefaultIcon({ name, url }: DefaultIconProps) {
  return (
    <Tooltip label={name}>
      <SocialIcon style={{ height: 30, width: 30 }} url={url} target="_blank" />
    </Tooltip>
  );
}

function Contacts() {
  return (
    <Stack>
      <Title size="h2">Our Contacts</Title>

      <Group spacing={4}>
        <Text span>Latest Updates via</Text>
        <DefaultIcon name="Telegram" url={`https://t.me/${commonKey}`} />
        <DefaultIcon name="Discord" url={`https://discord.gg/${discordKey}`} />
        <CustomIcon name="X (Twitter)" url={`https://twitter.com/${commonKey}`} icon="/icons/twitter.png" />
        <DefaultIcon name="Facebook" url={`https://www.facebook.com/${commonKey}`} />
        <DefaultIcon name="Linkedin" url={`https://www.linkedin.com/company/${commonKey}`} />
        <DefaultIcon name="Tiktok" url={`https://www.tiktok.com/@${commonKey}`} />
        <DefaultIcon name="Youtube" url={`https://www.youtube.com/@${commonKey}`} />
        <DefaultIcon name="Instagram" url={`https://www.instagram.com/${commonKey}`} />
        <DefaultIcon name="Pinterest" url={`https://www.pinterest.com/${commonKey}`} />
        <DefaultIcon name="Reddit" url={`https://www.reddit.com/r/${commonKey}`} />
        <CustomIcon name="Quora" url={`https://${commonKey}.quora.com`} icon="/icons/quora.svg" />
        <DefaultIcon name="Medium" url={`https://www.medium.com/@${commonKey}`} />
        <DefaultIcon name="Tumblr" url={`https://www.tumblr.com/blog/${commonKey}`} />
        <CustomIcon name="Mastodon" url={`https://mastodon.social/@${commonKey}`} icon="/icons/mastodon.svg" />
        <DefaultIcon name="Github" url="https://github.com/orgs/fishprovider/discussions/categories/announcements" />
        <CustomIcon name="MyFxBook" url="https://www.myfxbook.com/members/FishProvider" icon="/icons/myfxbook-icon-only.png" background="black" />
        <CustomIcon name="CTrader" url="https://ctrader.com/u/FishProvider" icon="/icons/ctrader-logo-only.png" />
      </Group>

      <Group spacing={4}>
        <Text span>Chat via</Text>
        <DefaultIcon name="Telegram Chat" url={`https://t.me/${commonKey}chat`} />
        <CustomIcon name="Zalo" url={`https://zalo.me/g/${zaloKey}`} icon="/icons/zalo.svg" />
        <DefaultIcon name="WhatsApp Chat" url={`https://chat.whatsapp.com/${whatsAppChatKey}`} />
        <CustomIcon name="Line" url={`https://line.me/R/ti/g/${lineKey}`} icon="/icons/line.svg" />
        <CustomIcon name="Viber" url={`https://invite.viber.com/?g2=${viberKey}`} icon="/icons/viber.png" />
        <DefaultIcon name="Snapchat" url={`https://www.snapchat.com/add/${commonKey}`} />
        <DefaultIcon name="Wechat ID: @fishprovider" url={`https://www.wechat.com/@${commonKey}`} />
      </Group>

      <Group spacing={4}>
        <Text span>Email:</Text>
        <DefaultIcon name="admin@fishprovider.com" url="mailto:admin@fishprovider.com" />
      </Group>
    </Stack>
  );
}

export default Contacts;
