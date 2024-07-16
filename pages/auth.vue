<template>
    <div>
        <v-toolbar>
            <v-toolbar-title
                ><span class="text-h4 mr-2">家計簿アプリ</span>
                <span class="text-subtitle-1" v-if="currentUser == null"
                    >ログインしていません:ゲスト</span
                >
                <span class="text-subtitle-1" v-else
                    >ログイン中:{{ currentUser.displayName }}</span
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

        <h1>Firebase Authentication Example</h1>
        <p class="lead">
            Hello!Username:{{
                currentUser
                    ? currentUser.displayName + " UID= " + currentUser.uid
                    : ""
            }}
        </p>

        <div v-if="currentUser == null">
            <v-btn @click="signInWithGoogle">Sign In with google</v-btn>
            <v-btn @click="signInGuest">sign in as guest</v-btn>
        </div>
        <div v-else>
            <v-btn @click="signOutUser"> Sign Out </v-btn>
        </div>
    </div>
</template>

<script>
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

export default {
    data: () => ({
        currentUser: null,
        loginDialog: false,
        accountEntry: { mail: "", password: "" },
    }),
    mounted() {
        onAuthStateChanged(getAuth(), (user) => {
            if (user != null) {
                this.currentUser = user;
            } else {
                this.currentUser = null;
            }
        });
    },
    methods: {
        toggleLoginForm() {
            this.loginDialog = !this.loginDialog;
        },
        signInWithGoogle() {
            var provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((auth) => {
                    console.log("login", auth.user);
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
        signInGuest() {
            signInAnonymously(getAuth())
                .then((auth) => {
                    console.log("login", auth);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("faild to login", errorCode, errorMessage);
                });
        },
        signOutUser() {
            signOut(getAuth());
        },
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
                });
        },
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
                });
        },
    },
};
</script>
