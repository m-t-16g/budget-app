<template>
    <div>
        <v-toolbar>
            <v-toolbar-title
                >家計簿アプリ
                <span v-if="currentUser == null"
                    >ログインしていません:ゲスト</span
                >
                <span v-else
                    >ログイン中:{{ currentUser.displayName }}</span
                ></v-toolbar-title
            >
            <p>ログイン</p>
            <v-btn icon><v-icon>mdi-login</v-icon></v-btn>
        </v-toolbar>

        <h1>Firebase Authentication Example</h1>
        <p class="lead">
            Hello!Username:{{ currentUser ? currentUser.displayName : "" }}
        </p>
        <div v-if="currentUser == null">
            <v-btn @click="signIn">Sign In</v-btn>
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
} from "firebase/auth";

export default {
    data: () => ({
        currentUser: null,
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
        signIn() {
            var provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((auth) => {
                    console.log("login", auth.user);
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
    },
};
</script>
