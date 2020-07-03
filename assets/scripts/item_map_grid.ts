import MapManager from "./map_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class ItemMapGrid extends cc.Component {
    @property(cc.Sprite)
    sprite_main: cc.Sprite = null
    @property(cc.Label)
    label_level: cc.Label = null
    @property(cc.Button)
    btn_select: cc.Button = null

    indexX: number = 0
    indexY: number = 0

    onLoad() {
        this.btn_select.node.on("click", this.onClick, this)
    }

    Init(x, y) {
        this.indexX = x
        this.indexY = y

        let color
        let mapData = MapManager.instance.mapDatas[this.indexX][this.indexY]
        if (mapData) {
            switch (mapData.type) {
                case 1:
                    color = cc.Color.RED
                    break
                case 2:
                    color = cc.Color.YELLOW
                    break
                case 3:
                    color = cc.Color.BLUE
                    break
            }
            this.sprite_main.node.color = color
            this.label_level.string = mapData.level.toString()
            this.node.setPosition(new cc.Vec2(-250 + this.indexX * 100, this.indexY * 100))
        } else {
            this.sprite_main.node.color = cc.Color.WHITE
        }
    }

    moveTo(aimIndex) {
        let aim = aimIndex * 100
        new cc.Tween()
            .target(this.node)
            .to(1, { position: new cc.Vec2(this.node.position.x, aim) })
            .start()
    }

    moveBy() {
        let aim = this.indexY * 100
        new cc.Tween()
            .target(this.node)
            .set({ position: new cc.Vec2(-250 + this.indexX * 100, 600), active: true })
            .to(1, { position: new cc.Vec2(-250 + this.indexX * 100, aim) })
            .start()
    }

    onClick() {
        MapManager.instance.onClickMap(this.indexX, this.indexY)
    }
}
