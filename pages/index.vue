<template>
    <v-container>
        <v-row>
            <v-col cols="3">
                <v-text-field v-model="newEntry.title" label="費目">
                </v-text-field>
            </v-col>
            <v-col cols="3">
                <v-text-field
                    v-model="newEntry.amount"
                    label="金額"
                    type="number"
                ></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-select
                    v-model="newEntry.category"
                    :items="categories"
                    label="カテゴリー"
                ></v-select>
            </v-col>
            <v-btn class="align-self-center" @click="addEntry">追加</v-btn>
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
export default defineComponent({
    data() {
        return {
            newEntry: {
                title: "",
                amount: "",
                category: "",
                date: "",
            },
            categories: ["収入", "食費", "交通費", "その他"],
            entries: [
                {
                    title: "ロイホ",
                    amount: "4555",
                    category: "食費",
                    date: "2024/7/13",
                },
                {
                    title: "給与",
                    amount: "11223",
                    category: "収入",
                    date: "2024/7/14",
                },
                {
                    title: "パチンコ",
                    amount: "10234",
                    category: "その他",
                    date: "2024/7/14",
                },
            ],
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
            if (this.newEntry.amount && this.newEntry.category) {
                if (this.newEntry.title == "") this.newEntry.title = "記入無し";
                this.entries.push({
                    title: this.newEntry.title,
                    amount: this.newEntry.amount,
                    category: this.newEntry.category,
                    date: new Date().toLocaleDateString(),
                });
                this.newEntry.title = "";
                this.newEntry.amount = "";
                this.newEntry.category = "";
            }
        },
        deleteItem(item) {},
    },
});
</script>

<style scoped></style>
