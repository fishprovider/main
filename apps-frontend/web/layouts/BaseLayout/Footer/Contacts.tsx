import { SocialIcon } from 'react-social-icons';

import Link from '~components/base/Link';
import Group from '~ui/core/Group';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import Tooltip from '~ui/core/Tooltip';

const commonKey = 'fishprovider';
// const stackOFKey = '17071216';
const discordKey = 'KpHQjdhKmC';
const whatsAppChannelKey = 'FvvX52ptBec4T5hJgLnZBz';
const whatsAppChatKey = 'Lr2M5zX4GTZEyZSES798xs';
const zaloKey = 'autuht309';
const lineKey = 'qeQpcnfzVs';
const viberKey = 'AQAwbzM9MBf3jlEffyPzHXOCz9faehdoci%2BrzPWzmcgkCY10b7HGUNFzPwq5VMDU';
// const okKey = '70000002570204';

// { url: `https://www.youtube.com/@${commonKey}` },
// { url: `https://www.tiktok.com/@${commonKey}` },
// { url: `https://www.twitch.tv/${commonKey}_admin` },

interface CustomIconProps {
  name: string;
  url: string;
  icon: string;
}

function CustomIcon({ name, url, icon }: CustomIconProps) {
  return (
    <Tooltip label={name}>
      <Link href={url} target="_blank">
        <Image
          src={icon}
          alt={name}
          fit="contain"
          width={30}
          height={30}
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
        {/* <CustomIcon name="Moj" url={`https://mojapp.in/@${commonKey}`} icon="/icons/moj.png" /> */}
        {/* <DefaultIcon name="VK" url={`https://vk.com/${commonKey}.page`} /> */}
        {/* <CustomIcon name="OK" url={`https://ok.ru/group/${okKey}`} icon="/icons/ok.png" /> */}
        <DefaultIcon name="WhatsApp" url={`https://chat.whatsapp.com/${whatsAppChannelKey}`} />
        <DefaultIcon name="Pinterest" url={`https://www.pinterest.com/${commonKey}`} />
        <DefaultIcon name="Reddit" url={`https://www.reddit.com/r/${commonKey}`} />
        <CustomIcon name="Quora" url={`https://${commonKey}.quora.com`} icon="/icons/quora.svg" />
        {/* <CustomIcon name="CTrader Forum" url="https://ctrader.com/forum/third-party-products" icon="/icons/ctrader-logo-only.png" /> */}
        <DefaultIcon name="Medium" url={`https://www.medium.com/@${commonKey}`} />
        <DefaultIcon name="Tumblr" url={`https://www.tumblr.com/blog/${commonKey}`} />
        <CustomIcon name="Mastodon" url={`https://mastodon.social/@${commonKey}`} icon="/icons/mastodon.svg" />
        <DefaultIcon name="Github" url="https://github.com/orgs/fishprovider/discussions/categories/announcements" />
        {/* <CustomIcon name="Forex Peace Army" url="https://www.forexpeacearmy.com/community/threads/fishprovider-your-gateway-to-successful-forex-trading.80403" icon="/icons/fpa.jpeg" /> */}

        {/* <CustomIcon name="MQL5 Forum" url="https://www.mql5.com/en/forum" icon="/icons/mql5.png" /> */}
        {/* <CustomIcon name="Forex Factory" url="https://www.forexfactory.com/forum/71-trading-systems" icon="/icons/forexfactory.png" /> */}
        {/* <CustomIcon name="MyFxBook" url="https://www.myfxbook.com/community/trading-systems/4,1" icon="/icons/myfxbook-icon-only.png" /> */}
        {/* <DefaultIcon name="StackOverflow" url={`https://www.stackoverflow.com/users/${stackOFKey}/${commonKey}`} /> */}
        {/* <DefaultIcon name="Facebook Group" url={`https://www.facebook.com/groups/${commonKey}`} /> */}
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
