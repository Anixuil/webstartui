/*
 * @Author: Anixuil
 * @Date: 2024-12-26 17:19:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-02-02 10:52:25
 * @Description: 主线程入口
 */
import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron'
import checkUpdate, { update } from './checkUpdate'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { createWriteStream, WriteStream } from 'fs'
import { isFirstRun, refreshData } from './utils'
import { autoUpdater } from 'electron-updater'
const require = createRequire(import.meta.url)
const sqlite3 = require('sqlite3')
const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface DBParams {
  table: string;
  type: 'insert' | 'delete' | 'update' | 'query';
  sql?: string;
  condition?: { [key: string]: any };
  data: { [key: string]: any };
}
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// 存储项目进程和监控器
interface ProjectProcess {
  process: any;
  monitor: NodeJS.Timeout | null;
  outputBuffer: string[];
  logPath: string;
}

const projectProcesses = new Map<number, ProjectProcess>();

// 添加日志文件流的Map
const logStreams = new Map<number, WriteStream>();

// 添加一个处理 ANSI 转义码的函数
function stripAnsi(str: string): string {
  // 移除 ANSI 转义码
  return str
    .replace(/\x1B\[\d+m/g, '') // 移除颜色代码
    .replace(/\x1B\[[\d;]*[A-Za-z]/g, '') // 移除其他 ANSI 转义序列
    .replace(/\[(\d+m|\d+;\d+m)/g, ''); // 移除残留的颜色代码
}

// 格式化错误对象或特殊输出
function formatOutput(data: string): string {
  try {
    // 检查是否是 JSON 字符串
    if (data.includes('{') && data.includes('}')) {
      try {
        const obj = JSON.parse(data);
        return JSON.stringify(obj, null, 2);
      } catch {
        // 如果不是有效的 JSON，按原样处理
      }
    }

    // 处理常见的错误输出格式
    return data
      .replace(/\],\s*library:/g, '] library:') // 修复错误对象格式
      .replace(/(\w+):\s*'([^']*)'(?=,|\s|$)/g, '$1: $2') // 移除多余的引号
      .replace(/,\s*(?=[a-zA-Z])/g, ', ') // 优化逗号后的空格
      .trim();
  } catch {
    return data;
  }
}

// 添加节流函数
function throttle(func: Function, limit: number) {
  let inThrottle: boolean = false;
  let lastBuffer: string[] = [];
  let timer: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, [...args, lastBuffer]);
      lastBuffer = [];
      inThrottle = true;

      // 清除之前的定时器
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        inThrottle = false;
        if (lastBuffer.length > 0) {
          func.apply(null, [args[0], args[1], lastBuffer]);
          lastBuffer = [];
        }
      }, limit);
    } else {
      lastBuffer.push(args[1]);
    }
  };
}

// 批量写入日志
function batchWriteLog(port: number, data: string, buffer: string[] = []) {
  const process = projectProcesses.get(port);
  if (!process) return;

  const logStream = logStreams.get(port);
  if (logStream && !logStream.destroyed) {
    try {
      // 合并当前数据和缓冲区数据，并进行格式化
      const allData = [data, ...buffer]
        .map(line => {
          const cleanData = stripAnsi(line);
          return formatOutput(cleanData);
        })
        .join('');

      // 使用 WriteStream 的缓冲功能
      logStream.cork();
      logStream.write(allData, (err) => {
        if (err) {
          console.error('写入日志失败:', err);
        }
        process.outputBuffer.push(allData);

        // 发送到渲染进程，实现平滑滚动
        if (win) {
          win.webContents.send('log-update', {
            port,
            data: allData
          });
        }
      });
      // 在下一个事件循环中解除缓冲
      global.process.nextTick(() => {
        logStream.uncork();
      });

      // 定期检查日志行数
      if (Math.random() < 0.05) { // 降低到5%的检查概率
        fs.readFile(process.logPath, 'utf-8', (err, content) => {
          if (err) {
            console.error('读取日志失败:', err);
            return;
          }

          const contentLines = content.split('\n');
          if (contentLines.length > 1000) {
            const newContent = contentLines.slice(-1000).join('\n');
            fs.writeFile(process.logPath, newContent, (err) => {
              if (err) {
                console.error('更新日志失败:', err);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('处理日志失败:', error);
    }
  }
}

// 使用节流的handleProcessOutput，降低到500ms提高响应速度
const throttledHandleProcessOutput = throttle(batchWriteLog, 500);

// 修改 handleProcessOutput 函数
function handleProcessOutput(port: number, data: string) {
  throttledHandleProcessOutput(port, data);
}

// 检查端口是否被占用
async function checkPortOccupied(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    // 只检查127.0.0.1上的端口
    exec(`netstat -ano | findstr "127.0.0.1:${port}"`, (error: any, stdout: string) => {
      resolve(!error && stdout.toString().trim() !== '');
    });
  });
}

// 监控端口状态
function monitorPort(port: number) {
  const process = projectProcesses.get(port);
  if (!process) return;

  const { exec } = require('child_process');

  // 清除已存在的监控器
  if (process.monitor) {
    clearInterval(process.monitor);
  }

  process.monitor = setInterval(async () => {
    try {
      const isActive = await checkPortOccupied(port);
      if (!isActive) {
        clearInterval(process.monitor!);
        projectProcesses.delete(port);
        win?.webContents.send('port-status', {
          port,
          status: 'inactive'
        });
        return;
      }

      // 获取进程性能数据
      const pid = process.process.pid;
      exec(
        `wmic process where ProcessId=${pid} get WorkingSetSize`,
        (error: any, memoryData: string) => {
          if (error) return;

          exec(
            `wmic path Win32_PerfFormattedData_PerfProc_Process where IDProcess=${pid} get PercentProcessorTime`,
            (error: any, cpuData: string) => {
              if (error) return;

              const memoryUsage = parseInt(memoryData.toString().split('\n')[1].trim()) || 0;
              const cpuUsage = parseInt(cpuData.toString().split('\n')[1].trim()) || 0;

              if (win) {
                win.webContents.send('port-status', {
                  port,
                  status: 'active',
                  memoryUsage: {
                    heapUsed: memoryUsage,
                    heapTotal: memoryUsage,
                  },
                  cpuUsage
                });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error(`监控端口 ${port} 时发生错误:`, error);
    }
  }, 5000);
}

async function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    // 关闭菜单
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    width: 1080,
    height: 720,
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    autoUpdater.forceDevUpdateConfig = true;
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  win.webContents.openDevTools()

  // 是否是第一次运行
  ipcMain.handle('is-first-run', async () => {
    const isFirstRunVal = await isFirstRun(db)
    // 如果是第一次运行，则存入数据库
    if (isFirstRunVal) {
      // 先查询sys_table是否有数据，有则更新，没有则插入
      const sysData = await queryData({
        table: 'sys_table',
        type: 'query',
        data: {}
      })
      if (sysData.length > 1) {
        // 删除除了第一条以外的数据
        for (let i = 1; i < sysData.length; i++) {
          await deleteData({ table: 'sys_table', type: 'delete', data: { sys_id: sysData[i].sysId } })
        }
        // 更新第一条数据
        updateData({ table: 'sys_table', type: 'update', data: { sys_is_first_run: 0 }, condition: { sys_id: sysData[0].sysId } })
      } else if (sysData.length === 1) {
        // 更新第一条数据
        updateData({ table: 'sys_table', type: 'update', data: { sys_is_first_run: 0 }, condition: { sys_id: sysData[0].sysId } })
      } else if (sysData.length === 0) {
        insertData({ table: 'sys_table', type: 'insert', data: { sys_is_first_run: 0 } })
      }
    }
    return isFirstRunVal
  })

  // 取消更新
  ipcMain.handle('auto-update-cancel', async () => {
    return new Promise(async (resolve, reject) => {
      // 停止下载
      autoUpdater.removeAllListeners()
      // 重启
      app.relaunch()
      app.exit()
      resolve(true)
    })
  })

  // 恢复第一次运行
  ipcMain.handle('restore-first-run', async () => {
    return new Promise(async (resolve, reject) => {
      const isFirstRunVal = await isFirstRun(db)
      if (isFirstRunVal) {
        const sysData = await queryData({
          table: 'sys_table',
          type: 'query',
          data: {}
        })
        if (sysData.length > 1) {
          // 删除除了第一条以外的数据
          for (let i = 1; i < sysData.length; i++) {
            await deleteData({ table: 'sys_table', type: 'delete', data: { sys_id: sysData[i].sys_id } })
          }
          // 更新第一条数据
          updateData({ table: 'sys_table', type: 'update', data: { sys_is_first_run: 1 }, condition: { sys_id: sysData[0].sys_id } })
          resolve(true)
        } else if (sysData.length === 1) {
          updateData({ table: 'sys_table', type: 'update', data: { sys_is_first_run: 1 }, condition: { sys_id: sysData[0].sys_id } })
          resolve(true)
        } else {
          reject(false)
        }
      } else {
        reject(false)
      }
    })
  })

  // 更新日志
  ipcMain.on('update-log', async (event, params: { mode: string }) => {
    switch (params.mode) {
      case 'open':
        win?.webContents.send('update-log', { mode: params.mode });
        break;
    }
  })

  // 自动更新
  ipcMain.handle('auto-check-update', () => {
    if (!win) return false;
    // 检测更新
    checkUpdate(win, db)
    return true
  })

  // 更新
  ipcMain.handle('auto-update', () => {
    if (!win) return false;
    // 更新
    update(win)
    return true
  })

  // 选择文件对话框
  ipcMain.handle("open-file-dialog", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (canceled) {
      return [];
    }
    return filePaths;
  })

  // 根据文件路径获取信息
  ipcMain.handle('getProjectInfoByPath', (event, path: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const files = await fs.promises.readdir(path);
        let info: {
          projectName?: string;
          projectVersion?: string;
          projectConfig?: string;
          projectPort?: number;
          projectCommand?: string;
          projectConfigFileName?: string;
        } = {}

        // 找到package.json文件
        const packageJson = files.find(file => file === 'package.json');
        if (!packageJson) {
          // throw new Error('未找到package.json文件');
          reject('未找到package.json文件');
          return;
        }

        // 读取package.json文件
        const packageJsonPath = path + '/' + packageJson;
        const packageJsonData = await fs.promises.readFile(packageJsonPath, 'utf-8');
        const { name, version } = JSON.parse(packageJsonData);
        info = { projectName: name, projectVersion: version };

        // 找到vue.config.js或者vite.config.js文件或者vue.config.ts或者vite.config.ts文件
        const configFiles = ['vue.config.js', 'vite.config.js', 'vue.config.ts', 'vite.config.ts'];
        const configFile = files.find(file => configFiles.includes(file));
        if (configFile) {
          info.projectConfigFileName = configFile;
          const configFilePath = path + '/' + configFile;
          const configData = await fs.promises.readFile(configFilePath, 'utf-8');
          info.projectConfig = configData;
          // 找到端口号 如果没有找到端口号，根据项目类型设置默认端口号 端口得是number类型
          const portReg = /port\s*:\s*(\d+)/;
          const port = configData.match(portReg);
          if (port) {
            info.projectPort = parseInt(port[1]);
          } else {
            info.projectPort = 8080;
          }
          // 找到scripts中的dev || serve || start命令 给优先找到的命令拼上 npm run
          const commandReg = /dev|serve|start/;
          const command = configData.match(commandReg);
          if (command) {
            info.projectCommand = `npm run ${command[0]}`;
          } else {
            info.projectCommand = 'npm run dev';
          }
        } else {
          console.log('未找到配置文件');
        }
        // return info;
        resolve(info);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    })
  })

  // 数据库操作
  ipcMain.handle('db', (event, params) => {
    return new Promise(async (resolve, reject) => {
      params.data = toLine(params.data);  // 对象所有驼峰字段转为下划线字段
      if (params?.condition) {
        params.condition = toLine(params.condition);  // 对象所有驼峰字段转为下划线字段
      }
      // 加上创建时间和更新时间
      if (params.type === 'insert') {
        params.data.create_time = new Date().toLocaleString();
        params.data.update_time = new Date().toLocaleString();
      } else if (params.type === 'update') {
        // 如果projectStatus为1，则更新update_time为当前时间，如果projectStatus为0，则不更新update_time
        if (params.data.project_status == '1') {
          params.data.update_time = new Date().toLocaleString();
        }
      }
      try {
        switch (params.type) {
          case 'insert':
            // 插入数据时，检测projectLocalUrl是否已存在，如果已存在，不允许插入
            const project: any[] = await queryData({
              table: 'project_table',
              type: 'query',
              data: {
                project_local_url: params.data.project_local_url
              }
            });
            if (project.length > 0) {
              reject('已存在同路径项目，请勿重复添加');
              return;
            }
            // 插入数据时，同时对项目地址下的配置文件进行写入
            const configFilePath = params.data.project_local_url + '\\' + params.data.project_config_file_name;
            console.log('configFilePath', configFilePath);

            await fs.promises.writeFile(configFilePath, params.data.project_config);
            const id = await insertData(params);
            resolve(id);
            break;
          case 'delete':
            const count = await deleteData(params);
            resolve(count);
            break;
          case 'update':
            // 更新数据时，如果是项目一些配置信息变动，比如projectPort,projectConfig,projectBackendUrl，需要对比项目地址是否变动，如果变动，需要更新项目状态为未启动，如果未变动，则需要进入项目地址下更换配置文件的端口号，以及整个配置文件
            if (params.data.project_local_url) {
              const project: any[] = await queryData({
                table: 'project_table',
                type: 'query',
                data: {
                  project_id: params.condition.project_id || params.data.project_id
                }
              });
              if (project.length === 0) {
                reject('未找到项目');
                return;
              }
              if (project[0].projectLocalUrl !== params.data.project_local_url) {
                params.data.project_status = '0';
              } else {
                // 更换配置文件
                const configFilePath = params.data.project_local_url + '/' + params.data.project_config_file_name;
                await fs.promises.writeFile(configFilePath, params.data.project_config);
              }
            }
            const updateCount = await updateData(params);
            resolve(updateCount);
            break;
          case 'query':
            const data = await queryData(params);
            resolve(data);
            break;
          default:
            reject('未知数据库操作类型');
            break;
        }
      } catch (err) {
        console.log('err', err);
        reject(err);
      }
    })
  })

  // 安装依赖
  ipcMain.handle('install', async (event, params) => {
    return new Promise((resolve, reject) => {
      try {
        const { projectLocalUrl, type } = params;
        const { exec } = require('child_process');
        // 获取项目在哪个盘符下，切换到该盘符下，执行npm install
        const disk = projectLocalUrl.split(':')[0];
        exec(`${disk}: && cd ${projectLocalUrl} && ${type || 'npm'} install`,
          {
            maxBuffer: 1024 * 1024 * 1024
          },
          (error: any, stdout: any, stderr: any) => {
            if (error) {
              console.error(`执行出错: ${error.message}`);
              reject(error);
              return error;
            }
            if (stderr) {
              console.error(`stderr: ${stderr}`);
              reject(stderr);
              return stderr;
            }
            console.log(`stdout: ${stdout}`);
            resolve(true)
          });
      } catch (err) {
        console.error(err);
        reject(err);
        return err;
      }
    })

  })

  // 打开项目地址
  ipcMain.handle('openProjectUrl', async (event, params) => {
    // 用浏览器打开项目地址 http://localhost:port
    const { projectPort } = params;
    const { exec } = require('child_process');
    exec(`start http://localhost:${projectPort}`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`执行出错: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      // console.log(`stdout: ${stdout}`);
    });
  })

  // 启动项目
  ipcMain.handle('startProject', async (event, params) => {
    const { projectLocalUrl, projectPort, projectCommand, projectName, projectId } = params;

    try {
      // 检查端口占用
      const isOccupied = await checkPortOccupied(projectPort);
      if (isOccupied) {
        throw new Error(`端口 ${projectPort} 已被占用，请更换端口`);
      }

      // 创建日志目录和文件
      const logDir = path.join(app.getPath('userData'), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const logPath = path.join(logDir, `${projectName}.log`);
      console.log('日志文件目录', logPath);


      // 创建日志写入流
      const logStream = createWriteStream(logPath, {
        flags: 'w',
        encoding: 'utf8',
        highWaterMark: 64 * 1024,
        autoClose: true
      });

      // 错误处理
      logStream.on('error', (error) => {
        console.error('日志写入流错误:', error);
        win?.webContents.send('process-output', {
          port: projectPort,
          output: `日志写入错误: ${error.message}`
        });
      });

      // 启动子进程
      const { spawn } = require('child_process');
      const disk = projectLocalUrl.split(':')[0];
      const child = spawn('cmd.exe', [
        '/c',
        `${disk}: && cd "${projectLocalUrl}" && ${projectCommand || 'npm run dev'}`
      ], {
        shell: true,
        maxBuffer: 1024 * 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: '1' }
      });

      // 存储进程信息
      projectProcesses.set(projectPort, {
        process: child,
        monitor: null,
        outputBuffer: [],
        logPath
      });
      logStreams.set(projectPort, logStream);

      // 处理输出
      const handleOutput = (data: Buffer) => {
        handleProcessOutput(projectPort, data.toString())
      };

      child.stdout.on('data', handleOutput);
      child.stderr.on('data', handleOutput);

      // 处理进程退出
      child.on('exit', async (code: number) => {
        console.log('exit', code);

        try {
          if (code !== 0) {
            const errorMsg = `进程异常退出，退出码: ${code}`;
            handleProcessOutput(projectPort, errorMsg);
          }

          // 关闭日志流
          const logStream = logStreams.get(projectPort);
          if (logStream && !logStream.destroyed) {
            await new Promise<void>((resolve) => {
              setTimeout(() => {
                logStream.end(() => {
                  logStreams.delete(projectPort);
                  resolve();
                });
              }, 1000);
            });
          }

          // 更新项目状态
          await updateData({
            table: 'project_table',
            type: 'update',
            data: { project_status: '0' },
            condition: { project_id: projectId }
          });

          // 清理进程信息
          projectProcesses.delete(projectPort);

          // 通知渲染进程
          refreshData(win, code !== 0 ? '项目关闭，如有疑问请查看日志' : '项目已停止');
        } catch (error) {
          console.error('项目关闭', error);
        }
      });

      // 启动监控
      // monitorPort(projectPort);

      return true;
    } catch (err) {
      console.error('启动项目失败:', err);
      throw err;
    }
  });

  // 停止项目
  ipcMain.handle('stopProject', async (event, params) => {
    const { projectPort, projectId } = params;

    try {
      const processInfo = projectProcesses.get(projectPort);
      if (processInfo) {
        // 关闭日志流
        const logStream = logStreams.get(projectPort);
        if (logStream && !logStream.destroyed) {
          await new Promise<void>((resolve) => {
            logStream.end(() => {
              logStreams.delete(projectPort);
              resolve();
            });
          });
        }

        // 结束进程树
        const { spawn } = require('child_process');
        spawn('taskkill', ['/pid', processInfo.process.pid, '/f', '/t']);

        projectProcesses.delete(projectPort);
      }

      // 更新项目状态
      await updateData({
        table: 'project_table',
        type: 'update',
        data: { project_status: '0' },
        condition: { project_id: projectId }
      });

      return true;
    } catch (err) {
      console.error('停止项目失败:', err);
      throw err;
    }
  });

  // 修改readProjectLog处理函数
  ipcMain.handle('readProjectLog', async (event, params) => {
    const { projectName, lastPosition = 0 } = params;
    const logDir = path.join(app.getPath('userData'), 'logs');
    const logPath = path.join(logDir, `${projectName}.log`);

    try {
      if (!fs.existsSync(logPath)) {
        return { content: '', position: 0 };
      }

      const stats = await fs.promises.stat(logPath);
      const fileSize = stats.size;

      // 如果lastPosition为0或大于文件大小,则从头读取
      if (lastPosition === 0 || lastPosition > fileSize) {
        const content = await fs.promises.readFile(logPath, 'utf-8');
        return {
          content,
          position: fileSize
        };
      }

      // 否则只读取新增的部分
      const handle = await fs.promises.open(logPath, 'r');
      const buffer = Buffer.alloc(fileSize - lastPosition);
      await handle.read(buffer, 0, fileSize - lastPosition, lastPosition);
      await handle.close();

      return {
        content: buffer.toString('utf-8'),
        position: fileSize
      };
    } catch (err) {
      console.error('读取日志文件失败:', err);
      return { content: '', position: 0 };
    }
  });

  // 设置最大监听器数量
  ipcMain.setMaxListeners(20);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
  db.close((err: any) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Close the database connection.');
    }
  })
})

// 激活窗口
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 检测更新
app.whenReady().then(createWindow)

// sqlite 数据库操作
// 数据库文件路径 如果是开发环境，数据库文件路径为项目根目录下的webstartui.db 如果是生产环境，数据库文件路径为用户数据目录下的webstartui.db
const dbPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, 'webstartui.db') : path.join(app.getPath('userData'), 'webstartui.db');
// console.log('dbPath', dbPath);

// 打开数据库
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: any) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
})

// 创建表
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS project_table (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT, -- 项目id
    project_name TEXT NOT NULL, -- 项目名称
    project_local_url TEXT NOT NULL, -- 项目路径
    project_git_url TEXT, -- 项目git地址
    project_branch TEXT, -- 项目分支
    project_version TEXT, -- 项目版本
    project_config TEXT, -- 项目配置
    project_desc TEXT, -- 项目描述
    project_type TEXT, -- 项目类型
    /**
     * @description: 
     * @return {*}
     */
    project_status TEXT, -- 项目状态
    project_port TEXT, -- 项目端口
    project_command TEXT, -- 项目启动命令
    project_config_file_name TEXT, -- 项目配置文件名
    project_backend_url TEXT, -- 项目后端地址
    create_time datetime, -- 创建时间
    update_time datetime -- 更新时间
  );
  `, (err: any) => {
    if (err) {
      console.error(err.message);
    }
  })
  db.run(`CREATE TABLE IF NOT EXISTS sys_table (
    sys_id INTEGER PRIMARY KEY AUTOINCREMENT, -- 系统id
    sys_is_first_run BOOLEAN DEFAULT true, -- 是否是第一次运行
    sys_version TEXT, -- 系统版本
    sys_update_time datetime -- 系统更新时间
  );`, (err: any) => {
    if (err) {
      console.error(err.message);
    }
  })
})

// 封装通用的数据库增删改查操作方法
// 插入数据
function insertData(params: DBParams) {
  return new Promise((resolve, reject) => {
    const { table, data } = params;
    const keys = Object.keys(data);
    const values = Object.values(data);
    let sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')});`;
    db.run(sql, values, function (this: any, err: any) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    })
  })
}

// 删除数据
function deleteData(params: DBParams) {
  return new Promise((resolve, reject) => {
    const { table, data } = params;
    const keys = Object.keys(data);
    const values = Object.values(data);
    let sql = `DELETE FROM ${table} WHERE ${keys.map((key) => `${key} = ?`).join(' AND ')};`;
    db.run(sql, values, function (this: any, err: any) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    })
  })
}

// 更新数据
function updateData(params: DBParams) {
  return new Promise((resolve, reject) => {
    const { table, data } = params;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const condition = params.condition;
    if (!condition) {
      reject('缺少条件');
      return
    }
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    let sql = `UPDATE ${table} SET ${keys.map((key) => `${key} = ?`).join(',')} WHERE ${conditionKeys.map((key) => `${key} = ?`).join(' AND ')};`;
    db.run(sql, [...values, ...conditionValues], function (this: any, err: any) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    })
  })
}

// 查询数据
function queryData(params: DBParams): Promise<any> {
  return new Promise((resolve, reject) => {
    const { table, data } = params;
    const keys = Object.keys(data);
    const values = Object.values(data);
    let sql = ''
    if (keys.length === 0) {
      sql = `SELECT * FROM ${table};`;
    } else {
      sql = `SELECT * FROM ${table} WHERE ${keys.map((key) => `${key} = ?`).join(' AND ')};`;
    }
    db.all(sql, values, (err: any, rows: any) => {
      if (err) {
        reject(err);
      } else {
        rows = rows.map((row: any) => toHump(row));
        resolve(rows);
      }
    })
  })
}

// 对对象所有驼峰字段转为下划线字段
function toLine(obj: { [key: string]: any }) {
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    newObj[key.replace(/([A-Z])/g, "_$1").toLowerCase()] = obj[key];
  }
  return newObj;
}

// 对象所有下划线字段转为驼峰字段
function toHump(obj: { [key: string]: any }) {
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    newObj[key.replace(/\_(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    })] = obj[key];
  }
  return newObj;
}