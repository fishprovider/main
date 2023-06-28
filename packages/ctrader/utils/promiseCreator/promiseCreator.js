function promiseCreator() {
    let resolveExec = () => undefined;
    let rejectExec = () => undefined;
    const promise = new Promise((resolve, reject) => {
        resolveExec = (val) => resolve(val || undefined);
        rejectExec = reject;
    });
    const newPromise = Object.assign(promise, { resolveExec, rejectExec });
    return newPromise;
}
export default promiseCreator;
