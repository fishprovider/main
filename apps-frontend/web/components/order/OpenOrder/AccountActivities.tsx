import { AccountActivity, AccountMember } from '@fishprovider/core';
import _ from 'lodash';
import moment from 'moment';

import { ProviderRoleText } from '~constants/account';
import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Indicator from '~ui/core/Indicator';
import Tooltip from '~ui/core/Tooltip';
import { getActivityColor } from '~utils/account';

interface Props {
  activities?: Record<string, AccountActivity>,
  members?: AccountMember[],
}

function AccountActivities({
  activities = {},
  members = [],
}: Props) {
  const userActivities = _.sortBy(
    _.map(activities, (activity, userId) => {
      const member = members.find((item) => item.userId === userId);
      const lastSeen = moment(activity.lastView).fromNow();
      const lastSeenMinutes = moment().diff(moment(activity.lastView), 'minutes');
      const lastSeenColor = getActivityColor(lastSeenMinutes);
      const tooltip = [
        ...(member ? [`[${ProviderRoleText[member.role]?.text}] ${member.name}`] : []),
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
        if (!lastSeenColor) return null;
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
