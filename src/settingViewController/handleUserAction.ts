import { openUrl, postNotification, showHUD } from "utils/common"
import { dataSource, dataSource0, $name } from "addon"
import { checkInputCorrect } from "utils/input"
import { profile } from "profile"

const tag2indexPath = (tag: number): NSIndexPath => {
    return {
        section: (tag - 999 - (tag - 999) % 100) / 100,
        row: (tag - 999) % 100
    }
}

const tableViewDidSelectRowAtIndexPath = (tableView: UITableView, indexPath: NSIndexPath) => {
    if(profile.newPage){
        const section = dataSource0[indexPath.section]
    }else{
        const section = dataSource[indexPath.section]
    }

    const row = section.rows[indexPath.row]
    switch (row.type) {
        case cellViewType.plainText:
            if (row.link) openUrl(row.link)
            break
        case cellViewType.buttonWithInput:
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                row.label!, row.help!, 2, "确定", [],
                (alert: UIAlertView) => {
                    let text = alert.textFieldAtIndex(0).text
                    if (!text) return
                    postNotification(`${$name}ButtonClick`, {
                        key: row.key,
                        content: text
                    })
                })
            break
        case cellViewType.button:
            if (row.key == "space") return
            postNotification(`${$name}ButtonClick`, {
                key: row.key,
                content: ""
            })
    }
}

const textFieldShouldReturn = (sender: UITextField) => {
    const indexPath: NSIndexPath = tag2indexPath(sender.tag)
    if(profile.newPage){
        const section = dataSource0[indexPath.section]
    }else{
        const section = dataSource[indexPath.section]
    }
    
    // const section = dataSource[indexPath.section]
    const row = section.rows[indexPath.row]
    let text = sender.text.trim()
    // 可以为空
    if (!text || checkInputCorrect(text, row.key!)) {
        // 输入正确则取消光标
        sender.resignFirstResponder()
        row.content = text
        postNotification(`${$name}InputOver`, {
            name: section.header.toLocaleLowerCase(),
            key: row.key, content: text
        })
    } else showHUD("输入错误，请查看相关说明")
    return true
}

const switchChange = (sender: UISwitch) => {
    const indexPath: NSIndexPath = tag2indexPath(sender.tag)
    if(profile.newPage){
        const section = dataSource0[indexPath.section]
    }else{
        const section = dataSource[indexPath.section]
    }
    // const section = dataSource[indexPath.section]
    const row = section.rows[indexPath.row]
    row.status = sender.on
    postNotification(`${$name}SwitchChange`, {
        name: section.header.toLowerCase(),
        key: row.key, status: sender.on
    })
}

export default {
    tableViewDidSelectRowAtIndexPath,
    textFieldShouldReturn,
    switchChange
}