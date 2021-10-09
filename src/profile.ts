const profileType = {
    on: true,
    rightMode: false,
    selectTextOn: false,
    copyMode: false,
    clickCardOn: false,
    clickExcerptOn: false,
    titleLinkFirst: false,
    wordUrl: "eudic://dict/$&",
    sentenceUrl: "https://translate.google.com/?hl=zh-CN&sl=en&tl=zh-CN&text=$&&op=translate",
    defaultUrl: "https://cn.bing.com/search?q=$&",
    customUrl: "",
    customCopy: `"%title"`,
    textSelected: "",
    noteId: "",
    compact: true,
    adjust: 70,
    padding: true,
    fillExplanation: true,
    fillFrequency: false,
    locationX:0,
    locationY:0
}

const docProfileType = {
}

export type IProfile = typeof profileType
export type IProfile_doc = typeof docProfileType

const profile: { [k: string]: boolean | string | number} & IProfile = {
    ...profileType
}

const docProfile: IProfile_doc = {
    ...docProfileType
}

export { profile, docProfile }