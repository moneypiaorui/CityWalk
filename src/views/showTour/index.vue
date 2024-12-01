<template>
    <div class="container">
        <back-button></back-button>
        <MapView v-if="keyPoints.length > 0" :keyPoints="keyPoints" />
    </div>
</template>

<script>
import MapView from "@/components/MapView.vue";
import BackButton from '@/components/BackButton.vue';
import axios from 'axios';

export default {
    components: { MapView, BackButton },
    mounted() {
    console.log('接收到的参数:', this.$route.query);
    const { startTime, lastTime, description } = this.$route.query;
    console.log(`出发时间: ${startTime}, 持续时间: ${lastTime}, 描述: ${description}`);
    },
    data() {
        return {
            keyPoints: [],
        };
    },
    async created() {
        console.log('接收到的参数:', this.$route.query);
        const { x, y } = this.$route.query;
        // console.log(`出发时间: ${startTime}, 持续时间: ${lastTime}, 描述: ${description}`);

        try {
            const response = await axios.get(`/api/getTour`, { params: { x, y } });
            this.keyPoints = response.data.keyPoints; // 更新 keyPoints
        } catch (error) {
            console.error('Error fetching key points:', error);
        }
    },

    mounted() { },

};
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
}
</style>