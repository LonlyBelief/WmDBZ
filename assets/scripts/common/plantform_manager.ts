interface ADCalBack {
    (isOK: boolean, param?: {}): void
}

class SubscribeData {
    IsOpen: boolean = false
    IsFirst: boolean = true
    constructor(isopen, isfirst) {
        this.IsOpen = isopen
        this.IsFirst = isfirst
    }
}

export default class PlatformManager {
    private static _instance: PlatformManager = null

    shareStartTime: number = 0
    shareEndTime: number = 0

    lastAction: string = ""
    lastParam: string = ""

    //记录开始分享状态
    startShare: boolean = false

    //推送的key
    subscribeKeys: { [key: number]: string } = {}
    subScribeKeyValue: { [key: string]: SubscribeData } = {}

    shareStrings: string[] = []

    sharePics: string[] = [
        "https://littlehero.wechat.res.chiji-h5.com/shareImg/share1.jpg",
        "https://littlehero.wechat.res.chiji-h5.com/shareImg/share2.jpg",
        "https://littlehero.wechat.res.chiji-h5.com/shareImg/share3.jpg",
        "https://littlehero.wechat.res.chiji-h5.com/shareImg/share4.jpg",
    ]

    static get instance() {
        if (this._instance == null) {
            this._instance = new PlatformManager()
        }
        return this._instance
    }

    isWechat(): boolean {
        return typeof window["wx"] != "undefined"
    }

    initData() {
        if (this.isWechat()) {
            let res = window["wx"].getLaunchOptionsSync()
            let query = res.query
            let gdt_vid = query.gdt_vid
            let weixinadinfo = query.weixinadinfo

            // 获取⼴告id
            let aid = 0
            if (weixinadinfo) {
                let weixinadinfoArr = weixinadinfo.split(`.`)
                aid = weixinadinfoArr[0]
            }
        }
    }

    isComeFromMyProgram(sceneID: number) {
        return sceneID == 1104
    }

    checkUpdate() {
        if (this.isWechat()) {
            if (typeof window["wx"].getUpdateManager === "function") {
                // 请在使用前先判断是否支持
                const updateManager = window["wx"].getUpdateManager()

                updateManager.onCheckForUpdate(function (res) {
                    // 请求完新版本信息的回调
                    console.log(res.hasUpdate)
                })

                updateManager.onUpdateReady(function () {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                })

                updateManager.onUpdateFailed(function () {
                    console.error("新的版本下载失败")
                    // 新的版本下载失败
                })
            }
        }
    }

    shareAppMessage(action: string, param: string) {
        this.startShare = true

        this.shareStartTime = new Date().getTime() / 1000

        this.lastAction = action
        this.lastParam = param

        // let shareStringCount = this.shareStrings.length
        // let index = Rand.getRandomIndex(shareStringCount)
        // let titleStr = this.shareStrings[index]

        // let sharePicCount = this.sharePics.length
        // let index2 = Rand.getRandomIndex(sharePicCount)
        // let sharePicUrl = this.sharePics[index2]

        //是否微信
        // if (this.isWechat()) {
        //     window["wx"].shareAppMessage({
        //         title: titleStr,
        //         imageUrl: sharePicUrl,
        //         query: "action=" + action + "&param=" + param,
        //     })
        // }
    }

    setLocal(key: string, val: any) {
        if (this.isWechat()) {
            try {
                //console.log(val)
                window["wx"].setStorageSync(key, val)
            } catch (e) {
                console.error(e)
            }
        } else {
            cc.sys.localStorage.setItem(key, val)
        }
    }

    getLocal(key: string): any {
        if (this.isWechat()) {
            try {
                const value = window["wx"].getStorageSync(key)
                if (value) {
                    // Do something with return value
                    //console.log(value)
                    return value
                }
            } catch (e) {
                return null
                // Do something when catch error
            }
        } else {
            return cc.sys.localStorage.getItem(key)
        }
    }

    _hasAd = false

    hasAd() {
        if (this.isWechat()) {
            return this._hasAd
        }
        return false
    }

    private videoAd //保存视频实例
    adCallBack: ADCalBack = null
    initVideoAd(callback: ADCalBack) {
        //初始化视频方法
        this.adCallBack = callback
        if (this.isWechat()) {
            //字节跳动处理
            if (typeof window["wx"].createRewardedVideoAd == "undefined") {
                console.error("no wx.createRewardedVideoAd")
                PlatformManager.instance.adCallBack(false)
                return
            }

            //实例
            let videoAd = window["wx"].createRewardedVideoAd({
                adUnitId: "adunit-0dd5330026a5ac8e",
            })

            this.videoAd = videoAd

            videoAd.onLoad(() => {
                console.log(" videoAd.onLoad")
                PlatformManager.instance._hasAd = true
            })
            //捕捉错误
            videoAd.onError((err) => {
                console.log(" videoAd.onError")
                console.log(err)
                // AudioManager.instance.resumeAllMusic()

                PlatformManager.instance._hasAd = false
            })

            //关闭视频的回调函数
            videoAd.onClose((res) => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                console.log(res)
                if ((res && res.isEnded) || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    // console.log("正常播放结束，可以下发游戏奖励")
                    PlatformManager.instance.adCallBack(true)
                } else {
                    // console.log("您的视频还没看完，无法获得奖励")
                    PlatformManager.instance.adCallBack(false)
                }
            })

            videoAd.load()
        }
    }

    resetAdCallback(callback: ADCalBack) {
        // console.log("========重置广告回调函数")
        this.adCallBack = callback
    }

    showAd() {
        if (this.isWechat()) {
            //版本兼容保护
            if (typeof PlatformManager.instance.videoAd.show != "undefined") {
                PlatformManager.instance.videoAd.show().catch((err) => {
                    PlatformManager.instance.videoAd.load().then(() => {
                        PlatformManager.instance.videoAd.show()
                    })
                })
            }
        }
    }

    exitGame() {
        if (this.isWechat()) {
            window["wx"].exitMiniProgram()
        }
    }
}
