<template>
    <div class="container">
        <back-button></back-button>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="keyPoints.length === 0" class="no-data">暂无数据</div>
        <MapView v-else :keyPoints="keyPoints" />
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
            loading: true, // 添加加载状态
        };
    },
    async created() {
        console.log('接收到的参数:', this.$route.query);
        const { lon, lat,radius } = this.$route.query;
// console.log(`出发时间: ${startTime}, 持续时间: ${lastTime}, 描述: ${description}`);

        try {
            const response = await axios.get(`/api/getTour`, { params: { lon, lat, radius } });
            const keyPoints = response.data.keyPoints;

            // 对 keyPoints 进行排序，确保曼哈顿距离总和最小
            this.keyPoints = this.sortKeyPoints(keyPoints);
        } catch (error) {
            console.error('Error fetching key points:', error);
        } finally {
            this.loading = false; // 加载完成
        }
    },
    methods: {
        sortKeyPoints(keyPoints) {
            if (!keyPoints || keyPoints.length === 0) return [];

            // 曼哈顿距离计算函数
            const manhattanDistance = (p1, p2) => Math.abs(p1.lon - p2.lon) + Math.abs(p1.lat - p2.lat);

            // 选择第一个点作为起点
            const sorted = [keyPoints[0]];
            const remaining = keyPoints.slice(1);

            while (remaining.length > 0) {
                let closestIndex = 0;
                let closestDistance = manhattanDistance(sorted[sorted.length - 1], remaining[0]);

                for (let i = 1; i < remaining.length; i++) {
                    const distance = manhattanDistance(sorted[sorted.length - 1], remaining[i]);
                    if (distance < closestDistance) {
                        closestIndex = i;
                        closestDistance = distance;
                    }
                }

                sorted.push(remaining.splice(closestIndex, 1)[0]);
            }

            return sorted;
        }
    },
};
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.loading, .no-data {
    font-size: 16px;
    color: #666;
    margin-top: 20px;
}
</style>