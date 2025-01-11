import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore';
import { db } from './config';

interface QueryCondition {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    throw error;
  }
};

export const getDocuments = async (
  collectionName: string,
  conditions?: QueryCondition[],
  orderByField?: string,
  orderDirection?: OrderByDirection
) => {
  try {
    let q = collection(db, collectionName);
    
    if (conditions) {
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};
