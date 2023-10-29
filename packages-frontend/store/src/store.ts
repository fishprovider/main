import { log } from '@fishprovider/core';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import pickBy from 'lodash/pickBy';
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

interface DocWithId extends Record<string, any> {
  _id: string,
}

export type TransformState<State> = (state: State) => State;

export type StateSet<Doc> = Record<string, Doc>;

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

export interface StoreObj<State, Transform> {
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

export const buildStoreSet = <Doc extends DocWithId>(
  initState: StateSet<Doc>, name: string,
) => {
  type State = StateSet<Doc>;
  type Transform = TransformState<State>;
  type Store = StoreSet<State, Transform, Doc>;

  const stateCreator: StateCreator<Store> = (set) => ({
    state: initState,
    setState: (transform: Transform, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] setState`);

      set(({ state }) => ({
        state: transform(state),
      }));
    },
    mergeDocs: (docs: Partial<Doc>[], options?: MergeDocsOptions) => {
      const { replace, replaceAll, skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] mergeDocs`, replace, replaceAll, docs);

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
            log.error(`[store ${name}] mergeDocs: doc has no _id`, doc);
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
      if (!skipLog) log.debug(`[store ${name}] mergeDoc`, replace, doc);

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
        log.error(`[store ${name}] mergeDoc: doc has no _id`, doc);
        return state;
      });
    },
    removeDoc: (docId: string, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] removeDoc`, docId);

      set(({ state }) => ({
        state: pickBy(state, (doc) => doc._id !== docId),
      }));
    },
    removeDocs: (docIds: string[], options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] removeDocs`, docIds);

      const objDocIds = keyBy(docIds);
      set(({ state }) => ({
        state: pickBy(state, (doc) => !objDocIds[doc._id]),
      }));
    },
  });

  const store = createWithEqualityFn<Store>()(devtools(stateCreator, {
    enabled: false,
    store: name,
  }), shallow);

  const getState = () => store.getState().state;

  const useStore = <Val>(
    selector: (state: State) => Val,
    comparator?: (a: Val, b: Val) => boolean,
  ) => store(({ state }) => selector(state), comparator);

  return {
    ...store.getState(), getState, useStore,
  };
};

export const buildStoreObj = <State extends Record<string, any>>(
  initState: State, name: string,
) => {
  type Transform = TransformState<State>;
  type Store = StoreObj<State, Transform>;

  const stateCreator: StateCreator<Store> = (set) => ({
    state: initState,
    setState: (transform: Transform, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] setState`);

      set(({ state }) => ({
        state: transform(state),
      }));
    },
    mergeState: (data: Partial<State>, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] mergeState`, data);

      set(({ state }) => ({
        state: {
          ...state,
          ...data,
        },
      }));
    },
    removeKey: (key: string, options?: Options) => {
      const { skipLog } = options || {};
      if (!skipLog) log.debug(`[store ${name}] removeKey`, key);

      set(({ state }) => ({
        state: pickBy(state, (doc) => doc._id !== key) as State,
      }));
    },
  });

  const store = createWithEqualityFn<Store>()(devtools(stateCreator, {
    enabled: false,
    store: name,
  }), Comparator.shallowEqual);

  const getState = () => store.getState().state;

  const useStore = <Val>(
    selector: (state: State) => Val,
    comparator?: (a: Val, b: Val) => boolean,
  ) => store(({ state }) => selector(state), comparator);

  return {
    ...store.getState(), getState, useStore,
  };
};
