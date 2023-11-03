export const getDoc = async <T>(params: {
  getDocCache?: () => Promise<T>,
  setDocCache?: (doc: T) => Promise<T>,
  getDocDb?: () => Promise<T>,
}) => {
  const {
    getDocCache, setDocCache, getDocDb,
  } = params;

  const setDoc = async (doc: T) => {
    if (setDocCache) {
      await setDocCache(doc);
    }
  };

  let doc: T | undefined;

  if (getDocCache) {
    doc = await getDocCache();
  }

  if (getDocDb) {
    if (!doc) {
      doc = await getDocDb();
      setDoc(doc); // non-blocking
    } else {
      getDocDb().then(setDoc); // non-blocking
    }
  }

  return doc;
};

export const getDocs = async <T>(params: {
  getDocsCache?: () => Promise<T>,
  setDocsCache?: (docs: T) => Promise<T>,
  getDocsDb?: () => Promise<T>,
}) => {
  const {
    getDocsCache, setDocsCache, getDocsDb,
  } = params;

  const setDocs = async (docs: T) => {
    if (setDocsCache) {
      await setDocsCache(docs);
    }
  };

  let docs: T | undefined;

  if (getDocsCache) {
    docs = await getDocsCache();
  }

  if (getDocsDb) {
    if (!docs) {
      docs = await getDocsDb();
      setDocs(docs); // non-blocking
    } else {
      getDocsDb().then(setDocs); // non-blocking
    }
  }

  return docs;
};

export const updateDoc = async <T>(params: {
  updateDocCache?: () => Promise<T>,
  updateDocDb?: () => Promise<T>,
}) => {
  const {
    updateDocCache, updateDocDb,
  } = params;
  if (updateDocCache) {
    updateDocCache(); // non-blocking
  }

  let doc: T | undefined;

  if (updateDocDb) {
    doc = await updateDocDb();
  }

  return doc;
};

export const updateDocs = async <T>(params: {
  updateDocsCache?: () => Promise<T>,
  updateDocsDb?: () => Promise<T>,
}) => {
  const {
    updateDocsCache, updateDocsDb,
  } = params;
  if (updateDocsCache) {
    updateDocsCache(); // non-blocking
  }

  let docs: T | undefined;

  if (updateDocsDb) {
    docs = await updateDocsDb();
  }

  return docs;
};

export const removeDoc = async <T>(params: {
  removeDocCache?: () => Promise<T>,
  removeDocDb?: () => Promise<T>,
}) => {
  const {
    removeDocCache, removeDocDb,
  } = params;
  if (removeDocCache) {
    removeDocCache(); // non-blocking
  }

  let doc: T | undefined;

  if (removeDocDb) {
    doc = await removeDocDb();
  }

  return doc;
};
