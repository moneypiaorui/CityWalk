<template>
  <div class="container">
  <back-button></back-button>
    <!-- 上半部分：地图 -->
    <div class="map" ref="mapContainer"></div>
    <!-- <div id="panel" style="width: 300px; height: 100%; float: right;"></div> -->

    <!-- 下半部分：输入栏 -->
    <div class="input-container">
      <input v-model="time" type="text" placeholder="选择时间" class="time-input" />
      <input v-model="description" type="text" placeholder="描述" class="text-input" />
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import BackButton from '@/components/BackButton.vue'

export default {
  components:{
    BackButton,
  },
  data() {
    return {
      time: '', // 时间输入框的数据绑定
      description: '', // 描述输入框的数据绑定
      AMap: null, // 高德地图 JSAPI
      map: null, // 存储地图实例，方便后续使用
      geolocation: null, // 定位实例
      marker: null, // 存储地图中心的大头标

      selectedCoordinates: null, // 存储用户选择的坐标
      userLocation: null, // 用户当前位置

    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    selectedCoordinates: {
      deep: true,
      handler() {
        this.marker.setPosition(this.selectedCoordinates); // 更新标记位置
        this.map.setCenter(this.selectedCoordinates); // 设置地图中心

      },
    },
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
        plugins: ["AMap.Scale", "AMap.Geolocation"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      }).then((AMap) => {
        this.AMap = AMap;
        this.map = new AMap.Map(this.$refs.mapContainer, {
          resizeEnable: true, // 启用地图容器自动调整大小
          center: [113.9305, 22.5333], // 设置地图中心点
          zoom: 13, // 设置地图缩放级别
        });


        // 添加地图中心的大头标（标记）
        this.marker = new AMap.Marker({
          map: this.map,
          position: this.map.getCenter(), // 默认位置地图中心
          offset: new AMap.Pixel(-16, -32), // 偏移
          icon: new AMap.Icon({
            image: '/photos/pin.png', // 图标路径
            size: new AMap.Size(50, 50), // 逻辑大小
            imageSize: new AMap.Size(30, 30), //渲染大小
          }),

        });

        // 监听地图的拖动事件，实时更新大头标的位置
        this.map.on('move', () => {
          console.log('地图移动了'); // 调试
        });
        // 点击地图显示坐标
        this.map.on('click', (e) => {
          this.selectedCoordinates = [e.lnglat.lng, e.lnglat.lat];
        });

        // 添加定位插件
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位
          timeout: 10000, // 超时时间，单位毫秒
          maximumAge: 0, // 允许最长缓存时间
          convert: true, // 将 GPS 坐标转换成高德地图坐标
          showMarker: false, // 是否显示定位点
          panToLocation: true, // 定位成功后将定位到地图中心
          showCircle: false, // 是否显示定位精度圆
          // zoomToAccuracy: true, // 定位成功后自动调整地图视野
        });

        // 添加定位控件到地图
        this.map.addControl(this.geolocation);

        this.getUserLocation();

      }).catch((e) => {
        console.log(e);
      });
    },
    // 获取用户当前位置
    getUserLocation() {
      if (!this.geolocation) {
        console.error("定位插件尚未初始化");
        return;
      }

      this.geolocation.getCurrentPosition((status, result) => {
        if (status === "complete") {
          console.log("定位成功：", result);
          const { position } = result; // 获取经纬度
          this.selectedCoordinates = [position.lng, position.lat]; // 更新选定的坐标
        } else {
          console.error("定位失败：", result.message);
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 0;
  padding: 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff7f7;
}

.map {
  flex: 1;
  /* 让地图容器占据剩余空间 */
  background-color: #e4e4e4;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.time-input,
.text-input {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>