export const getDoc = async <T>(params: {
  getDocCache?: () => Promise<T | undefined>,
  setDocCache?: (doc?: T) => Promise<any>,
  getDocDb?: () => Promise<T | undefined>,
}) => {
  const {
    getDocCache, setDocCache, getDocDb,
  } = params;

  const setDoc = async (doc?: T) => {
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
  getDocsCache?: () => Promise<T[] | undefined>,
  setDocsCache?: (docs?: T[]) => Promise<any>,
  getDocsDb?: () => Promise<T[] | undefined>,
}) => {
  const {
    getDocsCache, setDocsCache, getDocsDb,
  } = params;

  const setDocs = async (docs?: T[]) => {
    if (setDocsCache) {
      await setDocsCache(docs);
    }
  };

  let docs: T[] | undefined;

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
