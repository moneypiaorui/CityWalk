<template>
    <div id="map" class="map-container"></div>
    <!-- 详细信息上拉框 -->
    <div class="info-panel" :class="{ expanded: isPanelExpanded, displayed: isPanelDisplayed }">
      <div class="toggle-button" @click="togglePanel">
        <span v-if="!isPanelExpanded">▲</span>
        <span v-else>▼</span>
      </div>
      <div class="info-content">
        <button class="close-button" @click="closePanel">关闭</button>
        
        <!-- 景点信息 -->
        <div class="spot-info" v-if="selectedPoint">
          <h3>{{ selectedPoint.name }}</h3>
          <p>{{ selectedPoint.description }}</p>
        </div>
        
        <!-- 聊天对话框 -->
        <div class="chat-container">
          <div class="conversation-group" v-for="(group, index) in chatHistory" :key="index">
            <!-- 用户消息 -->
            <div class="message-row user-message" v-if="group.user">
              <div class="message-container">
                <div class="message-bubble">
                  <div class="message-content">{{ group.user }}</div>
                </div>
                <div class="avatar-container">
                  <div class="avatar user-avatar">
                    <img src="/photos/ask.jpg" alt="User">
                  </div>
                </div>
              </div>
            </div>
            
            <!-- AI回复 -->
<div class="message-row ai-message" v-if="group.ai || (isLoading && index === chatHistory.length - 1)">
  <div class="message-container">
    <div class="avatar-container">
      <div class="avatar ai-avatar">
        <img src="/photos/ans.jpg" alt="AI">
      </div>
    </div>
    <div class="message-bubble">
      <div class="message-content" v-if="group.ai" v-html="renderMarkdown(group.ai)"></div>
      <div class="loading-animation" v-else>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
        
        <!-- 输入框 -->
        <div class="input-group">
          <input v-model="inputValue" @keyup.enter="sendMessage" 
                 placeholder="向AI咨询关于此景点的问题..." class="message-input"/>
          <button @click="sendMessage" class="send-button">发送</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AMapLoader from '@amap/amap-jsapi-loader';
  import {marked} from 'marked';
  
  export default {
    name: "MapView",
    props: {
      keyPoints: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        map: null,
        AMap: null,
        markers: [],
        walkingRoutes: [],
        isPanelExpanded: false,
        isPanelDisplayed: false,
        selectedPoint: null,
        inputValue: '',
        chatHistory: [],
        isLoading: false
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      renderMarkdown(text){
        return marked.parse(text);
      },
      initMap() {
        window._AMapSecurityConfig = {
          securityJsCode: "a6fb5508951536308488060ab69b1538",
        };
        AMapLoader.load({
          key: "d836c18b3ba48bea9eb5ba6edbec3b50",
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.Walking"],
        }).then((AMap) => {
          this.AMap = AMap;
          this.map = new AMap.Map("map", {
            zoom: 14,
            center: this.keyPoints[0]?.position || [0, 0],
          });
          this.addCustomMarkers();
          this.planRoute();
        }).catch((e) => {
          console.log(e);
        });
      },
      
      planRoute() {
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
            panel: null,
            hideMarkers: true,
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
              this.walkingRoutes.push(polyline);
            } else {
              console.error("步行路线规划失败", result);
            }
          });
        }
      },
  
      addCustomMarkers() {
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
  
          marker.on("click", () => {
            new this.AMap.InfoWindow({
              content: `<div style="color:black;white-space: nowrap;display: flex; 
              align-items: center; 
              justify-content: center;">${point.name}</div>`,
              anchor: "bottom-center",
              offset: new this.AMap.Pixel(0, -20),
            }).open(this.map, point.position);
  
            this.selectedPoint = point;
            this.isPanelDisplayed = true;
            this.chatHistory = []; // 切换景点时清空聊天记录
          });
  
          this.markers.push(marker);
        });
      },
      
      togglePanel() {
        this.isPanelExpanded = !this.isPanelExpanded;
      },
      
      closePanel() {
        this.isPanelDisplayed = false;
        this.selectedPoint = null;
      },
      
      async sendMessage() {
        if (!this.inputValue.trim() || !this.selectedPoint) return;

        const userMessage = this.inputValue;
        this.chatHistory.push({ user: userMessage });
        this.inputValue = '';

        this.isLoading = true;

        try {
          // 调用DeepSeek API并启用流式传输
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer sk-1293377df9b2444d9bf8fec5625af9fe`,
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {
                  role: "user",
                  content: `关于${this.selectedPoint.name}(${this.selectedPoint.description})，${userMessage}`
                }
              ],
              temperature: 0.7,
              stream: true, // 启用流式传输
            }),
          });

          if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
          }

          // 使用ReadableStream逐步读取数据
          const reader = response.body.getReader();
          let result = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let chunk = new TextDecoder().decode(value);
            let chunks = chunk.split('\n')
            chunks.forEach(chunk => {
              if (chunk.startsWith('data: {')) {
                chunk = chunk.slice(6).trim(); // 去掉前缀
                console.log(chunk); // 调试输出
                chunk = JSON.parse(chunk)
                console.log(chunk.choices[0].delta.content); // 调试输出
                result += chunk.choices[0].delta.content;
              }
              

            });
            
            // 动态更新聊天记录
            this.chatHistory[this.chatHistory.length - 1].ai = result;
          }
        } catch (error) {
          console.error('API调用失败:', error);
          this.chatHistory[this.chatHistory.length - 1].ai = 
            '抱歉，获取信息时出现问题，请稍后再试。';
        } finally {
          this.isLoading = false;
        }
      },
      
      async queryDeepSeek(prompt) {
        // 这里替换为实际的DeepSeek API调用
        // 以下是模拟实现
        const apiKey = 'sk-1293377df9b2444d9bf8fec5625af9fe';
        const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
        // 模拟API返回，实际使用时删除
        // return new Promise(resolve => {
        //   setTimeout(() => {
        //     resolve(`关于${this.selectedPoint.name}，这里是一些相关信息...<br><br>
        //     该景点位于深圳南山，是一个受欢迎的旅游目的地。`);
        //   }, 1000);
        // });
      }
    },
    watch: {
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
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  
  /* 信息面板样式 */
  .info-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #333;
    background-color: #fff;
    border-top: 1px solid #ddd;
    transition: transform 0.3s ease;
    transform: translateY(67%);
    display: none;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .info-panel.expanded {
    transform: translateY(0);
  }
  
  .info-panel.displayed {
    display: block;
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
    height: 65vh;
    color: #333;
    display: flex;
    flex-direction: column;
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
  
  .spot-info {
    padding: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .spot-info h3 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  /* 聊天对话框样式 */
  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .conversation-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .message-row {
    width: 100%;
    display: flex;
  }
  
  .message-container {
    max-width: 80%;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .user-message {
    justify-content: flex-end;
  }
  
  .ai-message {
    justify-content: flex-start;
  }
  
  .avatar-container {
    flex-shrink: 0;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f0f0;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .user-avatar {
    background-color: #4a9eff;
  }
  
  .ai-avatar {
    background-color: #10a37f;
  }
  
  .message-bubble {
    padding: 12px 16px;
    border-radius: 18px;
    line-height: 1.5;
    font-size: 15px;
    max-width: 100%;
    word-wrap: break-word;
  }
  
  .user-message .message-bubble {
    background: #4a9eff;
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  .ai-message .message-bubble {
    background: #f5f5f5;
    color: #333;
    border-bottom-left-radius: 4px;
  }
  
  /* 输入框样式 */
  .input-group {
    display: flex;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #eee;
  }
  
  .message-input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
  }
  
  .send-button {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #4a9eff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .send-button:hover {
    background-color: #3a8bef;
  }
  
/* 加载动画样式 */
.loading-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #888;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1);
  }
}

  /* 滚动条样式 */
  .chat-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .chat-container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  
  .chat-container::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
  </style>