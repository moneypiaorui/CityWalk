<template>
    <div class="container">
        <back-button></back-button>
        <div class="route-info" v-if="routeType">
            <span class="route-type">{{getRouteTypeLabel(routeType) }}</span>
            <h3 class="route-title" v-if="title">{{ title }}</h3>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="keyPoints.length === 0" class="no-data">暂无数据</div>
        <MapView v-else :keyPoints="keyPoints" />
        
    </div>
</template>

<script>
import MapView from "@/components/MapView.vue";
import BackButton from '@/components/BackButton.vue';
import axios from 'axios';
import { usePreferencesStore } from '@/stores/preferences';

export default {
    components: { MapView, BackButton },
    data() {
        return {
            keyPoints: [],
            loading: true,
            isPanelExpanded: false,
            title: '',
            routeType: ''
        };
    },
    computed: {
        // 通过 pinia 获取全局 preferences
        preferences() {
            return usePreferencesStore().preferences;
        }
    },
    async created() {
        console.log('接收到的参数:', this.$route.query);
        const { lon, lat, radius, title, keyPoints: keyPointsStr, routeType } = this.$route.query;
        
        this.title = title || '';
        this.routeType = routeType || '';

        try {
            // 判断是从分享页面跳转还是从创建页面跳转
            if (keyPointsStr) {
                // 从分享页面跳转，直接解析传递的keyPoints
                this.keyPoints = JSON.parse(keyPointsStr);
                console.log('从分享页面接收到的景点:', this.keyPoints);
            } else if (lon && lat) {
                // 从创建页面跳转，调用API获取keyPoints
                const response = await axios.get(`/api/getTour`, { params: { lon, lat, radius,routeType } });
                const keyPoints = response.data.keyPoints || [];

                // 对 keyPoints 进行排序，确保曼哈顿距离总和最小
                // this.keyPoints = this.sortKeyPoints(keyPoints);
                this.keyPoints = keyPoints;
                console.log('从API获取的景点:', this.keyPoints);
            }
        } catch (error) {
            console.error('Error fetching key points:', error);
        } finally {
            this.loading = false; // 加载完成
        }
    },
    methods: {
        getRouteTypeLabel(type) {
            const pref = this.preferences.find(p => p.value === type);
            return pref ? pref.label : (type || '');
        },
        // sortKeyPoints(keyPoints) {
        //     if (!keyPoints || keyPoints.length === 0) return [];

        //     // 曼哈顿距离计算函数
        //     const manhattanDistance = (p1, p2) => {
        //         // 兼容不同的数据格式
        //         const lon1 = p1.lon || p1.position?.[0];
        //         const lat1 = p1.lat || p1.position?.[1];
        //         const lon2 = p2.lon || p2.position?.[0];
        //         const lat2 = p2.lat || p2.position?.[1];
                
        //         if (!lon1 || !lat1 || !lon2 || !lat2) {
        //             console.warn('Missing coordinates for distance calculation');
        //             return 0;
        //         }
                
        //         return Math.abs(lon1 - lon2) + Math.abs(lat1 - lat2);
        //     };

        //     // 选择第一个点作为起点
        //     const sorted = [keyPoints[0]];
        //     const remaining = keyPoints.slice(1);

        //     while (remaining.length > 0) {
        //         let closestIndex = 0;
        //         let closestDistance = manhattanDistance(sorted[sorted.length - 1], remaining[0]);

        //         for (let i = 1; i < remaining.length; i++) {
        //             const distance = manhattanDistance(sorted[sorted.length - 1], remaining[i]);
        //             if (distance < closestDistance) {
        //                 closestIndex = i;
        //                 closestDistance = distance;
        //             }
        //         }

        //         sorted.push(remaining.splice(closestIndex, 1)[0]);
        //     }

        //     return sorted;
        // },
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
    position: relative; /* 确保子元素定位正常 */
}
.loading, .no-data {
    font-size: 16px;
    color: #666;
    margin-top: 20px;
}

.route-info {
    position: absolute;
    top: 80px;
    left: 20px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 0.85);
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
}

.route-type {
    background-color: #1976D2;
    color: white;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 5px;
}

.route-title {
    margin: 0;
    font-size: 16px;
    color: #333;
}
</style>
