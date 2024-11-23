<template>
    <div class="container">
        <back-button></back-button>
        <MapView :keyPoints="keyPoints" />
    </div>
</template>

<script>
import MapView from "@/components/MapView.vue";
import BackButton from '@/components/BackButton.vue'

export default {
    components: { MapView ,BackButton},
    data() {
        return {
            // 关键点坐标（高德坐标系）
            keyPoints: [
                [117.227219, 31.820586], // 点 1：合肥火车站
                [117.233803, 31.828797], // 点 2：天鹅湖地铁站
                [117.240958, 31.833682], // 点 3：天鹅湖公园
                [117.259029, 31.838299], // 点 4：FEW少数派咖啡店
            ],
        };
    },
};
</script>
<style scoped>
.container {
    height: 100%;
    width: 100%;
}
</style>