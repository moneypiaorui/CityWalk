<template>
  <div>
    <el-row :gutter="50">
      <el-col :span="12" class="col-gap">
        <div class="grid-content" @click="()=>{this.$router.push('/tour/create')}">
          <el-icon><Edit /></el-icon>创建旅行
        </div>
      </el-col>
      <el-col :span="12" class="col-gap">
        <div class="grid-content" @click="()=>{this.$router.push('/')}">
          <el-icon><MapLocation /></el-icon>加入旅行
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}

.col-gap {
  margin-bottom: 0; /* 移除垂直间距 */
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 20px;
}

.grid-content {
  height: 150px;
  border-radius: 15px;
  min-height: 36px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 10px rgba(42, 41, 41, 0.443);
  color: black;
  font-size: 29px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>