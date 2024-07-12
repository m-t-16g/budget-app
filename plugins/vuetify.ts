// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/components";
export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        // ... your configuration
        components: {
            VDateInput,
        },
    });
    app.vueApp.use(vuetify);
});
