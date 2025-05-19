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
                <div class="tour-card" @click="navigateToTour(item)">
                    <div class="tour-image">
                        <img :src="item.image" alt="景点图片" />
                        <span class="route-type-tag">{{ item.routeType }}</span>
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
import { Location, Picture } from '@element-plus/icons-vue';

export default {
    components: {
        Location,
        Picture
    },
    data() {
        return {
            tourData: [
                {
                    title: "深圳南山",
                    image: "photos/nanshan.png",
                    distance: 1.5,
                    spotsCount: 5,
                    routeType: "阴凉路线",
                    keyPoints: [
                        {
                            name: "深圳湾公园",
                            position: [113.945, 22.526],
                            description: "深圳湾畔的海滨公园，适合散步骑行"
                        },
                        {
                            name: "世界之窗",
                            position: [113.973, 22.536],
                            description: "微缩世界著名景观的主题公园"
                        },
                        {
                            name: "欢乐海岸",
                            position: [113.991, 22.523],
                            description: "大型商业文化综合体，有音乐喷泉"
                        },
                        {
                            name: "南山博物馆",
                            position: [113.923, 22.531],
                            description: "展示南山历史文化的综合性博物馆"
                        },
                        {
                            name: "海上世界",
                            position: [113.915, 22.485],
                            description: "以明华轮为中心的滨海休闲区"
                        }
                    ]
                },
                {
                    title: "上海外滩",
                    image: "photos/shanghai.png",
                    distance: 2,
                    spotsCount: 5,
                    routeType: "文化探索",
                    keyPoints: [
                        {
                            name: "外滩",
                            position: [121.490, 31.236],
                            description: "上海地标，拥有万国建筑博览群"
                        },
                        {
                            name: "南京路步行街",
                            position: [121.474, 31.234],
                            description: "中国第一商业街，购物天堂"
                        },
                        {
                            name: "豫园",
                            position: [121.492, 31.227],
                            description: "明代古典园林，上海历史名胜"
                        },
                        {
                            name: "陆家嘴金融区",
                            position: [121.504, 31.238],
                            description: "现代化金融中心，东方明珠等地标"
                        },
                        {
                            name: "人民广场",
                            position: [121.473, 31.233],
                            description: "上海市中心重要地标和文化休闲中心"
                        }
                    ]
                },
                {
                    title: "香港中环",
                    image: "photos/hongkong.png",
                    distance: 1,
                    spotsCount: 5,
                    routeType: "最短路线",
                    keyPoints: [
                        {
                            name: "维多利亚港",
                            position: [114.169, 22.293],
                            description: "世界三大天然良港之一，景色壮观"
                        },
                        {
                            name: "太平山顶",
                            position: [114.150, 22.271],
                            description: "香港最高点，可俯瞰香港岛和九龙"
                        },
                        {
                            name: "兰桂坊",
                            position: [114.155, 22.280],
                            description: "热闹的娱乐区，酒吧餐厅林立"
                        },
                        {
                            name: "中环街市",
                            position: [114.154, 22.283],
                            description: "历史悠久的百年古迹，现为文化艺术中心"
                        },
                        {
                            name: "IFC商场",
                            position: [114.158, 22.285],
                            description: "国际金融中心商场，高端购物场所"
                        }
                    ]
                },
                {
                    title: "北京故宫",
                    image: "photos/beijing.png",
                    distance: 2,
                    spotsCount: 5,
                    routeType: "文化探索",
                    keyPoints: [
                        {
                            name: "故宫博物院",
                            position: [116.397, 39.917],
                            description: "明清两代皇宫，世界最大古代宫殿建筑群"
                        },
                        {
                            name: "天安门广场",
                            position: [116.404, 39.905],
                            description: "世界最大城市广场，中国政治中心"
                        },
                        {
                            name: "景山公园",
                            position: [116.396, 39.928],
                            description: "人工山，可俯瞰故宫全景"
                        },
                        {
                            name: "什刹海",
                            position: [116.380, 39.940],
                            description: "历史悠久的文化街区，有胡同和酒吧街"
                        },
                        {
                            name: "北海公园",
                            position: [116.390, 39.926],
                            description: "皇家园林，有白塔和琼华岛"
                        }
                    ]
                },
                {
                    title: "成都青城山",
                    image: "https://via.placeholder.com/300x200?text=青城山景点",
                    distance: 2,
                    spotsCount: 5,
                    routeType: "阴凉路线",
                    keyPoints: [
                        {
                            name: "建福宫",
                            position: [103.568, 30.916],
                            description: "青城山最大的宫观，道教圣地"
                        },
                        {
                            name: "天师洞",
                            position: [103.567, 30.912],
                            description: "传说为张道陵修炼之地，景色幽静"
                        },
                        {
                            name: "上清宫",
                            position: [103.570, 30.918],
                            description: "青城山上的主要道观，历史悠久"
                        },
                        {
                            name: "五龙沟",
                            position: [103.572, 30.920],
                            description: "山间峡谷，溪流长廊，树荫浓密"
                        },
                        {
                            name: "天然图画",
                            position: [103.575, 30.915],
                            description: "壮丽的山间景观，如同天然画卷"
                        }
                    ]
                },
                {
                    title: "广州白云山",
                    image: "https://via.placeholder.com/300x200?text=白云山景点",
                    distance: 2,
                    spotsCount: 5,
                    routeType: "吃货路线",
                    keyPoints: [
                        {
                            name: "白云山索道",
                            position: [113.311, 23.183],
                            description: "可俯瞰广州全景，观赏云海"
                        },
                        {
                            name: "明珠楼",
                            position: [113.306, 23.181],
                            description: "白云山标志性建筑，登高远眺"
                        },
                        {
                            name: "白云山美食广场",
                            position: [113.309, 23.182],
                            description: "汇集广州特色小吃和粤菜"
                        },
                        {
                            name: "云台花园",
                            position: [113.307, 23.179],
                            description: "花卉种类丰富，自然生态环境佳"
                        },
                        {
                            name: "摩星岭",
                            position: [113.312, 23.180],
                            description: "白云山最高峰，有著名的粤菜餐厅"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        navigateToTour(item) {
            // 传递景点数据到showTour页面
            this.$router.push({
                path: '/tour/show',
                query: {
                    title: item.title,
                    keyPoints: JSON.stringify(item.keyPoints),
                    routeType: item.routeType
                }
            });
        }
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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative; /* 为内部绝对定位元素提供参考 */
}

.tour-image {
    flex: 7; /* 图片占7份 */
    overflow: hidden;
    position: relative; /* 为路线类型标签提供定位参考 */
}

.tour-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.route-type-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

/* 悬停效果 */
.tour-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tour-card:hover .tour-image img {
    transform: scale(1.05);
}

/* 标题与副标题样式 */
.header-section {
    text-align: center;
    margin: 15px 0;
    padding: 0 10px;
}

.title {
    margin: 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
}

.subtitle {
    margin: 5px 0 15px;
    color: #666;
    font-size: 14px;
}
</style>