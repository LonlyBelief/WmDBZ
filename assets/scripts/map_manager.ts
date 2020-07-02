import ItemMapGrid from "./item_map_grid"

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
        return 0.2 * (this.level - 1) + 0.4
    }

    setLevelByScore(score) {
        this.isNeedClear = false
        let newLevel = Math.ceil(score)
        if (newLevel > this.level) {
            this.level = newLevel
        }
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
    }

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
    }

    checkConnect(x, y) {
        let mapData = this.mapDatas[x][y]
        mapData.isNextXConnect = this._checkConnect(mapData.type, x + 1, y)
        mapData.isNextYConnect = this._checkConnect(mapData.type, x, y + 1)
        this._setCheckLeftX(x + 1, y, mapData.isNextXConnect)
        this._setCheckLeftY(x, y + 1, mapData.isNextYConnect)
    }

    _setCheckLeftX(x, y, connect) {
        if (this.mapDatas[x] && this.mapDatas[x][y]) {
            return this.mapDatas[x][y].isLeftXConnect == connect
        }
    }
    _setCheckLeftY(x, y, connect) {
        if (this.mapDatas[x] && this.mapDatas[x][y]) {
            return this.mapDatas[x][y].isLeftYConnect == connect
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

    onClickMap(x, y) {
        let score = this._getScoreNext(x, y)
        this.mapDatas[x][y].setLevelByScore(score)
        console.log("=====" + x + "====" + y + "======" + score)

        let newMapDatas = []
        for (let i = 0; i < 5; i++) {
            let saveList = []
            for (let j = 0; j < 5; j++) {
                if (this.mapDatas[i][j].isNeedClear) {
                    // removeList.push(j)
                } else {
                    saveList.push(j)
                }
            }
            let newList = []
            for (let k = 0; k < saveList.length; k++) {
                newList.push(this.mapDatas[i][k])
            }
            newMapDatas[i] = newList
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (newMapDatas[i][j]) {
                } else {
                    let type = Math.ceil(Math.random() * 3)
                    newMapDatas[i][j] = new MapData(type, 1, i, j)
                }
            }
        }
        this.mapDatas = newMapDatas
        this.InitMapEntity()
        this.checkConnect(0, 0)
    }
    _getScoreNext(x, y) {
        let mapData = this.mapDatas[x][y]
        let score = 0
        if (mapData) {
            if (!mapData.isNeedClear) {
                mapData.isNeedClear = true
                score += mapData.getHeavy()
            } else {
                return 0
            }
            if (mapData.isNextXConnect) {
                score += this._getScoreNext(x + 1, y)
            }
            if (mapData.isNextYConnect) {
                score += this._getScoreNext(x, y + 1)
            }
            if (mapData.isLeftXConnect) {
                score += this._getScoreNext(x - 1, y)
            }
            if (mapData.isLeftYConnect) {
                score += this._getScoreNext(x, y - 1)
            }
        }
        return score
    }
}