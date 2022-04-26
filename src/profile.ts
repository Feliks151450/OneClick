const profileType = {
    on: true,
    locationMode: 11,//10为左侧，11为中间，12为右侧
    windowMode: 0,//0为阅读全屏，1为分屏，2为脑图全屏
    smartLocationOn: true,
    locationX:0.,
    locationY:200.,
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
    test:0,
    arrow:0,
    newPage:false,
    mainPath:"",
    click:0

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