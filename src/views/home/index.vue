<template>
  <div>
    <el-row :gutter="20">
    <el-col :span="12"><div class="grid-content " @click = "()=>{this.$router.push('/createTour')}"><el-icon><Edit /></el-icon>创建旅行</div ></el-col>
    <el-col :span="12"><div class="grid-content " @click = "()=>{this.$router.push({path:'/showTour', query:{x:113.9305,y: 22.5333}})}"><el-icon><MapLocation /></el-icon>展示路径</div ></el-col>
  </el-row>
  </div>
</template>
<script>

</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 15px;
}
.grid-content {
  height: 100px;
  border-radius: 15px;
  min-height: 36px;
  background-color: white;
  color: black;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>