export const delay = (timeMS: number) => new Promise((resolve) => {
  setTimeout(resolve, timeMS);
});
