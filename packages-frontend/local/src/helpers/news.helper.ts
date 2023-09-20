export const buildNewsKeys = (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const keys = Object.entries(filter).map(([key, value]) => `${key}-${value}`);
  return `news-${keys?.join('-')}`;
};
