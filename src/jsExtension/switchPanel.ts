import { profile } from "profile";
import { delay, delayBreak, log, showHUD } from "utils/common";
import mnaddon from "../../mnaddon.json"

// 面板状态
let panelStatus = true

// 设置窗口面板的位置和大小
export const layoutViewController = () => {
    let frame = self.studyController.view.bounds
    // if(profile.compact){}
    let width = profile.compact?70:160
    let os = Application.sharedInstance().osType
    if(os == 0){width = width-15}
    profile.adjust = profile.locationY
    // profile.adjust = profile.adjust<0?0:profile.adjust
    // profile.adjust = profile.adjust+250>frame.height?frame.height-250:profile.adjust
    if(profile.adjust < 0){profile.adjust = 0 }
    if(profile.adjust + 220 > frame.height){profile.adjust = frame.height-250}
    let padding = profile.padding?40:0
    let y = profile.adjust
    if (profile.rightMode) {
        self.settingViewController.view.frame = { x: frame.width - width - padding, y: y, width: width, height: 220 }
    } else {
        self.settingViewController.view.frame = { x: padding, y: y, width: width, height: 220 }
    }
}

export const closePanel = () => {
    if (panelStatus) {
        self.settingViewController.view.removeFromSuperview()
        panelStatus = false;
    }
}

export const openPanel = async () => {
    if (!panelStatus) {
        self.studyController.view.addSubview(self.settingViewController.view)
        panelStatus = true;
        // 开启面板时，若键盘处于开启状态，关闭键盘
        await delay(0.2)
        self.studyController.becomeFirstResponder()
    }
}


const switchPanel = async () => {
    // if (isWaiting) {
    //     isClicked = true
    //     return
    // }
    // isWaiting = true
    // const success = await delayBreak(25, 0.01, () => isClicked)
    // if (success) {
    //     log("双击", "switch")
    //     profile.compact = !profile.compact
    //     isClicked = false
    //     self.studyController.refreshAddonCommands()
    // } else {
        // log("单击", "switch")
        panelStatus ? closePanel() : openPanel()//判断面板是否打开，以执行关闭或打开的操作
        profile.on = !profile.on
        // profile.on ? (profile.copyMode ?
        //     showHUD(`${mnaddon.title} 已打开，当前处于 Copy 模式`) :
        //     showHUD(`${mnaddon.title} 已打开，当前处于 Search 模式`)) :
        //     showHUD(`${mnaddon.title} 已关闭`)
        self.studyController.refreshAddonCommands()
    // }
    // isWaiting = false
}

// addSubview 的时候会执行，也就是打开操作面板的时候
const controllerWillLayoutSubviews = (controller: UIViewController) => {
    if (controller == self.studyController){
    layoutViewController()
    }
        
}

const queryAddonCommandStatus = () => {
    const mode = Application.sharedInstance().studyController(self.window).studyMode
    // 复习模式下不显示图标
    if (mode < studyMode.review)
        return {
            image: "logo.png",
            object: self,
            selector: "switchPanel:",
            checked: profile.on ? true : false,
        };
    return null
}

export default {
    queryAddonCommandStatus,
    switchPanel,
    controllerWillLayoutSubviews
}
