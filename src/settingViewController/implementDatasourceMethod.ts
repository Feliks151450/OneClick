import { dataSource, dataSource0 } from "addon";
import { showHUD } from "utils/common";
import { profile } from "profile"
import { isOCNull } from "utils/common";

const indexPath2tag = (indexPath: NSIndexPath): number => {
    return indexPath.section * 100 + indexPath.row + 999
}

const numberOfSectionsInTableView = (tableView: UITableView) => {
    if(profile.newPage){
        return dataSource0.length//分区数
    }else{
        return dataSource.length//分区数
    }
    
}

const tableViewNumberOfRowsInSection = (tableView: UITableView, section: number) => {
    if(profile.newPage){
        return dataSource0[section].rows.length//每个分区多少行
    }else{
        return dataSource[section].rows.length//每个分区多少行
    }
    
}

const tableViewTitleForHeaderInSection = (tableView: UITableView, section: number) => {
    if(profile.newPage){
        return dataSource0[section].header
    }else{
        return dataSource[section].header
    }
    
}

const tableViewHeightForRowAtIndexPath = (tableView: UITableView, indexPath: NSIndexPath) => {
    if(profile.newPage){
        const row = dataSource0[indexPath.section].rows[indexPath.row]
    }else{
        const row = dataSource[indexPath.section].rows[indexPath.row]
    }
    
    
    if (row.key == "space") return 300
    else if (row.type === cellViewType.plainText) {
        let num = row.label!.length - row.label!.replace(/[\r\n]/g, '').length
        return 30 + num * 10
    } else return 40
}
const tableViewCellForRowAtIndexPath = (tableView: UITableView, indexPath: NSIndexPath) => {
    if(profile.newPage){
        const row = dataSource0[indexPath.section].rows[indexPath.row]
    }else{
        const row = dataSource[indexPath.section].rows[indexPath.row]
    }
    // const row = dataSource[indexPath.section].rows[indexPath.row]//哪个分区哪一行
    switch (row.type) {
        case cellViewType.plainText: {
        //复用？
            const cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'PlainTextCellID')
            cell.selectionStyle = 0
            cell.textLabel.opaque = false
            cell.textLabel.textAlignment = 0
            cell.textLabel.lineBreakMode = 0
            cell.textLabel.numberOfLines = 0
            cell.textLabel.textColor = UIColor.grayColor()
            cell.textLabel.font = UIFont.systemFontOfSize(12)
            cell.textLabel.text = row.label
            return cell
        }
        case cellViewType.button: case cellViewType.buttonWithInput: {
            const cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'ButtonCellID')
            cell.textLabel.font = UIFont.systemFontOfSize(17)
            cell.textLabel.textColor = self.textColor
            cell.textLabel.lineBreakMode = 0
            cell.textLabel.textAlignment = 0
            cell.selectionStyle = row.key == "space" ? 0 : 1
            cell.textLabel.text = row.label
            const iconColor = Application.sharedInstance().currentTheme == "Gray" ? "light" : "dark"
            // showHUD(profile.mainPath)
            // let mainPath = `/Users/linlifei/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/marginnote.extension.oneClick`
            const image = NSData.dataWithContentsOfFile(
                profile.mainPath + `/icon/${row.key}.png`
            )
            // let mainPath = "123"

            if (!isOCNull(image)){
                // showHUD(mainPath)
                cell.imageView.image = UIImage.imageWithDataScale(image, 2)
            }
            
            return cell
        }
        case cellViewType.switch: {
            const cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'SwitchCellID')
            cell.selectionStyle = 0
            cell.textLabel.text = row.label
            cell.textLabel.font = UIFont.systemFontOfSize(15)
            cell.textLabel.textColor = self.textColor
            let view = null
            if (row.status) view = controllers.switch(row.status)
            else view = controllers.switch()
            let newFrame = view.frame
            newFrame.x = cell.contentView.frame.width - newFrame.width - 10
            view.frame = newFrame
            view.autoresizingMask = 1 << 0
            view.tag = indexPath2tag(indexPath)
            cell.contentView.addSubview(view)
            return cell
        }
        case cellViewType.inlineInput: {
            const cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'inlineInputCellID')
            cell.selectionStyle = 0
            cell.textLabel.font = UIFont.systemFontOfSize(15)
            cell.textLabel.textColor = self.textColor
            cell.textLabel.text = row.label
            let view = null
            if (row.content) view = controllers.inlineInput(row.content)
            else view = controllers.inlineInput()
            let newFrame = view.frame
            newFrame.x = cell.contentView.frame.width - newFrame.width - 10
            view.frame = newFrame
            view.autoresizingMask = 1 << 0
            // 传入位置，不要直接传入 indexPath，以及设置 indexPath 属性
            // 唯一值，建议加一个较大数
            view.tag = indexPath2tag(indexPath)
            cell.contentView.addSubview(view)
            return cell
        }
        case cellViewType.input: {
            const cell = UITableViewCell.makeWithStyleReuseIdentifier(0, 'inputCellID')
            cell.textLabel.font = UIFont.systemFontOfSize(16)
            cell.textLabel.textColor = self.textColor
            cell.selectionStyle = 0
            let view = null
            if (row.content) view = controllers.input(row.content)
            else view = controllers.input()
            view.autoresizingMask = 1 << 0
            view.tag = indexPath2tag(indexPath)
            cell.contentView.addSubview(view)
            return cell
        }
    }
}


// 仅用于 SettingViewController, self 为 tableviewcontroller
export const controllers = {
    switch(status = false) {
        const frame = { x: 0, y: 5, width: 50, height: 30 }
        const view = new UISwitch(frame)
        view.addTargetActionForControlEvents(self, 'switchChange:', 1 << 12)
        view.backgroundColor = UIColor.clearColor()
        view.on = status
        return view
    },
    inlineInput(text = "") {
        const frame = { x: 0, y: 9, width: 100, height: 30 }
        if (Application.sharedInstance().osType == 0) frame.y = 5
        const view = new UITextField(frame)
        view.font = UIFont.systemFontOfSize(18)
        view.textColor = self.textColor
        // 把协议和控制器连接
        view.delegate = self
        view.text = text
        view.placeholder = "enter"
        view.textAlignment = 0
        view.autoresizingMask = 1 << 1 | 1 << 5
        return view
    },
    input(text = "") {
        const frame = { x: 40, y: 9, width: 250, height: 30 }
        if (Application.sharedInstance().osType == 0) frame.y = 5
        const view = new UITextField(frame)
        view.font = UIFont.systemFontOfSize(15)
        view.textColor = self.textColor
        view.placeholder = "enter"
        view.delegate = self
        view.textAlignment = 0
        view.autoresizingMask = 1 << 1 | 1 << 5
        view.text = text
        return view
    }
}

export default {
    numberOfSectionsInTableView,
    tableViewNumberOfRowsInSection,
    tableViewTitleForHeaderInSection,
    tableViewHeightForRowAtIndexPath,
    tableViewCellForRowAtIndexPath,
}