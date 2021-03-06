import { postNotification } from "./common"
import { showHUD } from "utils/common"
import { profile } from "profile"
/**
 * 获取选中的卡片
 */
const getSelectNodes = (noteId:string): MbBookNote[] => {
  if(profile.windowMode == 0){
    const note = getNoteById(noteId)
    return [note]
  }else{
    const MindMapNodes: any[] = self.studyController.notebookController.mindmapView.selViewLst
    return MindMapNodes.map(item => item.note.note)
  }
}
/**
 * 获取选中的文字
 */
// const getSelectText = (): string => {
//   showHUD("123")
//   const text = self.DocumentController.selectionText
//   showHUD(text)
//   return text
// }


/**
 * 获取卡片中的所有摘录
 */
const excerptNotes = (node: MbBookNote): MbBookNote[] => {
  const notes: MbBookNote[] = [node]
  // 包括作为评论的摘录
  const comments = node.comments
  for (const comment of comments) {
    if (comment.type == "LinkNote")
      notes.push(Database.sharedInstance().getNoteById(comment.noteid)!)
  }
  return notes
}

const getNoteById = (noteid: string): MbBookNote => {
  return Database.sharedInstance().getNoteById(noteid)!
}

const getMediaByHash = (hash: string): NSData => {
  return Database.sharedInstance().getMediaByHash(hash)!
 }


/**
 * 可撤销的动作，所有修改数据的动作都应该用这个方法包裹
 */
const undoGrouping = (action: () => void) => {
  UndoManager.sharedInstance().undoGrouping("${$name}", self.notebookid, () => {
    action()
    // 同步修改到数据库
    Database.sharedInstance().setNotebookSyncDirty(self.notebookid)
  })
}

const RefreshAfterDBChange = () => {
  postNotification('RefreshAfterDBChange', { topicid: self.notebookId })
}

/**
 * 获取评论的索引
 */
const getCommentIndex = (node: MbBookNote, commentNote: MbBookNote) => {
  const comments = node.comments
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i]
    // 如果直接用 comments[i] 貌似不能触发类型保护
    if (comment.type == "LinkNote" && comment.noteid == commentNote.noteId)
      return i
  }
  return -1
}

/**
 * 获取卡片内所有的文字
 */
const getAllText = (note: MbBookNote) => {
  const textArr = []
  if (note.excerptText) textArr.push(note.excerptText)
  note.comments.forEach(comment => {
    switch (comment.type) {
      case "TextNote":
      case "HtmlNote":
        const text = comment.text.trim()
        if (text && !text.includes("marginnote3app"))
          textArr.push(text)
        break
      case "LinkNote":
        if (comment.q_htext) textArr.push(comment.q_htext.trim())
    }
  })
  return textArr.join("\n")
}

export {
  getSelectNodes,
  excerptNotes,
  undoGrouping,
  getCommentIndex,
  getNoteById,
  RefreshAfterDBChange,
  getAllText,
  getMediaByHash
  // getSelectText
}