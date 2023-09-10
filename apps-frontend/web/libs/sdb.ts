import {
  addDoc as addDocFb,
  collection,
  deleteField,
  doc as docFb,
  DocumentData, getFirestore,
  onSnapshot as onSnapshotFb,
  SnapshotOptions, Timestamp,
  updateDoc as updateDocFb,
} from 'firebase/firestore';
import _ from 'lodash';

// mutate the doc
function convertDateToTimestamp(doc: any) {
  _.forEach(doc, (value, key) => {
    if (value instanceof Date) {
      _.set(doc, [key], Timestamp.fromDate(value));
    } else if (typeof value === 'object') {
      convertDateToTimestamp(value);
    }
  });
}

// mutate the doc
function convertTimestampToDate(doc: any) {
  _.forEach(doc, (value, key) => {
    if (value instanceof Timestamp) {
      _.set(doc, [key], value.toDate());
    } else if (typeof value === 'object') {
      convertTimestampToDate(value);
    }
  });
}

function converter<Doc extends Record<string, any>>() {
  return {
    toFirestore: (doc: Doc): DocumentData => {
      const newDoc = _.cloneDeep(doc);
      convertDateToTimestamp(newDoc);
      return newDoc;
    },
    fromFirestore: (snapshot: DocumentData, options: SnapshotOptions): Doc => {
      const doc = snapshot.data(options);
      convertTimestampToDate(doc);
      return doc;
    },
  };
}

function addDoc<Doc extends Record<string, any>>(params: {
  col: string,
  doc: Doc,
}) {
  const { col, doc } = params;
  const colRef = collection(getFirestore(), col).withConverter(converter<Doc>());
  const docRef = addDocFb(colRef, doc);
  return docRef;
}

function updateDoc(params: {
  doc: string,
  updateData: any,
}) {
  const { doc, updateData } = params;
  const docRef = docFb(getFirestore(), doc);
  const newUpdateData = { ...updateData };
  Object.keys(newUpdateData).forEach((key) => {
    const value = newUpdateData[key];
    if (value === null) {
      _.set(newUpdateData, key, deleteField());
    }
  });
  return updateDocFb(docRef, newUpdateData);
}

function subDoc<Doc extends Record<string, any>>(params: {
  doc: string,
  onSnapshot: (doc: Doc) => void,
}) {
  const { doc, onSnapshot } = params;
  const docRef = docFb(getFirestore(), doc).withConverter(converter<Doc>());
  const unsub = onSnapshotFb(docRef, (querySnapshot) => {
    if (querySnapshot.exists()) {
      onSnapshot({
        _id: querySnapshot.id,
        ...querySnapshot.data(),
      });
    }
  }, (err) => {
    Logger.error('[sdb] Failed to subDoc', err);
  });
  return unsub;
}

function subDocs<Doc extends Record<string, any>>(params: {
  col: string,
  onSnapshot: (docs: Doc[]) => void,
}) {
  const { col, onSnapshot } = params;
  const colRef = collection(getFirestore(), col).withConverter(converter<Doc>());
  const unsub = onSnapshotFb(colRef, (querySnapshot) => {
    const docs = querySnapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));
    onSnapshot(docs);
  }, (err) => {
    Logger.error('[sdb] Failed to subDocs', err);
  });
  return unsub;
}

export {
  addDoc,
  subDoc,
  subDocs,
  updateDoc,
};
