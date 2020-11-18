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
    node_up: cc.Node = null
    @property(cc.Node)
    node_left: cc.Node = null

    indexX: number = 0
    indexY: number = 0

    offsetX: number = -200
    offsetY: number = -200

    sp_color: cc.Color = cc.Color.WHITE

    baseSizeX: number = 95
    baseSizeY: number = 99

    onLoad() {
        this.btn_select.node.on("click", this.onClick, this)
    }

    Init(x, y) {
        this.indexX = x
        this.indexY = y
        this.sprite_main.node.scaleX = 1
        this.sprite_main.node.scaleY = 1

        let exSprite
        let mapData = MapManager.instance.mapDatas[this.indexX][this.indexY]
        if (mapData) {
            switch (mapData.type) {
                case 1:
                    this.sp_color = cc.Color.RED
                    break
                case 2:
                    this.sp_color = cc.Color.GREEN
                    break
                case 3:
                    this.sp_color = cc.Color.BLUE
                    break
                case 4:
                    this.sp_color = cc.Color.YELLOW
                    break
                default:
                    this.sp_color = cc.Color.GRAY
                    break
            }
            this.sprite_main.spriteFrame = ResourcesManager.instance.getCommonSprite("0000")
            this.sprite_main.node.color = this.sp_color
            this.label_level.string = mapData.level.toString()
            this.node.setPosition(new cc.Vec2(this.offsetX + this.indexX * this.baseSizeX, this.offsetY + this.indexY * this.baseSizeY))

            this.node_up.getComponent(cc.Sprite).spriteFrame = ResourcesManager.instance.getCommonSprite(exSprite)
            this.node_left.getComponent(cc.Sprite).spriteFrame = ResourcesManager.instance.getCommonSprite(exSprite)

            this.node_up.active = false
            this.node_left.active = false
        }
    }

    showEx() {
        let mapData = MapManager.instance.mapDatas[this.indexX][this.indexY]
        if (mapData) {
            this.node_up.active = mapData.isNextYConnect
            this.node_left.active = mapData.isNextXConnect

            let nameStr = ""
            nameStr += mapData.isLeftXConnect ? "1" : "0"
            nameStr += mapData.isNextYConnect ? "1" : "0"
            nameStr += mapData.isNextXConnect ? "1" : "0"
            nameStr += mapData.isLeftYConnect ? "1" : "0"
            if (nameStr == "1000") {
                nameStr = "0010"
                this.sprite_main.node.scaleX = -1
            }
            if (nameStr == "1001") {
                nameStr = "0011"
                this.sprite_main.node.scaleX = -1
            }
            if (nameStr == "1100") {
                nameStr = "0110"
                this.sprite_main.node.scaleX = -1
            }
            if (nameStr == "1101") {
                nameStr = "0111"
                this.sprite_main.node.scaleX = -1
            }
            if (nameStr == "1111") {
                nameStr = "1111_1"
            }
            if (nameStr == "0111") {
                nameStr = "0111_1"
            }
            if (nameStr == "1110") {
                nameStr = "1110_1"
            }
            if (nameStr == "1011") {
                nameStr = "1011_1"
            }
            let sprite = ResourcesManager.instance.getCommonSprite(nameStr)
            if (sprite == null) {
                console.log("=====:" + nameStr)
            }
            this.sprite_main.spriteFrame = sprite
        }
    }

    moveTo(aimIndex) {
        let aim = this.offsetY + aimIndex * this.baseSizeY
        let time = (this.indexY - aimIndex) * 0.05
        new cc.Tween()
            .target(this.node)
            .to(time, { position: new cc.Vec2(this.node.position.x, aim) })
            .start()
    }

    moveBy() {
        let aim = this.offsetY + this.indexY * this.baseSizeY
        let time = (6 - this.indexY) * 0.05
        new cc.Tween()
            .target(this.node)
            .set({ position: new cc.Vec2(this.offsetX + this.indexX * this.baseSizeX, this.offsetY + this.baseSizeY * 6), active: true })
            .to(time, { position: new cc.Vec2(this.offsetX + this.indexX * this.baseSizeX, aim) })
            .start()
    }

    changeSize(aimX, aimY) {
        // let aimPosX = this.offsetX + aimX * 100
        // let aimPosY = this.offsetY + aimY * 100
        // let time = Math.abs(this.indexY - aimY) * 0.1
        // new cc.Tween()
        //     .target(this.node)
        //     .to(time, { position: new cc.Vec2(aimPosX, aimPosY), scale: 0.5 })
        //     .set({ scale: 1, active: false })
        //     .start()
    }

    onClick() {
        MapManager.instance.onClickMap(this.indexX, this.indexY)
    }
}
