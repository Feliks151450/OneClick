import { delay, showHUD } from "utils/common"
import { closePanel,openPanel } from "jsExtension/switchPanel"
const viewDidLoad = () => {
    // 允许被选中，如果不加有一定机率无法触发选中 delegate
    self.tableView.allowsSelection = true
    // 圆角
    self.view.layer.cornerRadius = 10
}


// 每次打开都会执行
const viewWillAppear = () => {
    self.tableView.reloadData()
    let theme = Application.sharedInstance().currentTheme
    self.tableView.backgroundColor = Application.sharedInstance().defaultNotebookColor
    self.textColor = Application.sharedInstance().currentTheme == "Gray" ? UIColor.whiteColor() : UIColor.blackColor()

}

export default {
    viewDidLoad,
    viewWillAppear
}