import genDataSource from "utils/dataSource"
import { profile } from "profile"
import pangu from "utils/pangu"
import { getAllText, getSelectNodes, getMediaByHash, excerptNotes, getNoteById, } from "utils/note"
import { string2ReplaceParam,reverseEscape } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import { isOCNull, log, showHUD, openUrl, delayBreak, delay } from "utils/common"
import fetch from "utils/network"
import { undoGrouping, RefreshAfterDBChange } from "utils/note"
// import { dict } from "utils/dict"
import mnaddon from "../mnaddon.json"
import { closePanel, openPanel } from "jsExtension/switchPanel"
// import textSelected from "jsExtension/handleReceivedEvent"
// let text:string = textSelected
const configs0: IConfig[] = [
{
    name: "   设置",
    intro: "1.2 by Linlifei",
    link: "https://github.com/ourongxing/copysearch",
    settings: [
      // {
      //   key: "smartLocationOn",
      //   type: cellViewType.button,
      //   label: "位置跟随",
      // },
      {
        key: "LorR",
        type: cellViewType.button,
        label: "位置切换"
      },
      {
        key: "moveUp",
        type: cellViewType.button,
        label: "上移"
      },
      {
        key: "moveDown",
        type: cellViewType.button,
        label: "下移"
      },
      {
        key: "padding",
        type: cellViewType.button,
        label: "是否贴边"
      },
    ],
    actions: [
      {
          type: cellViewType.button,
          label: '标题⇌摘录',
          key: 'switchTitleorExcerpt',
      },
      {
          type: cellViewType.button,
          label: 'MD Link',
          key: 'copyAsMarkdownLink',
      },
      {
          type: cellViewType.button,
          label: '复制摘录',
          key: 'copyExcerptPic',
      },
      {
          type: cellViewType.button,
          label: '欧路词典',
          key: 'searchInEudic',
          // key: 'completeSelected',
      },
      // {
      //     type: cellViewType.button,
      //     label: '📑 标题+摘录',
      //     key: 'copyAllNote',
      // },
      {
        key: "compact",
        type: cellViewType.button,
        label: "迷你模式"
      },
    ]
  },
]

const configs1: IConfig[] = [
  {
    name: "设置",
    intro: "1.2",
    link: "https://github.com/ourongxing/copysearch",
    settings: [
      // {
      //   key: "smartLocationOn",
      //   type: cellViewType.button,
      //   label: "  ",
      // },
      {
        key: "LorR",
        type: cellViewType.button,
        label: "    "
      },
      {
        key: "moveUp",
        type: cellViewType.button,
        label: "    "
      },
      {
        key: "moveDown",
        type: cellViewType.button,
        label: "    "
      },
      {
        key: "padding",
        type: cellViewType.button,
        label: "    "
      },
    ],
    actions: [
      {
          type: cellViewType.button,
          label: '    🔄',
          key: 'switchTitleorExcerpt',
      },
      {
          type: cellViewType.button,
          label: '    🔗',
          key: 'copyAsMarkdownLink',
      },
      {
          type: cellViewType.button,
          label: '    🔖',
          key: 'copyExcerptPic',
      },
      {
          type: cellViewType.button,
          label: '    📘',
          // key: 'completeSelected',
          key: 'searchInEudic',
      },
      // {
      //     type: cellViewType.button,
      //     label: '📑',
      //     key: 'copyAllNote',
      // },
      {
        key: "compact",
        type: cellViewType.button,
        label: "    🪄"
      },
    ]
  },
  // {
  //   name: "Copy",
  //   intro: "自定义在复制模式下点击卡片时复制的内容\n点击查看支持的变量",
  //   link: "https://busiyi.notion.site/Copy-61ef85cf19f24de2a14814db0e3ea05a",
  //   settings: [
  //     {
  //       key: "customCopy",
  //       type: cellViewType.input,
  //     },
  //   ],
  // },
  // {
  //   name: "Search",
  //   intro: "自定义 Url，点击查看更多 UrlScheme",
  //   link: "https://busiyi.notion.site/Search-26440b198773492cbc1e39015ae55654",
  //   settings: [
  //     {
  //       key: "titleLinkFirst",
  //       type: cellViewType.switch,
  //       label: "标题链接取第一个",
  //     },
  //     {
  //       key: "wordUrl",
  //       type: cellViewType.inlineInput,
  //       label: "单词或短语",
  //     },
  //     {
  //       key: "sentenceUrl",
  //       type: cellViewType.inlineInput,
  //       label: "英语句子",
  //     },
  //     {
  //       key: "defaultUrl",
  //       type: cellViewType.inlineInput,
  //       label: "默认情况",
  //     },
  //     {
  //       key: "customUrl",
  //       type: cellViewType.input,
  //       help: "自定义，点击查看具体输入格式",
  //       link: "https://busiyi.notion.site/Search-26440b198773492cbc1e39015ae55654",
  //     },
  //   ],
  // }
]
type Dict = {
  word: string
  sw: string
  exchange?: string
  // 下面这些都有可能是 NSNull
  phonetic: string
  definition: string
  translation: string
  tag: string
  collins: string
}
const utils = {
  // getUrl(text: string) {
  //   if (profile.customUrl) {
  //     const params = string2ReplaceParam(profile.customUrl)
  //     for (const item of params) {
  //       if (text.match(item.regexp)) {
  //         const title = text.replace(item.regexp, item.newSubStr)
  //         return text.replace(/^.*$/, title)
  //       }
  //     }
  //   }

  //   if (isHalfWidth(text)) {
  //     if (profile.wordUrl && wordCount(text) < 4)
  //       return text.replace(/^.*$/, profile.wordUrl)
  //     if (profile.sentenceUrl && wordCount(text) > 3)
  //       return text.replace(/^.*$/, profile.sentenceUrl)
  //   }
  //   if (profile.defaultUrl)
  //     return text.replace(/^.*$/, profile.defaultUrl)
  //   return false
  // },
  getCustomText(note: MbBookNote) {
    // 后期可以慢慢加
    const vars = {
      title: note.noteTitle ?? "",
      text: getAllText(note),
      createTime: note.createDate,
      modifiedTime: note.modifiedDate,
      link: "marginnote3app://note/" + note.noteId,
    }
    let _text = JSON.parse(`{"text": ${profile.customCopy}}`).text
    Object.entries(vars).forEach(([key, value]) => {
      const reg = new RegExp(`{{${key}}}`, "g")
      _text = _text.replace(reg, <string>value)
    })
    return _text.replace(/\n{2,}/g, "\n")
  },
  standardizeText(text: string): string {
    if (isHalfWidth(text)) return text
    const preset = [0]
    text = text
      .replace(/\*\*([\b-']*?)\*\*/g, "placeholder$1placeholder")
      .replace(/\*\*/g, "占位符")
    for (const set of preset) {
      switch (set) {
        case 1:
          text = pangu.toFullwidth(text)
          break
        case 2:
          text = pangu.spacing(text)
        case 3:
          text = text.replace(/\x20{2,}/g, "\x20").replace(/\x20*\n\x20/, "\n")
          break
      }
    }
    return text.replace(/占位符/g, "**").replace(/placeholder/g, "**")
  },
  // getPureZH(text: string) {
  //   const arr = text.split("\n")
  //   text =
  //     arr.length > 1
  //       ? arr.filter(item => !/\[.*\]/.test(item)).join("\n")
  //       : arr[0].replace(/\[.*\]/, "")
  //   return text.replace(/\ba\. /g, "adj. ")
  // },

  // async getWordInfo(word: string): Promise<Dict> {
  //   const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + word).then(
  //     res => res.json()
  //   )
  //   const info = <Dict[]>res.filter((info: any) => info.word == info.sw)
  //   if (!info.length) throw "查询不到该单词"
  //   showHUD("123")
  //   return info[0]
  // },

  // getWordEx(lemma: string, ex: string): string {
  //   // s:demands/p:demanded/i:demanding/d:demanded/3:demands
  //   const arr = ex
  //     .split(/\//)
  //     .filter(item => !/[01]:/.test(item))
  //     .map(item => item.slice(2))
  //   return [...new Set([lemma, ...arr])].join("; ")
  // },

  // getTag(str: string) {
  //   const re = [
  //     ["zk", "中考"],
  //     ["gk", "高考"],
  //     ["cet4", "四级"],
  //     ["cet6", "六级"],
  //     ["ky", "考研"],
  //     ["gre", "GRE"],
  //     ["toefl", "托福"],
  //     ["ielts", "雅思"]
  //   ]
  //   for (const [a, b] of re) str = str.replace(a, b)
  //   return str.replace(/ /g, "/")
  // },
  // getCollinsStar(num: number) {
  //   return "⭐".repeat(num)
  // },
  // async checkGetWord(text: string) {
  //   try {
  //     if (!isHalfWidth(text) || countWord(text) != 1) throw "不是单词"
  //     text = text.toLowerCase()
  //     let title = text
  //     let info = await this.getWordInfo(text)
  //     if (info.exchange) {
  //       const ex = info.exchange
  //       const lemma = ex.replace(/^0:(\w*)\/[^/]*$/, "$1")
  //       if (lemma != ex) {
  //         text = lemma
  //         info = await this.getWordInfo(lemma)
  //       }
  //       // title = this.getWordEx(text, info.exchange!)
  //     }

  //     // 这里有点坑爹，OC 的 JSON 转换会把 null 转成 NSNull，NSNull 在 JS 中是一个对象
  //     const vars = {
  //       word: text,
  //       phonetic: isOCNull(info.phonetic) ? "" : info.phonetic,
  //       tag: false,
  //       collins: "",
  //       en: true,
  //       zh: true
  //     }
  //       let fill = reverseEscape(`"{{zh}}"`)
  //       Object.entries(vars).forEach(([key, value]) => {
  //         const reg = new RegExp(`{{${key}}}`, "g")
  //         fill = fill.replace(reg, <string>value)
  //       })
  //       text = this.standardizeText(fill)
  //       return text
  //     // return {
  //     //   // title,
  //     //   text
  //     // }
  //   } catch (error) {
  //     log(error, "autocomplete")
  //     switch (error) {
  //       case "请求超时。":
  //         showHUD("请求超时，请检查网络连接！")
  //     }
  //     return false
  //   }
  // }
  // checkGetWord(text: string) {
  //   text = text.toLowerCase()
  //   // 判断一下是否是单词，或许可以降低点内存消耗
  //   if (!(/^[a-z]+$/.test(text) && dict[text])) return false
  //   const autocomplete = profile.autocomplete
  //   let word = dict[text]
  //   if (word.lemma) {
  //     text = word.lemma
  //     showHUD(text)
  //     word = dict[word.lemma]
  //   }
  //   const wordObj = { title: text, text: "" }
  //   let tmp_text = []
  //   if (word.exchange) wordObj.title = text + "; " + word.exchange.replace(/-/g, text).replace(/;/g, "; ")
  //   if (profile.fillExplanation && word.explain) tmp_text.push(word.explain)
  //   // if (profile.fillFrequency && word.frequency) tmp_text.push(word.frequency)
  //   wordObj.text = tmp_text.join("\n\n")
  //   return wordObj
  // },
}

const actions: IActionMethod = {
  // copySelected({ }) {
  //   try {
  //     const nodes = getSelectNodes(profile.noteId)
  //     let texts: string[] = []
  //     if (nodes.length == 1)
  //       texts.push(utils.getCustomText(nodes[0]))
  //     else nodes.forEach((node, index) => {
  //       texts.push(String(index + 1) + ". " + utils.getCustomText(node))
  //     })
  //     const pasteBoard = UIPasteboard.generalPasteboard()
  //     pasteBoard.string = texts.join("\n").trim()
  //   } catch {
  //     return
  //   }
  //   showHUD("复制成功")
  // },
  // async completeSelected() {
  //   const nodes = getSelectNodes(profile.noteId)
  //   for (const note of nodes) {
  //     const text = note?.excerptText
  //     // if (!title) continue
  //     const result = await this.checkGetWord(text.split(/\s*[;；]\s*/)[0])
  //     // showHUD(result)
  //     // if (!result) continue
  //     // undoGrouping(() => {
  //     //   // note.noteTitle = result.title
  //     //   // if (option == 1) 
  //     //   note.excerptText = result
  //     // })
  //   }
  //   RefreshAfterDBChange()
  // },
  switchTitleorExcerpt({ }) {
    const nodes = getSelectNodes(profile.noteId)
    for (const note of nodes) {
      let title = note.noteTitle ?? ""
      let text = note.excerptText ?? ""
      // 只允许存在一个
      if ((title || text) && !(title && text)) {
        // 去除划重点留下的 ****
        note.noteTitle = text.replace(/\*\*(.*?)\*\*/g, "$1")
        note.excerptText = title
      } else if (title == text) {
        // 如果摘录与标题相同，MN 只显示标题，此时我们必然想切换到摘录
        note.noteTitle = ""
      }
    }
    showHUD("标题转换完成")
  },
  async copyAsMarkdownLink({ }) {
    // profile.click = profile.click+1
    var pasteBoard = UIPasteboard.generalPasteboard()
    const nodes = getSelectNodes(profile.noteId)
    let text = ""
    // switch(profile.click){
    //   case 1:{
        for (const note of nodes) {
        var noteid = note.noteId
        let noteTitle = note.noteTitle
        noteTitle = noteTitle?noteTitle:"noTitle"
        text = text+'['+noteTitle+'](marginnote3app://note/'+noteid+')'+'\n'
        }
        showHUD("MDLink已复制")
        // break
      // }case 2:{
      //   for (const note of nodes) {
      //   var noteid = note.noteId
      //   let noteTitle = note.noteTitle
      //   noteTitle = noteTitle?noteTitle:"noTitle"
      //   text = text+"marginnote3app://note/"+noteid+'\n'
      //   }
      //   showHUD("已修改为纯链接")
      //   break
      // }
    // }
    pasteBoard.string = text
    // const success = await delay(0.5)
    // profile.click = 0
  },


  async copyExcerptPic({ }) {
    // profile.click = profile.click+1
    var pasteBoard = UIPasteboard.generalPasteboard()    
    const nodes = getSelectNodes(profile.noteId)
    // switch(profile.click){
      // case 1:{
        let text_0 = ""
        for (const note of nodes) {
        let pic = note.excerptPic
        let text = note.excerptText
        if(pic){
          var hash = pic.paint
          var imageData = getMediaByHash(hash)
          pasteBoard.image = UIImage.imageWithData(imageData)
          const success = await delay(0.5)
        }else{
          if(text) text_0 = text_0+text+'\n'
        }
        }
        if(text_0 != "") {
          pasteBoard.string = text_0
          text_0 = ""
        }
        showHUD("摘录已复制")
        // break
      // }case 2:{
      //   let text_title = ""
      //   for (const note of nodes) {
      //   let noteTitle = note.noteTitle
      //   if(noteTitle) text_title = text_title+noteTitle+'\n'
      //   }
      //   pasteBoard.string = text_title
      //   showHUD("标题已复制")
      //   break
      // }
    // }

    // const success = await delay(0.5)
    // profile.click = 0
    // let note = getNoteById(profile.noteId)
    // let pic = note.excerptPic
    // let text = note.excerptText
    // if(text){
    //   pasteBoard.string = text
    //   showHUD('摘录文字已复制',2)
    // }
    // if(pic){
    //   var hash = pic.paint
    //   var imageData = getMediaByHash(hash)
    //   var image = UIImage.imageWithData(imageData)
    //   pasteBoard.image = image
    //   showHUD('摘录图片已复制',2)
    // }


    
    },
  copyAllNote({ }) {
    var pasteBoard = UIPasteboard.generalPasteboard()
    // let note = getNoteById(profile.noteId)
    // var noteTitle = note.noteTitle
    // var noteExcerpt = note.excerptText
    // noteTitle = noteTitle?noteTitle:"noTitle"
    // noteExcerpt = noteExcerpt?noteExcerpt:""
    // showHUD(noteTitle)
    // let text = '['+noteTitle+'](marginnote3app://note/'+profile.noteId+')'+'\n'+noteExcerpt
    // pasteBoard.string = text


    const nodes = getSelectNodes(profile.noteId)
    let text = ""
    for (const note of nodes) {
        var noteid = note.noteId
        var noteTitle = note.noteTitle
        var noteExcerpt = note.excerptText
        noteTitle = noteTitle?noteTitle:"noTitle"
        noteExcerpt = noteExcerpt?noteExcerpt:""
        showHUD(noteTitle)
        text = text+'['+noteTitle+'](marginnote3app://note/'+noteid+')'+'\n'+noteExcerpt+'\n\n'
    }
      pasteBoard.string = text
    },

  searchInEudic({ }){
    // showHUD(userInfo)
    // const text = userInfo.documentController.selectionText
    // var pasteBoard = UIPasteboard.generalPasteboard()
    // var pasteBoard = UIPasteboard.pasteboardWithNameCreate("eudic",false)

    // let text = pasteBoard.URL
    // showHUD(profile.textSelected,2)
    let text = profile.textSelected
        // text = text.toLowerCase()
    // let info  =  this.getWordInfo(text)
    // showHUD(info)
    let url = ""
    if(text != ""){
      url = "eudic://dict/"+text //欧路词典
      profile.textSelected = ""
    }
    else{
      let note = getNoteById(profile.noteId)
      let text = note.excerptText
      profile.noteId = ""
      if(text) {
        url = "eudic://dict/"+text //欧路词典
      }
    }
    openUrl(url)
    },
  LorR({}){
    profile.smartLocationOn = false
    if(profile.locationMode == 12){
      profile.locationMode =10
    }else{
      profile.locationMode = profile.locationMode+1
    }
    },
  moveDown({}){
    profile.adjust = profile.adjust+100
    },
  moveUp({}){
    profile.adjust = profile.adjust-100
    },
  padding({}){
    profile.padding = !profile.padding
    },
  smartLocationOn({}){
    let text = profile.smartLocationOn == true? "位置跟随关闭":"位置跟随开启"
    showHUD(text)
    profile.smartLocationOn = !profile.smartLocationOn
    },
  compact({}){
    profile.newPage = !profile.newPage
    closePanel()
    openPanel()
    },
  // completeSelected({ }) {
  //   const nodes = getSelectNodes()
  //   for (const note of nodes) {
  //     const title = note.noteTitle
  //     const text = note.excerptText
  //     // if (title) {
  //       const wordObj = utils.checkGetWord(text)
  //       if (wordObj) {
  //       showHUD(wordObj.title)
  //         note.noteTitle = text
  //         // if (!text || text == title) {
  //           note.excerptText = wordObj.text
  //         // }
  //       }
  //     // }
  //   }
  // }
}
// if(profile.compact){
//   const configs = configs0
// }else{
//   const configs = configs1
// }
// const configs = profile.compact?configs0:configs1
const dataSource = genDataSource(configs1, {
  // action 板块详情
  name: " OC",
  // intro: "点击"
})
const dataSource0 = genDataSource(configs0, {
  // action 板块详情
  name: "   OneClick",
  // intro: "点击"
})

const $name = mnaddon.addonid.split(".")[2]
export { $name, utils, actions, dataSource, dataSource0 }