import { keyBy } from 'lodash';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface DocWithId extends Record<string, any> {
  _id: string,
}

type TransformState<State> = (state: State) => State;

type StateSet<Doc> = Record<string, Doc>;

let logDebug = console.log;
let logError = console.error;

interface Options {
  skipLog?: boolean
}

interface MergeDocOptions extends Options {
  replace?: boolean,
}

interface MergeDocsOptions extends MergeDocOptions {
  replaceAll?: boolean
}

interface StoreSet<State, Transform, Doc> {
  state: State;
  setState: (transform: Transform, options?: Options) => void;
  mergeDocs: (docs: Partial<Doc>[], options?: MergeDocsOptions) => void;
  mergeDoc: (doc: Partial<Doc>, options?: MergeDocOptions) => void;
  removeDoc: (docId: string, options?: Options) => void;
  removeDocs: (docIds: string[], options?: Options) => void;
}

interface StoreObj<State, Transform> {
  state: State;
  setState: (transform: Transform, options?: Options) => void;
  mergeState: (data: Partial<State>, options?: Options) => void;
  removeKey: (key: string, options?: Options) => void;
}

const Comparator = {
  strictEqual: (a: any, b: any) => a === b,
  shallowEqual: shallow,
  deepEqual: isEqual,
};

function initStore(params: {
  logDebug?: (...args: any[]) => void,
  logError?: (...args: any[]) => void
}) {
  if (params.logDebug) {
    logDebug = params.logDebug;
  }
  if (params.logError) {
    logError = params.logError;
  }
}

function buildStoreSet<Doc extends DocWithId>(initState: StateSet<Doc>, name: string) {
  type State = StateSet<Doc>;
  type Transform = TransformState<State>;
  type Store = StoreSet<State, Transform, Doc>;

  const store = createWithEqualityFn<Store>((set) => ({
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
  }), Comparator.shallowEqual);

  const getState = () => store.getState().state;

  function useStore<Val>(
    selector: (state: State) => Val,
    comparator?: (a: Val, b: Val) => boolean,
  ) {
    return store(({ state }) => selector(state), comparator);
  }

  return {
    ...store.getState(), getState, useStore,
  };
}

function buildStore<State extends Record<string, any>>(initState: State, name: string) {
  type Transform = TransformState<State>;
  type Store = StoreObj<State, Transform>;

  const store = createWithEqualityFn<Store>((set) => ({
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
  }), Comparator.shallowEqual);

  const getState = () => store.getState().state;

  function useStore<Val>(
    selector: (state: State) => Val,
    comparator?: (a: Val, b: Val) => boolean,
  ) {
    return store(({ state }) => selector(state), comparator);
  }

  return {
    ...store.getState(), getState, useStore,
  };
}

export {
  buildStore,
  buildStoreSet,
  Comparator,
  initStore,
};

export type {
  MergeDocOptions,
  MergeDocsOptions,
  Options,
  StoreObj as Store,
  StoreSet,
};
