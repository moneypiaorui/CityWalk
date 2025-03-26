<template>
    <footer class="custom-footer">
      <nav class="navigation-bar">
        <div 
          v-for="item in navItems"
          :key="item.index"
          class="nav-item"
          :class="{ 'active': activeIndex === item.index }"
          @click="handleNavigation(item)"
        >
          <div class="item-container">
            <component 
              :is="item.icon"
              class="nav-icon"
              :class="{ 'icon-active': activeIndex === item.index }"
            />
            <span class="nav-label">{{ item.label }}</span>
          </div>
          <div class="indicator" />
        </div>
      </nav>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    HomeFilled,
    Share,
    UserFilled
  } from '@element-plus/icons-vue';
  
  const router = useRouter();
  const activeIndex = ref('1');
  
  const navItems = [
    { index: '1', label: '首页', icon: HomeFilled, route: 'home' },
    { index: '2', label: '社群', icon: Share, route: 'share' },
    { index: '3', label: '我的', icon: UserFilled, route: 'profile' }
  ];
  
  const handleNavigation = (item) => {
    activeIndex.value = item.index;
    router.push({ name: item.route });
  };
  </script>
  
  <style scoped>
  .custom-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(20px);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
    z-index: 1000;
  }
  
  .navigation-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    max-width: 480px;
    height: 100%;
    margin: 0 auto;
    padding: 0 12px;
  }
  
  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
    &:hover {
      .nav-icon {
        transform: translateY(-3px) scale(1.15);
      }
    }
  
    &.active {
      .indicator {
        width: 24px;
        background: #6366f1;
        opacity: 1;
      }
  
      .nav-icon {
        color: #6366f1;
        filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2));
      }
  
      .nav-label {
        color: #6366f1;
        transform: translateY(1px);
      }
    }
  }
  
  .item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .nav-icon {
    width: 24px;
    height: 24px;
    color: #64748b;
    transition: all 0.3s ease;
  }
  
  .nav-label {
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
    letter-spacing: 0.3px;
    transition: all 0.2s ease;
  }
  
  .indicator {
    position: absolute;
    bottom: 8px;
    width: 16px;
    height: 3px;
    background: transparent;
    border-radius: 2px;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 480px) {
    .custom-footer {
      height: 64px;
    }
  
    .nav-icon {
      width: 22px;
      height: 22px;
    }
  
    .nav-label {
      font-size: 11px;
    }
  
    .indicator {
      bottom: 6px;
    }
  }
  </style>