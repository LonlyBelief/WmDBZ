import MapManager from "../map_manager"
import GameUIManager from "./game_ui_manager"

const { ccclass, property } = cc._decorator

@ccclass
export default class BaseUIManager extends cc.Component {
    static instance: BaseUIManager = null
    @property(cc.Button)
    btn_menu: cc.Button = null

    @property(cc.Label)
    label_knock_down: cc.Label = null
    @property(cc.Label)
    label_max_grade: cc.Label = null
    @property(cc.Label)
    label_single_grade: cc.Label = null

    onLoad() {
        BaseUIManager.instance = this
        this.btn_menu.node.on("click", this.onClickMenu, this)
    }

    refresh() {
        this.label_single_grade.string = MapManager.instance.getAllGrade().toString()
        this.label_knock_down.string = MapManager.instance.knockDownCount.toString()
    }

    onClickMenu() {
        GameUIManager.instance.showUI()
    }
}
