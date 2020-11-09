import GameManage, { GameStatus } from "../game_manager"
import MapManager from "../map_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class GameUIManager extends cc.Component {
    static instance: GameUIManager = null
    @property(cc.Node)
    node_content: cc.Node = null
    @property(cc.Button)
    btn_start: cc.Button = null
    @property(cc.Button)
    btn_rank: cc.Button = null
    @property(cc.Button)
    btn_level: cc.Button = null
    @property(cc.Button)
    btn_setting: cc.Button = null

    @property(cc.Label)
    label_game_status: cc.Label = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GameUIManager.instance = this
        this.btn_start.node.on("click", this.onClickStart, this)
        this.btn_rank.node.on("click", this.onClickRank, this)
        this.btn_level.node.on("click", this.onClickLevel, this)
        this.btn_setting.node.on("click", this.onClickSetting, this)
    }

    showUI() {
        this.node_content.active = true
    }

    refresh() {
        
    }

    onClickStart() {
        MapManager.instance.InitMap()
        GameManage.instance.setGameOpen()
        this.hideUI()
    }
    onClickRank() {
        if(GameManage.instance.gameStatus == GameStatus.End){
            MapManager.instance.InitMap()
            GameManage.instance.setGameOpen()
        }else{

        }
        this.hideUI()
     }
    onClickLevel() {
        
    }
    onClickSetting() { }

    hideUI() {
        this.node_content.active = false
    }
}
