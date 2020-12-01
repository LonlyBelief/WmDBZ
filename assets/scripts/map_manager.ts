import GameManage from "./game_manager"
import ItemMapGrid from "./item_map_grid"
import BaseUIManager from "./ui/base_ui_manager"
import GameUIManager from "./ui/game_ui_manager"
import MessageBoxUIManager from "./ui/message_box_ui"

const { ccclass, property } = cc._decorator

export class MapData {
    posX: number = 0
    posY: number = 0

    type: number = 0
    level: number = 0

    isNeedClear: boolean = false

    isNextXConnect: boolean = false
    isNextYConnect: boolean = false
    isLeftXConnect: boolean = false
    isLeftYConnect: boolean = false

    constructor(type, level, posX, posY) {
        this.type = type
        this.level = level
        this.posX = posX
        this.posY = posY
        this.isNeedClear = false
        this.isNextXConnect = false
        this.isNextYConnect = false
        this.isLeftXConnect = false
        this.isLeftYConnect = false
    }

    change(mapData: MapData) {
        this.posX = mapData.posX
        this.posY = mapData.posY
        this.type = mapData.type
        this.level = mapData.level
        this.isNeedClear = false
    }

    getHeavy(): number {
        if (this.level < 10) {
            return 0.5 * this.level + 0.3
        } else {
            return 10
        }
    }

    setLevelByScore(score) {
        this.isNeedClear = false
        let newLevel = Math.floor(score)

        if (this.level < 10 && newLevel >= 10) {
            this.level = 10
        } else if (this.level == 10) {
            this.level = 10 + Math.floor(score / 10)
        } else if (this.level < 10 && newLevel > this.level) {
            this.level = newLevel
        }

        if (this.level == 10) {
            this.type = 4
        } else if (this.level > 10) {
            this.type = this.level
        }
    }

    setConnectFalse() {
        this.isNextXConnect = false
        this.isNextYConnect = false
        this.isLeftXConnect = false
        this.isLeftYConnect = false
    }

    getGrade() {
        return Math.pow(2, this.level) - 1
    }

    checkIsSingle() {
        return !this.isNextXConnect && !this.isNextYConnect && !this.isLeftXConnect && !this.isLeftYConnect
    }
}

@ccclass
export default class MapManager extends cc.Component {
    static instance: MapManager = null

    // LIFE-CYCLE CALLBACKS:

    mapDatas: Array<Array<MapData>> = []

    @property(cc.Node)
    node_map: cc.Node = null

    mapEntitys: Array<ItemMapGrid> = []

    knockDownCount: number = 2

    canAddCount: number = 2

    onLoad() {
        MapManager.instance = this
    }

    start() {
        this.InitMap()
    }

    InitMap() {
        for (let i = 0; i < 5; i++) {
            let newList = []
            for (let j = 0; j < 5; j++) {
                let type = Math.ceil(Math.random() * 3)
                newList.push(new MapData(type, 1, i, j))
            }
            this.mapDatas[i] = newList
        }
        this.InitMapEntity()
        this.checkConnect(0, 0)
        this.showConnect()
    }

    /**
     * 将地图的数据和表现连接起来
     */
    InitMapEntity() {
        if (this.mapEntitys.length < 25) {
            for (let i = 0; i < 25; i++) {
                let newNode = cc.instantiate(this.node_map)
                newNode.parent = this.node
                this.mapEntitys.push(newNode.getComponent(ItemMapGrid))
            }
        }
        let index = 0
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.mapEntitys[index]) {
                    this.mapEntitys[index].Init(i, j)
                    index += 1
                }
            }
        }

        BaseUIManager.instance.refresh()
    }

    /**
     * 检测当前节点和下级节点是否存在联系
     * @param x
     * @param y
     */
    checkConnect(x, y) {
        let mapData = this.mapDatas[x][y]
        mapData.isLeftXConnect = false
        mapData.isLeftYConnect = false
        mapData.isNextXConnect = false
        mapData.isNextYConnect = false
        mapData.isNextXConnect = this._checkConnect(mapData.type, x + 1, y)
        mapData.isNextYConnect = this._checkConnect(mapData.type, x, y + 1)
        this._setCheckLeftX(x + 1, y, mapData.isNextXConnect)
        this._setCheckLeftY(x, y + 1, mapData.isNextYConnect)

        if (this.checkGameIsEnd()) {
            MessageBoxUIManager.instance.showUI("游戏结束", "是否重新开始", (ok) => {
                if (ok) {
                    GameUIManager.instance.showUI()
                }
            })
        }
    }

    /**
     * 展示当前节点和下级节点的联系
     */
    showConnect() {
        for (let i = 0; i < 25; i++) {
            this.mapEntitys[i].showEx()
        }
    }

    _setCheckLeftX(x, y, connect) {
        if (this.mapDatas[x] && this.mapDatas[x][y]) {
            this.mapDatas[x][y].isLeftXConnect = connect
        }
    }
    _setCheckLeftY(x, y, connect) {
        if (this.mapDatas[x] && this.mapDatas[x][y]) {
            this.mapDatas[x][y].isLeftYConnect = connect
        }
    }

    _checkConnect(type, x, y): boolean {
        if (this.mapDatas[x] && this.mapDatas[x][y]) {
            this.checkConnect(x, y)
            return this.mapDatas[x][y].type == type
        } else {
            return false
        }
    }

    _isAnim: boolean = false
    onClickMap(x, y) {
        if (this._isAnim) {
            return
        }
        if (!this._getMapIsConnect(x, y)) {
            if (this.knockDownCount >= 0) {
                MessageBoxUIManager.instance.showUI("提示", "你还有" + this.knockDownCount + "次拆除机会，点击确定使用", (ok) => {
                    if (ok) {
                        this.knockDownCount -= 1
                        MapManager.instance.knockDown(x, y)
                    }
                })
            }
            return
        }
        this._isAnim = true
        this.addBuild(x, y)
    }

    knockDown(x, y) {
        this.mapDatas[x][y].isNeedClear = true
        let newMapDatas = []
        let removeList = []
        for (let i = 0; i < 5; i++) {
            let saveList = []
            for (let j = 0; j < 5; j++) {
                if (this.mapDatas[i][j].isNeedClear) {
                    this.mapEntitys[i * 5 + j].changeSize(x, y)
                } else {
                    saveList.push(j)
                }
            }
            let newList = []
            for (let k = 0; k < saveList.length; k++) {
                let orY = saveList[k]
                let orIndex = i * 5 + orY
                let aimIndex = i * 5 + k
                removeList.push(orIndex)

                let mid = this.mapEntitys[aimIndex]
                this.mapEntitys[aimIndex] = this.mapEntitys[orIndex]
                this.mapEntitys[orIndex] = mid
                this.mapEntitys[aimIndex].moveTo(k)

                newList.push(this.mapDatas[i][orY])
            }
            newMapDatas[i] = newList
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (newMapDatas[i][j]) {
                } else {
                    let type = Math.ceil(Math.random() * 3)
                    newMapDatas[i][j] = new MapData(type, 1, i, j)

                    this.mapEntitys[i * 5 + j].Init(i, j)
                    this.mapEntitys[i * 5 + j].moveBy()
                }
            }
        }
        this.mapDatas = newMapDatas
        this.InitMapEntity()
        this.scheduleOnce(() => {
            this.checkConnect(0, 0)
            this.showConnect()
            this._isAnim = false
        }, 0.4)
    }
    addBuild(x, y) {
        let score = this._getScoreNext(x, y, 0)
        this.mapDatas[x][y].setLevelByScore(score)

        let newMapDatas = []
        let removeList = []
        for (let i = 0; i < 5; i++) {
            let saveList = []
            for (let j = 0; j < 5; j++) {
                if (this.mapDatas[i][j].isNeedClear) {
                    this.mapEntitys[i * 5 + j].changeSize(x, y)
                } else {
                    saveList.push(j)
                }
            }
            let newList = []
            for (let k = 0; k < saveList.length; k++) {
                let orY = saveList[k]
                let orIndex = i * 5 + orY
                let aimIndex = i * 5 + k
                removeList.push(orIndex)

                let mid = this.mapEntitys[aimIndex]
                this.mapEntitys[aimIndex] = this.mapEntitys[orIndex]
                this.mapEntitys[orIndex] = mid
                this.mapEntitys[aimIndex].moveTo(k)

                newList.push(this.mapDatas[i][orY])
            }
            newMapDatas[i] = newList
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (newMapDatas[i][j]) {
                } else {
                    let type = Math.ceil(Math.random() * 3)
                    newMapDatas[i][j] = new MapData(type, 1, i, j)

                    this.mapEntitys[i * 5 + j].Init(i, j)
                    this.mapEntitys[i * 5 + j].moveBy()
                }
            }
        }
        this.mapDatas = newMapDatas
        this.InitMapEntity()
        this.scheduleOnce(() => {
            this.checkConnect(0, 0)
            this.showConnect()
            this._isAnim = false
        }, 0.4)
    }

    _getScoreNext(x, y, pos) {
        let mapData = this.mapDatas[x][y]
        let score = 0
        if (mapData) {
            if (mapData.isNeedClear) {
                return 0
            }
            mapData.isNeedClear = true
            score += mapData.getHeavy()
            if (mapData.isNextXConnect && pos != 3) {
                score += this._getScoreNext(x + 1, y, 1)
            }
            if (mapData.isNextYConnect && pos != 4) {
                score += this._getScoreNext(x, y + 1, 2)
            }
            if (mapData.isLeftXConnect && pos != 1) {
                score += this._getScoreNext(x - 1, y, 3)
            }
            if (mapData.isLeftYConnect && pos != 2) {
                score += this._getScoreNext(x, y - 1, 4)
            }
        }
        return score
    }

    _getMapIsConnect(x, y) {
        let mapData = this.mapDatas[x][y]
        if (mapData) {
            if (mapData.isNextXConnect) {
                return true
            }
            if (mapData.isNextYConnect) {
                return true
            }
            if (mapData.isLeftXConnect) {
                return true
            }
            if (mapData.isLeftYConnect) {
                return true
            }
        }
        return false
    }

    getAllGrade() {
        let num = 0
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.mapDatas[i][j]) {
                    num += this.mapDatas[i][j].getGrade()
                }
            }
        }
        return num
    }

    checkGameIsEnd(): boolean {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.mapDatas[i][j]) {
                    if (!this.mapDatas[i][j].checkIsSingle()) {
                        return false
                    }
                }
            }
        }
        if (this.knockDownCount <= 0) {
            return true
        } else {
            return false
        }
    }

    watchVideoCallback() {
        this.canAddCount -= 1
        this.knockDownCount += 1
    }
}
