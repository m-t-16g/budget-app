import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
} from "firebase/firestore";

export const useFirestore = () => {
    const db = getFirestore();
    const getSnapshot = async () => await getDocs(collection(db, "budget"));

    return { db, getSnapshot };
};
