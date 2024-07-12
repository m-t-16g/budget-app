<template>
    <v-container>
        usedbtest
        <v-row>
            <v-col cols="4">
                <v-text-field
                    v-model="newEntry.state"
                    label="state"
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                    v-model="newEntry.name"
                    label="name"
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                    v-model="newEntry.country"
                    label="country"
                ></v-text-field>
            </v-col>
            <v-divider />
            <v-col cols="2">
                <v-btn @click="addEntry">Add Entry</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table :items="dbitems"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDoc,
    setDoc,
    getDocs,
    doc,
} from "firebase/firestore";
import { reactive, ref } from "@vue/reactivity";
const newEntry = reactive({
    name: "",
    state: "",
    country: "",
});
async function addEntry() {
    await addDoc(collection(useFirestore().db, "cities"), {
        name: newEntry.name,
        state: newEntry.state,
        country: newEntry.country,
    });
    newEntry.name = "";
    newEntry.state = "";
    newEntry.city = "";
    getCollection(useFirestore().db);
}
const dbitems = reactive([
    {
        name: "TestItem",
        state: "Test",
        country: "TEST",
    },
    {
        name: "Test2",
        state: "Tes2",
        country: "TES2",
    },
]);
async function getCollection(db) {
    const querySnapshot = await getDocs(collection(db, "cities"));
    dbitems.length = 0;
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        dbitems.push(doc.data());
    });
}
onMounted(async () => {
    const db = getFirestore();
    // データを追加       doc(db | collection | ID)
    //   await setDoc(doc(db, "cities", "LA"), {
    //      name: "Los Angeles",
    //      state: "CA",
    //      country: "USA"
    //      });
    // 全データを取得する書き方
    // const querySnapshot = await getDocs(collection(db, "cities"));
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    //     dbitems.push(doc.data());
    // });
    getCollection(db);
});
</script>
