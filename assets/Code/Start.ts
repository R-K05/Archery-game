import { _decorator, Component, Node,director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {

    @property(Node)
    Button_start:Node = null  // 开始按钮

    // 点击“开始游戏”按钮调用这个函数
    public onStartGame() {
        // 这里的 'scene' 必须和你射箭场景的名字一致
        director.loadScene('scene');
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

