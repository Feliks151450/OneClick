import genDataSource from "utils/dataSource"
import { profile } from "profile"
import { isHalfWidth, wordCount } from "utils/text"
import { getAllText, getSelectNodes, getMediaByHash, excerptNotes, getNoteById, } from "utils/note"
import { openUrl, showHUD } from "utils/common"
import { string2ReplaceParam } from "utils/input"
import { dict } from "utils/dict"
import mnaddon from "../mnaddon.json"
// import textSelected from "jsExtension/handleReceivedEvent"
// let text:string = textSelected
const configs0: IConfig[] = [
  {
    name: "Settings",
    intro: `version: ${mnaddon.version} 仅用于技术测试\nmade by ${mnaddon.author}`,
    link: "https://github.com/ourongxing/copysearch",
    settings: [
      {
        key: "LorR",
        type: cellViewType.button,
        label: "左"
      },
      // {
      //   key: "copyMode",
      //   type: cellViewType.switch,
      //   label: "复制模式",
      // },
      // {
      //   key: "selectTextOn",
      //   type: cellViewType.switch,
      //   label: "选中文字时执行",
      // },
      // {
      //   key: "clickExcerptOn",
      //   type: cellViewType.switch,
      //   label: "点击摘录时执行",
      // },
      // {
      //   key: "clickCardOn",
      //   type: cellViewType.switch,
      //   label: "点击卡片时执行",
      // },
      {
        key: "compact",
        type: cellViewType.button,
        label: "大"
      },
      {
        key: "moveUp",
        type: cellViewType.button,
        label: "上"
      },
      {
        key: "moveDown",
        type: cellViewType.button,
        label: "下"
      },
      {
        key: "padding",
        type: cellViewType.button,
        label: "贴"
      },
    ],
    actions: [
      // {
      //   key: "copySelected",
      //   type: cellViewType.button,
      //   label: "复制卡片信息",
      // },
      {
          type: cellViewType.button,
          label: '标题',
          key: 'switchTitleorExcerpt',
      },
      {
          type: cellViewType.button,
          label: 'MD',
          key: 'copyAsMarkdownLink',
      },
      {
          type: cellViewType.button,
          label: '复制',
          key: 'copyExcerptPic',
      },
      {
          type: cellViewType.button,
          label: '欧路',
          key: 'searchInEudic',
      },
      {
          type: cellViewType.button,
          label: '标题',
          key: 'copyAllNote',
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

const configs1: IConfig[] = [
  {
    name: "设置",
    intro: `version: ${mnaddon.version} 仅用于技术测试\nmade by ${mnaddon.author}`,
    link: "https://github.com/ourongxing/copysearch",
    settings: [
      {
        key: "compact",
        type: cellViewType.button,
        label: "🪄 大⇌小"
      },
      {
        key: "copyMode",
        type: cellViewType.switch,
        label: "复制模式",
      },
      // {
      //   key: "selectTextOn",
      //   type: cellViewType.switch,
      //   label: "选中文字时执行",
      // },
      // {
      //   key: "clickExcerptOn",
      //   type: cellViewType.switch,
      //   label: "点击摘录时执行",
      // },
      // {
      //   key: "clickCardOn",
      //   type: cellViewType.switch,
      //   label: "点击卡片时执行",
      // },
      {
        key: "LorR",
        type: cellViewType.button,
        label: "↔️ 左⇌右"
      },
      {
        key: "moveUp",
        type: cellViewType.button,
        label: "⬆️ 上移"
      },
      {
        key: "moveDown",
        type: cellViewType.button,
        label: "⬇️ 下移"
      },
      {
        key: "padding",
        type: cellViewType.button,
        label: "📌 贴边"
      },
    ],
    actions: [
      // {
      //   key: "copySelected",
      //   type: cellViewType.button,
      //   label: "复制卡片信息",
      // },
      {
          type: cellViewType.button,
          label: '🔄 标题⇌摘录',
          key: 'switchTitleorExcerpt',
      },
      {
          type: cellViewType.button,
          label: '🔗 MD Link',
          key: 'copyAsMarkdownLink',
      },
      {
          type: cellViewType.button,
          label: '🔖 复制摘录',
          key: 'copyExcerptPic',
      },
      {
          type: cellViewType.button,
          label: '📘 欧路词典',
          key: 'searchInEudic',
      },
      {
          type: cellViewType.button,
          label: '📑 标题+摘录',
          key: 'copyAllNote',
      },
      // {
      //     type: cellViewType.button,
      //     label: '补充释义',
      //     key: 'completeSelected',      
      // }
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
const utils = {
  getUrl(text: string) {
    if (profile.customUrl) {
      const params = string2ReplaceParam(profile.customUrl)
      for (const item of params) {
        if (text.match(item.regexp)) {
          const title = text.replace(item.regexp, item.newSubStr)
          return text.replace(/^.*$/, title)
        }
      }
    }

    if (isHalfWidth(text)) {
      if (profile.wordUrl && wordCount(text) < 4)
        return text.replace(/^.*$/, profile.wordUrl)
      if (profile.sentenceUrl && wordCount(text) > 3)
        return text.replace(/^.*$/, profile.sentenceUrl)
    }
    if (profile.defaultUrl)
      return text.replace(/^.*$/, profile.defaultUrl)
    return false
  },
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
  checkGetWord(text: string) {
    text = text.toLowerCase()
    // 判断一下是否是单词，或许可以降低点内存消耗
    if (!(/^[a-z]+$/.test(text) && dict[text])) return false
    const autocomplete = profile.autocomplete
    let word = dict[text]
    if (word.lemma) {
      text = word.lemma
      showHUD(text)
      word = dict[word.lemma]
    }
    const wordObj = { title: text, text: "" }
    let tmp_text = []
    if (word.exchange) wordObj.title = text + "; " + word.exchange.replace(/-/g, text).replace(/;/g, "; ")
    if (profile.fillExplanation && word.explain) tmp_text.push(word.explain)
    // if (profile.fillFrequency && word.frequency) tmp_text.push(word.frequency)
    wordObj.text = tmp_text.join("\n\n")
    return wordObj
  },
}

const actions: IActionMethod = {
  copySelected({ }) {
    try {
      const nodes = getSelectNodes()
      let texts: string[] = []
      if (nodes.length == 1)
        texts.push(utils.getCustomText(nodes[0]))
      else nodes.forEach((node, index) => {
        texts.push(String(index + 1) + ". " + utils.getCustomText(node))
      })
      const pasteBoard = UIPasteboard.generalPasteboard()
      pasteBoard.string = texts.join("\n").trim()
    } catch {
      return
    }
    showHUD("复制成功")
  },
  switchTitleorExcerpt({ }) {

    const nodes = getSelectNodes()
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText ?? ""
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
  },
  copyAsMarkdownLink({ }) {
    var pasteBoard = UIPasteboard.generalPasteboard()
    let note = getNoteById(profile.noteId)
    let noteTitle = note.noteTitle
    noteTitle = noteTitle?noteTitle:"noTitle"
    let text = '['+noteTitle+'](marginnote3app://note/'+profile.noteId+')'
    pasteBoard.string = text
    showHUD(noteTitle)
    const nodes = getSelectNodes()
    text = ""
    for (const note of nodes) {
        var noteid = note.noteId
        noteTitle = note.noteTitle
        noteTitle = noteTitle?noteTitle:"noTitle"
        text = text+'['+noteTitle+'](marginnote3app://note/'+noteid+')'+'\n'
    }
    pasteBoard.string = text
    showHUD("链接已复制")

  },

  copyExcerptPic({ }) {
    var pasteBoard = UIPasteboard.generalPasteboard()
    let note = getNoteById(profile.noteId)
    let pic = note.excerptPic
    let text = note.excerptText
    if(text){
      pasteBoard.string = text
      showHUD('摘录文字已复制',2)
    }
    if(pic){
      var hash = pic.paint
      var imageData = getMediaByHash(hash)
      var image = UIImage.imageWithData(imageData)
      pasteBoard.image = image
      showHUD('摘录图片已复制',2)
    }

    const nodes = getSelectNodes()
    for (const note of nodes) {
        let pic = note.excerptPic
        let text = note.excerptText
        if(text){
          pasteBoard.string = text
          showHUD('摘录文字已复制',2)
        }
        if(pic){
          var hash = pic.paint
          var imageData = getMediaByHash(hash)
          var image = UIImage.imageWithData(imageData)
          pasteBoard.image = image
          showHUD('摘录图片已复制',2)
        }
    }
    },
  copyAllNote({ }) {
    const nodes = getSelectNodes()
    let text = ""
    var pasteBoard = UIPasteboard.generalPasteboard()
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
  compact({}){
    profile.compact = !profile.compact
    },

  LorR({}){
    profile.rightMode = !profile.rightMode
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
  completeSelected({ }) {
    const nodes = getSelectNodes()
    for (const note of nodes) {
      const title = note.noteTitle
      const text = note.excerptText
      // if (title) {
        const wordObj = utils.checkGetWord(text)
        if (wordObj) {
        showHUD(wordObj.title)
          note.noteTitle = text
          // if (!text || text == title) {
            note.excerptText = wordObj.text
          // }
        }
      // }
    }
  }
}
// if(profile.compact){
//   const configs = configs0
// }else{
//   const configs = configs1
// }
// const configs = profile.compact?configs0:configs1
const dataSource = genDataSource(configs1, {
  // action 板块详情
  name: "OneClick",
  // intro: "点击"
})

const $name = mnaddon.addonid.split(".")[2]
export { $name, utils, actions, dataSource }