import { checkRepository, GetAssetsService } from '@fishprovider/core';

export const getAssetsService: GetAssetsService = async ({
  filter, options, repositories,
}) => {
  //
  // pre-check
  //
  const getAssetsRepo = checkRepository(repositories.asset.getAssets);

  //
  // main
  //
  return getAssetsRepo(filter, options);
};
