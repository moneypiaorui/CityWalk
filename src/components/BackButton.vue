<!-- Start Generation Here -->
<template>
  <el-button type="primary" @click="goBack" class="back-button">
    <el-icon>
      <ArrowLeftBold />
    </el-icon>
  </el-button>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router?.back();
    },
  },
};
</script>

<style scoped>
.back-button {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  top: 35px;
  left: 35px;
  z-index: 100;
  font-size: 25px;  
  color: black;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<!-- End Generation Here -->
