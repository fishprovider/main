import { BaseError, RepositoryError } from '@fishprovider/core';

import { Projection } from '..';

const validateProjection = <T extends Record<string, any>>(
  projection?: Projection<T>,
  obj?: T,
) => {
  if (!projection || !obj) return true;

  const isBlacklist = Object.values(projection).every((value) => value === 0);
  if (isBlacklist) {
    return Object.keys(projection).every((key) => obj[key] === undefined);
  }
  return Object.keys(obj).every((key) => projection[key] === 1);
};

export const checkProjection = <T extends Record<string, any>>(
  projection?: Projection<T>,
  obj?: T,
) => {
  if (!validateProjection(projection, obj)) {
    throw new BaseError(RepositoryError.REPOSITORY_INVALID_PROJECTION);
  }
  return obj;
};
