<!-- Start Generation Here -->
<template>
    <el-footer>
        <el-menu :default-active="activeIndex" class="bottom-nav" mode="horizontal" :collapse="false">
            <el-menu-item index="1" @click="navigateTo('home')">首页</el-menu-item>
            <el-menu-item index="2" @click="navigateTo('share')">社群</el-menu-item>
            <el-menu-item index="3" @click="navigateTo('profile')">我的</el-menu-item>
        </el-menu>
    </el-footer>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '1'
        };
    },
    methods: {
        navigateTo(route) {
            this.$router.push({ name: route });
        }
    }
};
</script>

<style scoped>
.bottom-nav {
    display: flex;
    justify-content: space-around;
    background-color: #cccccc;
    color: rgb(63, 63, 63);
}

.el-menu {
    flex: 1;
}

</style>
<!-- End Generation Here -->
