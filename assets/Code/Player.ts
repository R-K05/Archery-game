import { _decorator, Collider2D, Component, Contact2DType, Input, input, instantiate, Label, Node, Prefab, tween, Vec3, Animation, director, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property(Node)
    Target_Node: Node = null // 箭靶节点

    @property(Prefab)
    jian_Prefab: Prefab = null  // 箭的预制体

    @property(Node)
    jian_Top_Node: Node = null // 箭的父节点

    @property(Node)
    Tips_Node: Node = null  // 提示框节点

    @property(Label)
    Tips_Label: Label = null  // 文本框节点

    @property(Label)
    Tips_total_Label: Label = null  // 文本框

    @property(Label)
    Tips_now_Label: Label = null  // 文本框

    @property(Animation)
    Button_Animation: Animation = null // 按钮动画节点

    @property(Animation)
    NextLevel_Button: Animation = null  // “下一关”按钮节点

    @property(AudioClip)
    Win_AudioClip: AudioClip = null // 成功音频

    @property(AudioClip)
    Low_AudioClip: AudioClip = null // 失败音频

    jian_Node: Node = null  // 箭自身节点

    Angle = 0 // 初始旋转角度
    Angle_Speed = 50 // 旋转速度

    Move = true // 箭靶旋转开关

    total_Label = 10  // 目标箭数
    now_Label = 0  // 当前射入箭数s

    Up_Sw = true


    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.TOUCH_START, this)
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.TOUCH_START, this)
    }

    // 触摸函数
    TOUCH_START() {
        const jian_Node = instantiate(this.jian_Prefab) // 把预制体生成为节点
        jian_Node.setParent(this.jian_Top_Node)  // 设置该节点的父节点
        jian_Node.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACT, this)
        // jian_Node.setPosition(0, 60, 0)
        tween(jian_Node).to(0.1, { position: new Vec3(0, 60, 0) }).call(() => {
            const World_Pos = jian_Node.getWorldPosition()  // 获取世界坐标
            jian_Node.setParent(this.Target_Node)  // 设置父节点
            jian_Node.setWorldPosition(World_Pos)  // 设置世界坐标
            jian_Node.angle = -(this.Target_Node.angle - 90)  // 设置箭的旋转角度
            this.Up_Num()
            jian_Node.getComponent(Collider2D).off(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACT, this)

        }).start() // 平滑移动
    }

    BEGIN_CONTACT() {
        this.Up_Sw = false
        this.Tips_UI(false)
    }

    Win_Audio_Play() {
        const Audio = this.node.getComponent(AudioSource) // 导入音频组件
        Audio.clip = this.Win_AudioClip // 指定播放资源
        Audio.play()
    }

    Low_Audio_Play() {
        const Audio = this.node.getComponent(AudioSource) // 导入音频组件
        Audio.clip = this.Low_AudioClip // 指定播放资源
        Audio.play()
    }

    Tips_UI(param) {
        this.Move = false  // 关闭旋转
        input.off(Input.EventType.TOUCH_START, this.TOUCH_START, this) // 关闭发射
        this.Tips_Node.active = true

        if (!param) {
            this.Tips_Label.string = "你失败了"

            // 显示“重新开始”按钮，隐藏“下一关”按钮
            if (this.Button_Animation && this.Button_Animation.node) {
                this.Button_Animation.node.active = true
                this.Button_Animation.play('animation') // 播放animation动画
            }
            if (this.NextLevel_Button) {
                this.NextLevel_Button.node.active = false
            }

        } else {
            this.Tips_Label.string = "你成功了"
            // 隐藏“重新开始”按钮，显示“下一关”按钮
            if (this.Button_Animation && this.Button_Animation.node) {
                this.Button_Animation.node.active = false
            }
            if (this.NextLevel_Button) {
                this.NextLevel_Button.node.active = true
                this.NextLevel_Button.play('animation_next') // 播放animation_next动画
            }
        }
    }

    // 下一关按钮点击函数
    Next_Level() {
        // TODO：后续可以改成加载下一关场景/修改关卡参数
        director.loadScene('scene');
    }

    New_Game() {
        director.loadScene('scene')
    }

    Up_Num() {
        if (!this.Up_Sw) {
            this.Low_Audio_Play()
            return
        }
        this.Win_Audio_Play()
        this.now_Label++
        this.Tips_now_Label.string = '当前：已射入' + this.now_Label + "把"
        if (this.now_Label >= this.total_Label) {
            this.Tips_UI(true)
        }

    }

    start() {
        this.Tips_total_Label.string = '目标：射入' + this.total_Label + "把宝剑"
        this.Tips_now_Label.string = '当前：已射入' + this.now_Label + "把"
    }

    update(deltaTime: number) {
        if (!this.Move) { return }
        if (this.Angle >= 360) {
            this.Angle = 0
        }
        this.Angle += deltaTime * this.Angle_Speed  // 帧时间补偿
        this.Target_Node.angle = this.Angle  // 让箭靶旋转  
    }
}

