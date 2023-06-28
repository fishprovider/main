/**
 * @callback BeforeShutdownListener
 * @param {string} [signalOrEvent] The exit signal or event name received on the process.
 */
type BeforeShutdownListener = (signalOrEvent?: string) => void;

export type { BeforeShutdownListener };
