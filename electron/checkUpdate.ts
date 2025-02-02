/*
 * @Author: Anixuil
 * @Date: 2024-12-31 22:36:35
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-21 17:53:39
 * @Description: 更新检测
 */
import { BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { isFirstRun } from './utils';

// 向渲染进程发送消息 0 更新失败 1 检测中 2 更新中 3 更新完成 4 进度 5 没有新版本
const Message = (mainWindow: BrowserWindow, type: Number, data?: string | number) => {
    const sendData = {
        state: type,
        msg: data || ''
    }
    mainWindow.webContents.send('web-update-message', sendData)
}

// 检测更新
export default (mainWindow: BrowserWindow, db: any) => {

    autoUpdater.autoDownload = false

    // 设置更新地址
    autoUpdater.setFeedURL('https://download.anixuil.top/webstartui/update/')

    // 更新错误
    autoUpdater.on('error', (err) => {
        Message(mainWindow, 0, err.message)
        autoUpdater.removeAllListeners()
    })

    // 检测中
    autoUpdater.on('checking-for-update', () => {
        Message(mainWindow, 1)
    })

    // 没有新版本
    autoUpdater.on('update-not-available', () => {
        Message(mainWindow, 5, '没有新版本')
        // 销毁autoUpdater
        autoUpdater.removeAllListeners()
    })

    // 有可更新版本
    autoUpdater.on('update-available', () => {
        Message(mainWindow, 2)
    })

    // 更新完成
    autoUpdater.on('update-downloaded', async () => {
        Message(mainWindow, 3)
        // 对第一次运行进行更新
        const isFirstRunVal = await isFirstRun(db)
        if (isFirstRunVal) {
            autoUpdater.quitAndInstall(true, true)
            autoUpdater.removeAllListeners()
        } else {
            // 恢复第一次运行
            window.ipcRenderer.invoke('restore-first-run').then(() => {
                autoUpdater.removeAllListeners()
            }).finally(() => {
                autoUpdater.quitAndInstall(true, true)
                autoUpdater.removeAllListeners()
            })
        }
    })

    //应用下载进度条事件
    // autoUpdater.on("download-progress", (progressObj) => {
    //     Message(mainWindow, 4, progressObj.percent)
    // })

    // 更新下载进度
    autoUpdater.on('download-progress', (progress) => {
        mainWindow.webContents.send('web-update-message', progress)
    })

    // 检测
    autoUpdater.checkForUpdates()
}

// 开始更新
export const update = (mainWindow: BrowserWindow) => {
    autoUpdater.downloadUpdate()
}