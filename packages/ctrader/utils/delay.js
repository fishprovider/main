const delay = (timeMS) => new Promise((resolve) => {
    setTimeout(resolve, timeMS);
});
export default delay;
