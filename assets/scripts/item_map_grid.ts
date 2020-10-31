import MapManager from "./map_manager"
import ResourcesManager from "./ui/resources_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemMapGrid extends cc.Component {
    @property(cc.Sprite)
    sprite_main: cc.Sprite = null
    @property(cc.Label)
    label_level: cc.Label = null
    @property(cc.Button)
    btn_select: cc.Button = null
    @property(cc.Node)
    node_up:cc.Node = null
    @property(cc.Node)
    node_left:cc.Node = null

    indexX: number = 0
    indexY: number = 0

    offsetX: number = -200
    offsetY: number = -200

    onLoad() {
        this.btn_select.node.on("click", this.onClick, this)
    }

    Init(x, y) {
        this.indexX = x
        this.indexY = y

        let spriteName
        let exSprite
        let mapData = MapManager.instance.mapDatas[this.indexX][this.indexY]
        if (mapData) {
            switch (mapData.type) {
                case 1:
                    spriteName = 1
                    exSprite = 11
                    break
                case 2:
                    spriteName = 2
                    exSprite = 21
                    break
                case 3:
                    spriteName = 3
                    exSprite = 31
                    break
            }
            this.sprite_main.spriteFrame = ResourcesManager.instance.getCommonSprite(spriteName)
            this.label_level.string = mapData.level.toString()
            this.node.setPosition(new cc.Vec2(this.offsetX + this.indexX * 100, this.offsetY + this.indexY * 100))

            this.node_up.getComponent(cc.Sprite).spriteFrame = ResourcesManager.instance.getCommonSprite(exSprite)
            this.node_left.getComponent(cc.Sprite).spriteFrame = ResourcesManager.instance.getCommonSprite(exSprite)

            this.node_up.active = false
            this.node_left.active = false
        }
    }

    showEx(){
        let mapData = MapManager.instance.mapDatas[this.indexX][this.indexY]
        if (mapData) {
            this.node_up.active = mapData.isNextYConnect
            this.node_left.active = mapData.isNextXConnect
        }
    }

    moveTo(aimIndex) {
        let aim = this.offsetY + aimIndex * 100
        let time = (this.indexY - aimIndex) * 0.1
        new cc.Tween()
            .target(this.node)
            .to(time, { position: new cc.Vec2(this.node.position.x, aim) })
            .start()
    }

    moveBy() {
        let aim = this.offsetY + this.indexY * 100
        let time = (6 - this.indexY) * 0.1
        new cc.Tween()
            .target(this.node)
            .set({ position: new cc.Vec2(this.offsetX + this.indexX * 100, this.offsetY + 600), active: true })
            .to(time, { position: new cc.Vec2(this.offsetX + this.indexX * 100, aim) })
            .start()
    }

    changeSize(aimX, aimY) {
        let aimPosX = this.offsetX + aimX * 100
        let aimPosY = this.offsetY + aimY * 100
        let time = Math.abs(this.indexY - aimY) * 0.1
        new cc.Tween()
            .target(this.node)
            .to(time, { position: new cc.Vec2(aimPosX, aimPosY), scale: 0.5 })
            .set({ scale: 1, active: false })
            .start()
    }

    onClick() {
        MapManager.instance.onClickMap(this.indexX, this.indexY)
    }
}
