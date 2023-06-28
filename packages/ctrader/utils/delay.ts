const delay = (timeMS: number) => new Promise((resolve) => {
  setTimeout(resolve, timeMS);
});

export default delay;
