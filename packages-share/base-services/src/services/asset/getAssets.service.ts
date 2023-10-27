import { checkRepository, GetAssetsService } from '../..';

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
