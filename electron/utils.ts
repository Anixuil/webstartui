/*
 * @Author: Anixuil
 * @Date: 2025-01-11 11:14:41
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-01-21 17:22:47
 * @Description: 工具函数
 */
import { BrowserWindow } from 'electron'

// 通知渲染进程刷新页面
export function refreshData(win: BrowserWindow | null, msg = '') {
    win?.webContents.send('refresh-data', { msg })
}

// 每次运行时，判断系统是否是第一次运行
export function isFirstRun(db: any) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM sys_table WHERE sys_is_first_run = 0'
        db.all(sql, (err: any, rows: any) => {
            if (err) {
                console.error(err);
                reject(false)
            }
            resolve(!(rows && rows.length > 0))
        })
    })
}
