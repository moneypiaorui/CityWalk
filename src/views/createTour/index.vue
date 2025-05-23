<template>
  <div class="container">

    <!-- 上半部分：地图 -->
    <div class="map" ref="mapContainer">
      <back-button></back-button>
    </div>

    <!-- <div id="panel" style="width: 300px; height: 100%; float: right;"></div> -->

    <!-- 下半部分：输入时间栏 -->
    <div class="input-container">
        <div class="custom-time-picker">
          <input type="time" v-model="startTime" placeholder="出发时间" id="startTime-input" class="custom-time-input"/>
        </div>
        <div class="custom-time-picker">
          <input type="time" v-model="lastTime" placeholder="持续时间" id="lastTime-input" class="custom-time-input"/>
        </div>
    </div>
    
    <!-- 偏好选择栏 -->
    <div class="preference-selector">
      <div class="selector-header" @click="togglePreferencePanel">
        <span>{{ selectedPreference === 'default' ? '个性化选项' : getPreferenceLabel(selectedPreference) }}</span>
        <i class="preference-icon" :class="{ 'expanded': showPreferencePanel }">{{ showPreferencePanel ? '▼' : '▲' }}</i>
      </div>
      <div class="preference-panel" :class="{ 'show': showPreferencePanel }">
        <div 
          v-for="(pref, index) in preferences" 
          :key="index" 
          class="preference-item"
          :class="{ 'active': selectedPreference === pref.value }"
          @click="selectPreference(pref.value)"
        >
          {{ pref.label }}
        </div>
      </div>
    </div>

    <!-- <input v-model="description" type="text" placeholder="描述" class="text-input" /> -->
    <button class="create" @click="navigateToShowTour">一键生成路线</button>
  </div>
  
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import BackButton from '@/components/BackButton.vue';
import { ElTimePicker } from 'element-plus';
import * as XLSX from "xlsx"
import pinImg from "@/assets/pin.png"
import { usePreferencesStore } from '@/stores/preferences'

export default {
  components: {
    BackButton,
    ElTimePicker,
  },
  computed: {
    preferences() {
      return usePreferencesStore().preferences;
    },
    // 根据 selectedPreference 返回不同的数据源
    sceneryData() {
      switch (this.selectedPreference) {
        case 'default':
          return null;
        case 'food':
          return '/shenzhen_food.xlsx';
        case 'culture':
          return '/shenzhen_culture.xlsx';
        default:
          return '/scenery.xlsx';
      }
    }
  },
  data() {
    return {
      startTime: '', // 时间输入框的数据绑定
      lastTime: '',
      timeValue: '',
      description: '', // 描述输入框的数据绑定
      radius:1,//景点选择范围，单位km
      AMap: null, // 高德地图 JSAPI
      map: null, // 存储地图实例，方便后续使用
      geolocation: null, // 定位实例
      marker: null, // 存储地图中心的大头标
      markers: [], // 用于保存所有 marker 实例
      circle: null,
      circleEditor: null,
      showOverlay: false, // 控制背景灰色遮罩的显示
      selectedCoordinates: [113.9305, 22.5333], // 存储用户选择的坐标
      userLocation: null, // 用户当前位置
      showPreferencePanel: false, // 控制偏好选择面板的显示
      selectedPreference: 'default', // 默认选择

      // 设置时间选择器的分钟步长
      startTimePickerOptions: {
        disabledMinutes() {
          const disabled = [];
          for (let i = 0; i < 60; i++) {
            if (i % 15 !== 0) {
              disabled.push(i);
            }
          }
          return disabled;
        }  // 设置分钟步长为 15 分钟
      },
      lastTimePickerOptions: {
        disabledMinutes() {
          const disabled = [];
          const allowedMinutes = [0, 15, 30, 45]; // 允许选择的分钟数
          for (let i = 0; i < 60; i++) {
            if (i % 15 !== 0) {
              disabled.push(i);
            }
          }
          return disabled;
        }  // 设置分钟步长为 15 分钟
      },
      
    };
  },
  created() {
    this.initMap();
    // sceneryData 的 watcher 会自动加载数据点
  },
  watch: {
    selectedCoordinates: {
      deep: true,
      handler() {
        this.marker.setPosition(this.selectedCoordinates); // 更新标记位置
        this.map.setCenter(this.selectedCoordinates); // 设置地图中心
        this.circle.setCenter(this.selectedCoordinates);

        this.circleEditor.close(); // 关闭圆形编辑器
        this.circleEditor = new AMap.CircleEditor(this.map, this.circle)
        this.circleEditor.open(); // 打开圆形编辑器
        this.circleEditor.on('adjust', (event)=> {
          this.radius = this.circle.getRadius() / 1000; // 将半径转换为公里
        })

        console.log("选定的半径：", this.radius); // 调试
      },
    },
    // 监听sceneryData变化，重载数据点
    sceneryData: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return; // selectedPreference为'default'时不加载
        fetch(newVal)
          .then((response) => response.arrayBuffer())
          .then((data) => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
            const worksheet = workbook.Sheets[sheetName]; // 获取工作表
            const jsonData = XLSX.utils.sheet_to_json(worksheet); // 转换为 JSON 数据
            // 先清除旧的 marker
            if (this.markers && this.markers.length > 0) {
              this.markers.forEach(marker => {
                this.map.remove(marker);
              });
              this.markers = [];
            }
            this.addMarkers(jsonData)
          });
      }
    }
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
          radius: this.radius * 1000, // 初始半径
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
        this.circleEditor.open(); // 打开圆形编辑器

        // this.circleEditor.on('move', function (event) {
        //   console.log('触发事件:move')
        // })

        // this.circleEditor.on('adjust', function (event) {
        //   console.log('触发事件:adjust')
        //   this.radius = this.circle.getRadius() / 1000; // 将半径转换为公里
        // })

        // this.circleEditor.on('end', (event) => {
        //   console.log('触发事件： end')
        // })

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
      // 获取输入框的值
      const startTime = this.startTime || ''; // 出发时间
      const lastTime = this.lastTime || ''; // 持续时间
      const description = this.description || ''; // 描述文本

      // 将值编码为 URL 查询参数
      const queryParams = {
        lon: this.selectedCoordinates[0],
        lat: this.selectedCoordinates[1],
        startTime: this.startTime,
        lastTime: this.lastTime,
        description: this.description,
        radius: this.radius,
        routeType: this.selectedPreference
      }

      // 跳转到目标页面，并携带参数
      this.$router.push({ path: '/tour/show', query: queryParams });
    },

    addMarkers(data) {
      // 添加新 marker
      data.forEach((item) => {
        // console.log("item", item); // 调试
        const marker = new this.AMap.Marker({
          map: this.map,
          position: [item.x, item.y],
          title: item['景点'],
        });
        // 添加点击事件弹窗
        marker.on("click", () => {
          new this.AMap.InfoWindow({
            content: `<div style = "color:black;white-space: nowrap;display: flex; 
                    align-items: center; 
                    justify-content: center; ">${item['景点']}</div>`,
            anchor: "bottom-center",
            offset: new this.AMap.Pixel(0, -40),
          }).open(this.map, [item.x, item.y]);
        });
        this.markers.push(marker); // 保存 marker 实例
      });
      // console.log("markers", this.markers); // 调试
    },
    togglePreferencePanel() {
      this.showPreferencePanel = !this.showPreferencePanel;
    },
    selectPreference(value) {
      this.selectedPreference = value;
      this.showPreferencePanel = false; // 选择后自动收起面板
    },
    getPreferenceLabel(value) {
      const pref = this.preferences.find(p => p.value === value);
      return pref ? pref.label : '个性化选项';
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

.input-container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  padding-bottom: 10px;
  gap: 10px;
}

/* 时间选择框父级 */
.custom-time-picker {
  position: static;
  border-radius:5px;
  width: 100%;
}

/* 时间选择框输入框 */
.custom-time-input {
  appearance: none;
  width: 100%;
  height: 50px;
  font-size: 16px;
  text-align: center;
  padding: 0;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* .text-input {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  height: 30px;
} */

.create {
  box-shadow: 0 4px 8px rgba(95, 94, 94, 0.459);
  border-radius: 20px;
  height: 60px;
  margin-top: 20px;
  background-color: #6366f1;
  color: white;
}

.preference-selector {
  margin-top: 10px;
  padding: 0;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  background-color: #f8f8f8;
  color: #333;
  transition: background-color 0.3s;
}

.selector-header:hover {
  background-color: #f0f0f0;
}

.preference-icon {
  transition: transform 0.3s ease;
  color: #6366f1;
  font-weight: bold;
}

.expanded {
  transform: rotate(180deg);
}

.preference-panel {
  display: none;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.show {
  display: block;
  max-height: 300px;
}

.preference-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-top: 1px solid #f0f0f0;
}

.preference-item:hover {
  background-color: #f5f5f5;
}

.active {
  background-color: #e8eaff;
  color: #6366f1;
  font-weight: 500;
}
</style>