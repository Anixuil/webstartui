import { app as w, BrowserWindow as I, ipcMain as h, dialog as U } from "electron";
import { createRequire as A } from "node:module";
import { fileURLToPath as F } from "node:url";
import g from "node:path";
import P from "node:fs";
const T = A(import.meta.url), b = T("sqlite3"), $ = g.dirname(F(import.meta.url));
process.env.APP_ROOT = g.join($, "..");
const v = process.env.VITE_DEV_SERVER_URL, K = g.join(process.env.APP_ROOT, "dist-electron"), S = g.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = v ? g.join(process.env.APP_ROOT, "public") : S;
let l;
function L() {
  l = new I({
    icon: g.join(process.env.VITE_PUBLIC, "favicon.ico"),
    // 关闭菜单
    autoHideMenuBar: !0,
    webPreferences: {
      preload: g.join($, "preload.mjs")
    },
    width: 1080,
    height: 720
  }), l.webContents.on("did-finish-load", () => {
    l == null || l.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), v ? l.loadURL(v) : l.loadFile(g.join(S, "index.html")), h.handle("open-file-dialog", async () => {
    const { canceled: r, filePaths: e } = await U.showOpenDialog({
      properties: ["openDirectory"]
    });
    return r ? [] : e;
  }), h.handle("getProjectInfoByPath", async (r, e) => {
    try {
      const c = await P.promises.readdir(e);
      let n = {};
      const t = c.find((_) => _ === "package.json");
      if (!t)
        throw new Error("未找到package.json文件");
      const o = e + "/" + t, i = await P.promises.readFile(o, "utf-8"), { name: d, version: a } = JSON.parse(i);
      n = { projectName: d, projectVersion: a };
      const j = ["vue.config.js", "vite.config.js", "vue.config.ts", "vite.config.ts"], f = c.find((_) => j.includes(_));
      if (f) {
        n.projectConfigFileName = f;
        const _ = e + "/" + f, m = await P.promises.readFile(_, "utf-8");
        n.projectConfig = m;
        const C = /port\s*:\s*(\d+)/, O = m.match(C);
        O ? n.projectPort = parseInt(O[1]) : n.projectPort = 8080;
        const N = /dev|serve|start/, R = m.match(N);
        R ? n.projectCommand = `npm run ${R[0]}` : n.projectCommand = "npm run dev";
      } else
        console.log("未找到配置文件");
      return n;
    } catch (c) {
      throw console.error(c), c;
    }
  }), h.handle("db", (r, e) => new Promise(async (c, n) => {
    e.data = k(e.data), e != null && e.condition && (e.condition = k(e.condition)), e.type === "insert" ? (e.data.create_time = (/* @__PURE__ */ new Date()).toLocaleString(), e.data.update_time = (/* @__PURE__ */ new Date()).toLocaleString()) : e.type === "update" && (e.data.update_time = (/* @__PURE__ */ new Date()).toLocaleString());
    try {
      switch (e.type) {
        case "insert":
          if ((await y({
            table: "project_table",
            type: "query",
            data: {
              project_local_url: e.data.project_local_url
            }
          })).length > 0) {
            n("已存在同路径项目，请勿重复添加");
            return;
          }
          const o = e.data.project_local_url + "\\" + e.data.project_config_file_name;
          console.log("configFilePath", o), await P.promises.writeFile(o, e.data.project_config);
          const i = await q(e);
          c(i);
          break;
        case "delete":
          const d = await V(e);
          c(d);
          break;
        case "update":
          if (e.data.project_local_url) {
            const f = await y({
              table: "project_table",
              type: "query",
              data: {
                project_id: e.condition.project_id || e.data.project_id
              }
            });
            if (f.length === 0) {
              n("未找到项目");
              return;
            }
            if (f[0].projectLocalUrl !== e.data.project_local_url)
              e.data.project_status = "0";
            else {
              const _ = e.data.project_local_url + "/" + e.data.project_config_file_name;
              await P.promises.writeFile(_, e.data.project_config);
            }
          }
          const a = await D(e);
          c(a);
          break;
        case "query":
          const j = await y(e);
          c(j);
          break;
        default:
          n("未知数据库操作类型");
          break;
      }
    } catch (t) {
      console.log("err", t), n(t);
    }
  })), h.handle("install", async (r, e) => new Promise((c, n) => {
    try {
      const { projectLocalUrl: t, type: o } = e, { exec: i } = T("child_process"), d = t.split(":")[0];
      i(
        `${d}: && cd ${t} && ${o || "npm"} install`,
        {
          maxBuffer: 1024 * 1024 * 1024
        },
        (a, j, f) => {
          if (a)
            return console.error(`执行出错: ${a.message}`), n(a), a;
          if (f)
            return console.error(`stderr: ${f}`), n(f), f;
          console.log(`stdout: ${j}`), c(!0);
        }
      );
    } catch (t) {
      return console.error(t), n(t), t;
    }
  })), h.handle("openProjectUrl", async (r, e) => {
    const { projectPort: c } = e, { exec: n } = T("child_process");
    n(`start http://localhost:${c}`, (t, o, i) => {
      if (t) {
        console.error(`执行出错: ${t.message}`);
        return;
      }
      if (i) {
        console.error(`stderr: ${i}`);
        return;
      }
    });
  });
  const s = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  function u(r, e) {
    var t, o;
    console.log("Starting port monitor for port:", r);
    const { exec: c } = T("child_process");
    (t = e.stdout) == null || t.on("data", (i) => {
      l == null || l.webContents.send("process-output", {
        port: r,
        output: i.toString()
      });
    }), (o = e.stderr) == null || o.on("data", (i) => {
      l == null || l.webContents.send("process-output", {
        port: r,
        output: i.toString()
      });
    });
    const n = setInterval(() => {
      c(`netstat -ano | findstr :${r}`, (i, d) => {
        if (!i && d) {
          const a = process.memoryUsage(), j = d.toString().split(`
`)[0].trim().split(/\s+/).pop();
          c(
            `wmic path Win32_PerfFormattedData_PerfProc_Process where IDProcess=${j} get PercentProcessorTime`,
            (f, _) => {
              const m = _.toString().split(`
`)[1].trim();
              l == null || l.webContents.send("port-status", {
                port: r,
                status: "active",
                data: d.toString(),
                memoryUsage: {
                  heapUsed: (a == null ? void 0 : a.heapUsed) || 0,
                  heapTotal: (a == null ? void 0 : a.heapTotal) || 0
                },
                cpuUsage: parseInt(m) || 0
              });
            }
          );
        } else
          clearInterval(s.get(r)), s.delete(r), l == null || l.webContents.send("port-status", {
            port: r,
            status: "inactive"
          });
      });
    }, 5e3);
    return s.set(r, n), p.set(r, e), n;
  }
  h.handle("startProject", async (r, e) => new Promise((c, n) => {
    try {
      const { projectLocalUrl: t, projectPort: o, projectCommand: i } = e, { exec: d } = T("child_process");
      d(`netstat -ano | findstr :${o}`, (a, j) => {
        if (j && j.toString().trim()) {
          n(`端口 ${o} 已被占用，请更换端口`);
          return;
        }
        const f = t.split(":")[0], _ = d(
          `${f}: && cd ${t} && ${i || "npm run dev"}`,
          {
            maxBuffer: 1024 * 1024 * 1024
          }
        );
        u(o, _), c(!0);
      });
    } catch (t) {
      n(t);
    }
  })), h.handle("stopProject", async (r, e) => new Promise((c, n) => {
    var t;
    try {
      const { projectPort: o, projectId: i } = e, { exec: d } = T("child_process");
      s.has(o) && (clearInterval(s.get(o)), s.delete(o), (t = p.get(o)) == null || t.kill(), p.delete(o)), d(`netstat -ano | findstr :${o}`, (a, j) => {
        if (!j || !j.toString().trim()) {
          D({
            table: "project_table",
            type: "update",
            data: { project_status: "0" },
            condition: { project_id: i }
          }).then(() => c(!0)).catch(n);
          return;
        }
        const f = Array.from(new Set(
          j.toString().split(`
`).map((_) => _.trim().split(/\s+/).pop()).filter(Boolean)
        ));
        Promise.all(f.map(
          (_) => new Promise((m) => {
            d(`taskkill /F /pid ${_}`, m);
          })
        )).then(() => c(!0)).catch(n);
      });
    } catch (o) {
      n(o);
    }
  }));
}
w.on("window-all-closed", () => {
  process.platform !== "darwin" && (w.quit(), l = null), E.close((s) => {
    s ? console.error(s.message) : console.log("Close the database connection.");
  });
});
w.on("activate", () => {
  I.getAllWindows().length === 0 && L();
});
w.whenReady().then(L);
const X = process.env.NODE_ENV === "development" ? g.join($, "webstartui.db") : g.join(w.getPath("userData"), "webstartui.db"), E = new b.Database(X, b.OPEN_READWRITE | b.OPEN_CREATE, (s) => {
  s ? console.error(s.message) : console.log("Connected to the database.");
});
E.serialize(() => {
  E.run(`CREATE TABLE IF NOT EXISTS project_table (
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
  );`, (s) => {
    s && console.error(s.message);
  });
});
function q(s) {
  return new Promise((p, u) => {
    const { table: r, data: e } = s, c = Object.keys(e), n = Object.values(e);
    let t = `INSERT INTO ${r} (${c.join(",")}) VALUES (${c.map(() => "?").join(",")});`;
    E.run(t, n, function(o) {
      o ? u(o) : p(this.lastID);
    });
  });
}
function V(s) {
  return new Promise((p, u) => {
    const { table: r, data: e } = s, c = Object.keys(e), n = Object.values(e);
    let t = `DELETE FROM ${r} WHERE ${c.map((o) => `${o} = ?`).join(" AND ")};`;
    E.run(t, n, function(o) {
      o ? u(o) : p(this.changes);
    });
  });
}
function D(s) {
  return new Promise((p, u) => {
    const { table: r, data: e } = s, c = Object.keys(e), n = Object.values(e), t = s.condition;
    if (!t) {
      u("缺少条件");
      return;
    }
    const o = Object.keys(t), i = Object.values(t);
    let d = `UPDATE ${r} SET ${c.map((a) => `${a} = ?`).join(",")} WHERE ${o.map((a) => `${a} = ?`).join(" AND ")};`;
    E.run(d, [...n, ...i], function(a) {
      a ? u(a) : p(this.changes);
    });
  });
}
function y(s) {
  return new Promise((p, u) => {
    const { table: r, data: e } = s, c = Object.keys(e), n = Object.values(e);
    let t = "";
    c.length === 0 ? t = `SELECT * FROM ${r};` : t = `SELECT * FROM ${r} WHERE ${c.map((o) => `${o} = ?`).join(" AND ")};`, E.all(t, n, (o, i) => {
      o ? u(o) : (i = i.map((d) => M(d)), p(i));
    });
  });
}
function k(s) {
  const p = {};
  for (const u in s)
    p[u.replace(/([A-Z])/g, "_$1").toLowerCase()] = s[u];
  return p;
}
function M(s) {
  const p = {};
  for (const u in s)
    p[u.replace(/\_(\w)/g, function(r, e) {
      return e.toUpperCase();
    })] = s[u];
  return p;
}
export {
  K as MAIN_DIST,
  S as RENDERER_DIST,
  v as VITE_DEV_SERVER_URL
};
