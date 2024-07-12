<template>
    <v-container>
        <v-row>
            <v-col cols="3">
                <v-text-field v-model="newEntry.title" label="費目">
                </v-text-field>
            </v-col>
            <v-col cols="3">
                <v-select
                    v-model="newEntry.category"
                    :items="categories"
                    label="カテゴリー"
                ></v-select>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="newEntry.amount"
                    label="金額"
                    type="number"
                    :rules="[rules.positive]"
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="newEntry.date"
                    type="date"
                ></v-text-field>
            </v-col>
            <v-col
                ><v-btn class="align-self-center" @click="addEntry"
                    >追加</v-btn
                ></v-col
            >
        </v-row>
        <v-row>
            <v-col cols="12"><p class="text-h5">総計</p></v-col>

            <v-col cols="3"
                >収入:<span>{{ balanceSum.income }}</span></v-col
            >
            <v-col cols="3"
                >支出:<span>{{ balanceSum.spend }}</span></v-col
            >
        </v-row>
        <v-row
            ><v-col class="font-weight-bold" cols="4"
                >収支:<span
                    :class="balanceSum.balance >= 0 ? 'text-green' : 'text-red'"
                    >{{ balanceSum.balance }}</span
                ></v-col
            ></v-row
        >
        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="headers"
                    :items="entries"
                    class="elevation-1"
                >
                    <template v-slot:top>
                        <v-dialog v-model="dialog" max-width="500px">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">編集</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6">
                                                <v-text-field
                                                    v-model="editEntry.title"
                                                    label="費目"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-select
                                                    v-model="editEntry.category"
                                                    :items="categories"
                                                    label="カテゴリー"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-text-field
                                                    v-model="editEntry.amount"
                                                    label="金額"
                                                    type="number"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <v-text-field
                                                    v-model="editEntry.date"
                                                    type="date"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue-darken-1"
                                        variant="text"
                                        @click="close"
                                    >
                                        閉じる
                                    </v-btn>
                                    <v-btn
                                        color="blue-darken-1"
                                        variant="text"
                                        @click="saveEdit"
                                    >
                                        保存
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </template>

                    <template v-slot:item.amount="{ item }">
                        <v-chip
                            :color="item.category == '収入' ? 'green' : 'red'"
                            :text="item.amount"
                            label
                        >
                        </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            class="me-2"
                            size="small"
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon size="small" @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDoc,
    setDoc,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    onSnapshot,
} from "firebase/firestore";
export default defineComponent({
    data() {
        return {
            // 編集時に必要な配列の番号
            editIndex: -1,
            // 新規追加時のデータを配列としてフォームと紐づけ
            newEntry: {
                title: "",
                amount: "",
                category: "",
                date: "",
                owner: "",
            },
            // データ編集時に編集中のデータを保存する配列
            editEntry: {
                title: "",
                amount: "",
                category: "",
                date: "",
                owner: "",
            },
            // カテゴリー名
            categories: ["収入", "食費", "交通費", "その他"],
            // 表示するデータ
            entries: [
                {
                    title: "ロイホ",
                    amount: "4555",
                    category: "食費",
                    date: "2024-07-13",
                    owner: "guest",
                },
                {
                    title: "給与",
                    amount: "11223",
                    category: "収入",
                    date: "2024-07-14",
                    owner: "guest",
                },
                {
                    title: "パチンコ",
                    amount: "10234",
                    category: "その他",
                    date: "2024-07-14",
                    owner: "guest",
                },
            ],
            // データテーブルに必要なデータ
            headers: [
                { title: "費目", value: "title", key: "title" },
                { title: "カテゴリー", value: "category", key: "category" },
                {
                    title: "金額",
                    value: "amount",
                    key: "amount",
                    align: "start",
                },
                { title: "日付", value: "date", key: "date" },
                { title: "編集", key: "actions", sortable: false },
            ],
            // 数値フォームのルール
            rules: {
                positive: (value) =>
                    value >= 0 || "マイナスの値を入力しないでください",
            },
            // 編集ダイアログのコントロール
            dialog: false,
            // 仮ユーザ
            user: "guest",
        };
    },
    computed: {
        balanceSum: function () {
            let sum = { balance: 0, income: 0, spend: 0 };
            this.entries.forEach((entry) => {
                if (entry.category == "収入") {
                    sum.balance += parseInt(entry.amount);
                    sum.income += parseInt(entry.amount);
                } else {
                    sum.balance -= parseInt(entry.amount);
                    sum.spend += parseInt(entry.amount);
                }
            });
            return sum;
        },
    },
    methods: {
        addEntry() {
            if (
                this.newEntry.amount &&
                this.newEntry.category &&
                this.newEntry.amount > 0
            ) {
                if (this.newEntry.title == "") this.newEntry.title = "記入無し";
                if (this.newEntry.date == "")
                    this.newEntry.date = new Date().toLocaleDateString("sv-SE");
                addDoc(collection(useFirestore().db, "budget"), {
                    title: this.newEntry.title,
                    amount: this.newEntry.amount,
                    category: this.newEntry.category,
                    date: this.newEntry.date,
                    owner: this.user,
                });
                this.newEntry.title = "";
                this.newEntry.amount = "";
                this.newEntry.category = "";
                this.newEntry.date = "";
                this.newEntry.owner = this.user;
            }
        },
        deleteItem(item) {
            deleteDoc(doc(useFirestore().db, "budget", item.id));
        },
        editItem(item) {
            this.editIndex = this.entries.indexOf(item);
            this.editEntry = Object.assign({}, item);
            this.dialog = true;
        },
        close() {
            this.dialog = false;
        },
        saveEdit() {
            updateDoc(
                doc(
                    useFirestore().db,
                    "budget",
                    this.entries[this.editIndex].id
                ),
                {
                    title: this.editEntry.title,
                    amount: this.editEntry.amount,
                    category: this.editEntry.category,
                    date: this.editEntry.date,
                }
            );
            this.dialog = false;
        },
    },
    async mounted() {
        onSnapshot(collection(useFirestore().db, "budget"), (querySnapshot) => {
            this.entries.length = 0;
            querySnapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    title: doc.data().title,
                    amount: doc.data().amount,
                    category: doc.data().category,
                    date: doc.data().date,
                    owner: doc.data().owner,
                };
                this.entries.push(data);
            });
        });
        console.log(this.entries);
    },
});
</script>

<style scoped></style>
