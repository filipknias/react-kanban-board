import { useEffect } from 'react';
import { query, onSnapshot, Query } from "firebase/firestore";

export default function useFirestoreListener<T>(myQuery: Query, callback: (data: T[]) => void) {
  useEffect(() => {
    const q = query(myQuery);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: T[] = [];
      querySnapshot.forEach((doc: any) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      callback(data);
    });

    return () => unsubscribe();
  }, []);
};