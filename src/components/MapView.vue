<template>
    <div id="map" class="map-container"></div>
    <!-- 新增详细信息上拉框 -->
    <div class="info-panel" :class="{ expanded: isPanelExpanded, displayed: isPanelDisplayed }">
        <div class="toggle-button" @click="togglePanel">
            <span v-if="!isPanelExpanded">▲</span>
            <span v-else>▼</span>
        </div>
        <div class="info-content">
            <button class="close-button" @click="closePanel">关闭</button>
            <p v-if="selectedPoint">{{ selectedPoint.name }}</p>
            <p v-else>这里是详细信息内容，可以根据需要动态填充。</p>
        </div>
    </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
    name: "MapView",
    props: {
        keyPoints: {
            type: Array, // 传入关键点数组
            required: true,
        },
    },
    data() {
        return {
            map: null, // 地图实例
            AMap: null,
            markers: [], // 存储标记的数组
            walkingRoutes: [], // 存储步行路线的数组
            isPanelExpanded: false, // 是否展开详细信息面板
            isPanelDisplayed: false, // 是否显示详细信息面板
            selectedPoint: null, // 当前选中的景点
        };
    },
    mounted() {
        console.log("初始化map");
        this.initMap();
    },
    methods: {
        // 初始化地图
        initMap() {
            window._AMapSecurityConfig = {
                securityJsCode: "a6fb5508951536308488060ab69b1538",
            };
            AMapLoader.load({
                key: "d836c18b3ba48bea9eb5ba6edbec3b50", // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: ["AMap.Scale", "AMap.Walking"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
            }).then((AMap) => {
                this.AMap = AMap; // 将加载成功的 AMap 对象存储到组件实例中
                this.map = new AMap.Map("map", {
                    zoom: 14,
                    center: this.keyPoints[0]?.position || [0, 0], // 以第一个点为地图中心
                });
                this.addCustomMarkers();
                this.planRoute();
            }).catch((e) => {
                console.log(e);
            });
        },

        // 规划多点步行路线
        planRoute() {
            // 清除之前的路线
            this.walkingRoutes.forEach(route => route.setMap(null));
            this.walkingRoutes = [];

            if (this.keyPoints.length < 2) {
                console.warn("关键点少于 2 个，无法规划路线");
                return;
            }

            for (let i = 0; i < this.keyPoints.length - 1; i++) {
                const start = this.keyPoints[i].position;
                const end = this.keyPoints[i + 1].position;

                const walking = new this.AMap.Walking({
                    map: this.map,
                    panel: null, // 不显示导航面板
                    hideMarkers: true, // 隐藏默认起点和终点标注
                });
                walking.search(start, end, (status, result) => {
                    if (status === "complete" && result.routes && result.routes.length > 0) {
                        const path = result.routes[0].steps.reduce((acc, step) => {
                            return acc.concat(step.path);
                        }, []);
                        const polyline = new this.AMap.Polyline({
                            path: path,
                            strokeColor: "#FF0000",
                            strokeWeight: 4,
                            map: this.map,
                        });
                        this.walkingRoutes.push(polyline); // 存储路线
                    } else {
                        console.error("步行路线规划失败", result);
                    }
                });
            }
        },

        // 添加自定义标注
        addCustomMarkers() {
            // 清除之前的标记
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];

            this.keyPoints.forEach((point, index) => {
                const marker = new this.AMap.Marker({
                    position: point.position,
                    map: this.map,
                    anchor: "center",
                    content: `
                        <div class="mark">
                            ${index + 1}
                        </div>
                    `,
                });

                // 添加点击事件弹窗和显示详细信息
                marker.on("click", () => {
                    new this.AMap.InfoWindow({
                        content: `<div style="color:black;white-space: nowrap;display: flex; 
                        align-items: center; 
                        justify-content: center;">${point.name}</div>`,
                        anchor: "bottom-center",
                        offset: new this.AMap.Pixel(0, -20),
                    }).open(this.map, point.position);

                    this.selectedPoint = point; // 设置当前选中的景点
                    this.isPanelDisplayed = true; // 显示详细信息面板
                });

                this.markers.push(marker); // 存储标记
            });
        },
        togglePanel() {
            this.isPanelExpanded = !this.isPanelExpanded;
        },
        closePanel() {
            this.isPanelDisplayed = false; // 隐藏详细信息面板
            this.selectedPoint = null; // 清空选中的景点
        },
    },
    watch: {
        // 当关键点数据变化时重新规划路线和更新标注
        keyPoints: {
            deep: true,
            immediate: true,
            handler() {
                if (this.map) {
                    this.planRoute();
                    this.addCustomMarkers();
                }
            },
        },
    },
};
</script>

<style>
.map-container {
    width: 100%;
    height: 100%;
}

.mark {
    color: white;
    background: #007BFF;
    border: white 3px solid;
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.info-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #333;
    background-color: #fff;
    border-top: 1px solid #ddd;
    transition: transform 0.8s ease; /* 添加过渡效果 */
    transform: translateY(80%); /* 默认隐藏 */
    display: none; /* 默认隐藏 */
}
.info-panel.expanded {
    transform: translateY(0); /* 展开时显示 */
}
.info-panel.displayed {
    display: block; /* 显示面板 */
}
.toggle-button {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    background-color: #f5f5f5;
    cursor: pointer;
    font-size: 18px;
    border-top: 1px solid #ddd;
}
.info-content {
    padding: 20px;
    font-size: 14px;
    height: 60vh;
    color: #333;
}
.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
}
.close-button:hover {
    background-color: #d9363e;
}
</style>