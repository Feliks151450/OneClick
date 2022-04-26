import handleReceivedEvent from "jsExtension/handleReceivedEvent"
import switchPanel from "jsExtension/switchPanel"
import { getObjCClassDeclar } from "utils/common"
// import { InstMethods, clsMethons,deliverMainPath } from "jsExtension/lifeCycle"
import lifeCycle, { clsMethons, deliverMainPath } from "jsExtension/lifeCycle"
import mnaddon from "../mnaddon.json"

// const inst: InstMembers = {
//   ...InstMethods,
//   ...switchPanel,
//   ...handleReceivedEvent,
// };
const inst: InstMembers = {
  ...lifeCycle,
  ...switchPanel,
  ...handleReceivedEvent
}
// const cls: ClsMembers = {
//   ...clsMethons
// }
const cls: ClsMembers = clsMethons
// JSB.newAddon = (mainPath): WrapperObj<any> => JSB.defineClass(getObjCClassDeclar(mnaddon.title, "JSExtension"), inst, cls);
JSB.newAddon = (mainPath): WrapperObj<any> => {
  deliverMainPath(mainPath)
  return JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"), inst, cls)
}
