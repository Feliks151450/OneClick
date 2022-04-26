import { actions } from "addon"
import { layoutViewController} from "jsExtension/switchPanel"
import { profile } from "profile"
import { getNoteById, getSelectNodes, RefreshAfterDBChange, undoGrouping } from "utils/note"
import { delayBreak, log, showHUD } from "utils/common"
import copySearch from "./copySearchHandler"
import eventHandlerController from "utils/event"
import { $name } from "addon"

interface IUserInfo {
  [k: string]: any
}

interface eventHandler {
  ({ userInfo }: { userInfo: IUserInfo }): void
}

export const eventCtrl = eventHandlerController([
  { event: `${$name}InputOver` },
  { event: `${$name}SwitchChange` },
  { event: `${$name}ButtonClick` },
  { event: 'PopupMenuOnSelection' },
  { event: 'ActiveDigestNote' },
  { event: 'PopupMenuOnNote' }
])

const onButtonClick: eventHandler = ({ userInfo }) => {
  // 传入你需要的内容
  actions[userInfo.key]({
    content: userInfo.content,
  })
  RefreshAfterDBChange()
}

const onSwitchChange: eventHandler = ({ userInfo }) => {
  profile[userInfo.key] = userInfo.status
  switch (userInfo.key) {
    case "rightMode":
      layoutViewController()
      break
    case "copyMode":
      showHUD("切换到 Copy 模式")
  }
}

const onInputOver: eventHandler = ({ userInfo }) => {
  profile[userInfo.key] = userInfo.content
  if (userInfo.content) {
    showHUD("输入已保存")
  } else showHUD("输入已清空")
}

// 选择文本
const onPopupMenuOnSelection: eventHandler = ({ userInfo }) => {
  log("选中了文字", "action")
  const text = userInfo.documentController.selectionText


  // const arrow:boolean = userInfo.arrow

  // if(arrow){
  // showHUD("123")
  // }else{
  // showHUD("456")
  // }
  // showHUD(String(arrow))

  // showHUD(str[0].substr(2,20))

  // showHUD(str[1].substr(0,strLength-1))
  // showHUD(location.substr(2,3)+","+location.substr(21,4))
  if(profile.smartLocationOn){
    const location:string = userInfo.winRect
    const str = location.split(",")
    const strLength = str[1].length
    profile.locationX = Number(str[0].substr(2,18))
    // profile.locationY = Number(str[1].substr(0,strLength-1))//-370
    profile.locationY = Number(str[1].substr(0,strLength-1))-200
    profile.arrow = userInfo.arrow
    // showHUD("纵坐标为"+str[1].substr(0,strLength-1))
    // let os = Application.sharedInstance().osType
    // if(os == 0){profile.locationY = profile.locationY-300}
    // profile.adjust = profile.locationY-300
  }

  // self.studyController.refreshAddonCommands()


  // var pasteBoard = UIPasteboard.generalPasteboard()
  // var pasteBoard = UIPasteboard.pasteboardWithUniqueName()
  // const text_old = pasteBoard.string
  // const url = "eudic://dict/"+text
  // pasteBoard.URL = NSURL.URLWithString(encodeURI(url))
  // textSelected = text
  // showHUD(textSelected)
  // if(text_old){
  // pasteBoard.string = text_old
  // }
  profile.textSelected = text
  // 选中文字不会触发矫正，所以可能是乱码
  // if (profile.on && profile.selectTextOn) {
  //   if (text) copySearch({
  //     text
  //   })
  // }
}

let isClickCard = false
// 点击卡片会触发点击摘录，但是变成框架再点击就不会触发点击卡片，只会触发点击摘录，有点离谱
const onActiveDigestNote: eventHandler = async ({ userInfo }) => {
  log("点击了卡片", "action")
  isClickCard = true
  if (profile.on && profile.clickCardOn) {
    let note = getNoteById(userInfo.noteid)
    // 貌似这个事件可以取到点击的摘录，不过这里只需要主摘录
    note = note.groupNoteId ? getNoteById(note.groupNoteId) : note
    copySearch({
      note
    })
  }
}

const onPopupMenuOnNote: eventHandler = ({ userInfo }) => {
  // if (isClickCard) {
  //   isClickCard = false
  //   return
  // }
  // log("点击了摘录", "action")
  // if (profile.on && profile.clickExcerptOn) {
  //   const note = <MbBookNote>userInfo.note
  //   // 必然存在一个，否则不可能存在此摘录
  //   const text = note.excerptText ?? note.noteTitle
  //   copySearch({
  //     text
  //   })
  // }
  // showHUD(userInfo.note)
  // actions[userInfo.key]({
  //   note: userInfo.note,
  // })
  const note = <MbBookNote>userInfo.note
  profile.noteId = String(note.noteId)
  if(profile.smartLocationOn){
    const location:string = userInfo.winRect
    profile.arrow = userInfo.arrow
    const str = location.split(",")
    const strLength = str[1].length
    profile.locationX = Number(str[0].substr(2,18))
    profile.locationY = Number(str[1].substr(0,strLength-1))-120
    let os = Application.sharedInstance().osType
    if(os == 0){profile.locationY = profile.locationY-10}
    // profile.adjust = profile.locationY-50
  }
  // showHUD(note.noteId)
  // const test:string = note.noteId
  // RefreshAfterDBChange()
}

// 有关摘录处理的功能请直接开发 ohmymn 插件，避免冲突
const onProcessExcerptText: eventHandler = ({ userInfo }) => {
}

export default {
  onButtonClick,
  onInputOver,
  onSwitchChange,
  onPopupMenuOnNote,
  onActiveDigestNote,
  onPopupMenuOnSelection
}