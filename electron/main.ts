/*
 * @Author: Anixuil
 * @Date: 2024-12-26 17:19:21
 * @LastEditors: Anixuil
 * @LastEditTime: 2024-12-29 23:47:29
 * @Description: 主线程入口
 */
import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
// import { sqlite3 } from 'sqlite3'
// import * as sqlite3 from 'sqlite3'
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

function createWindow() {
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

  // globalShortcut.register('Alt+F4', () => {
  //   console.log('Alt+F4 is pressed');
  // })
  // globalShortcut.register('CmdOrCtrl+Q', () => {
  //   console.log('CmdOrCtrl+Q is pressed');
  // })
  // globalShortcut.register('Alt', () => {
  //   console.log('Alt is pressed');
  // })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  // win.webContents.openDevTools()

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
  ipcMain.handle('getProjectInfoByPath', async (event, path: string) => {
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
        throw new Error('未找到package.json文件');
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
      return info;
    } catch (err) {
      console.error(err);
      throw err;
    }
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
        params.data.update_time = new Date().toLocaleString();
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

  // Store port monitors and processes
  const portMonitors = new Map<number, any>();
  const processOutputs = new Map<number, any>();


  // Monitor port function
  function monitorPort(port: number, child: any) {
    console.log('Starting port monitor for port:', port);
    const { exec } = require('child_process');
    // Store process output
    child.stdout?.on('data', (data: string) => {
      win?.webContents.send('process-output', {
        port,
        output: data.toString()
      });
    });

    child.stderr?.on('data', (data: string) => {
      win?.webContents.send('process-output', {
        port,
        output: data.toString()
      });
    });

    const monitor = setInterval(() => {
      exec(`netstat -ano | findstr :${port}`, (error: any, stdout: string) => {
        if (!error && stdout) {
          // console.log('stdout', stdout);

          const usage = process.memoryUsage();
          // Get CPU usage for the process
          const pid = stdout.toString()
            .split('\n')[0]
            .trim()
            .split(/\s+/)
            .pop();

          exec(`wmic path Win32_PerfFormattedData_PerfProc_Process where IDProcess=${pid} get PercentProcessorTime`,
            (error: any, cpuData: string) => {
              const cpuUsage = cpuData.toString()
                .split('\n')[1]
                .trim();

              win?.webContents.send('port-status', {
                port,
                status: 'active',
                data: stdout.toString(),
                memoryUsage: {
                  heapUsed: usage?.heapUsed || 0,
                  heapTotal: usage?.heapTotal || 0,
                },
                cpuUsage: parseInt(cpuUsage) || 0
              });
            });
        } else {
          clearInterval(portMonitors.get(port));
          portMonitors.delete(port);
          win?.webContents.send('port-status', {
            port,
            status: 'inactive'
          });
        }
      });
    }, 5000);

    portMonitors.set(port, monitor);
    processOutputs.set(port, child);
    return monitor;
  }

  // 启动项目
  ipcMain.handle('startProject', async (event, params) => {
    return new Promise((resolve, reject) => {
      try {
        const { projectLocalUrl, projectPort, projectCommand } = params;
        const { exec } = require('child_process');

        exec(`netstat -ano | findstr :${projectPort}`, (error: any, stdout: string) => {
          if (stdout && stdout.toString().trim()) {
            reject(`端口 ${projectPort} 已被占用，请更换端口`);
            return;
          }

          const disk = projectLocalUrl.split(':')[0];
          const child = exec(`${disk}: && cd ${projectLocalUrl} && ${projectCommand || 'npm run dev'}`,
            {
              maxBuffer: 1024 * 1024 * 1024
            });

          // setTimeout(() => {
          monitorPort(projectPort, child);
          resolve(true);
          // }, 2000);
        });
      } catch (err) {
        reject(err);
      }
    });
  })

  // 停止项目
  ipcMain.handle('stopProject', async (event, params) => {
    return new Promise((resolve, reject) => {
      try {
        const { projectPort, projectId } = params;
        const { exec } = require('child_process');

        // Stop monitoring and kill process
        if (portMonitors.has(projectPort)) {
          clearInterval(portMonitors.get(projectPort));
          portMonitors.delete(projectPort);
          processOutputs.get(projectPort)?.kill();
          processOutputs.delete(projectPort);
        }

        exec(`netstat -ano | findstr :${projectPort}`, (error: any, stdout: string) => {
          if (!stdout || !stdout.toString().trim()) {
            updateData({
              table: 'project_table',
              type: 'update',
              data: { project_status: '0' },
              condition: { project_id: projectId }
            }).then(() => resolve(true))
              .catch(reject);
            return;
          }

          const pids = Array.from(new Set(
            stdout.toString()
              .split('\n')
              .map(line => line.trim().split(/\s+/).pop())
              .filter(Boolean)
          ));

          Promise.all(pids.map(pid =>
            new Promise((resolve) => {
              exec(`taskkill /F /pid ${pid}`, resolve);
            })
          )).then(() => resolve(true))
            .catch(reject);
        });
      } catch (err) {
        reject(err);
      }
    });
  })

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

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

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
    project_status TEXT, -- 项目状态
    project_port TEXT, -- 项目端口
    project_command TEXT, -- 项目启动命令
    project_config_file_name TEXT, -- 项目配置文件名
    project_backend_url TEXT, -- 项目后端地址
    create_time datetime, -- 创建时间
    update_time datetime -- 更新时间
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