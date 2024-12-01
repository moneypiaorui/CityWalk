<template>
    <div id="map" class="map-container"></div>
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
            AMap: null
        };
    },
    mounted() {
        this.initAMap();
        // setTimeout(() => {
        //     this.planRoute();
        //     this.addCustomMarkers();
        // }, 1000);

    },
    unmounted() {
        this.map?.destroy();
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
                // this.AMap = AMap; // 将加载成功的 AMap 对象存储到组件实例中
                this.map = new AMap.Map("map", {
                    zoom: 14, // 地图缩放级别
                    center: this.keyPoints[0], // 以第一个点为地图中心
                });
                this.addCustomMarkers();
                this.planRoute();
            }).catch((e) => {
                console.log(e);
            });


        },

        // 规划多点步行路线
        planRoute() {
            if (this.keyPoints.length < 2) {
                console.warn("关键点少于 2 个，无法规划路线");
                return;
            }

            for (let i = 0; i < this.keyPoints.length - 1; i++) {
                const start = this.keyPoints[i];
                const end = this.keyPoints[i + 1];

                // 创建单独的 Walking 实例
                const walking = new AMap.Walking({
                    map: this.map,
                    panel: null, // 不显示导航面板
                    hideMarkers: true, // 隐藏默认起点和终点标注
                });
                walking.search(start, end, (status, result) => {
                    if (status === "complete" && result.routes && result.routes.length > 0) {
                        const path = result.routes[0].steps.reduce((acc, step) => {
                            return acc.concat(step.path);
                        }, []);

                        // new AMap.Polyline({
                        //     path: path,
                        //     strokeColor: "#FF0000",
                        //     strokeWeight: 4,
                        //     map: this.map,
                        // });
                    } else {
                        console.error("步行路线规划失败", result);
                    }
                });
            }
        },

        // 添加自定义标注
        addCustomMarkers() {
            this.keyPoints.forEach((point, index) => {
                const marker = new AMap.Marker({
                    position: point,
                    map: this.map,
                    anchor: "center",
                    content: `
                            <div class = "mark" >
                                ${index + 1}
                            </div>
                        `, // 自定义标注内容
                });

                // 添加点击事件弹窗
                marker.on("click", () => {
                    new AMap.InfoWindow({
                        content: `<div style = "color:black;white-space: nowrap;display: flex; 
                    align-items: center; 
                    justify-content: center; ">关键点 ${index + 1}: (${point[0]}, ${point[1]})</div>`,
                        anchor: "bottom-center",
                        offset: new AMap.Pixel(0, -20),

                    }).open(this.map, point);
                });
            });
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
    mounted() {
        this.initMap();
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
</style>