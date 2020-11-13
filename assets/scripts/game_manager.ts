import PlatformManager from "./common/plantform_manager"
import MapManager from "./map_manager"
import GameUIManager from "./ui/game_ui_manager"

const { ccclass, property } = cc._decorator

export enum GameStatus {
    End = 0,
    Start = 1,
}

@ccclass
export default class GameManage extends cc.Component {
    static instance: GameManage = null

    gameStatus: number = 0

    maxGrade: number = 0
    key_save_max_grade: string = "KEY_SAVE_MAX_GRADE"

    onLoad() {
        GameManage.instance = this
        cc.dynamicAtlasManager.enabled = false
    }

    start() {
        PlatformManager.instance.initVideoAd(() => {
            MapManager.instance.watchVideoCallback()
        })
        GameUIManager.instance.showUI()
    }

    setGameOpen() {
        this.gameStatus = GameStatus.Start
    }
    setGameEnd() {
        this.gameStatus = GameStatus.End
    }

    getMaxGrade() {}
    setMaxGrade() {}
}
