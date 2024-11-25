<template>
    <div ref="scrollContainer" class="picker">
      <div>
        <div
          v-for="(item, index) in items"
          :key="index"
          :class="['picker-item', { active: index === currentIndex }]"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import BScroll from "better-scroll";
  
  export default {
    data() {
      return {
        items: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
        currentIndex: 0,
      };
    },
    mounted() {
      const scroll = new BScroll(this.$refs.scrollContainer, {
        scrollY: true,
        snap: {
          loop: false,
          threshold: 0.3,
        },
        probeType: 3,
        
      });
  
      scroll.on("scrollEnd", (pos) => {
        this.currentIndex = Math.abs(pos.y / 40); // 每项的高度是 40px
      });
    },
  };
  </script>
  
  <style>
  .picker {
    height: 120px;
    overflow: hidden;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  .picker-item {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #888;
  }
  .picker-item.active {
    color: #007aff;
    font-weight: bold;
  }
  </style>
  