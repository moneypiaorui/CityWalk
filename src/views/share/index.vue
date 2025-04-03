<template>
    <div class="share-container">
        <div class="header-section">
            <h2 class="title">路线攻略</h2> 
            <p class="subtitle">发现精彩旅行路线，一键复用轻松出发</p>
        </div>

        <el-row :gutter="10" class="share-row">
            <el-col 
                :span="12" 
                v-for="(item, index) in tourData" 
                :key="index" 
                class="tour-col"
            >
                <div class="tour-card">
                    <div class="tour-image">
                        <img :src="item.image" alt="景点图片" />
                    </div>
                    <div class="tour-content">
                        <div class="tour-title">{{ item.title }}</div>
                        <div class="tour-tags">
                            <span class="tag-item">
                                <el-icon><Location /></el-icon>
                                {{ item.distance }}km
                            </span>
                            <span class="tag-item">
                                <el-icon><Picture /></el-icon>
                                {{ item.spotsCount }}个景点
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tourData: [
                {
                    title: "深圳南山",
                    image: "photos/nanshan.png",
                    distance: 1.5,
                    spotsCount: 8
                },
                {
                    title: "上海外海滩",
                    image: "photos/shanghai.png",
                    distance: 2,
                    spotsCount: 5
                },
                {
                    title: "香港中环",
                    image: "photos/hongkong.png",
                    distance: 1,
                    spotsCount: 6
                },
                {
                    title: "北京故宫",
                    image: "photos/beijing.png",
                    distance: 2,
                    spotsCount: 5
                },
                {
                    title: "成都青城山",
                    image: "https://via.placeholder.com/300x200?text=青城山景点",
                    distance: 2,
                    spotsCount: 6
                },
                {
                    title: "广州白云山",
                    image: "https://via.placeholder.com/300x200?text=白云山景点",
                    distance: 2,
                    spotsCount: 7
                },

            ]
        };
    }
};
</script>

<style scoped>
/* 移动端优化样式 */
.share-container {
    padding: 0 8px; /* 左右减少间距 */
    box-sizing: border-box;
}

.share-row {
    margin: 0 -4px; /* 抵消col的padding */
    display: flex;
    flex-wrap: wrap;
}

.tour-col {
    padding: 8px 4px !important; /* 减少列间距 */
    width: 50%;
    box-sizing: border-box;
}

.tour-card {
    height: 220px; /* 移动端更适合的高度 */
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.tour-image {
    flex: 7; /* 图片占7份 */
    overflow: hidden;
}

.tour-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.tour-content {
    flex: 1; /* 内容占1份 */
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.tour-title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tour-tags {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
}

.tag-item {
    display: flex;
    align-items: center;
}

.el-icon {
    font-size: 12px;
    margin-right: 2px;
}

/* 点击效果 */
.tour-card:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>