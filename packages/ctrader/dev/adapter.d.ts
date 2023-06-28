declare const status: () => Promise<void>;
declare const stop: () => Promise<void>;
declare const resume: () => Promise<void>;
declare const destroy: () => Promise<void>;
declare const start: () => Promise<void>;
declare const restart: ({ restartProcess }: {
    restartProcess?: boolean | undefined;
}) => Promise<void>;
declare const enableHeartbeat = true;
declare const enableLocalRemote = true;
declare const beforeShutdownHandlers: (() => Promise<void>)[];
export { beforeShutdownHandlers, destroy, enableHeartbeat, enableLocalRemote, restart, resume, start, status, stop, };
