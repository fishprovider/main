import storeUser from '@fishprovider/cross/stores/user';
import { Roles } from '@fishprovider/utils/constants/user';
import type { Activity, Member } from '@fishprovider/utils/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

import { ProviderRoleText } from '~constants/account';
import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Indicator from '~ui/core/Indicator';
import Tooltip from '~ui/core/Tooltip';
import { getActivityColor } from '~utils/account';

interface Props {
  activities?: Record<string, Activity>,
  members?: Member[],
}

function AccountActivities({
  activities = {},
  members = [],
}: Props) {
  const {
    userId: userIdCurr,
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
  }));

  const userActivities = _.sortBy(
    _.map(activities, (activity, userId) => {
      const member = members.find((item) => item.userId === userId) || {
        userId,
        name: userId,
        role: Roles.viewer,
        picture: '',
      };
      const lastSeen = moment(activity.lastView).fromNow();
      const lastSeenMinutes = moment().diff(moment(activity.lastView), 'minutes');
      const lastSeenColor = getActivityColor(lastSeenMinutes);
      const tooltip = [
        `[${ProviderRoleText[member.role]?.text}] ${member.name}`,
        ...(lastSeen ? [`last seen ${lastSeen}`] : []),
      ].join(', ');
      return {
        ...activity,
        ...member,
        lastSeen,
        lastSeenMinutes,
        lastSeenColor,
        tooltip,
      };
    }),
    ['lastSeenMinutes', 'name', 'userId'],
  );

  return (
    <Group spacing={6}>
      {userActivities.map(({
        userId, picture, lastSeenMinutes, lastSeenColor, tooltip,
      }) => {
        if (userId === userIdCurr || !lastSeenColor) return null;
        return (
          <Tooltip key={userId} label={tooltip}>
            <Indicator
              color={lastSeenColor}
              processing={lastSeenMinutes < 5}
              withBorder={lastSeenMinutes < 5}
              disabled={lastSeenMinutes > 60 * 24 * 5}
            >
              <Avatar size="sm" radius="md" src={picture} alt={userId} />
            </Indicator>
          </Tooltip>
        );
      })}
    </Group>
  );
}

export default AccountActivities;
