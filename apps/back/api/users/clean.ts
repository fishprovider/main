import { ErrorType } from '@fishprovider/utils/constants/error';
import { Roles } from '@fishprovider/utils/constants/user';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { User } from '@fishprovider/utils/types/User.model';
import _ from 'lodash';

const userClean = async ({ userInfo }: {
  userInfo: User,
}) => {
  const { uid, roles, starProviders } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const newRoles = roles || {};
  const newStarProviders = starProviders || {};

  const cleanDisabledProviders = () => {
    _.forEach(newRoles.adminProviders, (enabled, providerId) => {
      if (!enabled) {
        _.unset(newRoles.adminProviders, providerId);
      }
    });
    _.forEach(newRoles.traderProviders, (enabled, providerId) => {
      if (!enabled) {
        _.unset(newRoles.traderProviders, providerId);
      }
    });
    _.forEach(newRoles.protectorProviders, (enabled, providerId) => {
      if (!enabled) {
        _.unset(newRoles.protectorProviders, providerId);
      }
    });
    _.forEach(newRoles.viewerProviders, (enabled, providerId) => {
      if (!enabled) {
        _.unset(newRoles.viewerProviders, providerId);
      }
    });
  };
  cleanDisabledProviders();

  const cleanRoleProviders = async () => {
    const providerIds = _.uniq([
      ..._.keys(newRoles.adminProviders),
      ..._.keys(newRoles.traderProviders),
      ..._.keys(newRoles.protectorProviders),
      ..._.keys(newRoles.viewerProviders),
    ]);

    for (const providerId of providerIds) {
      const account = await Mongo.collection<Account>('accounts').findOne({
        _id: providerId,
        'members.userId': uid,
      }, {
        projection: {
          members: 1,
        },
      });
      if (!account) {
        _.unset(newRoles.adminProviders, providerId);
        _.unset(newRoles.traderProviders, providerId);
        _.unset(newRoles.protectorProviders, providerId);
        _.unset(newRoles.viewerProviders, providerId);
      } else {
        const { members } = account;
        const member = _.find(members, (item) => item.userId === uid);
        switch (member?.role) {
          case Roles.admin: {
            _.unset(newRoles.traderProviders, providerId);
            _.unset(newRoles.protectorProviders, providerId);
            _.unset(newRoles.viewerProviders, providerId);
            break;
          }
          case Roles.trader: {
            _.unset(newRoles.adminProviders, providerId);
            _.unset(newRoles.protectorProviders, providerId);
            _.unset(newRoles.viewerProviders, providerId);
            break;
          }
          case Roles.protector: {
            _.unset(newRoles.adminProviders, providerId);
            _.unset(newRoles.traderProviders, providerId);
            _.unset(newRoles.viewerProviders, providerId);
            break;
          }
          case Roles.viewer: {
            _.unset(newRoles.adminProviders, providerId);
            _.unset(newRoles.traderProviders, providerId);
            _.unset(newRoles.protectorProviders, providerId);
            break;
          }
          default:
        }
      }
    }
  };
  await cleanRoleProviders();

  const cleanStarProviders = () => {
    const providerIds = _.keyBy(_.uniq([
      ..._.keys(newRoles.adminProviders),
      ..._.keys(newRoles.traderProviders),
      ..._.keys(newRoles.protectorProviders),
      ..._.keys(newRoles.viewerProviders),
    ]));
    _.forEach(newStarProviders, (enabled, providerId) => {
      if (!enabled || !providerIds[providerId]) {
        _.unset(newStarProviders, providerId);
      }
    });
  };
  cleanStarProviders();

  const updateData = {
    roles: newRoles,
    starProviders: newStarProviders,
  };
  await Mongo.collection<User>('users').updateOne({
    _id: uid,
  }, {
    $set: updateData,
  });

  return {
    result: {
      _id: uid,
      ...updateData,
    },
  };
};

export default userClean;
