import { BaseError, ServiceError } from '@fishprovider/core';
import { BaseGetOptions, Projection } from '@fishprovider/repositories';
import _ from 'lodash';

export const validateProjection = <T extends Record<string, any>>(
  projection: Projection<T>,
  obj: T,
) => {
  const isBlacklist = Object.values(projection).every((value) => value === 0);
  if (isBlacklist) {
    return Object.keys(projection).every((key) => obj[key] === undefined);
  }
  return Object.keys(obj).every((key) => projection[key] === 1);
};

export const getProjectionBlacklist = <T extends Record<string, any>>(
  blacklist: Projection<T>,
  projection?: Projection<T>,
) => {
  if (!projection || !_.size(projection)) {
    return blacklist;
  }

  const isBlacklist = Object.values(projection).every((value) => value === 0);
  if (isBlacklist) {
    return {
      ...projection,
      ...blacklist,
    };
  }

  const isWhitelist = Object.values(projection).every((value) => value === 1);
  if (isWhitelist) {
    return _.omit(projection, _.keys(blacklist));
  }

  throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
};

export const sanitizeBaseGetOptions = <T>(
  options: BaseGetOptions<T>,
  blacklist: Projection<T>,
) => ({
    ...options,
    projection: getProjectionBlacklist(blacklist, options.projection),
  });
