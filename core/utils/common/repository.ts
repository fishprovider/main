import type { Projection } from '@fishprovider/models';

export const validateProjection = <T extends Record<string, any>>(
  projection: Projection<T>,
  obj: T,
) => Object.entries(obj).every(([key, value]) => {
    if (projection[key as keyof T] === 0) return value === undefined;
    if (projection[key as keyof T] === undefined) return false;
    return true;
  });
