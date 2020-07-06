const { ccclass, property } = cc._decorator

@ccclass
export default class ResourcesManager extends cc.Component {
    static instance: ResourcesManager = null

    // LIFE-CYCLE CALLBACKS:

    @property(cc.SpriteAtlas)
    mainAltar: cc.SpriteAtlas = null

    onLoad() {
        ResourcesManager.instance = this
    }

    getCommonSprite(name) {
        return this.mainAltar.getSpriteFrame(name) || null
    }
}
