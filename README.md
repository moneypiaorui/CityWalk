# CityWalk
本仓库为前端工程
运行`npm run dev`后需要同步开启CityWalkBackend服务来获取数据
api使用绝对路径，通过vite.config.js配置代理重写到3000端口的后端服务器上

运行`npm run build`打包工程，然后将dist文件夹下的文件部署到后端的public文件夹下