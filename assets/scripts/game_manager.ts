import GameUIManager from "./ui/game_ui_manager"

const { ccclass, property } = cc._decorator

export enum GameStatus{
    End=0,
    Start = 1,
}

@ccclass
export default class GameManage extends cc.Component {
    static instance:GameManage = null

    gameStatus:number = 0

    onLoad() {
        GameManage.instance = this
        cc.dynamicAtlasManager.enabled = false
    }

    start() {
        GameUIManager.instance.showUI()
    }

    setGameOpen(){
        this.gameStatus = GameStatus.Start
    }
    setGameEnd(){
        this.gameStatus = GameStatus.End
    }

}
