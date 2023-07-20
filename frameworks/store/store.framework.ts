import { keyBy } from 'lodash';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

interface DocWithId extends Record<string, any> {
  _id: string,
}

type TransformState<State> = (state: State) => State;

type StateSet<Doc> = Record<string, Doc>;

let logDebug = console.log;
let logError = console.error;

export interface Options {
  skipLog?: boolean
}

export interface MergeDocOptions extends Options {
  replace?: boolean,
}

export interface MergeDocsOptions extends MergeDocOptions {
  replaceAll?: boolean
}

export interface StoreSet<State, Transform, Doc> {
  state: State;
  setState: (transform: Transform, options?: Options) => void;
  mergeDocs: (docs: Partial<Doc>[], options?: MergeDocsOptions) => void;
  mergeDoc: (doc: Partial<Doc>, options?: MergeDocOptions) => void;
  removeDoc: (docId: string, options?: Options) => void;
  removeDocs: (docIds: string[], options?: Options) => void;
}

export interface Store<State, Transform> {
  state: State;
  setState: (transform: Transform, options?: Options) => void;
  mergeState: (data: Partial<State>, options?: Options) => void;
  removeKey: (key: string, options?: Options) => void;
}

export const Comparator = {
  strictEqual: (a: any, b: any) => a === b,
  shallowEqual: shallow,
  deepEqual: isEqual,
};

export function buildStoreSet<Doc extends DocWithId>(initState: StateSet<Doc>, name: string) {
  type State = StateSet<Doc>;
  type Transform = TransformState<State>;

  const store = create<StoreSet<State, Transform, Doc>>((set) => ({
    state: initState,
    setState: (transform: Transform, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] setState`);

      set(({ state }) => ({
        state: transform(state),
      }));
    },
    mergeDocs: (docs: Partial<Doc>[], options?: MergeDocsOptions) => {
      const { replace, replaceAll, skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] mergeDocs`, replace, replaceAll, docs);

      set(({ state }) => {
        const newDocs: State = {};
        docs.forEach((doc) => {
          if (doc._id) {
            const newDoc = replace ? doc : {
              ...state[doc._id],
              ...doc,
            };
            newDocs[doc._id] = newDoc as Doc;
          } else {
            logError(`[store ${name}] mergeDocs: doc has no _id`, doc);
          }
        });
        return {
          state: replaceAll ? newDocs : {
            ...state,
            ...newDocs,
          },
        };
      });
    },
    mergeDoc: (doc: Partial<Doc>, options?: MergeDocOptions) => {
      const { replace, skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] mergeDoc`, replace, doc);

      set(({ state }) => {
        if (doc._id) {
          const newDoc = replace ? doc : {
            ...state[doc._id],
            ...doc,
          };
          return {
            state: {
              ...state,
              [doc._id]: newDoc as Doc,
            },
          };
        }
        logError(`[store ${name}] mergeDoc: doc has no _id`, doc);
        return state;
      });
    },
    removeDoc: (docId: string, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] removeDoc`, docId);

      set(({ state }) => ({
        state: pickBy(state, (doc) => doc._id !== docId),
      }));
    },
    removeDocs: (docIds: string[], options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] removeDocs`, docIds);

      const objDocIds = keyBy(docIds);
      set(({ state }) => ({
        state: pickBy(state, (doc) => !objDocIds[doc._id]),
      }));
    },
  }));

  const getState = () => store.getState().state;

  function useStore<Val>(
    selector: (state: State) => Val,
    comparator: (a: Val, b: Val) => boolean = Comparator.shallowEqual,
  ) {
    return store(({ state }) => selector(state), comparator);
  }

  return {
    ...store.getState(), getState, useStore,
  };
}

export function buildStore<State extends Record<string, any>>(initState: State, name: string) {
  type Transform = TransformState<State>;

  const store = create<Store<State, Transform>>((set) => ({
    state: initState,
    setState: (transform: Transform, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] setState`);

      set(({ state }) => ({
        state: transform(state),
      }));
    },
    mergeState: (data: Partial<State>, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] mergeState`, data);

      set(({ state }) => ({
        state: {
          ...state,
          ...data,
        },
      }));
    },
    removeKey: (key: string, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) logDebug(`[store ${name}] removeKey`, key);

      set(({ state }) => ({
        state: pickBy(state, (doc) => doc._id !== key) as State,
      }));
    },
  }));

  const getState = () => store.getState().state;

  function useStore<Val>(
    selector: (state: State) => Val,
    comparator: (a: Val, b: Val) => boolean = Comparator.shallowEqual,
  ) {
    return store(({ state }) => selector(state), comparator);
  }

  return {
    ...store.getState(), getState, useStore,
  };
}

const start = async (params: {
  logDebug?: (...args: any[]) => void,
  logError?: (...args: any[]) => void
}) => {
  console.info('Started local.framework');

  if (params.logDebug) {
    logDebug = params.logDebug;
  }
  if (params.logError) {
    logError = params.logError;
  }
};

const stop = async () => {
  console.info('Stopped local.framework');
};

export const store = {
  start,
  stop,
};
