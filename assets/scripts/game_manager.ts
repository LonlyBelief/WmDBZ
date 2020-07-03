const { ccclass, property } = cc._decorator

@ccclass
export default class GameManage extends cc.Component {
    onLoad() {
        cc.dynamicAtlasManager.enabled = false
    }

    start() {}

    // update (dt) {}
}
