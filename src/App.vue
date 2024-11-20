
<template>
  <div id="app">
    <div class="container">
      <!-- 上半部分：地图 -->
      <div class="map-container" ref="mapContainer"></div>

      <!-- 下半部分：输入栏 -->
      <div class="input-container">
        <input v-model="time" type="text" placeholder="选择时间" class="time-input" />
        <input v-model="description" type="text" placeholder="描述" class="text-input" />
      </div>
       <!-- 显示选定的坐标 -->
       <div v-if="selectedCoordinates" class="coordinates-info">
        <p>选定的坐标：{{ selectedCoordinates }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: '', // 时间输入框的数据绑定
      description: '', // 描述输入框的数据绑定
      map: null, // 存储地图实例，方便后续使用
      selectedCoordinates: null, // 存储用户选择的坐标
      userLocation: null, // 用户当前位置
      marker: null, // 存储地图中心的大头标
    };
  },
  mounted() {
    // 延迟一段时间后加载地图，确保高德地图 API 完全加载
    setTimeout(() => {
      this.loadMap();
    }, 1000); // 延迟1秒加载
  },
  methods: {
    loadMap() {
      
      if (window.AMap) {
        // 初始化地图并存储到 data 中的 map
        // @ts-ignore
        this.map = new window.AMap.Map(this.$refs.mapContainer, {
          resizeEnable: true, // 启用地图容器自动调整大小
          center: [113.9305, 22.5333], // 设置地图中心点
          zoom: 13, // 设置地图缩放级别
        });


        // 添加地图中心的大头标（标记）
        this.marker = new window.AMap.Marker({
          position: this.map.getCenter(), // 默认位置是地图中心
          offset: new window.AMap.Pixel(-16, -32), // 根据图标大小调整偏移
          icon: new window.AMap.Icon({
              image: '/photos/pin.png', // 图标路径
              size: new window.AMap.Size(50, 50), // 设置图标逻辑大小（宽度，高度）
              imageSize: new window.AMap.Size(50, 50), // 显示大小，可以精确控制图标渲染尺寸
            }),

        });
        this.marker.setMap(this.map);

        // 监听地图的拖动事件，实时更新大头标的位置
        this.map.on('move', () => {
          const center = this.map.getCenter(); // 获取地图中心
          this.marker.setPosition(center); // 更新大头标的位置
          this.selectedCoordinates = `${center.lng}, ${center.lat}`; // 更新选中的坐标
        });
      } else {
        // 如果高德地图 API 没有加载，输出错误信息
        console.error('高德地图 API 加载失败');
      }
    },
    
  },
};
</script>


<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: flex-start;  /* 从左边开始显示 */
  align-items: flex-start;  /* 让内容从上方开始对齐 */
  height: 80vh;
  background-color: #fff7f7;
  width: 70vw;
  overflow: hidden; /* 防止内容溢出 */
  border-radius: 15px; /* 设置圆角边框 */
  box-shadow: 0 4px 10px rgba(9, 7, 7, 0.1); /* 设置阴影效果 */

}

.container {
  display: flex;
  width: 70vw; /* 容器占据100%的宽度 */
  flex-direction: column;
  height: 80vh; /* 确保容器占据整个视口 */
  justify-content: space-between;
  background-color: #fff7f7;
}

.map-container {
  flex: 1; /* 让地图容器占据剩余空间 */
  background-color: #e4e4e4;
  border-radius: 15px; /* 设置圆角边框 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 设置阴影效果 */
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

.coordinates-info {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

</style>