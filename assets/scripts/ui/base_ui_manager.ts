// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameUIManager from "./game_ui_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class BaseUIManager extends cc.Component {
    static instance: BaseUIManager = null
    @property(cc.Button)
    btn_menu: cc.Button = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BaseUIManager.instance = this
        this.btn_menu.node.on("click", this.onClickMenu, this)
    }

    onClickMenu() {
        GameUIManager.instance.showUI()
    }
}
