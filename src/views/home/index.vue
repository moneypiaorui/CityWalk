<template>
  <div>
    <el-row :gutter="50" type="flex" direction="vertical">
      <el-col :span="24" class="col-gap">
        <div class="grid-content" @click="()=>{this.$router.push('/tour/create')}">
          <el-icon><Edit /></el-icon>创建旅行
        </div>
      </el-col>
      <el-col :span="24" class="col-gap">
        <div class="grid-content" @click="()=>{this.$router.push('/')}">
          <el-icon><MapLocation /></el-icon>加入旅行
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'VerticalButtons'
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  flex-direction: column;
}

.col-gap {
  margin-bottom: 20px; /* 保持垂直间距 */
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 20px;
  width: 100%; /* 确保col占满整行 */
}

.grid-content {
  height: 240px;
  border-radius: 15px;
  min-height: 36px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 10px rgba(42, 41, 41, 0.443);
  color: black;
  font-size: 29px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* 添加手型指针 */
  transition: all 0.3s; /* 添加悬停动画 */
}

.grid-content:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(42, 41, 41, 0.5);
}

.grid-content .el-icon {
  margin-right: 10px;
  font-size: 32px;
}
</style>