<template>
    <div class="profile-container">
      <!-- 用户信息卡片 -->
      <el-card class="user-card">
        <div class="user-info">
          <div class="avatar-section">
            <el-avatar :size="80" src="https://example.com/avatar.jpg" />
            <div class="edit-btn">
              <el-button 
                type="primary" 
                size="small"
                @click="$router.push('/profile/edit')"
              >
                编辑资料
              </el-button>
            </div>
          </div>
          
          <div class="info-section">
            <h2 class="username">幻离ian</h2>
            <p class="signature">暂时没有签名描述</p>
            
            <div class="stats">
              <el-statistic 
                title="旅行" 
                :value="1" 
                class="stat-item"
                @click="$router.push('/trips')"
              />
              <el-divider direction="vertical" />
              <el-statistic 
                title="收藏" 
                :value="0" 
                class="stat-item"
                @click="$router.push('/collections')"
              />
              <el-divider direction="vertical" />
              <el-statistic 
                title="打卡" 
                :value="1" 
                class="stat-item"
                @click="$router.push('/checkins')"
              />
            </div>
          </div>
        </div>
      </el-card>
  
      <!-- 游记列表 -->
      <div class="travel-list">
        <h3 class="section-title">我的游记</h3>
        <el-card 
          v-for="(item, index) in travelList" 
          :key="index"
          class="travel-card"
          @click="$router.push(`/travel/${item.id}`)"
        >
          <div class="travel-content">
            <div class="travel-info">
              <h4 class="title">{{ item.title }}</h4>
              <div class="meta">
                <span class="location">
                  <el-icon><Location /></el-icon>
                  {{ item.location }}
                </span>
                <el-tag 
                  type="info" 
                  size="small"
                  class="travel-type"
                >
                  {{ item.type }}
                </el-tag>
              </div>
            </div>
            <el-button 
              type="primary" 
              plain 
              @click.stop="$router.push(`/travel/edit/${item.id}`)"
            >
              编辑
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Location } from '@element-plus/icons-vue'
  
  const travelList = ref([
    {
      id: 1,
      title: '合肥两日游美食寻觅',
      location: '合肥市',
      type: '独自旅行',
      date: '2023-08-15'
    }
  ])
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
  }
  
  .user-card {
    background: linear-gradient(135deg, #6366f115 0%, #818cf810 100%);
    border-radius: 16px;
    margin-bottom: 30px;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  @media (min-width: 498px) {
    
    .user-info {
      flex-direction: row;
      align-items: center;
    }
  }
 
  .avatar-section {
    position: relative;
    text-align: center;
  }
  
  .edit-btn {
    margin-top: 10px;
  }
  
  .info-section {
    flex: 1;
  }
  
  .username {
    color: #6366f1;
    margin: 0 0 8px;
    font-size: 24px;
  }
  
  .signature {
    color: #64748b;
    margin: 0 0 20px;
  }
  
  .stats {
    display: flex;
    gap: 30px;
    padding: 15px;
    background: #f8fafc;
    border-radius: 12px;
  }
  
  .stat-item {
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .stat-item:hover {
    transform: translateY(-2px);
  }
  
  .section-title {
    color: #6366f1;
    padding-left: 10px;
    border-left: 4px solid #6366f1;
    margin: 30px 0 20px;
  }
  
  .travel-card {
    margin-bottom: 20px;
    transition: transform 0.3s;
    cursor: pointer;
  }
  
  .travel-card:hover {
    transform: translateY(-3px);
  }
  
  .travel-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .travel-info {
    flex: 1;
  }
  
  .title {
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .meta {
    display: flex;
    gap: 15px;
    align-items: center;
    color: #64748b;
  }
  
  .travel-type {
    background-color: #e0e7ff;
    color: #6366f1;
    border: none;
  }
  
  .el-button--primary {
    background-color: #6366f1;
    border-color: #6366f1;
  }
  
  .el-button--primary:hover {
    background-color: #4f46e5;
    border-color: #4f46e5;
  }
  
  @media (max-width: 768px) {
    
    
    .travel-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
  }
  </style>