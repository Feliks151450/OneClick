import { profile } from "profile";
import { delay, delayBreak, log, showHUD } from "utils/common";
import mnaddon from "../../mnaddon.json"

// 面板状态
let panelStatus = true

// 设置窗口面板的位置和大小
export const layoutViewController = () => {
    let studyFrame = self.studyController.view.bounds
    let readerFrame = self.studyController.readerController.view.frame
    let hidden = self.studyController.readerController.view.hidden//true代表脑图全屏
    let rightMode = self.studyController.rightMapMode
    let fullWindow = readerFrame.width == studyFrame.width
    if(hidden){
        profile.windowMode = 2//阅读窗口被隐藏，即脑图全屏
    } else if(fullWindow){
        profile.windowMode = 0
    } else{
        profile.windowMode = 1
    }
    if(profile.newPage){
        // profile.compact = false
        let width = 170
        let height = Application.sharedInstance().osType == 0 ? 530 : 470
    }else{
        // profile.compact = true
        let width = 70
        let height = Application.sharedInstance().osType == 0 ? 250 : 220
    }
    // showHUD(self.mainPath)
    width = Application.sharedInstance().osType == 0 ? width-20 : width-15
    let adjustx = Application.sharedInstance().osType == 0 ? 27 : 27
    if(profile.locationMode == 11 && (fullWindow || hidden)){
            profile.locationMode = 12
        }
    let y_arrow = profile.arrow!=0?(profile.arrow-1.5)*250:100
    let y = profile.locationY+y_arrow//+profile.adjust


    
    profile.adjust = y+profile.adjust<0?-y:profile.adjust
    profile.adjust = y+height+profile.adjust>studyFrame.height?studyFrame.height-height-y:profile.adjust
    y = y+profile.adjust
    y = y<0?0:y
    y = y+height>studyFrame.height?studyFrame.height-height:y

    let padding = profile.padding?55:0
    if(rightMode){
    switch(profile.locationMode){
        case 10: {
            self.settingViewController.view.frame = { x: padding-adjustx+25, y: y, width: width, height: height }
            break
        }case 11: {
            self.settingViewController.view.frame = { x: readerFrame.width - width +adjustx , y: y, width: width, height: height }
            break
        }case 12: {
            self.settingViewController.view.frame = { x: studyFrame.width - width - padding+adjustx-25 , y: y, width: width, height: height }
            break
        }
    }
    }else{
    switch(profile.locationMode){
        case 10: {
            self.settingViewController.view.frame = { x: padding-adjustx+25, y: y, width: width, height: height }
            break
        }case 11: {
            self.settingViewController.view.frame = { x: studyFrame.width-readerFrame.width - width +adjustx , y: y, width: width, height: height }
            break
        }case 12: {
            self.settingViewController.view.frame = { x: studyFrame.width - width - padding+adjustx-25 , y: y, width: width, height: height }
            break
        }
    }
    
    
    }
}
// //大面板
// export const layoutViewController0 = () => {
//     let studyFrame = self.studyController.view.bounds
//     let readerFrame = self.studyController.readerController.view.frame
//     let hidden = self.studyController.readerController.view.hidden//true代表脑图全屏
//     let fullWindow = readerFrame.width == studyFrame.width
//     if(hidden){
//         profile.windowMode = 2//阅读窗口被隐藏，即脑图全屏
//     } else if(fullWindow){
//         profile.windowMode = 0
//     } else{
//         profile.windowMode = 1
//     }
//     // if(profile.newPage){
//         profile.compact = false
//         let height = 600
//     // }else{
//     //     profile.compact = true
//     //     let height = Application.sharedInstance().osType == 0 ? 250 : 220
//     // }
//     let width = profile.compact?70:160
//     width = Application.sharedInstance().osType == 0 ? width-15 : width-10
//     let adjustx = Application.sharedInstance().osType == 0 ? 27 : 35



    
//     if(profile.smartLocationOn){
//         if(hidden || fullWindow){
//             profile.locationMode = profile.locationX > studyFrame.width/2.?12:10
//         }else{
//             if(profile.locationX > readerFrame.width){
//                 profile.locationMode = profile.locationX > (0.5*readerFrame.width+0.5*studyFrame.width) ? 12 : 11
//             }else{
//                 profile.locationMode = profile.locationX > 0.5*readerFrame.width ? 11 : 10
//             }
//         }
//         // profile.adjust = profile.locationX > frame.width/2.?profile.adjust:profile.adjust+10
//     }else{
//         if(profile.locationMode == 11 && (fullWindow || hidden)){
//             profile.locationMode = 12
//         }
//     }
//     let y_arrow = profile.arrow!=0?(profile.arrow-1.5)*250:100
//     let y = profile.locationY+y_arrow//+profile.adjust
//     let over = y+600>studyFrame.height


    
//     profile.adjust = y<0?-profile.locationY:profile.adjust
//     profile.adjust = y+600>studyFrame.height?studyFrame.height-600-profile.locationY:profile.adjust
//     y = y+profile.adjust
//     y = y<0?0:y
//     y = y+600>studyFrame.height?studyFrame.height-600:y
//     showHUD(String(y))

//      // if(profile.adjust < 0){profile.adjust = 0 }
//     // if(profile.adjust + 220 > frame.height){profile.adjust = frame.height-250}
//     let padding = profile.padding?55:0
//     switch(profile.locationMode){
//         case 10: {
//             self.settingViewController.view.frame = { x: padding-adjustx+20, y: y, width: width, height: height }
//             // showHUD("左")
//             break
//         }
//         case 11: {
//             self.settingViewController.view.frame = { x: readerFrame.width - width +adjustx , y: y, width: width, height: height }
//             // showHUD("中")
//             break
          
//         }
//         case 12: {
            
//             self.settingViewController.view.frame = { x: studyFrame.width - width - padding+adjustx-20 , y: y, width: width, height: height }
//             // showHUD("右")
//             break

//         }
//     }
//     // showHUD(String(a)+"/"+self.settingViewController.view.frame.x)
// }

export const closePanel = () => {
    if (profile.on) {
        self.settingViewController.view.removeFromSuperview()
        // showHUD(`${mnaddon.title} 已关闭`)
        profile.on = false;
    }
}

export const openPanel = async () => {
    if (!profile.on) {
    // self.textviewcontroller.view.frame = { x: 10, y: 10, width: 100, height: 100 }
    // self.textviewcontroller.view.backgroundColor = UIColor.yellowColor()
        self.studyController.view.addSubview(self.settingViewController.view)
        // self.settingViewController.view.addSubview(self.textviewcontroller.view)
        profile.on = true;
        // showHUD(`${mnaddon.title} 已打开`)
        // 开启面板时，若键盘处于开启状态，关闭键盘
        // await delay(0.2)
        // self.studyController.becomeFirstResponder()
    }
}


export const switchPanel = async () => {

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
        profile.on ? closePanel() : openPanel()//判断面板是否打开，以执行关闭或打开的操作
        // profile.on = !profile.on
        self.studyController.refreshAddonCommands()
    // }
    // isWaiting = false
}

// addSubview 的时候会执行，也就是打开操作面板的时候
const controllerWillLayoutSubviews = (controller: UIViewController) => {
    // if (controller == self.studyController.readerController){
    // profile.readerMode = true
    // // showHUD("readerMode")
    // }
    // else{
    // profile.readerMode = false
    // showHUD("studyMode")
    // }
    // if(profile.newPage){
    //     closePanel()
    //     // await delay(0.2)
    //     openPanel()
    //  }
    // showHUD(profile.on)
    if (!profile.on) return
    // if (profile.on)
        layoutViewController()

    // showHUD("123")
    // }else{
    // showHUD("456")
    // }

        
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
