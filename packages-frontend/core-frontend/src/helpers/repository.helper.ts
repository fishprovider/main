import { BaseError } from '@fishprovider/core';

import { Projection, RepositoryError } from '..';

export const validateProjection = <T extends Record<string, any>>(
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

//
// check functions
//

export const checkRepository = <T>(repoFunction?: T) => {
  if (!repoFunction) {
    throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  }
  return repoFunction;
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
