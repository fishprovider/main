export const getDoc = async <T>(params: {
  getDocLocal?: () => Promise<T | undefined>,
  setDocLocal?: (doc?: T) => Promise<any>,
  setDocStore?: (doc?: T) => Promise<any>,
  getDocApi?: () => Promise<T | undefined>,
}) => {
  const {
    getDocLocal, setDocLocal, setDocStore, getDocApi,
  } = params;

  const setDocToLocal = async (doc?: T) => {
    if (setDocLocal) {
      await setDocLocal(doc);
    }
  };

  const setDocToStore = async (doc?: T) => {
    if (setDocStore) {
      await setDocStore(doc);
    }
  };

  const setDoc = async (doc?: T) => Promise.all([
    setDocToLocal(doc),
    setDocToStore(doc),
  ]);

  let doc: T | undefined;

  if (getDocLocal) {
    doc = await getDocLocal();
    setDocToStore(doc); // non-blocking
  }

  if (getDocApi) {
    if (!doc) {
      doc = await getDocApi();
      setDoc(doc); // non-blocking
    } else {
      getDocApi().then(setDoc); // non-blocking
    }
  }

  return doc;
};

export const getDocs = async <T>(params: {
  getDocsLocal?: () => Promise<T[] | undefined>,
  setDocsLocal?: (docs?: T[]) => Promise<any>,
  setDocsStore?: (docs?: T[]) => Promise<any>,
  getDocsApi?: () => Promise<T[] | undefined>,
}) => {
  const {
    getDocsLocal, setDocsLocal, setDocsStore, getDocsApi,
  } = params;

  const setDocsToLocal = async (docs?: T[]) => {
    if (setDocsLocal) {
      await setDocsLocal(docs);
    }
  };

  const setDocsToStore = async (docs?: T[]) => {
    if (setDocsStore) {
      await setDocsStore(docs);
    }
  };

  const setDocs = async (docs?: T[]) => Promise.all([
    setDocsToLocal(docs),
    setDocsToStore(docs),
  ]);

  let docs: T[] | undefined;

  if (getDocsLocal) {
    docs = await getDocsLocal();
    setDocsToStore(docs); // non-blocking
  }

  if (getDocsApi) {
    if (!docs) {
      docs = await getDocsApi();
      setDocs(docs); // non-blocking
    } else {
      getDocsApi().then(setDocs); // non-blocking
    }
  }

  return docs;
};

export const removeDoc = async (params: {
  removeDocLocal?: () => any,
  removeDocStore?: () => any,
  removeDocApi?: () => any,
}) => {
  const {
    removeDocLocal, removeDocStore, removeDocApi,
  } = params;
  if (removeDocLocal) {
    removeDocLocal(); // non-blocking
  }
  if (removeDocStore) {
    removeDocStore(); // non-blocking
  }
  if (removeDocApi) {
    await removeDocApi();
  }
};
