<template>
    <el-container class="container">
        <el-header class="header">
            <div class="header-content">
                <el-icon><Menu /></el-icon>
                <span class="header-title">CityWalk</span>
                <el-icon><Bell /></el-icon>
            </div>
        </el-header>
        <el-main class="main-content">
            <router-view></router-view>
        </el-main>
        <bottom-nav class="bottom-nav" />
    </el-container>
</template>

<script>
import bottomNav from "../components/bottomNav.vue";
import { Menu, Bell } from '@element-plus/icons-vue';

export default {
    components: {
        bottomNav,
        Menu,
        Bell,
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    background-color: #f5f5f5;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: #409eff;
    color: #ffffff;
    height: 60px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.header-title {
    font-size: 20px;
    font-weight: bold;
}

.main-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.bottom-nav {
    width: 100%;
}
</style>