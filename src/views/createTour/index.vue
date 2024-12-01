<template>
  <div class="container">

    <!-- 上半部分：地图 -->
    <div class="map" ref="mapContainer">
      <back-button></back-button>
      <div class="button-card" style="width: 120px">
        <el-button type="primary" @click="circleEditor.open()" round>开始编辑</el-button>
        <el-button type="primary" @click="circleEditor.close()" round>结束编辑</el-button>
      </div>
    </div>

    <!-- <div id="panel" style="width: 300px; height: 100%; float: right;"></div> -->

    <!-- 下半部分：输入时间栏 -->
    <div class="input-container">
      <el-time-picker v-model="startTime" placeholder="出发时间" :style="{ width: '600px',borderRadius: '50px'}" 
      format="HH:mm"  popper-class="custom-time-picker" @focus="showOverlay = true" @blur="showOverlay = false"></el-time-picker>
      <el-time-picker v-model="lastTime" placeholder="持续时间" :style="{ width: '600px',borderRadius: '50px' }"
      format="HH:mm" :disabled-minutes="lastTimePickerOptions.disabledMinutes" @focus="showOverlay = true" @blur="showOverlay = false"></el-time-picker>
    </div>
    <input v-model="description" type="text" placeholder="描述" class="text-input" />
    <button class="create"  @click="navigateToShowTour">一键生成路线</button>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import BackButton from '@/components/BackButton.vue';
import { ElTimePicker } from 'element-plus';
import * as XLSX from "xlsx"
import pinImg from "@/assets/pin.png"
import sceneryData from "@/assets/scenery.xlsx"

export default {
  components: {
    BackButton,
    ElTimePicker,
  },
  data() {
    return {
      startTime: '', // 时间输入框的数据绑定
      lastTime:'',
      description: '', // 描述输入框的数据绑定
      AMap: null, // 高德地图 JSAPI
      map: null, // 存储地图实例，方便后续使用
      geolocation: null, // 定位实例
      marker: null, // 存储地图中心的大头标
      circle: null,
      circleEditor: null,
      showOverlay: false, // 控制背景灰色遮罩的显示
      selectedCoordinates: [113.9305, 22.5333], // 存储用户选择的坐标
      userLocation: null, // 用户当前位置


      lastTimePickerOptions: {
        disabledMinutes() {
          const disabled = [];
          const allowedMinutes = [0, 15, 30, 45]; // 允许选择的分钟数
          for (let i = 0; i < 60; i++) {
          if (!allowedMinutes.includes(i)){
            disabled.push(i);
          }
          }
          return disabled;
        },
      },

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
        this.circle.setCenter(this.selectedCoordinates);
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
        plugins: ["AMap.Scale", "AMap.Geolocation", "AMap.CircleEditor"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      }).then((AMap) => {
        this.AMap = AMap;

        this.map = new AMap.Map(this.$refs.mapContainer, {
          resizeEnable: true, // 启用地图容器自动调整大小
          center: this.selectedCoordinates, // 设置地图中心点
          zoom: 13, // 设置地图缩放级别
        });


        // 添加地图中心的大头标（标记）
        this.marker = new AMap.Marker({
          map: this.map,
          position: this.selectedCoordinates, // 默认位置地图中心
          offset: new AMap.Pixel(-16, -32), // 偏移
          icon: new AMap.Icon({
            image: pinImg, // 图标路径
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

        this.circle = new AMap.Circle({
          center: this.selectedCoordinates,
          radius: 1000, //半径
          borderWeight: 3,
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 2,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          strokeStyle: 'dashed',
          strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: '#1791fc',
          zIndex: 50,
        })

        this.map.add(this.circle);
        // 缩放地图到合适的视野级别
        this.map.setFitView([this.circle])

        this.circleEditor = new AMap.CircleEditor(this.map, this.circle)

        this.circleEditor.on('move', function (event) {
          console.log('触发事件:move')
        })

        this.circleEditor.on('adjust', function (event) {
          console.log('触发事件:adjust')
        })

        this.circleEditor.on('end', function (event) {
          console.log('触发事件： end')
          // event.target 即为编辑后的圆形对象
        })

        fetch(sceneryData)
          .then((response) => response.arrayBuffer())
          .then((data) => {
            // 解析 Excel 文件
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
            const worksheet = workbook.Sheets[sheetName]; // 获取工作表
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // 转换为 JSON 数据
            this.addMarkers(jsonData)
          });

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
          this.userLocation = [position.lng, position.lat];
        } else {
          console.error("定位失败：", result.message);
        }
      });
    },

    //含参路由
      navigateToShowTour() {
      // 跳转到目标页面，并携带参数
      this.$router.push({
        path: '/showTour',
        query: {
          startTime: this.startTime || '', // 出发时间
          lastTime: this.lastTime || '',   // 持续时间
          description: this.description || '' // 描述文本
        }
      });
    },

    addMarkers(data) {
      data.forEach((item) => {
        const marker = new AMap.Marker({
          map: this.map,
          position: [item.x, item.y],
          title: item.scenery,
        });
        // 添加点击事件弹窗
        marker.on("click", () => {
          new AMap.InfoWindow({
            content: `<div style = "color:black;white-space: nowrap;display: flex; 
                    align-items: center; 
                    justify-content: center; ">${item.scenery}</div>`,
            anchor: "bottom-center",
            offset: new AMap.Pixel(0, -40),

          }).open(this.map, [item.x, item.y]);
        });
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 93%;
  margin: 0 0;
  padding: 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff7f7;
}

.map {
  position: relative;
  flex: 1;
  /* 让地图容器占据剩余空间 */
  background-color: #e4e4e4;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.button-card {
  position: absolute;
  bottom: 50px;
  right: 5px;
  z-index: 100;
  display: flex;
  flex-direction: column;

}

.button-card>.el-button {
  margin: 5px 5px;
}

.button-card {
  position: absolute;
  bottom: 50px;
  right: 5px;
  z-index: 100;
  display: flex;
  flex-direction: column;

}

.button-card>.el-button {
  margin: 5px 5px;
}

.input-container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  padding-bottom:10px;
  
}

/* 修改下拉面板的圆角和位置 */
.custom-time-picker {
  position: absolute !important;
  border-radius: 10px !important; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
  transform: translate(-50%, -50%) !important; /* 垂直和水平居中 */
  left: 50% !important; 
  top: 50% !important; 
  z-index: 2000 !important; /* 确保在最上方 */
}



/* 灰色背景遮罩 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明灰色背景 */
  z-index: 999; /* 确保遮罩层在弹出框下方 */
}

.time-input,
.text-input {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.create{
  border: 1px solid #c2bfbf;
}
</style>