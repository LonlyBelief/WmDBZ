const { ccclass, property } = cc._decorator

interface OkCalBack {
    (isOK: boolean, param?: {}): void
}

@ccclass
export default class MessageBoxUIManager extends cc.Component {
    static instance: MessageBoxUIManager = null

    @property(cc.Node)
    uiNode: cc.Node = null

    @property(cc.Node)
    maskNode: cc.Node = null

    @property(cc.Label)
    labelTitle: cc.Label = null

    @property(cc.Label)
    labelDesc: cc.Label = null

    @property(cc.Button)
    buttonCancel: cc.Button = null
    @property(cc.Button)
    buttonConfirm: cc.Button = null

    curCallBack: OkCalBack = null
    curParam: any = null

    onLoad() {
        // console.log("PoolManager Onload");
        MessageBoxUIManager.instance = this

        //this.maskNode.on('click', this.hideUI, this);

        this.buttonCancel.node.on("click", this.cancel, this)
        this.buttonConfirm.node.on("click", this.confirm, this)

        if (this.uiNode.active) {
            this.uiNode.active = false
        }
    }

    showUI(title: string, desc: string, callback: OkCalBack = null, param: {} = null) {
        console.log("=1111111111")
        this.refresh(title, desc, callback, param)
        this.uiNode.active = true
    }

    refresh(title: string, desc: string, callback: OkCalBack = null, param: {} = null) {
        this.labelTitle.string = title
        this.labelDesc.string = desc

        if (callback != null) {
            //console.log("需要回调函数")
            this.curCallBack = callback
        } else {
            this.curCallBack = null
        }
        this.curParam = param
    }

    cancel() {
        this.hideUI()
        if (this.curCallBack != null) {
            this.curCallBack(false, this.curParam)
        }
    }

    confirm() {
        this.hideUI()

        if (this.curCallBack != null) {
            this.curCallBack(true, this.curParam)
        }
    }

    hideUI() {
        this.uiNode.active = false
    }
}
