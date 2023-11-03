export const getDoc = async <T>(params: {
  getDocLocal?: () => Promise<T>,
  setDocLocal?: (doc: T) => Promise<T>,
  getDocStore?: () => Promise<T>,
  setDocStore?: (doc: T) => Promise<T>,
  getDocApi?: () => Promise<T>,
}) => {
  const {
    getDocLocal, setDocLocal, getDocStore, setDocStore, getDocApi,
  } = params;

  const setDocToLocal = async (doc: T) => {
    if (setDocLocal) {
      await setDocLocal(doc);
    }
  };

  const setDocToStore = async (doc: T) => {
    if (setDocStore) {
      await setDocStore(doc);
    }
  };

  const setDoc = async (doc: T) => Promise.all([
    setDocToLocal(doc),
    setDocToStore(doc),
  ]);

  let doc: T | undefined;

  if (getDocStore) {
    doc = await getDocStore();
  }

  if (getDocLocal) {
    if (!doc) {
      doc = await getDocLocal();
      setDocToStore(doc); // non-blocking
    }
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
  getDocsLocal?: () => Promise<T>,
  setDocsLocal?: (docs: T) => Promise<T>,
  getDocsStore?: () => Promise<T>,
  setDocsStore?: (docs: T) => Promise<T>,
  getDocsApi?: () => Promise<T>,
}) => {
  const {
    getDocsLocal, setDocsLocal, getDocsStore, setDocsStore, getDocsApi,
  } = params;

  const setDocsToLocal = async (docs: T) => {
    if (setDocsLocal) {
      await setDocsLocal(docs);
    }
  };

  const setDocsToStore = async (docs: T) => {
    if (setDocsStore) {
      await setDocsStore(docs);
    }
  };

  const setDocs = async (docs: T) => Promise.all([
    setDocsToLocal(docs),
    setDocsToStore(docs),
  ]);

  let docs: T | undefined;

  if (getDocsStore) {
    docs = await getDocsStore();
  }

  if (getDocsLocal) {
    if (!docs) {
      docs = await getDocsLocal();
      setDocsToStore(docs); // non-blocking
    }
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

export const removeDoc = async <T>(params: {
  removeDocLocal?: () => Promise<T>,
  removeDocStore?: () => Promise<T>,
  removeDocApi?: () => Promise<T>,
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

  let doc: T | undefined;

  if (removeDocApi) {
    doc = await removeDocApi();
  }

  return doc;
};
