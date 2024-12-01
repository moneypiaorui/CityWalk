<template>
    <div class="container">
        <back-button></back-button>
        <MapView :keyPoints="keyPoints" />
    </div>
</template>

<script>
import MapView from "@/components/MapView.vue";
import BackButton from '@/components/BackButton.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    components: { MapView, BackButton },
    data() {
        return {
            keyPoints: [],
        };
    },
    mounted() {
        const route = useRoute();
        const { x, y } = route.query;

        axios.get(`/api/getTour`, { params: { x, y } })
            .then(response => {
                this.keyPoints = response.data.keyPoints;
            })
            .catch(error => {
                console.error('Error fetching key points:', error);
            });
    },
};
</script>

<style scoped>
.container {
    height: 100%;
    width: 100%;
}
</style>