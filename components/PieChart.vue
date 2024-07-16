<script>
import { Pie } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PieController,
} from "chart.js";
ChartJS.register(Title, Tooltip, Legend, PieController);
export default {
    props: {
        chartData: {
            type: Object,
        },
        options: {
            type: Object,
            default: null,
        },
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    },
};
</script>
