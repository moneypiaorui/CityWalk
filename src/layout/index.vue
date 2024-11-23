<template>
    <el-container class="container">
        <el-header class="header">Header</el-header>
        <el-main class="main-content">
            <router-view></router-view>
        </el-main>
        <bottom-nav class="bottom-nav"/>
    </el-container>
</template>

<script>
import bottomNav from "../components/bottomNav.vue"
export default {
    components: {
        bottomNav,
    },
}
</script>

<style scoped>
.container {
    /* margin: 0 auto; */
    height: 100%;
    width: 100%;
}

.main-content {
    margin-top: 0;
    padding-top: 0;
    flex: 1;
    overflow-y: auto;
}

.bottom-nav {
    width: 100%;
}
</style>