# 机器人控制平台

基于 React + Vite 的机器人控制平台，通过 MQTT 实时连接机器人设备，提供监控和控制功能。

## 功能特性

- **机器人状态监控** - 实时显示在线状态、IP、电量、CPU、内存、温度
- **地图导航** - 网格地图显示机器人位置和路径规划
- **视频监控** - WebSocket 实时视频流连接
- **任务管理** - 任务队列编排、执行、停止
- **状态栏** - 显示连接状态和关键信息

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + Vite 7 |
| 后端 | Express + WebSocket |
| 通信 | MQTT + WS |

## 快速开始

### 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
cd server && npm install
```

### 配置 MQTT

```bash
cp server/.env.example server/.env
# 编辑 server/.env，设置 MQTT Broker 地址
```

### 启动

```bash
# 单独启动
npm run dev              # 前端
npm run dev:server       # 后端

# 同时启动前后端
npm run dev:all
```

访问 http://localhost:5173

## MQTT 主题

| 主题 | 方向 | 说明 |
|------|------|------|
| `robot/status` | 上报 | 机器人状态 |
| `robot/position` | 上报 | 位置坐标 |
| `robot/video` | 上报 | 视频流地址 |
| `robot/tasks` | 上报 | 任务列表 |
| `robot/command/#` | 下发 | 控制命令 |

## 项目结构

```
├── src/                      # 前端源码
│   ├── components/           # React 组件
│   │   ├── RobotPanel/      # 机器人状态
│   │   ├── MapPanel/        # 地图导航
│   │   ├── VideoPanel/      # 视频监控
│   │   ├── TaskPanel/       # 任务管理
│   │   └── StatusBar/       # 状态栏
│   ├── App.jsx              # 主应用
│   └── main.jsx             # 入口
├── server/                   # 后端服务
│   ├── index.js             # MQTT + WebSocket
│   └── package.json
└── package.json
```

## 命令

```bash
npm run dev        # 开发模式
npm run build      # 生产构建
npm run lint       # 代码检查
npm run preview    # 预览构建
```
