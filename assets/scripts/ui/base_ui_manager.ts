import PlatformManager from "../common/plantform_manager"
import MapManager from "../map_manager"
import GameUIManager from "./game_ui_manager"
import MessageBoxUIManager from "./message_box_ui"

const { ccclass, property } = cc._decorator

@ccclass
export default class BaseUIManager extends cc.Component {
    static instance: BaseUIManager = null
    @property(cc.Button)
    btn_menu: cc.Button = null
    @property(cc.Button)
    btn_add: cc.Button = null

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

    onClickBtnAdd() {
        if (MapManager.instance.canAddCount >= 0) {
            MessageBoxUIManager.instance.showUI(
                "提示",
                "观看广告可获得一次拆除机会，本局还可观看" + MapManager.instance.canAddCount + "次，点击确定观看",
                (ok) => {
                    if (ok) {
                        PlatformManager.instance.showAd()
                    }
                }
            )
        }
    }

    onClickMenu() {
        GameUIManager.instance.showUI()
    }
}
