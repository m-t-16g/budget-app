<template>
    <div>
        <v-toolbar>
            <v-toolbar-title
                ><span class="text-h4 mr-2">家計簿アプリ</span>
                <span class="text-subtitle-1" v-if="currentUser == null"
                    >ログインしていません:ゲスト</span
                >
                <span class="text-subtitle-1" v-else
                    >ログイン中</span
                ></v-toolbar-title
            >
            <v-dialog v-model="loginDialog" persistent
                ><v-card class="mx-auto" width="400" title="ログインフォーム">
                    <template v-slot:append>
                        <div>
                            <v-btn
                                icon="mdi-close"
                                variant="text"
                                @click="toggleLoginForm"
                            ></v-btn>
                        </div>
                    </template>
                    <v-divider></v-divider>
                    <v-container
                        ><v-text>メールアドレス</v-text>
                        <v-text-field
                            v-model="accountEntry.mail"
                            label="メールアドレス"
                            type="mail"
                        ></v-text-field>
                        <v-text>パスワード</v-text>
                        <v-text-field
                            v-model="accountEntry.password"
                            label="パスワード"
                            type="password"
                            :rules="[rules.password]"
                        ></v-text-field>
                        <v-btn
                            class="text-none"
                            prepend-icon="mdi-login"
                            @click="signInWithMail"
                            >ログイン</v-btn
                        >
                        <v-btn
                            class="text-none ml-4"
                            prepend-icon="mdi-account-plus"
                            @click="createAccount"
                            >アカウント作成</v-btn
                        >
                        <v-divider class="my-4"></v-divider>
                        <v-btn
                            class="text-none"
                            prepend-icon="mdi-google"
                            @click="signInWithGoogle"
                            >Googleでログイン</v-btn
                        >
                    </v-container>
                    <v-card-text></v-card-text> </v-card
            ></v-dialog>
            <v-btn
                v-if="currentUser == null"
                prepend-icon="mdi-login"
                @click="toggleLoginForm"
                >ログイン</v-btn
            >
            <v-btn v-else prepend-icon="mdi-logout" @click="signOutUser"
                >ログアウト</v-btn
            >
        </v-toolbar>

        <v-container>
            <v-row class="mt-2"
                ><v-list>
                    <v-list-title class="text-h5">機能説明</v-list-title>
                    <v-list-item
                        >データの作成、読み出し、変更、削除ができる家計簿アプリです</v-list-item
                    >
                    <v-list-item
                        >ログインしていない時はゲストデータを、ログインしている時はそのユーザのデータを閲覧できます。カテゴリーも横の歯車ボタンからユーザごとにカスタム可能です</v-list-item
                    >
                    <v-list-item
                        >ログイン方法は "メールアドレスとパスワード"
                        "googleアカウント"の2種類です</v-list-item
                    >
                </v-list></v-row
            >
            <v-row class="mt-4 mb-1">
                <v-col cols="3">
                    <v-text-field v-model="newEntry.title" label="費目">
                    </v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-select
                        v-model="newEntry.category"
                        :items="categories"
                        prepend-inner-icon="mdi-cog"
                        label="カテゴリー"
                        @click:prepend-inner="toggleCatDialog"
                    ></v-select>
                    <v-dialog v-model="catDialog"
                        ><v-card title="カテゴリー変更" class="mx-auto"
                            ><template v-slot:append>
                                <div>
                                    <v-btn
                                        icon="mdi-close"
                                        variant="text"
                                        @click="toggleCatDialog"
                                    ></v-btn>
                                </div>
                            </template>
                            <v-list density="compact">
                                <v-list-item
                                    v-for="(category, index) in categories"
                                    :key="index"
                                >
                                    <template v-slot:prepend>
                                        <v-icon
                                            icon="mdi-minus-circle"
                                            @click="removeCategories(index)"
                                        ></v-icon>
                                    </template>
                                    <v-list-item-title>
                                        {{ category }}
                                    </v-list-item-title>
                                    <template v-slot:append>
                                        <v-checkbox-btn
                                            v-model="isPositive[category]"
                                            color="success"
                                            label="収入源"
                                        ></v-checkbox-btn>
                                    </template>
                                </v-list-item>
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <v-icon
                                            icon="mdi-plus-circle"
                                            @click="addCategories"
                                        ></v-icon>
                                    </template>
                                    <v-list-item-title
                                        ><v-text-field
                                            v-model="newCategory"
                                            label="追加"
                                            variant="underlined"
                                            density="compact"
                                            :rules="[rules.noEmpty]"
                                        ></v-text-field
                                    ></v-list-item-title>
                                </v-list-item>
                            </v-list>
                            <v-card-actions>
                                <v-btn
                                    prepend-icon="mdi-content-save"
                                    text="保存して閉じる"
                                    @click="saveCustomCategories"
                                ></v-btn>
                            </v-card-actions> </v-card
                    ></v-dialog>
                </v-col>
                <v-col cols="2">
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
                <v-col class="d-flex" cols="1"
                    ><v-btn class="align-self-center" @click="addEntry"
                        >追加</v-btn
                    ></v-col
                >
            </v-row>
            <v-row></v-row>
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
                        :class="
                            balanceSum.balance >= 0 ? 'text-green' : 'text-red'
                        "
                        >{{ balanceSum.balance }}</span
                    ></v-col
                ></v-row
            >
            <v-row>
                <v-col cols="12">
                    <v-data-table
                        :headers="headers"
                        :items="makeEntry"
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
                                                        v-model="
                                                            editEntry.title
                                                        "
                                                        label="費目"
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-select
                                                        v-model="
                                                            editEntry.category
                                                        "
                                                        :items="categories"
                                                        label="カテゴリー"
                                                    ></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-text-field
                                                        v-model="
                                                            editEntry.amount
                                                        "
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
                                :color="
                                    isPositive[item.category] == true
                                        ? 'green'
                                        : 'red'
                                "
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
    </div>
</template>

<script>
// firestore関係のimport
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
// auth関係のimport
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

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
            categories: ["収入", "消耗品費", "食費", "交通費", "その他"],

            newCategory: "",
            isPositive: {
                収入: true,
                消耗品費: false,
                食費: false,
                交通費: false,
                その他: false,
            },
            // 表示するデータ
            entries: [],
            displayEntry: [],
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
                noEmpty: (value) => {
                    if (value) return true;
                    return "空白は許可されていません";
                },
                password: (value) => {
                    if (value.length >= 6) return true;
                    return "パスワードは6文字以上にしてください";
                },
            },
            // 編集ダイアログのコントロール
            dialog: false,
            // 仮ユーザ
            currentUser: null,
            // 検索用id
            currentUID: "guest",
            // ログインダイアログのコントロール
            loginDialog: false,
            // ログインフォームの入力内容
            accountEntry: { mail: "", password: "" },
            // カテゴリーダイアログのコントロール
            catDialog: false,
        };
    },
    computed: {
        // 集計部分の計算
        balanceSum: function () {
            let sum = { balance: 0, income: 0, spend: 0 };
            this.entries.forEach((entry) => {
                if (entry.owner == this.currentUID) {
                    if (this.isPositive[entry.category]) {
                        sum.balance += parseInt(entry.amount);
                        sum.income += parseInt(entry.amount);
                    } else {
                        sum.balance -= parseInt(entry.amount);
                        sum.spend += parseInt(entry.amount);
                    }
                }
            });
            return sum;
        },
        // idでデータを抽出
        makeEntry: function () {
            const displayEntry = [];
            this.entries.forEach((entry) => {
                if (entry.owner == this.currentUID) {
                    displayEntry.push(entry);
                }
            });
            return displayEntry;
        },
        posCheck: function (cat) {
            return this.isPositive[cat];
        },
    },
    methods: {
        // カテゴリー編集メソッドとダイアログの閉会
        toggleCatDialog() {
            this.catDialog = !this.catDialog;
        },
        addCategories() {
            if (this.newCategory) {
                this.categories.push(this.newCategory);
                this.isPositive[this.newCategory] = "false";
                this.newCategory = "";
            }
        },
        removeCategories(i) {
            delete this.isPositive[this.categories[i]];
            this.categories.splice(i, 1);
        },
        // カテゴリーをDBに保存
        async saveCustomCategories() {
            const uid = this.currentUID;
            await setDoc(doc(useFirestore().db, "customCategories", uid), {
                categories: this.categories,
                isPositive: this.isPositive,
            });
            this.catDialog = !this.catDialog;
        },
        // データベースからカスタムカテゴリをロード
        // エントリーを追加するメソッド
        addEntry() {
            // 新しいエントリーの条件チェック(空やマイナスの数値をはじく)
            if (
                this.newEntry.amount &&
                this.newEntry.category &&
                this.newEntry.amount > 0
            ) {
                // 空の入力やデータがあった際はデフォルトネームを設定
                if (this.newEntry.title == "") this.newEntry.title = "記入無し";
                if (this.newEntry.date == "")
                    this.newEntry.date = new Date().toLocaleDateString("sv-SE");
                // ログインしていない際はownerにguestを、ログイン中はuidを設定
                const userID =
                    this.currentUser == null ? "guest" : this.currentUser.uid;
                // dbに書き込み
                addDoc(collection(useFirestore().db, "budget"), {
                    title: this.newEntry.title,
                    amount: this.newEntry.amount,
                    category: this.newEntry.category,
                    date: this.newEntry.date,
                    owner: userID,
                });
                this.newEntry.title = "";
                this.newEntry.amount = "";
                this.newEntry.category = "";
                this.newEntry.date = "";
                this.newEntry.owner = userID;
            }
        },
        // アイテムを削除するメソッド
        deleteItem(item) {
            deleteDoc(doc(useFirestore().db, "budget", item.id));
        },
        // アイテムの編集開始するメソッド、変数editEntryに対象のカラムを複製
        editItem(item) {
            this.editIndex = this.entries.indexOf(item);
            this.editEntry = Object.assign({}, item);
            this.dialog = true;
        },
        close() {
            this.dialog = false;
        },
        // 編集されたカラムをデータベースに登録するメソッド
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
        // ログインフォームのコントロール
        toggleLoginForm() {
            this.loginDialog = !this.loginDialog;
        },
        // グーグルアカウントを使ったサインイン
        signInWithGoogle() {
            var provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((auth) => {
                    this.accountEntry.mail = "";
                    this.accountEntry.password = "";
                    if (this.loginDialog == true) this.loginDialog = false;
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("faild to login", errorCode, errorMessage);
                });
        },
        // サインアウト
        signOutUser() {
            signOut(getAuth());
        },
        // メールアドレスとパスワードを使ったサインイン
        signInWithMail() {
            signInWithEmailAndPassword(
                getAuth(),
                this.accountEntry.mail,
                this.accountEntry.password
            )
                .then(() => {
                    this.accountEntry.mail = "";
                    this.accountEntry.password = "";
                    this.loginDialog = false;
                })
                .catch((error) => {
                    console.log(error.code, error.message);
                    if (error.code == "auth/user-not-found") {
                        window.alert(
                            "メールアドレスが間違っているか、ユーザが登録されていません"
                        );
                    } else if (error.code == "auth/wrong-password") {
                        window.alert("パスワードが間違っています。");
                    }
                });
        },
        // メールアドレスを使ったアカウント作成
        createAccount() {
            createUserWithEmailAndPassword(
                getAuth(),
                this.accountEntry.mail,
                this.accountEntry.password
            )
                .then(() => {
                    this.accountEntry.mail = "";
                    this.accountEntry.password = "";
                    this.loginDialog = false;
                })
                .catch((error) => {
                    console.log(error.code, error.message);
                    window.alert(
                        "エラーが発生したため、最初からやり直してください"
                    );
                });
        },
    },
    mounted() {
        // ログイン状態の監視
        onAuthStateChanged(getAuth(), (user) => {
            if (user != null) {
                this.currentUser = user;
                this.currentUID = user.uid;
                const getCat = async () => {
                    const catSnap = await getDoc(
                        doc(useFirestore().db, "customCategories", user.uid)
                    );
                    console.log(catSnap.exists());
                    if (catSnap.exists()) {
                        console.log(catSnap.data());
                        this.categories = catSnap.data().categories;
                        this.isPositive = catSnap.data().isPositive;
                    } else {
                        console.log("nodata");
                        const templateSnap = await getDoc(
                            doc(
                                useFirestore().db,
                                "customCategories",
                                "template"
                            )
                        );
                        this.categories = templateSnap.data().categories;
                        this.isPositive = templateSnap.data().isPositive;
                    }
                };
                getCat();
            } else {
                this.currentUser = null;
                this.currentUID = "guest";
                const getCat = async () => {
                    const catSnap = await getDoc(
                        doc(useFirestore().db, "customCategories", "guest")
                    );
                    this.categories = catSnap.data().categories;
                    this.isPositive = catSnap.data().isPositive;
                };
                getCat();
            }
        });
        // ページがマウントされた時に、データベースにアクセスしてスナップショットを持ってくる
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
    },
});
</script>

<style scoped></style>
