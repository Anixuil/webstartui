/*
 * @Author: Anixuil
 * @Date: 2024-12-27 11:48:01
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-27 11:48:21
 * @Description: 请填写简介
 */
//获取屏幕缩放比例
function getRatio() {
    var ratio = 0
    var screen: ScreenInfo = window.screen
    var ua = navigator.userAgent.toLowerCase()

    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI
        }
    } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
    ) {
        ratio = window.outerWidth / window.innerWidth
    }

    if (ratio) {
        ratio = Math.round(ratio * 100)
    }
    return ratio
}


export function getScreenInfo() {
    var screen: ScreenInfo = window.screen
    var ua = navigator.userAgent.toLowerCase()
    var info: ScreenInfo = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        ratio: getRatio(),
        // 屏幕分辨率的宽和高
        screenWidth: (screen.width * getRatio()) / 100,
        screenHeight: (screen.height * getRatio()) / 100
    }

    if (~ua.indexOf('msie')) {
        info['deviceXDPI'] = screen.deviceXDPI
        info['logicalXDPI'] = screen.logicalXDPI
    }

    return info
}
