import Pt, { app as tt, BrowserWindow as ll, ipcMain as Se, dialog as Cf } from "electron";
import cl from "events";
import Hn from "crypto";
import ul from "tty";
import ho from "util";
import jr from "os";
import Et, { createWriteStream as bf } from "fs";
import qn from "stream";
import nn from "url";
import $f from "string_decoder";
import Of from "constants";
import fl from "assert";
import ie from "path";
import Br from "child_process";
import dl from "zlib";
import Rf from "http";
import { createRequire as If } from "node:module";
import { fileURLToPath as Pf } from "node:url";
import Pe from "node:path";
import xe from "node:fs";
var He = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, yi = {}, pe = {}, ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.CancellationError = ht.CancellationToken = void 0;
const Nf = cl;
class Df extends Nf.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new zi());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let a = null;
      if (r = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new zi());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
ht.CancellationToken = Df;
class zi extends Error {
  constructor() {
    super("cancelled");
  }
}
ht.CancellationError = zi;
var Ce = {}, Xi = { exports: {} }, fr = { exports: {} }, vi, ua;
function Ff() {
  if (ua) return vi;
  ua = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  vi = function(f, c) {
    c = c || {};
    var h = typeof f;
    if (h === "string" && f.length > 0)
      return a(f);
    if (h === "number" && isFinite(f))
      return c.long ? l(f) : s(f);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(f)
    );
  };
  function a(f) {
    if (f = String(f), !(f.length > 100)) {
      var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        f
      );
      if (c) {
        var h = parseFloat(c[1]), p = (c[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(f) {
    var c = Math.abs(f);
    return c >= r ? Math.round(f / r) + "d" : c >= n ? Math.round(f / n) + "h" : c >= t ? Math.round(f / t) + "m" : c >= e ? Math.round(f / e) + "s" : f + "ms";
  }
  function l(f) {
    var c = Math.abs(f);
    return c >= r ? d(f, c, r, "day") : c >= n ? d(f, c, n, "hour") : c >= t ? d(f, c, t, "minute") : c >= e ? d(f, c, e, "second") : f + " ms";
  }
  function d(f, c, h, p) {
    var y = c >= h * 1.5;
    return Math.round(f / h) + " " + p + (y ? "s" : "");
  }
  return vi;
}
var wi, fa;
function hl() {
  if (fa) return wi;
  fa = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = d, r.disable = s, r.enable = o, r.enabled = l, r.humanize = Ff(), r.destroy = f, Object.keys(t).forEach((c) => {
      r[c] = t[c];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(c) {
      let h = 0;
      for (let p = 0; p < c.length; p++)
        h = (h << 5) - h + c.charCodeAt(p), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(c) {
      let h, p = null, y, T;
      function w(...A) {
        if (!w.enabled)
          return;
        const $ = w, x = Number(/* @__PURE__ */ new Date()), k = x - (h || x);
        $.diff = k, $.prev = h, $.curr = x, h = x, A[0] = r.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let G = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (R, F) => {
          if (R === "%%")
            return "%";
          G++;
          const E = r.formatters[F];
          if (typeof E == "function") {
            const M = A[G];
            R = E.call($, M), A.splice(G, 1), G--;
          }
          return R;
        }), r.formatArgs.call($, A), ($.log || r.log).apply($, A);
      }
      return w.namespace = c, w.useColors = r.useColors(), w.color = r.selectColor(c), w.extend = i, w.destroy = r.destroy, Object.defineProperty(w, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (y !== r.namespaces && (y = r.namespaces, T = r.enabled(c)), T),
        set: (A) => {
          p = A;
        }
      }), typeof r.init == "function" && r.init(w), w;
    }
    function i(c, h) {
      const p = r(this.namespace + (typeof h > "u" ? ":" : h) + c);
      return p.log = this.log, p;
    }
    function o(c) {
      r.save(c), r.namespaces = c, r.names = [], r.skips = [];
      const h = (typeof c == "string" ? c : "").trim().replace(" ", ",").split(",").filter(Boolean);
      for (const p of h)
        p[0] === "-" ? r.skips.push(p.slice(1)) : r.names.push(p);
    }
    function a(c, h) {
      let p = 0, y = 0, T = -1, w = 0;
      for (; p < c.length; )
        if (y < h.length && (h[y] === c[p] || h[y] === "*"))
          h[y] === "*" ? (T = y, w = p, y++) : (p++, y++);
        else if (T !== -1)
          y = T + 1, w++, p = w;
        else
          return !1;
      for (; y < h.length && h[y] === "*"; )
        y++;
      return y === h.length;
    }
    function s() {
      const c = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), c;
    }
    function l(c) {
      for (const h of r.skips)
        if (a(c, h))
          return !1;
      for (const h of r.names)
        if (a(c, h))
          return !0;
      return !1;
    }
    function d(c) {
      return c instanceof Error ? c.stack || c.message : c;
    }
    function f() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return wi = e, wi;
}
var da;
function xf() {
  return da || (da = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const d = "color: " + this.color;
      l.splice(1, 0, d, "color: inherit");
      let f = 0, c = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (f++, h === "%c" && (c = f));
      }), l.splice(c, 0, d);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = hl()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(fr, fr.exports)), fr.exports;
}
var dr = { exports: {} }, _i, ha;
function Lf() {
  return ha || (ha = 1, _i = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), _i;
}
var Ti, pa;
function Uf() {
  if (pa) return Ti;
  pa = 1;
  const e = jr, t = ul, n = Lf(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, d) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !d && i === void 0)
      return 0;
    const f = i || 0;
    if (r.TERM === "dumb")
      return f;
    if (process.platform === "win32") {
      const c = e.release().split(".");
      return Number(c[0]) >= 10 && Number(c[2]) >= 10586 ? Number(c[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((c) => c in r) || r.CI_NAME === "codeship" ? 1 : f;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const c = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return c >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : f;
  }
  function s(l) {
    const d = a(l, l && l.isTTY);
    return o(d);
  }
  return Ti = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Ti;
}
var ma;
function kf() {
  return ma || (ma = 1, function(e, t) {
    const n = ul, r = ho;
    t.init = f, t.log = s, t.formatArgs = o, t.save = l, t.load = d, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Uf();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, p) => {
      const y = p.substring(6).toLowerCase().replace(/_([a-z])/g, (w, A) => A.toUpperCase());
      let T = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(T) ? T = !0 : /^(no|off|false|disabled)$/i.test(T) ? T = !1 : T === "null" ? T = null : T = Number(T), h[y] = T, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: p, useColors: y } = this;
      if (y) {
        const T = this.color, w = "\x1B[3" + (T < 8 ? T : "8;5;" + T), A = `  ${w};1m${p} \x1B[0m`;
        h[0] = A + h[0].split(`
`).join(`
` + A), h.push(w + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + p + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function d() {
      return process.env.DEBUG;
    }
    function f(h) {
      h.inspectOpts = {};
      const p = Object.keys(t.inspectOpts);
      for (let y = 0; y < p.length; y++)
        h.inspectOpts[p[y]] = t.inspectOpts[p[y]];
    }
    e.exports = hl()(t);
    const { formatters: c } = e.exports;
    c.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, c.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(dr, dr.exports)), dr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Xi.exports = xf() : Xi.exports = kf();
var Mf = Xi.exports, rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.newError = jf;
function jf(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.ProgressCallbackTransform = void 0;
const Bf = qn;
class Hf extends Bf.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Gn.ProgressCallbackTransform = Hf;
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.DigestTransform = Ce.HttpExecutor = Ce.HttpError = void 0;
Ce.createHttpError = Ki;
Ce.parseJson = Kf;
Ce.configureRequestOptionsFromUrl = ml;
Ce.configureRequestUrl = mo;
Ce.safeGetHeader = Kt;
Ce.configureRequestOptions = Rr;
Ce.safeStringifyJson = Ir;
const qf = Hn, Gf = Mf, Vf = Et, Wf = qn, pl = nn, Yf = ht, ga = rn, zf = Gn, pn = (0, Gf.default)("electron-builder");
function Ki(e, t = null) {
  return new po(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Ir(e.headers), t);
}
const Xf = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class po extends Error {
  constructor(t, n = `HTTP error: ${Xf.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ce.HttpError = po;
function Kf(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Or {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new Yf.CancellationToken(), r) {
    Rr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      pn(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, n, (a) => a.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return pn.enabled && pn(`Request: ${Ir(t)}`), n.createPromise((o, a, s) => {
      const l = this.createRequest(t, (d) => {
        try {
          this.handleResponse(d, t, n, o, a, i, r);
        } catch (f) {
          a(f);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (d) => {
        this.doApiRequest(d, n, r, i).then(o).catch(a);
      }), r(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, a, s) {
    var l;
    if (pn.enabled && pn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Ir(n)}`), t.statusCode === 404) {
      o(Ki(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, f = d >= 300 && d < 400, c = Kt(t, "location");
    if (f && c != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Or.prepareRedirectUrlOptions(c, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (p) => h += p), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const p = Kt(t, "content-type"), y = p != null && (Array.isArray(p) ? p.find((T) => T.includes("json")) != null : p.includes("json"));
          o(Ki(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${y ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (p) {
        o(p);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const a = [], s = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      mo(t, s), Rr(s), this.doDownload(s, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, d) => {
          let f = 0;
          l.on("data", (c) => {
            if (f += c.length, f > 524288e3) {
              d(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(c);
          }), l.on("end", () => {
            d(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const a = Kt(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(Or.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? Qf(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = ml(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = new pl.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return r;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof po && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ce.HttpExecutor = Or;
function ml(e, t) {
  const n = Rr(t);
  return mo(new pl.URL(e), n), n;
}
function mo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ji extends Wf.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, qf.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, ga.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ga.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ce.DigestTransform = Ji;
function Jf(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Kt(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function Qf(e, t) {
  if (!Jf(Kt(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = Kt(t, "content-length");
    a != null && n.push(new zf.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Ji(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Ji(e.options.sha2, "sha256", "hex"));
  const i = (0, Vf.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const a of n)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Rr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Ir(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.githubUrl = Zf;
Hr.getS3LikeProviderBaseUrl = ed;
function Zf(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function ed(e) {
  const t = e.provider;
  if (t === "s3")
    return td(e);
  if (t === "spaces")
    return nd(e);
  throw new Error(`Not supported provider: ${t}`);
}
function td(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return gl(t, e.path);
}
function gl(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function nd(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return gl(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
go.parseDn = rd;
function rd(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? r += e[a] : (a++, r += String.fromCharCode(l));
        continue;
      }
      if (n === null && s === "=") {
        n = r, r = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (r.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    r += s;
  }
  return o;
}
var Qt = {};
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.nil = Qt.UUID = void 0;
const El = Hn, yl = rn, id = "options.name must be either a string or a Buffer", Ea = (0, El.randomBytes)(16);
Ea[0] = Ea[0] | 1;
const Sr = {}, J = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Sr[t] = e, J[e] = t;
}
class Nt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Nt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return od(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = ad(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Sr[t[14] + t[15]] & 240) >> 4,
        variant: ya((Sr[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: ya((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, yl.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = Sr[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
Qt.UUID = Nt;
Nt.OID = Nt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function ya(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Rn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Rn || (Rn = {}));
function od(e, t, n, r, i = Rn.ASCII) {
  const o = (0, El.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, yl.newError)(id, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Rn.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Rn.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new Nt(s);
      break;
    default:
      l = J[s[0]] + J[s[1]] + J[s[2]] + J[s[3]] + "-" + J[s[4]] + J[s[5]] + "-" + J[s[6] & 15 | n] + J[s[7]] + "-" + J[s[8] & 63 | 128] + J[s[9]] + "-" + J[s[10]] + J[s[11]] + J[s[12]] + J[s[13]] + J[s[14]] + J[s[15]];
      break;
  }
  return l;
}
function ad(e) {
  return J[e[0]] + J[e[1]] + J[e[2]] + J[e[3]] + "-" + J[e[4]] + J[e[5]] + "-" + J[e[6]] + J[e[7]] + "-" + J[e[8]] + J[e[9]] + "-" + J[e[10]] + J[e[11]] + J[e[12]] + J[e[13]] + J[e[14]] + J[e[15]];
}
Qt.nil = new Nt("00000000-0000-0000-0000-000000000000");
var Vn = {}, vl = {};
(function(e) {
  (function(t) {
    t.parser = function(m, u) {
      return new r(m, u);
    }, t.SAXParser = r, t.SAXStream = f, t.createStream = d, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(m, u) {
      if (!(this instanceof r))
        return new r(m, u);
      var O = this;
      o(O), O.q = O.c = "", O.bufferCheckPosition = t.MAX_BUFFER_LENGTH, O.opt = u || {}, O.opt.lowercase = O.opt.lowercase || O.opt.lowercasetags, O.looseCase = O.opt.lowercase ? "toLowerCase" : "toUpperCase", O.tags = [], O.closed = O.closedRoot = O.sawRoot = !1, O.tag = O.error = null, O.strict = !!m, O.noscript = !!(m || O.opt.noscript), O.state = E.BEGIN, O.strictEntities = O.opt.strictEntities, O.ENTITIES = O.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), O.attribList = [], O.opt.xmlns && (O.ns = Object.create(T)), O.opt.unquotedAttributeValues === void 0 && (O.opt.unquotedAttributeValues = !m), O.trackPosition = O.opt.position !== !1, O.trackPosition && (O.position = O.line = O.column = 0), j(O, "onready");
    }
    Object.create || (Object.create = function(m) {
      function u() {
      }
      u.prototype = m;
      var O = new u();
      return O;
    }), Object.keys || (Object.keys = function(m) {
      var u = [];
      for (var O in m) m.hasOwnProperty(O) && u.push(O);
      return u;
    });
    function i(m) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), O = 0, _ = 0, Q = n.length; _ < Q; _++) {
        var te = m[n[_]].length;
        if (te > u)
          switch (n[_]) {
            case "textNode":
              Y(m);
              break;
            case "cdata":
              H(m, "oncdata", m.cdata), m.cdata = "";
              break;
            case "script":
              H(m, "onscript", m.script), m.script = "";
              break;
            default:
              C(m, "Max buffer length exceeded: " + n[_]);
          }
        O = Math.max(O, te);
      }
      var oe = t.MAX_BUFFER_LENGTH - O;
      m.bufferCheckPosition = oe + m.position;
    }
    function o(m) {
      for (var u = 0, O = n.length; u < O; u++)
        m[n[u]] = "";
    }
    function a(m) {
      Y(m), m.cdata !== "" && (H(m, "oncdata", m.cdata), m.cdata = ""), m.script !== "" && (H(m, "onscript", m.script), m.script = "");
    }
    r.prototype = {
      end: function() {
        N(this);
      },
      write: Ye,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(m) {
      return m !== "error" && m !== "end";
    });
    function d(m, u) {
      return new f(m, u);
    }
    function f(m, u) {
      if (!(this instanceof f))
        return new f(m, u);
      s.apply(this), this._parser = new r(m, u), this.writable = !0, this.readable = !0;
      var O = this;
      this._parser.onend = function() {
        O.emit("end");
      }, this._parser.onerror = function(_) {
        O.emit("error", _), O._parser.error = null;
      }, this._decoder = null, l.forEach(function(_) {
        Object.defineProperty(O, "on" + _, {
          get: function() {
            return O._parser["on" + _];
          },
          set: function(Q) {
            if (!Q)
              return O.removeAllListeners(_), O._parser["on" + _] = Q, Q;
            O.on(_, Q);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    f.prototype = Object.create(s.prototype, {
      constructor: {
        value: f
      }
    }), f.prototype.write = function(m) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(m)) {
        if (!this._decoder) {
          var u = $f.StringDecoder;
          this._decoder = new u("utf8");
        }
        m = this._decoder.write(m);
      }
      return this._parser.write(m.toString()), this.emit("data", m), !0;
    }, f.prototype.end = function(m) {
      return m && m.length && this.write(m), this._parser.end(), !0;
    }, f.prototype.on = function(m, u) {
      var O = this;
      return !O._parser["on" + m] && l.indexOf(m) !== -1 && (O._parser["on" + m] = function() {
        var _ = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        _.splice(0, 0, m), O.emit.apply(O, _);
      }), s.prototype.on.call(O, m, u);
    };
    var c = "[CDATA[", h = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", T = { xml: p, xmlns: y }, w = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, $ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, x = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function k(m) {
      return m === " " || m === `
` || m === "\r" || m === "	";
    }
    function G(m) {
      return m === '"' || m === "'";
    }
    function S(m) {
      return m === ">" || k(m);
    }
    function R(m, u) {
      return m.test(u);
    }
    function F(m, u) {
      return !R(m, u);
    }
    var E = 0;
    t.STATE = {
      BEGIN: E++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: E++,
      // leading whitespace
      TEXT: E++,
      // general stuff
      TEXT_ENTITY: E++,
      // &amp and such.
      OPEN_WAKA: E++,
      // <
      SGML_DECL: E++,
      // <!BLARG
      SGML_DECL_QUOTED: E++,
      // <!BLARG foo "bar
      DOCTYPE: E++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: E++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: E++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: E++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: E++,
      // <!-
      COMMENT: E++,
      // <!--
      COMMENT_ENDING: E++,
      // <!-- blah -
      COMMENT_ENDED: E++,
      // <!-- blah --
      CDATA: E++,
      // <![CDATA[ something
      CDATA_ENDING: E++,
      // ]
      CDATA_ENDING_2: E++,
      // ]]
      PROC_INST: E++,
      // <?hi
      PROC_INST_BODY: E++,
      // <?hi there
      PROC_INST_ENDING: E++,
      // <?hi "there" ?
      OPEN_TAG: E++,
      // <strong
      OPEN_TAG_SLASH: E++,
      // <strong /
      ATTRIB: E++,
      // <a
      ATTRIB_NAME: E++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: E++,
      // <a foo _
      ATTRIB_VALUE: E++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: E++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: E++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: E++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: E++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: E++,
      // <foo bar=&quot
      CLOSE_TAG: E++,
      // </a
      CLOSE_TAG_SAW_WHITE: E++,
      // </a   >
      SCRIPT: E++,
      // <script> ...
      SCRIPT_ENDING: E++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(m) {
      var u = t.ENTITIES[m], O = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[m] = O;
    });
    for (var M in t.STATE)
      t.STATE[t.STATE[M]] = M;
    E = t.STATE;
    function j(m, u, O) {
      m[u] && m[u](O);
    }
    function H(m, u, O) {
      m.textNode && Y(m), j(m, u, O);
    }
    function Y(m) {
      m.textNode = P(m.opt, m.textNode), m.textNode && j(m, "ontext", m.textNode), m.textNode = "";
    }
    function P(m, u) {
      return m.trim && (u = u.trim()), m.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function C(m, u) {
      return Y(m), m.trackPosition && (u += `
Line: ` + m.line + `
Column: ` + m.column + `
Char: ` + m.c), u = new Error(u), m.error = u, j(m, "onerror", u), m;
    }
    function N(m) {
      return m.sawRoot && !m.closedRoot && b(m, "Unclosed root tag"), m.state !== E.BEGIN && m.state !== E.BEGIN_WHITESPACE && m.state !== E.TEXT && C(m, "Unexpected end"), Y(m), m.c = "", m.closed = !0, j(m, "onend"), r.call(m, m.strict, m.opt), m;
    }
    function b(m, u) {
      if (typeof m != "object" || !(m instanceof r))
        throw new Error("bad call to strictFail");
      m.strict && C(m, u);
    }
    function L(m) {
      m.strict || (m.tagName = m.tagName[m.looseCase]());
      var u = m.tags[m.tags.length - 1] || m, O = m.tag = { name: m.tagName, attributes: {} };
      m.opt.xmlns && (O.ns = u.ns), m.attribList.length = 0, H(m, "onopentagstart", O);
    }
    function D(m, u) {
      var O = m.indexOf(":"), _ = O < 0 ? ["", m] : m.split(":"), Q = _[0], te = _[1];
      return u && m === "xmlns" && (Q = "xmlns", te = ""), { prefix: Q, local: te };
    }
    function q(m) {
      if (m.strict || (m.attribName = m.attribName[m.looseCase]()), m.attribList.indexOf(m.attribName) !== -1 || m.tag.attributes.hasOwnProperty(m.attribName)) {
        m.attribName = m.attribValue = "";
        return;
      }
      if (m.opt.xmlns) {
        var u = D(m.attribName, !0), O = u.prefix, _ = u.local;
        if (O === "xmlns")
          if (_ === "xml" && m.attribValue !== p)
            b(
              m,
              "xml: prefix must be bound to " + p + `
Actual: ` + m.attribValue
            );
          else if (_ === "xmlns" && m.attribValue !== y)
            b(
              m,
              "xmlns: prefix must be bound to " + y + `
Actual: ` + m.attribValue
            );
          else {
            var Q = m.tag, te = m.tags[m.tags.length - 1] || m;
            Q.ns === te.ns && (Q.ns = Object.create(te.ns)), Q.ns[_] = m.attribValue;
          }
        m.attribList.push([m.attribName, m.attribValue]);
      } else
        m.tag.attributes[m.attribName] = m.attribValue, H(m, "onattribute", {
          name: m.attribName,
          value: m.attribValue
        });
      m.attribName = m.attribValue = "";
    }
    function z(m, u) {
      if (m.opt.xmlns) {
        var O = m.tag, _ = D(m.tagName);
        O.prefix = _.prefix, O.local = _.local, O.uri = O.ns[_.prefix] || "", O.prefix && !O.uri && (b(m, "Unbound namespace prefix: " + JSON.stringify(m.tagName)), O.uri = _.prefix);
        var Q = m.tags[m.tags.length - 1] || m;
        O.ns && Q.ns !== O.ns && Object.keys(O.ns).forEach(function(nr) {
          H(m, "onopennamespace", {
            prefix: nr,
            uri: O.ns[nr]
          });
        });
        for (var te = 0, oe = m.attribList.length; te < oe; te++) {
          var ge = m.attribList[te], we = ge[0], rt = ge[1], ce = D(we, !0), Me = ce.prefix, ui = ce.local, tr = Me === "" ? "" : O.ns[Me] || "", cn = {
            name: we,
            value: rt,
            prefix: Me,
            local: ui,
            uri: tr
          };
          Me && Me !== "xmlns" && !tr && (b(m, "Unbound namespace prefix: " + JSON.stringify(Me)), cn.uri = Me), m.tag.attributes[we] = cn, H(m, "onattribute", cn);
        }
        m.attribList.length = 0;
      }
      m.tag.isSelfClosing = !!u, m.sawRoot = !0, m.tags.push(m.tag), H(m, "onopentag", m.tag), u || (!m.noscript && m.tagName.toLowerCase() === "script" ? m.state = E.SCRIPT : m.state = E.TEXT, m.tag = null, m.tagName = ""), m.attribName = m.attribValue = "", m.attribList.length = 0;
    }
    function W(m) {
      if (!m.tagName) {
        b(m, "Weird empty close tag."), m.textNode += "</>", m.state = E.TEXT;
        return;
      }
      if (m.script) {
        if (m.tagName !== "script") {
          m.script += "</" + m.tagName + ">", m.tagName = "", m.state = E.SCRIPT;
          return;
        }
        H(m, "onscript", m.script), m.script = "";
      }
      var u = m.tags.length, O = m.tagName;
      m.strict || (O = O[m.looseCase]());
      for (var _ = O; u--; ) {
        var Q = m.tags[u];
        if (Q.name !== _)
          b(m, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        b(m, "Unmatched closing tag: " + m.tagName), m.textNode += "</" + m.tagName + ">", m.state = E.TEXT;
        return;
      }
      m.tagName = O;
      for (var te = m.tags.length; te-- > u; ) {
        var oe = m.tag = m.tags.pop();
        m.tagName = m.tag.name, H(m, "onclosetag", m.tagName);
        var ge = {};
        for (var we in oe.ns)
          ge[we] = oe.ns[we];
        var rt = m.tags[m.tags.length - 1] || m;
        m.opt.xmlns && oe.ns !== rt.ns && Object.keys(oe.ns).forEach(function(ce) {
          var Me = oe.ns[ce];
          H(m, "onclosenamespace", { prefix: ce, uri: Me });
        });
      }
      u === 0 && (m.closedRoot = !0), m.tagName = m.attribValue = m.attribName = "", m.attribList.length = 0, m.state = E.TEXT;
    }
    function K(m) {
      var u = m.entity, O = u.toLowerCase(), _, Q = "";
      return m.ENTITIES[u] ? m.ENTITIES[u] : m.ENTITIES[O] ? m.ENTITIES[O] : (u = O, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), Q = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), Q = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || Q.toLowerCase() !== u ? (b(m, "Invalid character entity"), "&" + m.entity + ";") : String.fromCodePoint(_));
    }
    function fe(m, u) {
      u === "<" ? (m.state = E.OPEN_WAKA, m.startTagPosition = m.position) : k(u) || (b(m, "Non-whitespace before first tag."), m.textNode = u, m.state = E.TEXT);
    }
    function V(m, u) {
      var O = "";
      return u < m.length && (O = m.charAt(u)), O;
    }
    function Ye(m) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return C(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (m === null)
        return N(u);
      typeof m == "object" && (m = m.toString());
      for (var O = 0, _ = ""; _ = V(m, O++), u.c = _, !!_; )
        switch (u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case E.BEGIN:
            if (u.state = E.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            fe(u, _);
            continue;
          case E.BEGIN_WHITESPACE:
            fe(u, _);
            continue;
          case E.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var Q = O - 1; _ && _ !== "<" && _ !== "&"; )
                _ = V(m, O++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += m.substring(Q, O - 1);
            }
            _ === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : (!k(_) && (!u.sawRoot || u.closedRoot) && b(u, "Text data outside of root node."), _ === "&" ? u.state = E.TEXT_ENTITY : u.textNode += _);
            continue;
          case E.SCRIPT:
            _ === "<" ? u.state = E.SCRIPT_ENDING : u.script += _;
            continue;
          case E.SCRIPT_ENDING:
            _ === "/" ? u.state = E.CLOSE_TAG : (u.script += "<" + _, u.state = E.SCRIPT);
            continue;
          case E.OPEN_WAKA:
            if (_ === "!")
              u.state = E.SGML_DECL, u.sgmlDecl = "";
            else if (!k(_)) if (R(w, _))
              u.state = E.OPEN_TAG, u.tagName = _;
            else if (_ === "/")
              u.state = E.CLOSE_TAG, u.tagName = "";
            else if (_ === "?")
              u.state = E.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (b(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var te = u.position - u.startTagPosition;
                _ = new Array(te).join(" ") + _;
              }
              u.textNode += "<" + _, u.state = E.TEXT;
            }
            continue;
          case E.SGML_DECL:
            if (u.sgmlDecl + _ === "--") {
              u.state = E.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = E.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + _, u.sgmlDecl = "") : (u.sgmlDecl + _).toUpperCase() === c ? (H(u, "onopencdata"), u.state = E.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + _).toUpperCase() === h ? (u.state = E.DOCTYPE, (u.doctype || u.sawRoot) && b(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : _ === ">" ? (H(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = E.TEXT) : (G(_) && (u.state = E.SGML_DECL_QUOTED), u.sgmlDecl += _);
            continue;
          case E.SGML_DECL_QUOTED:
            _ === u.q && (u.state = E.SGML_DECL, u.q = ""), u.sgmlDecl += _;
            continue;
          case E.DOCTYPE:
            _ === ">" ? (u.state = E.TEXT, H(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += _, _ === "[" ? u.state = E.DOCTYPE_DTD : G(_) && (u.state = E.DOCTYPE_QUOTED, u.q = _));
            continue;
          case E.DOCTYPE_QUOTED:
            u.doctype += _, _ === u.q && (u.q = "", u.state = E.DOCTYPE);
            continue;
          case E.DOCTYPE_DTD:
            _ === "]" ? (u.doctype += _, u.state = E.DOCTYPE) : _ === "<" ? (u.state = E.OPEN_WAKA, u.startTagPosition = u.position) : G(_) ? (u.doctype += _, u.state = E.DOCTYPE_DTD_QUOTED, u.q = _) : u.doctype += _;
            continue;
          case E.DOCTYPE_DTD_QUOTED:
            u.doctype += _, _ === u.q && (u.state = E.DOCTYPE_DTD, u.q = "");
            continue;
          case E.COMMENT:
            _ === "-" ? u.state = E.COMMENT_ENDING : u.comment += _;
            continue;
          case E.COMMENT_ENDING:
            _ === "-" ? (u.state = E.COMMENT_ENDED, u.comment = P(u.opt, u.comment), u.comment && H(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + _, u.state = E.COMMENT);
            continue;
          case E.COMMENT_ENDED:
            _ !== ">" ? (b(u, "Malformed comment"), u.comment += "--" + _, u.state = E.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = E.DOCTYPE_DTD : u.state = E.TEXT;
            continue;
          case E.CDATA:
            _ === "]" ? u.state = E.CDATA_ENDING : u.cdata += _;
            continue;
          case E.CDATA_ENDING:
            _ === "]" ? u.state = E.CDATA_ENDING_2 : (u.cdata += "]" + _, u.state = E.CDATA);
            continue;
          case E.CDATA_ENDING_2:
            _ === ">" ? (u.cdata && H(u, "oncdata", u.cdata), H(u, "onclosecdata"), u.cdata = "", u.state = E.TEXT) : _ === "]" ? u.cdata += "]" : (u.cdata += "]]" + _, u.state = E.CDATA);
            continue;
          case E.PROC_INST:
            _ === "?" ? u.state = E.PROC_INST_ENDING : k(_) ? u.state = E.PROC_INST_BODY : u.procInstName += _;
            continue;
          case E.PROC_INST_BODY:
            if (!u.procInstBody && k(_))
              continue;
            _ === "?" ? u.state = E.PROC_INST_ENDING : u.procInstBody += _;
            continue;
          case E.PROC_INST_ENDING:
            _ === ">" ? (H(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = E.TEXT) : (u.procInstBody += "?" + _, u.state = E.PROC_INST_BODY);
            continue;
          case E.OPEN_TAG:
            R(A, _) ? u.tagName += _ : (L(u), _ === ">" ? z(u) : _ === "/" ? u.state = E.OPEN_TAG_SLASH : (k(_) || b(u, "Invalid character in tag name"), u.state = E.ATTRIB));
            continue;
          case E.OPEN_TAG_SLASH:
            _ === ">" ? (z(u, !0), W(u)) : (b(u, "Forward-slash in opening tag not followed by >"), u.state = E.ATTRIB);
            continue;
          case E.ATTRIB:
            if (k(_))
              continue;
            _ === ">" ? z(u) : _ === "/" ? u.state = E.OPEN_TAG_SLASH : R(w, _) ? (u.attribName = _, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME:
            _ === "=" ? u.state = E.ATTRIB_VALUE : _ === ">" ? (b(u, "Attribute without value"), u.attribValue = u.attribName, q(u), z(u)) : k(_) ? u.state = E.ATTRIB_NAME_SAW_WHITE : R(A, _) ? u.attribName += _ : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              u.state = E.ATTRIB_VALUE;
            else {
              if (k(_))
                continue;
              b(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", H(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", _ === ">" ? z(u) : R(w, _) ? (u.attribName = _, u.state = E.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = E.ATTRIB);
            }
            continue;
          case E.ATTRIB_VALUE:
            if (k(_))
              continue;
            G(_) ? (u.q = _, u.state = E.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || C(u, "Unquoted attribute value"), u.state = E.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case E.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            q(u), u.q = "", u.state = E.ATTRIB_VALUE_CLOSED;
            continue;
          case E.ATTRIB_VALUE_CLOSED:
            k(_) ? u.state = E.ATTRIB : _ === ">" ? z(u) : _ === "/" ? u.state = E.OPEN_TAG_SLASH : R(w, _) ? (b(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = E.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case E.ATTRIB_VALUE_UNQUOTED:
            if (!S(_)) {
              _ === "&" ? u.state = E.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            q(u), _ === ">" ? z(u) : u.state = E.ATTRIB;
            continue;
          case E.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? W(u) : R(A, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = E.SCRIPT) : (k(_) || b(u, "Invalid tagname in closing tag"), u.state = E.CLOSE_TAG_SAW_WHITE);
            else {
              if (k(_))
                continue;
              F(w, _) ? u.script ? (u.script += "</" + _, u.state = E.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case E.CLOSE_TAG_SAW_WHITE:
            if (k(_))
              continue;
            _ === ">" ? W(u) : b(u, "Invalid characters in closing tag");
            continue;
          case E.TEXT_ENTITY:
          case E.ATTRIB_VALUE_ENTITY_Q:
          case E.ATTRIB_VALUE_ENTITY_U:
            var oe, ge;
            switch (u.state) {
              case E.TEXT_ENTITY:
                oe = E.TEXT, ge = "textNode";
                break;
              case E.ATTRIB_VALUE_ENTITY_Q:
                oe = E.ATTRIB_VALUE_QUOTED, ge = "attribValue";
                break;
              case E.ATTRIB_VALUE_ENTITY_U:
                oe = E.ATTRIB_VALUE_UNQUOTED, ge = "attribValue";
                break;
            }
            if (_ === ";") {
              var we = K(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(we) ? (u.entity = "", u.state = oe, u.write(we)) : (u[ge] += we, u.entity = "", u.state = oe);
            } else R(u.entity.length ? x : $, _) ? u.entity += _ : (b(u, "Invalid character in entity name"), u[ge] += "&" + u.entity + _, u.entity = "", u.state = oe);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var m = String.fromCharCode, u = Math.floor, O = function() {
        var _ = 16384, Q = [], te, oe, ge = -1, we = arguments.length;
        if (!we)
          return "";
        for (var rt = ""; ++ge < we; ) {
          var ce = Number(arguments[ge]);
          if (!isFinite(ce) || // `NaN`, `+Infinity`, or `-Infinity`
          ce < 0 || // not a valid Unicode code point
          ce > 1114111 || // not a valid Unicode code point
          u(ce) !== ce)
            throw RangeError("Invalid code point: " + ce);
          ce <= 65535 ? Q.push(ce) : (ce -= 65536, te = (ce >> 10) + 55296, oe = ce % 1024 + 56320, Q.push(te, oe)), (ge + 1 === we || Q.length > _) && (rt += m.apply(null, Q), Q.length = 0);
        }
        return rt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: O,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = O;
    }();
  })(e);
})(vl);
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.XElement = void 0;
Vn.parseXml = ud;
const sd = vl, hr = rn;
class wl {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, hr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!cd(t))
      throw (0, hr.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, hr.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, hr.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (va(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => va(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
Vn.XElement = wl;
const ld = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function cd(e) {
  return ld.test(e);
}
function va(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function ud(e) {
  let t = null;
  const n = sd.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new wl(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = r[r.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.MemoLazy = void 0;
class fd {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && _l(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
qr.MemoLazy = fd;
function _l(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => _l(e[a], t[a]));
  }
  return e === t;
}
var Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
Eo.retry = Tl;
const dd = ht;
async function Tl(e, t, n, r = 0, i = 0, o) {
  var a;
  const s = new dd.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((a = o == null ? void 0 : o(l)) !== null && a !== void 0) || a) && t > 0 && !s.cancelled)
      return await new Promise((d) => setTimeout(d, n + r * i)), await Tl(e, t - 1, n, r, i + 1, o);
    throw l;
  }
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.retry = e.MemoLazy = e.newError = e.XElement = e.parseXml = e.ProgressCallbackTransform = e.UUID = e.parseDn = e.githubUrl = e.getS3LikeProviderBaseUrl = e.configureRequestUrl = e.parseJson = e.safeStringifyJson = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.safeGetHeader = e.DigestTransform = e.HttpExecutor = e.createHttpError = e.HttpError = e.CancellationError = e.CancellationToken = void 0, e.asArray = c;
  var t = ht;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } });
  var n = Ce;
  Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } });
  var r = Hr;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return r.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return r.githubUrl;
  } });
  var i = go;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return i.parseDn;
  } });
  var o = Qt;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return o.UUID;
  } });
  var a = Gn;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = Vn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return s.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return s.XElement;
  } });
  var l = rn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return l.newError;
  } });
  var d = qr;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return d.MemoLazy;
  } });
  var f = Eo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return f.retry;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function c(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(pe);
var Dt = {}, $e = {};
$e.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
$e.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var st = Of, hd = process.cwd, Cr = null, pd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Cr || (Cr = hd.call(process)), Cr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var wa = process.chdir;
  process.chdir = function(e) {
    Cr = null, wa.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, wa);
}
var md = gd;
function gd(e) {
  st.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(f, c, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(f, c, h, p) {
    p && process.nextTick(p);
  }, e.lchownSync = function() {
  }), pd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(f) {
    function c(h, p, y) {
      var T = Date.now(), w = 0;
      f(h, p, function A($) {
        if ($ && ($.code === "EACCES" || $.code === "EPERM" || $.code === "EBUSY") && Date.now() - T < 6e4) {
          setTimeout(function() {
            e.stat(p, function(x, k) {
              x && x.code === "ENOENT" ? f(h, p, A) : y($);
            });
          }, w), w < 100 && (w += 10);
          return;
        }
        y && y($);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(c, f), c;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(f) {
    function c(h, p, y, T, w, A) {
      var $;
      if (A && typeof A == "function") {
        var x = 0;
        $ = function(k, G, S) {
          if (k && k.code === "EAGAIN" && x < 10)
            return x++, f.call(e, h, p, y, T, w, $);
          A.apply(this, arguments);
        };
      }
      return f.call(e, h, p, y, T, w, $);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(c, f), c;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(f) {
    return function(c, h, p, y, T) {
      for (var w = 0; ; )
        try {
          return f.call(e, c, h, p, y, T);
        } catch (A) {
          if (A.code === "EAGAIN" && w < 10) {
            w++;
            continue;
          }
          throw A;
        }
    };
  }(e.readSync);
  function t(f) {
    f.lchmod = function(c, h, p) {
      f.open(
        c,
        st.O_WRONLY | st.O_SYMLINK,
        h,
        function(y, T) {
          if (y) {
            p && p(y);
            return;
          }
          f.fchmod(T, h, function(w) {
            f.close(T, function(A) {
              p && p(w || A);
            });
          });
        }
      );
    }, f.lchmodSync = function(c, h) {
      var p = f.openSync(c, st.O_WRONLY | st.O_SYMLINK, h), y = !0, T;
      try {
        T = f.fchmodSync(p, h), y = !1;
      } finally {
        if (y)
          try {
            f.closeSync(p);
          } catch {
          }
        else
          f.closeSync(p);
      }
      return T;
    };
  }
  function n(f) {
    st.hasOwnProperty("O_SYMLINK") && f.futimes ? (f.lutimes = function(c, h, p, y) {
      f.open(c, st.O_SYMLINK, function(T, w) {
        if (T) {
          y && y(T);
          return;
        }
        f.futimes(w, h, p, function(A) {
          f.close(w, function($) {
            y && y(A || $);
          });
        });
      });
    }, f.lutimesSync = function(c, h, p) {
      var y = f.openSync(c, st.O_SYMLINK), T, w = !0;
      try {
        T = f.futimesSync(y, h, p), w = !1;
      } finally {
        if (w)
          try {
            f.closeSync(y);
          } catch {
          }
        else
          f.closeSync(y);
      }
      return T;
    }) : f.futimes && (f.lutimes = function(c, h, p, y) {
      y && process.nextTick(y);
    }, f.lutimesSync = function() {
    });
  }
  function r(f) {
    return f && function(c, h, p) {
      return f.call(e, c, h, function(y) {
        d(y) && (y = null), p && p.apply(this, arguments);
      });
    };
  }
  function i(f) {
    return f && function(c, h) {
      try {
        return f.call(e, c, h);
      } catch (p) {
        if (!d(p)) throw p;
      }
    };
  }
  function o(f) {
    return f && function(c, h, p, y) {
      return f.call(e, c, h, p, function(T) {
        d(T) && (T = null), y && y.apply(this, arguments);
      });
    };
  }
  function a(f) {
    return f && function(c, h, p) {
      try {
        return f.call(e, c, h, p);
      } catch (y) {
        if (!d(y)) throw y;
      }
    };
  }
  function s(f) {
    return f && function(c, h, p) {
      typeof h == "function" && (p = h, h = null);
      function y(T, w) {
        w && (w.uid < 0 && (w.uid += 4294967296), w.gid < 0 && (w.gid += 4294967296)), p && p.apply(this, arguments);
      }
      return h ? f.call(e, c, h, y) : f.call(e, c, y);
    };
  }
  function l(f) {
    return f && function(c, h) {
      var p = h ? f.call(e, c, h) : f.call(e, c);
      return p && (p.uid < 0 && (p.uid += 4294967296), p.gid < 0 && (p.gid += 4294967296)), p;
    };
  }
  function d(f) {
    if (!f || f.code === "ENOSYS")
      return !0;
    var c = !process.getuid || process.getuid() !== 0;
    return !!(c && (f.code === "EINVAL" || f.code === "EPERM"));
  }
}
var _a = qn.Stream, Ed = yd;
function yd(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    _a.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var d = a[s];
      this[d] = i[d];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(f, c) {
      if (f) {
        o.emit("error", f), o.readable = !1;
        return;
      }
      o.fd = c, o.emit("open", c), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    _a.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var vd = _d, wd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function _d(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: wd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var re = Et, Td = md, Ad = Ed, Sd = vd, pr = ho, ye, Pr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ye = Symbol.for("graceful-fs.queue"), Pr = Symbol.for("graceful-fs.previous")) : (ye = "___graceful-fs.queue", Pr = "___graceful-fs.previous");
function Cd() {
}
function Al(e, t) {
  Object.defineProperty(e, ye, {
    get: function() {
      return t;
    }
  });
}
var Rt = Cd;
pr.debuglog ? Rt = pr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Rt = function() {
  var e = pr.format.apply(pr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!re[ye]) {
  var bd = He[ye] || [];
  Al(re, bd), re.close = function(e) {
    function t(n, r) {
      return e.call(re, n, function(i) {
        i || Ta(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Pr, {
      value: e
    }), t;
  }(re.close), re.closeSync = function(e) {
    function t(n) {
      e.apply(re, arguments), Ta();
    }
    return Object.defineProperty(t, Pr, {
      value: e
    }), t;
  }(re.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Rt(re[ye]), fl.equal(re[ye].length, 0);
  });
}
He[ye] || Al(He, re[ye]);
var Oe = yo(Sd(re));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !re.__patched && (Oe = yo(re), re.__patched = !0);
function yo(e) {
  Td(e), e.gracefulify = yo, e.createReadStream = G, e.createWriteStream = S;
  var t = e.readFile;
  e.readFile = n;
  function n(E, M, j) {
    return typeof M == "function" && (j = M, M = null), H(E, M, j);
    function H(Y, P, C, N) {
      return t(Y, P, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? Ut([H, [Y, P, C], b, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(E, M, j, H) {
    return typeof j == "function" && (H = j, j = null), Y(E, M, j, H);
    function Y(P, C, N, b, L) {
      return r(P, C, N, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ut([Y, [P, C, N, b], D, L || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(E, M, j, H) {
    return typeof j == "function" && (H = j, j = null), Y(E, M, j, H);
    function Y(P, C, N, b, L) {
      return o(P, C, N, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ut([Y, [P, C, N, b], D, L || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(E, M, j, H) {
    return typeof j == "function" && (H = j, j = 0), Y(E, M, j, H);
    function Y(P, C, N, b, L) {
      return s(P, C, N, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ut([Y, [P, C, N, b], D, L || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = c;
  var f = /^v[0-5]\./;
  function c(E, M, j) {
    typeof M == "function" && (j = M, M = null);
    var H = f.test(process.version) ? function(C, N, b, L) {
      return d(C, Y(
        C,
        N,
        b,
        L
      ));
    } : function(C, N, b, L) {
      return d(C, N, Y(
        C,
        N,
        b,
        L
      ));
    };
    return H(E, M, j);
    function Y(P, C, N, b) {
      return function(L, D) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? Ut([
          H,
          [P, C, N],
          L,
          b || Date.now(),
          Date.now()
        ]) : (D && D.sort && D.sort(), typeof N == "function" && N.call(this, L, D));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Ad(e);
    A = h.ReadStream, x = h.WriteStream;
  }
  var p = e.ReadStream;
  p && (A.prototype = Object.create(p.prototype), A.prototype.open = $);
  var y = e.WriteStream;
  y && (x.prototype = Object.create(y.prototype), x.prototype.open = k), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(E) {
      A = E;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return x;
    },
    set: function(E) {
      x = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return T;
    },
    set: function(E) {
      T = E;
    },
    enumerable: !0,
    configurable: !0
  });
  var w = x;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return w;
    },
    set: function(E) {
      w = E;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(E, M) {
    return this instanceof A ? (p.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function $() {
    var E = this;
    F(E.path, E.flags, E.mode, function(M, j) {
      M ? (E.autoClose && E.destroy(), E.emit("error", M)) : (E.fd = j, E.emit("open", j), E.read());
    });
  }
  function x(E, M) {
    return this instanceof x ? (y.apply(this, arguments), this) : x.apply(Object.create(x.prototype), arguments);
  }
  function k() {
    var E = this;
    F(E.path, E.flags, E.mode, function(M, j) {
      M ? (E.destroy(), E.emit("error", M)) : (E.fd = j, E.emit("open", j));
    });
  }
  function G(E, M) {
    return new e.ReadStream(E, M);
  }
  function S(E, M) {
    return new e.WriteStream(E, M);
  }
  var R = e.open;
  e.open = F;
  function F(E, M, j, H) {
    return typeof j == "function" && (H = j, j = null), Y(E, M, j, H);
    function Y(P, C, N, b, L) {
      return R(P, C, N, function(D, q) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Ut([Y, [P, C, N, b], D, L || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function Ut(e) {
  Rt("ENQUEUE", e[0].name, e[1]), re[ye].push(e), vo();
}
var mr;
function Ta() {
  for (var e = Date.now(), t = 0; t < re[ye].length; ++t)
    re[ye][t].length > 2 && (re[ye][t][3] = e, re[ye][t][4] = e);
  vo();
}
function vo() {
  if (clearTimeout(mr), mr = void 0, re[ye].length !== 0) {
    var e = re[ye].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Rt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Rt("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), d = Math.min(l * 1.2, 100);
      s >= d ? (Rt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : re[ye].push(e);
    }
    mr === void 0 && (mr = setTimeout(vo, 0));
  }
}
(function(e) {
  const t = $e.fromCallback, n = Oe, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((a) => n.exists(i, a));
  }, e.read = function(i, o, a, s, l, d) {
    return typeof d == "function" ? n.read(i, o, a, s, l, d) : new Promise((f, c) => {
      n.read(i, o, a, s, l, (h, p, y) => {
        if (h) return c(h);
        f({ bytesRead: p, buffer: y });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.write(i, o, ...a) : new Promise((s, l) => {
      n.write(i, o, ...a, (d, f, c) => {
        if (d) return l(d);
        s({ bytesWritten: f, buffer: c });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.writev(i, o, ...a) : new Promise((s, l) => {
      n.writev(i, o, ...a, (d, f, c) => {
        if (d) return l(d);
        s({ bytesWritten: f, buffers: c });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Dt);
var wo = {}, Sl = {};
const $d = ie;
Sl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace($d.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Cl = Dt, { checkPath: bl } = Sl, $l = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
wo.makeDir = async (e, t) => (bl(e), Cl.mkdir(e, {
  mode: $l(t),
  recursive: !0
}));
wo.makeDirSync = (e, t) => (bl(e), Cl.mkdirSync(e, {
  mode: $l(t),
  recursive: !0
}));
const Od = $e.fromPromise, { makeDir: Rd, makeDirSync: Ai } = wo, Si = Od(Rd);
var Je = {
  mkdirs: Si,
  mkdirsSync: Ai,
  // alias
  mkdirp: Si,
  mkdirpSync: Ai,
  ensureDir: Si,
  ensureDirSync: Ai
};
const Id = $e.fromPromise, Ol = Dt;
function Pd(e) {
  return Ol.access(e).then(() => !0).catch(() => !1);
}
var Ft = {
  pathExists: Id(Pd),
  pathExistsSync: Ol.existsSync
};
const Jt = Oe;
function Nd(e, t, n, r) {
  Jt.open(e, "r+", (i, o) => {
    if (i) return r(i);
    Jt.futimes(o, t, n, (a) => {
      Jt.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function Dd(e, t, n) {
  const r = Jt.openSync(e, "r+");
  return Jt.futimesSync(r, t, n), Jt.closeSync(r);
}
var Rl = {
  utimesMillis: Nd,
  utimesMillisSync: Dd
};
const Zt = Dt, he = ie, Fd = ho;
function xd(e, t, n) {
  const r = n.dereference ? (i) => Zt.stat(i, { bigint: !0 }) : (i) => Zt.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Ld(e, t, n) {
  let r;
  const i = n.dereference ? (a) => Zt.statSync(a, { bigint: !0 }) : (a) => Zt.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function Ud(e, t, n, r, i) {
  Fd.callbackify(xd)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (Wn(s, l)) {
        const d = he.basename(e), f = he.basename(t);
        return n === "move" && d !== f && d.toLowerCase() === f.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && _o(e, t) ? i(new Error(Gr(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function kd(e, t, n, r) {
  const { srcStat: i, destStat: o } = Ld(e, t, r);
  if (o) {
    if (Wn(i, o)) {
      const a = he.basename(e), s = he.basename(t);
      if (n === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && _o(e, t))
    throw new Error(Gr(e, t, n));
  return { srcStat: i, destStat: o };
}
function Il(e, t, n, r, i) {
  const o = he.resolve(he.dirname(e)), a = he.resolve(he.dirname(n));
  if (a === o || a === he.parse(a).root) return i();
  Zt.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : Wn(t, l) ? i(new Error(Gr(e, n, r))) : Il(e, t, a, r, i));
}
function Pl(e, t, n, r) {
  const i = he.resolve(he.dirname(e)), o = he.resolve(he.dirname(n));
  if (o === i || o === he.parse(o).root) return;
  let a;
  try {
    a = Zt.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (Wn(t, a))
    throw new Error(Gr(e, n, r));
  return Pl(e, t, o, r);
}
function Wn(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function _o(e, t) {
  const n = he.resolve(e).split(he.sep).filter((i) => i), r = he.resolve(t).split(he.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function Gr(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var on = {
  checkPaths: Ud,
  checkPathsSync: kd,
  checkParentPaths: Il,
  checkParentPathsSync: Pl,
  isSrcSubdir: _o,
  areIdentical: Wn
};
const Ne = Oe, Dn = ie, Md = Je.mkdirs, jd = Ft.pathExists, Bd = Rl.utimesMillis, Fn = on;
function Hd(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Fn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    Fn.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? Nl(Aa, s, e, t, n, r) : Aa(s, e, t, n, r));
  });
}
function Aa(e, t, n, r, i) {
  const o = Dn.dirname(n);
  jd(o, (a, s) => {
    if (a) return i(a);
    if (s) return Nr(e, t, n, r, i);
    Md(o, (l) => l ? i(l) : Nr(e, t, n, r, i));
  });
}
function Nl(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function qd(e, t, n, r, i) {
  return r.filter ? Nl(Nr, e, t, n, r, i) : Nr(e, t, n, r, i);
}
function Nr(e, t, n, r, i) {
  (r.dereference ? Ne.stat : Ne.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? Kd(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Gd(s, e, t, n, r, i) : s.isSymbolicLink() ? Zd(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Gd(e, t, n, r, i, o) {
  return t ? Vd(e, n, r, i, o) : Dl(e, n, r, i, o);
}
function Vd(e, t, n, r, i) {
  if (r.overwrite)
    Ne.unlink(n, (o) => o ? i(o) : Dl(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Dl(e, t, n, r, i) {
  Ne.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? Wd(e.mode, t, n, i) : Vr(n, e.mode, i));
}
function Wd(e, t, n, r) {
  return Yd(e) ? zd(n, e, (i) => i ? r(i) : Sa(e, t, n, r)) : Sa(e, t, n, r);
}
function Yd(e) {
  return (e & 128) === 0;
}
function zd(e, t, n) {
  return Vr(e, t | 128, n);
}
function Sa(e, t, n, r) {
  Xd(t, n, (i) => i ? r(i) : Vr(n, e, r));
}
function Vr(e, t, n) {
  return Ne.chmod(e, t, n);
}
function Xd(e, t, n) {
  Ne.stat(e, (r, i) => r ? n(r) : Bd(t, i.atime, i.mtime, n));
}
function Kd(e, t, n, r, i, o) {
  return t ? Fl(n, r, i, o) : Jd(e.mode, n, r, i, o);
}
function Jd(e, t, n, r, i) {
  Ne.mkdir(n, (o) => {
    if (o) return i(o);
    Fl(t, n, r, (a) => a ? i(a) : Vr(n, e, i));
  });
}
function Fl(e, t, n, r) {
  Ne.readdir(e, (i, o) => i ? r(i) : xl(o, e, t, n, r));
}
function xl(e, t, n, r, i) {
  const o = e.pop();
  return o ? Qd(e, o, t, n, r, i) : i();
}
function Qd(e, t, n, r, i, o) {
  const a = Dn.join(n, t), s = Dn.join(r, t);
  Fn.checkPaths(a, s, "copy", i, (l, d) => {
    if (l) return o(l);
    const { destStat: f } = d;
    qd(f, a, s, i, (c) => c ? o(c) : xl(e, n, r, i, o));
  });
}
function Zd(e, t, n, r, i) {
  Ne.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = Dn.resolve(process.cwd(), a)), e)
      Ne.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Ne.symlink(a, n, i) : i(s) : (r.dereference && (l = Dn.resolve(process.cwd(), l)), Fn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Fn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : eh(a, n, i)));
    else
      return Ne.symlink(a, n, i);
  });
}
function eh(e, t, n) {
  Ne.unlink(t, (r) => r ? n(r) : Ne.symlink(e, t, n));
}
var th = Hd;
const Te = Oe, xn = ie, nh = Je.mkdirsSync, rh = Rl.utimesMillisSync, Ln = on;
function ih(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Ln.checkPathsSync(e, t, "copy", n);
  return Ln.checkParentPathsSync(e, r, t, "copy"), oh(i, e, t, n);
}
function oh(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = xn.dirname(n);
  return Te.existsSync(i) || nh(i), Ll(e, t, n, r);
}
function ah(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Ll(e, t, n, r);
}
function Ll(e, t, n, r) {
  const o = (r.dereference ? Te.statSync : Te.lstatSync)(t);
  if (o.isDirectory()) return hh(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return sh(o, e, t, n, r);
  if (o.isSymbolicLink()) return gh(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function sh(e, t, n, r, i) {
  return t ? lh(e, n, r, i) : Ul(e, n, r, i);
}
function lh(e, t, n, r) {
  if (r.overwrite)
    return Te.unlinkSync(n), Ul(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Ul(e, t, n, r) {
  return Te.copyFileSync(t, n), r.preserveTimestamps && ch(e.mode, t, n), To(n, e.mode);
}
function ch(e, t, n) {
  return uh(e) && fh(n, e), dh(t, n);
}
function uh(e) {
  return (e & 128) === 0;
}
function fh(e, t) {
  return To(e, t | 128);
}
function To(e, t) {
  return Te.chmodSync(e, t);
}
function dh(e, t) {
  const n = Te.statSync(e);
  return rh(t, n.atime, n.mtime);
}
function hh(e, t, n, r, i) {
  return t ? kl(n, r, i) : ph(e.mode, n, r, i);
}
function ph(e, t, n, r) {
  return Te.mkdirSync(n), kl(t, n, r), To(n, e);
}
function kl(e, t, n) {
  Te.readdirSync(e).forEach((r) => mh(r, e, t, n));
}
function mh(e, t, n, r) {
  const i = xn.join(t, e), o = xn.join(n, e), { destStat: a } = Ln.checkPathsSync(i, o, "copy", r);
  return ah(a, i, o, r);
}
function gh(e, t, n, r) {
  let i = Te.readlinkSync(t);
  if (r.dereference && (i = xn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Te.readlinkSync(n);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Te.symlinkSync(i, n);
      throw a;
    }
    if (r.dereference && (o = xn.resolve(process.cwd(), o)), Ln.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Te.statSync(n).isDirectory() && Ln.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Eh(i, n);
  } else
    return Te.symlinkSync(i, n);
}
function Eh(e, t) {
  return Te.unlinkSync(t), Te.symlinkSync(e, t);
}
var yh = ih;
const vh = $e.fromCallback;
var Ao = {
  copy: vh(th),
  copySync: yh
};
const Ca = Oe, Ml = ie, Z = fl, Un = process.platform === "win32";
function jl(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || Ca[n], n = n + "Sync", e[n] = e[n] || Ca[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function So(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z.strictEqual(typeof n, "function", "rimraf: callback function required"), Z(t, "rimraf: invalid options argument provided"), Z.strictEqual(typeof t, "object", "rimraf: options should be object"), jl(t), ba(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => ba(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function ba(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Un)
      return $a(e, t, r, n);
    if (i && i.isDirectory())
      return br(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Un ? $a(e, t, o, n) : br(e, t, o, n);
        if (o.code === "EISDIR")
          return br(e, t, o, n);
      }
      return n(o);
    });
  });
}
function $a(e, t, n, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? br(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Oa(e, t, n) {
  let r;
  Z(e), Z(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? $r(e, t, n) : t.unlinkSync(e);
}
function br(e, t, n, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? wh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function wh(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      So(Ml.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Bl(e, t) {
  let n;
  t = t || {}, jl(t), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z(t, "rimraf: missing options"), Z.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Un && Oa(e, t, r);
  }
  try {
    n && n.isDirectory() ? $r(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Un ? Oa(e, t, r) : $r(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    $r(e, t, r);
  }
}
function $r(e, t, n) {
  Z(e), Z(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      _h(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function _h(e, t) {
  if (Z(e), Z(t), t.readdirSync(e).forEach((n) => Bl(Ml.join(e, n), t)), Un) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var Th = So;
So.sync = Bl;
const Dr = Oe, Ah = $e.fromCallback, Hl = Th;
function Sh(e, t) {
  if (Dr.rm) return Dr.rm(e, { recursive: !0, force: !0 }, t);
  Hl(e, t);
}
function Ch(e) {
  if (Dr.rmSync) return Dr.rmSync(e, { recursive: !0, force: !0 });
  Hl.sync(e);
}
var Wr = {
  remove: Ah(Sh),
  removeSync: Ch
};
const bh = $e.fromPromise, ql = Dt, Gl = ie, Vl = Je, Wl = Wr, Ra = bh(async function(t) {
  let n;
  try {
    n = await ql.readdir(t);
  } catch {
    return Vl.mkdirs(t);
  }
  return Promise.all(n.map((r) => Wl.remove(Gl.join(t, r))));
});
function Ia(e) {
  let t;
  try {
    t = ql.readdirSync(e);
  } catch {
    return Vl.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Gl.join(e, n), Wl.removeSync(n);
  });
}
var $h = {
  emptyDirSync: Ia,
  emptydirSync: Ia,
  emptyDir: Ra,
  emptydir: Ra
};
const Oh = $e.fromCallback, Yl = ie, ut = Oe, zl = Je;
function Rh(e, t) {
  function n() {
    ut.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  ut.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = Yl.dirname(e);
    ut.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? zl.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : ut.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Ih(e) {
  let t;
  try {
    t = ut.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = Yl.dirname(e);
  try {
    ut.statSync(n).isDirectory() || ut.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") zl.mkdirsSync(n);
    else throw r;
  }
  ut.writeFileSync(e, "");
}
var Ph = {
  createFile: Oh(Rh),
  createFileSync: Ih
};
const Nh = $e.fromCallback, Xl = ie, ct = Oe, Kl = Je, Dh = Ft.pathExists, { areIdentical: Jl } = on;
function Fh(e, t, n) {
  function r(i, o) {
    ct.link(i, o, (a) => {
      if (a) return n(a);
      n(null);
    });
  }
  ct.lstat(t, (i, o) => {
    ct.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), n(a);
      if (o && Jl(s, o)) return n(null);
      const l = Xl.dirname(t);
      Dh(l, (d, f) => {
        if (d) return n(d);
        if (f) return r(e, t);
        Kl.mkdirs(l, (c) => {
          if (c) return n(c);
          r(e, t);
        });
      });
    });
  });
}
function xh(e, t) {
  let n;
  try {
    n = ct.lstatSync(t);
  } catch {
  }
  try {
    const o = ct.lstatSync(e);
    if (n && Jl(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Xl.dirname(t);
  return ct.existsSync(r) || Kl.mkdirsSync(r), ct.linkSync(e, t);
}
var Lh = {
  createLink: Nh(Fh),
  createLinkSync: xh
};
const ft = ie, In = Oe, Uh = Ft.pathExists;
function kh(e, t, n) {
  if (ft.isAbsolute(e))
    return In.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = ft.dirname(t), i = ft.join(r, e);
    return Uh(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : In.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: ft.relative(r, e)
    })));
  }
}
function Mh(e, t) {
  let n;
  if (ft.isAbsolute(e)) {
    if (n = In.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = ft.dirname(t), i = ft.join(r, e);
    if (n = In.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = In.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: ft.relative(r, e)
    };
  }
}
var jh = {
  symlinkPaths: kh,
  symlinkPathsSync: Mh
};
const Ql = Oe;
function Bh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Ql.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Hh(e, t) {
  let n;
  if (t) return t;
  try {
    n = Ql.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var qh = {
  symlinkType: Bh,
  symlinkTypeSync: Hh
};
const Gh = $e.fromCallback, Zl = ie, Be = Dt, ec = Je, Vh = ec.mkdirs, Wh = ec.mkdirsSync, tc = jh, Yh = tc.symlinkPaths, zh = tc.symlinkPathsSync, nc = qh, Xh = nc.symlinkType, Kh = nc.symlinkTypeSync, Jh = Ft.pathExists, { areIdentical: rc } = on;
function Qh(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Be.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Be.stat(e),
      Be.stat(t)
    ]).then(([a, s]) => {
      if (rc(a, s)) return r(null);
      Pa(e, t, n, r);
    }) : Pa(e, t, n, r);
  });
}
function Pa(e, t, n, r) {
  Yh(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, Xh(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = Zl.dirname(t);
      Jh(l, (d, f) => {
        if (d) return r(d);
        if (f) return Be.symlink(e, t, s, r);
        Vh(l, (c) => {
          if (c) return r(c);
          Be.symlink(e, t, s, r);
        });
      });
    });
  });
}
function Zh(e, t, n) {
  let r;
  try {
    r = Be.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = Be.statSync(e), l = Be.statSync(t);
    if (rc(s, l)) return;
  }
  const i = zh(e, t);
  e = i.toDst, n = Kh(i.toCwd, n);
  const o = Zl.dirname(t);
  return Be.existsSync(o) || Wh(o), Be.symlinkSync(e, t, n);
}
var ep = {
  createSymlink: Gh(Qh),
  createSymlinkSync: Zh
};
const { createFile: Na, createFileSync: Da } = Ph, { createLink: Fa, createLinkSync: xa } = Lh, { createSymlink: La, createSymlinkSync: Ua } = ep;
var tp = {
  // file
  createFile: Na,
  createFileSync: Da,
  ensureFile: Na,
  ensureFileSync: Da,
  // link
  createLink: Fa,
  createLinkSync: xa,
  ensureLink: Fa,
  ensureLinkSync: xa,
  // symlink
  createSymlink: La,
  createSymlinkSync: Ua,
  ensureSymlink: La,
  ensureSymlinkSync: Ua
};
function np(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function rp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Co = { stringify: np, stripBom: rp };
let en;
try {
  en = Oe;
} catch {
  en = Et;
}
const Yr = $e, { stringify: ic, stripBom: oc } = Co;
async function ip(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || en, r = "throws" in t ? t.throws : !0;
  let i = await Yr.fromCallback(n.readFile)(e, t);
  i = oc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (r)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const op = Yr.fromPromise(ip);
function ap(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || en, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = oc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function sp(e, t, n = {}) {
  const r = n.fs || en, i = ic(t, n);
  await Yr.fromCallback(r.writeFile)(e, i, n);
}
const lp = Yr.fromPromise(sp);
function cp(e, t, n = {}) {
  const r = n.fs || en, i = ic(t, n);
  return r.writeFileSync(e, i, n);
}
const up = {
  readFile: op,
  readFileSync: ap,
  writeFile: lp,
  writeFileSync: cp
};
var fp = up;
const gr = fp;
var dp = {
  // jsonfile exports
  readJson: gr.readFile,
  readJsonSync: gr.readFileSync,
  writeJson: gr.writeFile,
  writeJsonSync: gr.writeFileSync
};
const hp = $e.fromCallback, Pn = Oe, ac = ie, sc = Je, pp = Ft.pathExists;
function mp(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = ac.dirname(e);
  pp(i, (o, a) => {
    if (o) return r(o);
    if (a) return Pn.writeFile(e, t, n, r);
    sc.mkdirs(i, (s) => {
      if (s) return r(s);
      Pn.writeFile(e, t, n, r);
    });
  });
}
function gp(e, ...t) {
  const n = ac.dirname(e);
  if (Pn.existsSync(n))
    return Pn.writeFileSync(e, ...t);
  sc.mkdirsSync(n), Pn.writeFileSync(e, ...t);
}
var bo = {
  outputFile: hp(mp),
  outputFileSync: gp
};
const { stringify: Ep } = Co, { outputFile: yp } = bo;
async function vp(e, t, n = {}) {
  const r = Ep(t, n);
  await yp(e, r, n);
}
var wp = vp;
const { stringify: _p } = Co, { outputFileSync: Tp } = bo;
function Ap(e, t, n) {
  const r = _p(t, n);
  Tp(e, r, n);
}
var Sp = Ap;
const Cp = $e.fromPromise, be = dp;
be.outputJson = Cp(wp);
be.outputJsonSync = Sp;
be.outputJSON = be.outputJson;
be.outputJSONSync = be.outputJsonSync;
be.writeJSON = be.writeJson;
be.writeJSONSync = be.writeJsonSync;
be.readJSON = be.readJson;
be.readJSONSync = be.readJsonSync;
var bp = be;
const $p = Oe, Qi = ie, Op = Ao.copy, lc = Wr.remove, Rp = Je.mkdirp, Ip = Ft.pathExists, ka = on;
function Pp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ka.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ka.checkParentPaths(e, s, t, "move", (d) => {
      if (d) return r(d);
      if (Np(t)) return Ma(e, t, i, l, r);
      Rp(Qi.dirname(t), (f) => f ? r(f) : Ma(e, t, i, l, r));
    });
  });
}
function Np(e) {
  const t = Qi.dirname(e);
  return Qi.parse(t).root === t;
}
function Ma(e, t, n, r, i) {
  if (r) return Ci(e, t, n, i);
  if (n)
    return lc(t, (o) => o ? i(o) : Ci(e, t, n, i));
  Ip(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Ci(e, t, n, i));
}
function Ci(e, t, n, r) {
  $p.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : Dp(e, t, n, r) : r());
}
function Dp(e, t, n, r) {
  Op(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : lc(e, r));
}
var Fp = Pp;
const cc = Oe, Zi = ie, xp = Ao.copySync, uc = Wr.removeSync, Lp = Je.mkdirpSync, ja = on;
function Up(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ja.checkPathsSync(e, t, "move", n);
  return ja.checkParentPathsSync(e, i, t, "move"), kp(t) || Lp(Zi.dirname(t)), Mp(e, t, r, o);
}
function kp(e) {
  const t = Zi.dirname(e);
  return Zi.parse(t).root === t;
}
function Mp(e, t, n, r) {
  if (r) return bi(e, t, n);
  if (n)
    return uc(t), bi(e, t, n);
  if (cc.existsSync(t)) throw new Error("dest already exists.");
  return bi(e, t, n);
}
function bi(e, t, n) {
  try {
    cc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return jp(e, t, n);
  }
}
function jp(e, t, n) {
  return xp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), uc(e);
}
var Bp = Up;
const Hp = $e.fromCallback;
var qp = {
  move: Hp(Fp),
  moveSync: Bp
}, yt = {
  // Export promiseified graceful-fs:
  ...Dt,
  // Export extra methods:
  ...Ao,
  ...$h,
  ...tp,
  ...bp,
  ...Je,
  ...qp,
  ...bo,
  ...Ft,
  ...Wr
}, mn = {}, St = {}, ve = {}, $o = {}, Ge = {};
function fc(e) {
  return typeof e > "u" || e === null;
}
function Gp(e) {
  return typeof e == "object" && e !== null;
}
function Vp(e) {
  return Array.isArray(e) ? e : fc(e) ? [] : [e];
}
function Wp(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Yp(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function zp(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ge.isNothing = fc;
Ge.isObject = Gp;
Ge.toArray = Vp;
Ge.repeat = Yp;
Ge.isNegativeZero = zp;
Ge.extend = Wp;
function dc(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function kn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = dc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
kn.prototype = Object.create(Error.prototype);
kn.prototype.constructor = kn;
kn.prototype.toString = function(t) {
  return this.name + ": " + dc(this, t);
};
var Yn = kn, bn = Ge;
function $i(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function Oi(e, t) {
  return bn.repeat(" ", t - e.length) + e;
}
function Xp(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, d, f = Math.min(e.line + t.linesAfter, i.length).toString().length, c = t.maxLength - (t.indent + f + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    d = $i(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      c
    ), s = bn.repeat(" ", t.indent) + Oi((e.line - l + 1).toString(), f) + " | " + d.str + `
` + s;
  for (d = $i(e.buffer, r[a], i[a], e.position, c), s += bn.repeat(" ", t.indent) + Oi((e.line + 1).toString(), f) + " | " + d.str + `
`, s += bn.repeat("-", t.indent + f + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    d = $i(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      c
    ), s += bn.repeat(" ", t.indent) + Oi((e.line + l + 1).toString(), f) + " | " + d.str + `
`;
  return s.replace(/\n$/, "");
}
var Kp = Xp, Ba = Yn, Jp = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Qp = [
  "scalar",
  "sequence",
  "mapping"
];
function Zp(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function em(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (Jp.indexOf(n) === -1)
      throw new Ba('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Zp(t.styleAliases || null), Qp.indexOf(this.kind) === -1)
    throw new Ba('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Re = em, gn = Yn, Ri = Re;
function Ha(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function tm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, n;
  function r(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, n = arguments.length; t < n; t += 1)
    arguments[t].forEach(r);
  return e;
}
function eo(e) {
  return this.extend(e);
}
eo.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Ri)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new gn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Ri))
      throw new gn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new gn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new gn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Ri))
      throw new gn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(eo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Ha(i, "implicit"), i.compiledExplicit = Ha(i, "explicit"), i.compiledTypeMap = tm(i.compiledImplicit, i.compiledExplicit), i;
};
var hc = eo, nm = Re, pc = new nm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), rm = Re, mc = new rm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), im = Re, gc = new im("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), om = hc, Ec = new om({
  explicit: [
    pc,
    mc,
    gc
  ]
}), am = Re;
function sm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function lm() {
  return null;
}
function cm(e) {
  return e === null;
}
var yc = new am("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: sm,
  construct: lm,
  predicate: cm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), um = Re;
function fm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function dm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function hm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var vc = new um("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: fm,
  construct: dm,
  predicate: hm,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), pm = Ge, mm = Re;
function gm(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Em(e) {
  return 48 <= e && e <= 55;
}
function ym(e) {
  return 48 <= e && e <= 57;
}
function vm(e) {
  if (e === null) return !1;
  var t = e.length, n = 0, r = !1, i;
  if (!t) return !1;
  if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "x") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!gm(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!Em(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!ym(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function wm(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function _m(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !pm.isNegativeZero(e);
}
var wc = new mm("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: vm,
  construct: wm,
  predicate: _m,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), _c = Ge, Tm = Re, Am = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Sm(e) {
  return !(e === null || !Am.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Cm(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var bm = /^[-+]?[0-9]+e/;
function $m(e, t) {
  var n;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (_c.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), bm.test(n) ? n.replace("e", ".e") : n;
}
function Om(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || _c.isNegativeZero(e));
}
var Tc = new Tm("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Sm,
  construct: Cm,
  predicate: Om,
  represent: $m,
  defaultStyle: "lowercase"
}), Ac = Ec.extend({
  implicit: [
    yc,
    vc,
    wc,
    Tc
  ]
}), Sc = Ac, Rm = Re, Cc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), bc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Im(e) {
  return e === null ? !1 : Cc.exec(e) !== null || bc.exec(e) !== null;
}
function Pm(e) {
  var t, n, r, i, o, a, s, l = 0, d = null, f, c, h;
  if (t = Cc.exec(e), t === null && (t = bc.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (f = +t[10], c = +(t[11] || 0), d = (f * 60 + c) * 6e4, t[9] === "-" && (d = -d)), h = new Date(Date.UTC(n, r, i, o, a, s, l)), d && h.setTime(h.getTime() - d), h;
}
function Nm(e) {
  return e.toISOString();
}
var $c = new Rm("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Im,
  construct: Pm,
  instanceOf: Date,
  represent: Nm
}), Dm = Re;
function Fm(e) {
  return e === "<<" || e === null;
}
var Oc = new Dm("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Fm
}), xm = Re, Oo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Lm(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Oo;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function Um(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Oo, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function km(e) {
  var t = "", n = 0, r, i, o = e.length, a = Oo;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function Mm(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Rc = new xm("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Lm,
  construct: Um,
  predicate: Mm,
  represent: km
}), jm = Re, Bm = Object.prototype.hasOwnProperty, Hm = Object.prototype.toString;
function qm(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, Hm.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Bm.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Gm(e) {
  return e !== null ? e : [];
}
var Ic = new jm("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: qm,
  construct: Gm
}), Vm = Re, Wm = Object.prototype.toString;
function Ym(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], Wm.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function zm(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var Pc = new Vm("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ym,
  construct: zm
}), Xm = Re, Km = Object.prototype.hasOwnProperty;
function Jm(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Km.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Qm(e) {
  return e !== null ? e : {};
}
var Nc = new Xm("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Jm,
  construct: Qm
}), Ro = Sc.extend({
  implicit: [
    $c,
    Oc
  ],
  explicit: [
    Rc,
    Ic,
    Pc,
    Nc
  ]
}), $t = Ge, Dc = Yn, Zm = Kp, eg = Ro, pt = Object.prototype.hasOwnProperty, Fr = 1, Fc = 2, xc = 3, xr = 4, Ii = 1, tg = 2, qa = 3, ng = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, rg = /[\x85\u2028\u2029]/, ig = /[,\[\]\{\}]/, Lc = /^(?:!|!!|![a-z\-]+!)$/i, Uc = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ga(e) {
  return Object.prototype.toString.call(e);
}
function Ke(e) {
  return e === 10 || e === 13;
}
function It(e) {
  return e === 9 || e === 32;
}
function De(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Gt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function og(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function ag(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function sg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Va(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function lg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var kc = new Array(256), Mc = new Array(256);
for (var kt = 0; kt < 256; kt++)
  kc[kt] = Va(kt) ? 1 : 0, Mc[kt] = Va(kt);
function cg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || eg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function jc(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Zm(n), new Dc(t, n);
}
function B(e, t) {
  throw jc(e, t);
}
function Lr(e, t) {
  e.onWarning && e.onWarning.call(null, jc(e, t));
}
var Wa = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && B(t, "duplication of %YAML directive"), r.length !== 1 && B(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && B(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && B(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Lr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && B(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], Lc.test(i) || B(t, "ill-formed tag handle (first argument) of the TAG directive"), pt.call(t.tagMap, i) && B(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Uc.test(o) || B(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      B(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function dt(e, t, n, r) {
  var i, o, a, s;
  if (t < n) {
    if (s = e.input.slice(t, n), r)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || B(e, "expected valid JSON character");
    else ng.test(s) && B(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function Ya(e, t, n, r) {
  var i, o, a, s;
  for ($t.isObject(n) || B(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], pt.call(t, o) || (t[o] = n[o], r[o] = !0);
}
function Vt(e, t, n, r, i, o, a, s, l) {
  var d, f;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, f = i.length; d < f; d += 1)
      Array.isArray(i[d]) && B(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ga(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Ga(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (d = 0, f = o.length; d < f; d += 1)
        Ya(e, t, o[d], n);
    else
      Ya(e, t, o, n);
  else
    !e.json && !pt.call(n, i) && pt.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, B(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: o
    }) : t[i] = o, delete n[i];
  return t;
}
function Io(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : B(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function le(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; It(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Ke(i))
      for (Io(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Lr(e, "deficient indentation"), r;
}
function zr(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || De(n)));
}
function Po(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += $t.repeat(`
`, t - 1));
}
function ug(e, t, n) {
  var r, i, o, a, s, l, d, f, c = e.kind, h = e.result, p;
  if (p = e.input.charCodeAt(e.position), De(p) || Gt(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), De(i) || n && Gt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; p !== 0; ) {
    if (p === 58) {
      if (i = e.input.charCodeAt(e.position + 1), De(i) || n && Gt(i))
        break;
    } else if (p === 35) {
      if (r = e.input.charCodeAt(e.position - 1), De(r))
        break;
    } else {
      if (e.position === e.lineStart && zr(e) || n && Gt(p))
        break;
      if (Ke(p))
        if (l = e.line, d = e.lineStart, f = e.lineIndent, le(e, !1, -1), e.lineIndent >= t) {
          s = !0, p = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = d, e.lineIndent = f;
          break;
        }
    }
    s && (dt(e, o, a, !1), Po(e, e.line - l), o = a = e.position, s = !1), It(p) || (a = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return dt(e, o, a, !1), e.result ? !0 : (e.kind = c, e.result = h, !1);
}
function fg(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (dt(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else Ke(n) ? (dt(e, r, i, !0), Po(e, le(e, !1, t)), r = i = e.position) : e.position === e.lineStart && zr(e) ? B(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  B(e, "unexpected end of the stream within a single quoted scalar");
}
function dg(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return dt(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (dt(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), Ke(s))
        le(e, !1, t);
      else if (s < 256 && kc[s])
        e.result += Mc[s], e.position++;
      else if ((a = ag(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = og(s)) >= 0 ? o = (o << 4) + a : B(e, "expected hexadecimal character");
        e.result += lg(o), e.position++;
      } else
        B(e, "unknown escape sequence");
      n = r = e.position;
    } else Ke(s) ? (dt(e, n, r, !0), Po(e, le(e, !1, t)), n = r = e.position) : e.position === e.lineStart && zr(e) ? B(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  B(e, "unexpected end of the stream within a double quoted scalar");
}
function hg(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, d, f, c, h, p, y = /* @__PURE__ */ Object.create(null), T, w, A, $;
  if ($ = e.input.charCodeAt(e.position), $ === 91)
    f = 93, p = !1, s = [];
  else if ($ === 123)
    f = 125, p = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), $ = e.input.charCodeAt(++e.position); $ !== 0; ) {
    if (le(e, !0, t), $ = e.input.charCodeAt(e.position), $ === f)
      return e.position++, e.tag = a, e.anchor = l, e.kind = p ? "mapping" : "sequence", e.result = s, !0;
    n ? $ === 44 && B(e, "expected the node content, but found ','") : B(e, "missed comma between flow collection entries"), w = T = A = null, c = h = !1, $ === 63 && (d = e.input.charCodeAt(e.position + 1), De(d) && (c = h = !0, e.position++, le(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, tn(e, t, Fr, !1, !0), w = e.tag, T = e.result, le(e, !0, t), $ = e.input.charCodeAt(e.position), (h || e.line === r) && $ === 58 && (c = !0, $ = e.input.charCodeAt(++e.position), le(e, !0, t), tn(e, t, Fr, !1, !0), A = e.result), p ? Vt(e, s, y, w, T, A, r, i, o) : c ? s.push(Vt(e, null, y, w, T, A, r, i, o)) : s.push(T), le(e, !0, t), $ = e.input.charCodeAt(e.position), $ === 44 ? (n = !0, $ = e.input.charCodeAt(++e.position)) : n = !1;
  }
  B(e, "unexpected end of the stream within a flow collection");
}
function pg(e, t) {
  var n, r, i = Ii, o = !1, a = !1, s = t, l = 0, d = !1, f, c;
  if (c = e.input.charCodeAt(e.position), c === 124)
    r = !1;
  else if (c === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; c !== 0; )
    if (c = e.input.charCodeAt(++e.position), c === 43 || c === 45)
      Ii === i ? i = c === 43 ? qa : tg : B(e, "repeat of a chomping mode identifier");
    else if ((f = sg(c)) >= 0)
      f === 0 ? B(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? B(e, "repeat of an indentation width identifier") : (s = t + f - 1, a = !0);
    else
      break;
  if (It(c)) {
    do
      c = e.input.charCodeAt(++e.position);
    while (It(c));
    if (c === 35)
      do
        c = e.input.charCodeAt(++e.position);
      while (!Ke(c) && c !== 0);
  }
  for (; c !== 0; ) {
    for (Io(e), e.lineIndent = 0, c = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && c === 32; )
      e.lineIndent++, c = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), Ke(c)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === qa ? e.result += $t.repeat(`
`, o ? 1 + l : l) : i === Ii && o && (e.result += `
`);
      break;
    }
    for (r ? It(c) ? (d = !0, e.result += $t.repeat(`
`, o ? 1 + l : l)) : d ? (d = !1, e.result += $t.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += $t.repeat(`
`, l) : e.result += $t.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !Ke(c) && c !== 0; )
      c = e.input.charCodeAt(++e.position);
    dt(e, n, e.position, !1);
  }
  return !0;
}
function za(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, B(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !De(a)))); ) {
    if (s = !0, e.position++, le(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, tn(e, t, xc, !1, !0), o.push(e.result), le(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      B(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function mg(e, t, n) {
  var r, i, o, a, s, l, d = e.tag, f = e.anchor, c = {}, h = /* @__PURE__ */ Object.create(null), p = null, y = null, T = null, w = !1, A = !1, $;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = c), $ = e.input.charCodeAt(e.position); $ !== 0; ) {
    if (!w && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, B(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, ($ === 63 || $ === 58) && De(r))
      $ === 63 ? (w && (Vt(e, c, h, p, y, null, a, s, l), p = y = T = null), A = !0, w = !0, i = !0) : w ? (w = !1, i = !0) : B(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, $ = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !tn(e, n, Fc, !1, !0))
        break;
      if (e.line === o) {
        for ($ = e.input.charCodeAt(e.position); It($); )
          $ = e.input.charCodeAt(++e.position);
        if ($ === 58)
          $ = e.input.charCodeAt(++e.position), De($) || B(e, "a whitespace character is expected after the key-value separator within a block mapping"), w && (Vt(e, c, h, p, y, null, a, s, l), p = y = T = null), A = !0, w = !1, i = !1, p = e.tag, y = e.result;
        else if (A)
          B(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = f, !0;
      } else if (A)
        B(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = f, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (w && (a = e.line, s = e.lineStart, l = e.position), tn(e, t, xr, !0, i) && (w ? y = e.result : T = e.result), w || (Vt(e, c, h, p, y, T, a, s, l), p = y = T = null), le(e, !0, -1), $ = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && $ !== 0)
      B(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return w && Vt(e, c, h, p, y, null, a, s, l), A && (e.tag = d, e.anchor = f, e.kind = "mapping", e.result = c), A;
}
function gg(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && B(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : B(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !De(a); )
      a === 33 && (r ? B(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Lc.test(i) || B(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), ig.test(o) && B(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Uc.test(o) && B(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    B(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : pt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : B(e, 'undeclared tag handle "' + i + '"'), !0;
}
function Eg(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && B(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !De(n) && !Gt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && B(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function yg(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !De(r) && !Gt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && B(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), pt.call(e.anchorMap, n) || B(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], le(e, !0, -1), !0;
}
function tn(e, t, n, r, i) {
  var o, a, s, l = 1, d = !1, f = !1, c, h, p, y, T, w;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = xr === n || xc === n, r && le(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; gg(e) || Eg(e); )
      le(e, !0, -1) ? (d = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = d || i), (l === 1 || xr === n) && (Fr === n || Fc === n ? T = t : T = t + 1, w = e.position - e.lineStart, l === 1 ? s && (za(e, w) || mg(e, w, T)) || hg(e, T) ? f = !0 : (a && pg(e, T) || fg(e, T) || dg(e, T) ? f = !0 : yg(e) ? (f = !0, (e.tag !== null || e.anchor !== null) && B(e, "alias node should not have any properties")) : ug(e, T, Fr === n) && (f = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (f = s && za(e, w))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && B(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), c = 0, h = e.implicitTypes.length; c < h; c += 1)
      if (y = e.implicitTypes[c], y.resolve(e.result)) {
        e.result = y.construct(e.result), e.tag = y.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (pt.call(e.typeMap[e.kind || "fallback"], e.tag))
      y = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (y = null, p = e.typeMap.multi[e.kind || "fallback"], c = 0, h = p.length; c < h; c += 1)
        if (e.tag.slice(0, p[c].tag.length) === p[c].tag) {
          y = p[c];
          break;
        }
    y || B(e, "unknown tag !<" + e.tag + ">"), e.result !== null && y.kind !== e.kind && B(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + y.kind + '", not "' + e.kind + '"'), y.resolve(e.result, e.tag) ? (e.result = y.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : B(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || f;
}
function vg(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (le(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !De(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && B(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; It(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Ke(a));
        break;
      }
      if (Ke(a)) break;
      for (n = e.position; a !== 0 && !De(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && Io(e), pt.call(Wa, r) ? Wa[r](e, r, i) : Lr(e, 'unknown document directive "' + r + '"');
  }
  if (le(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, le(e, !0, -1)) : o && B(e, "directives end mark is expected"), tn(e, e.lineIndent - 1, xr, !1, !0), le(e, !0, -1), e.checkLineBreaks && rg.test(e.input.slice(t, e.position)) && Lr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && zr(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, le(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    B(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Bc(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new cg(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, B(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    vg(n);
  return n.documents;
}
function wg(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = Bc(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function _g(e, t) {
  var n = Bc(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Dc("expected a single document in the stream, but found more");
  }
}
$o.loadAll = wg;
$o.load = _g;
var Hc = {}, Xr = Ge, zn = Yn, Tg = Ro, qc = Object.prototype.toString, Gc = Object.prototype.hasOwnProperty, No = 65279, Ag = 9, Mn = 10, Sg = 13, Cg = 32, bg = 33, $g = 34, to = 35, Og = 37, Rg = 38, Ig = 39, Pg = 42, Vc = 44, Ng = 45, Ur = 58, Dg = 61, Fg = 62, xg = 63, Lg = 64, Wc = 91, Yc = 93, Ug = 96, zc = 123, kg = 124, Xc = 125, Ae = {};
Ae[0] = "\\0";
Ae[7] = "\\a";
Ae[8] = "\\b";
Ae[9] = "\\t";
Ae[10] = "\\n";
Ae[11] = "\\v";
Ae[12] = "\\f";
Ae[13] = "\\r";
Ae[27] = "\\e";
Ae[34] = '\\"';
Ae[92] = "\\\\";
Ae[133] = "\\N";
Ae[160] = "\\_";
Ae[8232] = "\\L";
Ae[8233] = "\\P";
var Mg = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], jg = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Bg(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Gc.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function Hg(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new zn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + Xr.repeat("0", r - t.length) + t;
}
var qg = 1, jn = 2;
function Gg(e) {
  this.schema = e.schema || Tg, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Xr.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Bg(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? jn : qg, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Xa(e, t) {
  for (var n = Xr.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function no(e, t) {
  return `
` + Xr.repeat(" ", e.indent * t);
}
function Vg(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function kr(e) {
  return e === Cg || e === Ag;
}
function Bn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== No || 65536 <= e && e <= 1114111;
}
function Ka(e) {
  return Bn(e) && e !== No && e !== Sg && e !== Mn;
}
function Ja(e, t, n) {
  var r = Ka(e), i = r && !kr(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Vc && e !== Wc && e !== Yc && e !== zc && e !== Xc) && e !== to && !(t === Ur && !i) || Ka(t) && !kr(t) && e === to || t === Ur && i
  );
}
function Wg(e) {
  return Bn(e) && e !== No && !kr(e) && e !== Ng && e !== xg && e !== Ur && e !== Vc && e !== Wc && e !== Yc && e !== zc && e !== Xc && e !== to && e !== Rg && e !== Pg && e !== bg && e !== kg && e !== Dg && e !== Fg && e !== Ig && e !== $g && e !== Og && e !== Lg && e !== Ug;
}
function Yg(e) {
  return !kr(e) && e !== Ur;
}
function $n(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Kc(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Jc = 1, ro = 2, Qc = 3, Zc = 4, Ht = 5;
function zg(e, t, n, r, i, o, a, s) {
  var l, d = 0, f = null, c = !1, h = !1, p = r !== -1, y = -1, T = Wg($n(e, 0)) && Yg($n(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = $n(e, l), !Bn(d))
        return Ht;
      T = T && Ja(d, f, s), f = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = $n(e, l), d === Mn)
        c = !0, p && (h = h || // Foldable line = too long, and not more-indented.
        l - y - 1 > r && e[y + 1] !== " ", y = l);
      else if (!Bn(d))
        return Ht;
      T = T && Ja(d, f, s), f = d;
    }
    h = h || p && l - y - 1 > r && e[y + 1] !== " ";
  }
  return !c && !h ? T && !a && !i(e) ? Jc : o === jn ? Ht : ro : n > 9 && Kc(e) ? Ht : a ? o === jn ? Ht : ro : h ? Zc : Qc;
}
function Xg(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === jn ? '""' : "''";
    if (!e.noCompatMode && (Mg.indexOf(t) !== -1 || jg.test(t)))
      return e.quotingType === jn ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(d) {
      return Vg(e, d);
    }
    switch (zg(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case Jc:
        return t;
      case ro:
        return "'" + t.replace(/'/g, "''") + "'";
      case Qc:
        return "|" + Qa(t, e.indent) + Za(Xa(t, o));
      case Zc:
        return ">" + Qa(t, e.indent) + Za(Xa(Kg(t, a), o));
      case Ht:
        return '"' + Jg(t) + '"';
      default:
        throw new zn("impossible error: invalid scalar style");
    }
  }();
}
function Qa(e, t) {
  var n = Kc(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Za(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function Kg(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, n.lastIndex = d, es(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + es(l, t), i = o;
  }
  return r;
}
function es(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function Jg(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = $n(e, i), r = Ae[n], !r && Bn(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || Hg(n);
  return t;
}
function Qg(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (nt(e, t, s, !1, !1) || typeof s > "u" && nt(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function ts(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (nt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && nt(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += no(e, t)), e.dump && Mn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function Zg(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, d, f;
  for (a = 0, s = o.length; a < s; a += 1)
    f = "", r !== "" && (f += ", "), e.condenseFlow && (f += '"'), l = o[a], d = n[l], e.replacer && (d = e.replacer.call(n, l, d)), nt(e, t, l, !1, !1) && (e.dump.length > 1024 && (f += "? "), f += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), nt(e, t, d, !1, !1) && (f += e.dump, r += f));
  e.tag = i, e.dump = "{" + r + "}";
}
function e0(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, d, f, c, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new zn("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!r || i !== "") && (h += no(e, t)), d = a[s], f = n[d], e.replacer && (f = e.replacer.call(n, d, f)), nt(e, t + 1, d, !0, !0, !0) && (c = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, c && (e.dump && Mn === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, c && (h += no(e, t)), nt(e, t + 1, f, !0, c) && (e.dump && Mn === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function ns(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, qc.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (Gc.call(s.represent, l))
          r = s.represent[l](t, l);
        else
          throw new zn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function nt(e, t, n, r, i, o, a) {
  e.tag = null, e.dump = n, ns(e, n, !1) || ns(e, n, !0);
  var s = qc.call(e.dump), l = r, d;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var f = s === "[object Object]" || s === "[object Array]", c, h;
  if (f && (c = e.duplicates.indexOf(n), h = c !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[c])
    e.dump = "*ref_" + c;
  else {
    if (f && h && !e.usedDuplicates[c] && (e.usedDuplicates[c] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (e0(e, t, e.dump, i), h && (e.dump = "&ref_" + c + e.dump)) : (Zg(e, t, e.dump), h && (e.dump = "&ref_" + c + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? ts(e, t - 1, e.dump, i) : ts(e, t, e.dump, i), h && (e.dump = "&ref_" + c + e.dump)) : (Qg(e, t, e.dump), h && (e.dump = "&ref_" + c + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && Xg(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new zn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (d = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump);
  }
  return !0;
}
function t0(e, t) {
  var n = [], r = [], i, o;
  for (io(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function io(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        io(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        io(e[r[i]], t, n);
}
function n0(e, t) {
  t = t || {};
  var n = new Gg(t);
  n.noRefs || t0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), nt(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Hc.dump = n0;
var eu = $o, r0 = Hc;
function Do(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ve.Type = Re;
ve.Schema = hc;
ve.FAILSAFE_SCHEMA = Ec;
ve.JSON_SCHEMA = Ac;
ve.CORE_SCHEMA = Sc;
ve.DEFAULT_SCHEMA = Ro;
ve.load = eu.load;
ve.loadAll = eu.loadAll;
ve.dump = r0.dump;
ve.YAMLException = Yn;
ve.types = {
  binary: Rc,
  float: Tc,
  map: gc,
  null: yc,
  pairs: Pc,
  set: Nc,
  timestamp: $c,
  bool: vc,
  int: wc,
  merge: Oc,
  omap: Ic,
  seq: mc,
  str: pc
};
ve.safeLoad = Do("safeLoad", "load");
ve.safeLoadAll = Do("safeLoadAll", "loadAll");
ve.safeDump = Do("safeDump", "dump");
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.Lazy = void 0;
class i0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
Kr.Lazy = i0;
var oo = { exports: {} };
const o0 = "2.0.0", tu = 256, a0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, s0 = 16, l0 = tu - 6, c0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Jr = {
  MAX_LENGTH: tu,
  MAX_SAFE_COMPONENT_LENGTH: s0,
  MAX_SAFE_BUILD_LENGTH: l0,
  MAX_SAFE_INTEGER: a0,
  RELEASE_TYPES: c0,
  SEMVER_SPEC_VERSION: o0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const u0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Qr = u0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = Jr, o = Qr;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], d = t.t = {};
  let f = 0;
  const c = "[a-zA-Z0-9-]", h = [
    ["\\s", 1],
    ["\\d", i],
    [c, r]
  ], p = (T) => {
    for (const [w, A] of h)
      T = T.split(`${w}*`).join(`${w}{0,${A}}`).split(`${w}+`).join(`${w}{1,${A}}`);
    return T;
  }, y = (T, w, A) => {
    const $ = p(w), x = f++;
    o(T, x, w), d[T] = x, l[x] = w, a[x] = new RegExp(w, A ? "g" : void 0), s[x] = new RegExp($, A ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${c}*`), y("MAINVERSION", `(${l[d.NUMERICIDENTIFIER]})\\.(${l[d.NUMERICIDENTIFIER]})\\.(${l[d.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[d.NUMERICIDENTIFIERLOOSE]})\\.(${l[d.NUMERICIDENTIFIERLOOSE]})\\.(${l[d.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[d.NUMERICIDENTIFIER]}|${l[d.NONNUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[d.NUMERICIDENTIFIERLOOSE]}|${l[d.NONNUMERICIDENTIFIER]})`), y("PRERELEASE", `(?:-(${l[d.PRERELEASEIDENTIFIER]}(?:\\.${l[d.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[d.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[d.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${c}+`), y("BUILD", `(?:\\+(${l[d.BUILDIDENTIFIER]}(?:\\.${l[d.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[d.MAINVERSION]}${l[d.PRERELEASE]}?${l[d.BUILD]}?`), y("FULL", `^${l[d.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[d.MAINVERSIONLOOSE]}${l[d.PRERELEASELOOSE]}?${l[d.BUILD]}?`), y("LOOSE", `^${l[d.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[d.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[d.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[d.XRANGEIDENTIFIER]})(?:\\.(${l[d.XRANGEIDENTIFIER]})(?:\\.(${l[d.XRANGEIDENTIFIER]})(?:${l[d.PRERELEASE]})?${l[d.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[d.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[d.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[d.XRANGEIDENTIFIERLOOSE]})(?:${l[d.PRERELEASELOOSE]})?${l[d.BUILD]}?)?)?`), y("XRANGE", `^${l[d.GTLT]}\\s*${l[d.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[d.GTLT]}\\s*${l[d.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${l[d.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[d.COERCEPLAIN] + `(?:${l[d.PRERELEASE]})?(?:${l[d.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[d.COERCE], !0), y("COERCERTLFULL", l[d.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[d.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[d.LONETILDE]}${l[d.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[d.LONETILDE]}${l[d.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[d.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[d.LONECARET]}${l[d.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[d.LONECARET]}${l[d.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[d.GTLT]}\\s*(${l[d.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[d.GTLT]}\\s*(${l[d.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[d.GTLT]}\\s*(${l[d.LOOSEPLAIN]}|${l[d.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[d.XRANGEPLAIN]})\\s+-\\s+(${l[d.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[d.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[d.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(oo, oo.exports);
var Xn = oo.exports;
const f0 = Object.freeze({ loose: !0 }), d0 = Object.freeze({}), h0 = (e) => e ? typeof e != "object" ? f0 : e : d0;
var Fo = h0;
const rs = /^[0-9]+$/, nu = (e, t) => {
  const n = rs.test(e), r = rs.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, p0 = (e, t) => nu(t, e);
var ru = {
  compareIdentifiers: nu,
  rcompareIdentifiers: p0
};
const Er = Qr, { MAX_LENGTH: is, MAX_SAFE_INTEGER: yr } = Jr, { safeRe: os, t: as } = Xn, m0 = Fo, { compareIdentifiers: Mt } = ru;
let g0 = class Xe {
  constructor(t, n) {
    if (n = m0(n), t instanceof Xe) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > is)
      throw new TypeError(
        `version is longer than ${is} characters`
      );
    Er("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? os[as.LOOSE] : os[as.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > yr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > yr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > yr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < yr)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Er("SemVer.compare", this.version, this.options, t), !(t instanceof Xe)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Xe(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Xe || (t = new Xe(t, this.options)), Mt(this.major, t.major) || Mt(this.minor, t.minor) || Mt(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Xe || (t = new Xe(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Er("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return Mt(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof Xe || (t = new Xe(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Er("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return Mt(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (!n && r === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), Mt(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ie = g0;
const ss = Ie, E0 = (e, t, n = !1) => {
  if (e instanceof ss)
    return e;
  try {
    return new ss(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var an = E0;
const y0 = an, v0 = (e, t) => {
  const n = y0(e, t);
  return n ? n.version : null;
};
var w0 = v0;
const _0 = an, T0 = (e, t) => {
  const n = _0(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var A0 = T0;
const ls = Ie, S0 = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new ls(
      e instanceof ls ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var C0 = S0;
const cs = an, b0 = (e, t) => {
  const n = cs(e, null, !0), r = cs(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? n : r, s = o ? r : n, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l)
    return !s.patch && !s.minor ? "major" : a.patch ? "patch" : a.minor ? "minor" : "major";
  const f = l ? "pre" : "";
  return n.major !== r.major ? f + "major" : n.minor !== r.minor ? f + "minor" : n.patch !== r.patch ? f + "patch" : "prerelease";
};
var $0 = b0;
const O0 = Ie, R0 = (e, t) => new O0(e, t).major;
var I0 = R0;
const P0 = Ie, N0 = (e, t) => new P0(e, t).minor;
var D0 = N0;
const F0 = Ie, x0 = (e, t) => new F0(e, t).patch;
var L0 = x0;
const U0 = an, k0 = (e, t) => {
  const n = U0(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var M0 = k0;
const us = Ie, j0 = (e, t, n) => new us(e, n).compare(new us(t, n));
var Ve = j0;
const B0 = Ve, H0 = (e, t, n) => B0(t, e, n);
var q0 = H0;
const G0 = Ve, V0 = (e, t) => G0(e, t, !0);
var W0 = V0;
const fs = Ie, Y0 = (e, t, n) => {
  const r = new fs(e, n), i = new fs(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var xo = Y0;
const z0 = xo, X0 = (e, t) => e.sort((n, r) => z0(n, r, t));
var K0 = X0;
const J0 = xo, Q0 = (e, t) => e.sort((n, r) => J0(r, n, t));
var Z0 = Q0;
const eE = Ve, tE = (e, t, n) => eE(e, t, n) > 0;
var Zr = tE;
const nE = Ve, rE = (e, t, n) => nE(e, t, n) < 0;
var Lo = rE;
const iE = Ve, oE = (e, t, n) => iE(e, t, n) === 0;
var iu = oE;
const aE = Ve, sE = (e, t, n) => aE(e, t, n) !== 0;
var ou = sE;
const lE = Ve, cE = (e, t, n) => lE(e, t, n) >= 0;
var Uo = cE;
const uE = Ve, fE = (e, t, n) => uE(e, t, n) <= 0;
var ko = fE;
const dE = iu, hE = ou, pE = Zr, mE = Uo, gE = Lo, EE = ko, yE = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return dE(e, n, r);
    case "!=":
      return hE(e, n, r);
    case ">":
      return pE(e, n, r);
    case ">=":
      return mE(e, n, r);
    case "<":
      return gE(e, n, r);
    case "<=":
      return EE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var au = yE;
const vE = Ie, wE = an, { safeRe: vr, t: wr } = Xn, _E = (e, t) => {
  if (e instanceof vE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? vr[wr.COERCEFULL] : vr[wr.COERCE]);
  else {
    const l = t.includePrerelease ? vr[wr.COERCERTLFULL] : vr[wr.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || d.index + d[0].length !== n.index + n[0].length) && (n = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return wE(`${r}.${i}.${o}${a}${s}`, t);
};
var TE = _E;
class AE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var SE = AE, Pi, ds;
function We() {
  if (ds) return Pi;
  ds = 1;
  const e = /\s+/g;
  class t {
    constructor(C, N) {
      if (N = i(N), C instanceof t)
        return C.loose === !!N.loose && C.includePrerelease === !!N.includePrerelease ? C : new t(C.raw, N);
      if (C instanceof o)
        return this.raw = C.value, this.set = [[C]], this.formatted = void 0, this;
      if (this.options = N, this.loose = !!N.loose, this.includePrerelease = !!N.includePrerelease, this.raw = C.trim().replace(e, " "), this.set = this.raw.split("||").map((b) => this.parseRange(b.trim())).filter((b) => b.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const b = this.set[0];
        if (this.set = this.set.filter((L) => !T(L[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const L of this.set)
            if (L.length === 1 && w(L[0])) {
              this.set = [L];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let C = 0; C < this.set.length; C++) {
          C > 0 && (this.formatted += "||");
          const N = this.set[C];
          for (let b = 0; b < N.length; b++)
            b > 0 && (this.formatted += " "), this.formatted += N[b].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(C) {
      const b = ((this.options.includePrerelease && p) | (this.options.loose && y)) + ":" + C, L = r.get(b);
      if (L)
        return L;
      const D = this.options.loose, q = D ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      C = C.replace(q, H(this.options.includePrerelease)), a("hyphen replace", C), C = C.replace(l[d.COMPARATORTRIM], f), a("comparator trim", C), C = C.replace(l[d.TILDETRIM], c), a("tilde trim", C), C = C.replace(l[d.CARETTRIM], h), a("caret trim", C);
      let z = C.split(" ").map((V) => $(V, this.options)).join(" ").split(/\s+/).map((V) => j(V, this.options));
      D && (z = z.filter((V) => (a("loose invalid filter", V, this.options), !!V.match(l[d.COMPARATORLOOSE])))), a("range list", z);
      const W = /* @__PURE__ */ new Map(), K = z.map((V) => new o(V, this.options));
      for (const V of K) {
        if (T(V))
          return [V];
        W.set(V.value, V);
      }
      W.size > 1 && W.has("") && W.delete("");
      const fe = [...W.values()];
      return r.set(b, fe), fe;
    }
    intersects(C, N) {
      if (!(C instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => A(b, N) && C.set.some((L) => A(L, N) && b.every((D) => L.every((q) => D.intersects(q, N)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(C) {
      if (!C)
        return !1;
      if (typeof C == "string")
        try {
          C = new s(C, this.options);
        } catch {
          return !1;
        }
      for (let N = 0; N < this.set.length; N++)
        if (Y(this.set[N], C, this.options))
          return !0;
      return !1;
    }
  }
  Pi = t;
  const n = SE, r = new n(), i = Fo, o = ei(), a = Qr, s = Ie, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: f,
    tildeTrimReplace: c,
    caretTrimReplace: h
  } = Xn, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: y } = Jr, T = (P) => P.value === "<0.0.0-0", w = (P) => P.value === "", A = (P, C) => {
    let N = !0;
    const b = P.slice();
    let L = b.pop();
    for (; N && b.length; )
      N = b.every((D) => L.intersects(D, C)), L = b.pop();
    return N;
  }, $ = (P, C) => (a("comp", P, C), P = S(P, C), a("caret", P), P = k(P, C), a("tildes", P), P = F(P, C), a("xrange", P), P = M(P, C), a("stars", P), P), x = (P) => !P || P.toLowerCase() === "x" || P === "*", k = (P, C) => P.trim().split(/\s+/).map((N) => G(N, C)).join(" "), G = (P, C) => {
    const N = C.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return P.replace(N, (b, L, D, q, z) => {
      a("tilde", P, b, L, D, q, z);
      let W;
      return x(L) ? W = "" : x(D) ? W = `>=${L}.0.0 <${+L + 1}.0.0-0` : x(q) ? W = `>=${L}.${D}.0 <${L}.${+D + 1}.0-0` : z ? (a("replaceTilde pr", z), W = `>=${L}.${D}.${q}-${z} <${L}.${+D + 1}.0-0`) : W = `>=${L}.${D}.${q} <${L}.${+D + 1}.0-0`, a("tilde return", W), W;
    });
  }, S = (P, C) => P.trim().split(/\s+/).map((N) => R(N, C)).join(" "), R = (P, C) => {
    a("caret", P, C);
    const N = C.loose ? l[d.CARETLOOSE] : l[d.CARET], b = C.includePrerelease ? "-0" : "";
    return P.replace(N, (L, D, q, z, W) => {
      a("caret", P, L, D, q, z, W);
      let K;
      return x(D) ? K = "" : x(q) ? K = `>=${D}.0.0${b} <${+D + 1}.0.0-0` : x(z) ? D === "0" ? K = `>=${D}.${q}.0${b} <${D}.${+q + 1}.0-0` : K = `>=${D}.${q}.0${b} <${+D + 1}.0.0-0` : W ? (a("replaceCaret pr", W), D === "0" ? q === "0" ? K = `>=${D}.${q}.${z}-${W} <${D}.${q}.${+z + 1}-0` : K = `>=${D}.${q}.${z}-${W} <${D}.${+q + 1}.0-0` : K = `>=${D}.${q}.${z}-${W} <${+D + 1}.0.0-0`) : (a("no pr"), D === "0" ? q === "0" ? K = `>=${D}.${q}.${z}${b} <${D}.${q}.${+z + 1}-0` : K = `>=${D}.${q}.${z}${b} <${D}.${+q + 1}.0-0` : K = `>=${D}.${q}.${z} <${+D + 1}.0.0-0`), a("caret return", K), K;
    });
  }, F = (P, C) => (a("replaceXRanges", P, C), P.split(/\s+/).map((N) => E(N, C)).join(" ")), E = (P, C) => {
    P = P.trim();
    const N = C.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return P.replace(N, (b, L, D, q, z, W) => {
      a("xRange", P, b, L, D, q, z, W);
      const K = x(D), fe = K || x(q), V = fe || x(z), Ye = V;
      return L === "=" && Ye && (L = ""), W = C.includePrerelease ? "-0" : "", K ? L === ">" || L === "<" ? b = "<0.0.0-0" : b = "*" : L && Ye ? (fe && (q = 0), z = 0, L === ">" ? (L = ">=", fe ? (D = +D + 1, q = 0, z = 0) : (q = +q + 1, z = 0)) : L === "<=" && (L = "<", fe ? D = +D + 1 : q = +q + 1), L === "<" && (W = "-0"), b = `${L + D}.${q}.${z}${W}`) : fe ? b = `>=${D}.0.0${W} <${+D + 1}.0.0-0` : V && (b = `>=${D}.${q}.0${W} <${D}.${+q + 1}.0-0`), a("xRange return", b), b;
    });
  }, M = (P, C) => (a("replaceStars", P, C), P.trim().replace(l[d.STAR], "")), j = (P, C) => (a("replaceGTE0", P, C), P.trim().replace(l[C.includePrerelease ? d.GTE0PRE : d.GTE0], "")), H = (P) => (C, N, b, L, D, q, z, W, K, fe, V, Ye) => (x(b) ? N = "" : x(L) ? N = `>=${b}.0.0${P ? "-0" : ""}` : x(D) ? N = `>=${b}.${L}.0${P ? "-0" : ""}` : q ? N = `>=${N}` : N = `>=${N}${P ? "-0" : ""}`, x(K) ? W = "" : x(fe) ? W = `<${+K + 1}.0.0-0` : x(V) ? W = `<${K}.${+fe + 1}.0-0` : Ye ? W = `<=${K}.${fe}.${V}-${Ye}` : P ? W = `<${K}.${fe}.${+V + 1}-0` : W = `<=${W}`, `${N} ${W}`.trim()), Y = (P, C, N) => {
    for (let b = 0; b < P.length; b++)
      if (!P[b].test(C))
        return !1;
    if (C.prerelease.length && !N.includePrerelease) {
      for (let b = 0; b < P.length; b++)
        if (a(P[b].semver), P[b].semver !== o.ANY && P[b].semver.prerelease.length > 0) {
          const L = P[b].semver;
          if (L.major === C.major && L.minor === C.minor && L.patch === C.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Pi;
}
var Ni, hs;
function ei() {
  if (hs) return Ni;
  hs = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(f, c) {
      if (c = n(c), f instanceof t) {
        if (f.loose === !!c.loose)
          return f;
        f = f.value;
      }
      f = f.trim().split(/\s+/).join(" "), a("comparator", f, c), this.options = c, this.loose = !!c.loose, this.parse(f), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(f) {
      const c = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = f.match(c);
      if (!h)
        throw new TypeError(`Invalid comparator: ${f}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(f) {
      if (a("Comparator.test", f, this.options.loose), this.semver === e || f === e)
        return !0;
      if (typeof f == "string")
        try {
          f = new s(f, this.options);
        } catch {
          return !1;
        }
      return o(f, this.operator, this.semver, this.options);
    }
    intersects(f, c) {
      if (!(f instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(f.value, c).test(this.value) : f.operator === "" ? f.value === "" ? !0 : new l(this.value, c).test(f.semver) : (c = n(c), c.includePrerelease && (this.value === "<0.0.0-0" || f.value === "<0.0.0-0") || !c.includePrerelease && (this.value.startsWith("<0.0.0") || f.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && f.operator.startsWith(">") || this.operator.startsWith("<") && f.operator.startsWith("<") || this.semver.version === f.semver.version && this.operator.includes("=") && f.operator.includes("=") || o(this.semver, "<", f.semver, c) && this.operator.startsWith(">") && f.operator.startsWith("<") || o(this.semver, ">", f.semver, c) && this.operator.startsWith("<") && f.operator.startsWith(">")));
    }
  }
  Ni = t;
  const n = Fo, { safeRe: r, t: i } = Xn, o = au, a = Qr, s = Ie, l = We();
  return Ni;
}
const CE = We(), bE = (e, t, n) => {
  try {
    t = new CE(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var ti = bE;
const $E = We(), OE = (e, t) => new $E(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var RE = OE;
const IE = Ie, PE = We(), NE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new PE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new IE(r, n));
  }), r;
};
var DE = NE;
const FE = Ie, xE = We(), LE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new xE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new FE(r, n));
  }), r;
};
var UE = LE;
const Di = Ie, kE = We(), ps = Zr, ME = (e, t) => {
  e = new kE(e, t);
  let n = new Di("0.0.0");
  if (e.test(n) || (n = new Di("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new Di(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || ps(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || ps(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var jE = ME;
const BE = We(), HE = (e, t) => {
  try {
    return new BE(e, t).range || "*";
  } catch {
    return null;
  }
};
var qE = HE;
const GE = Ie, su = ei(), { ANY: VE } = su, WE = We(), YE = ti, ms = Zr, gs = Lo, zE = ko, XE = Uo, KE = (e, t, n, r) => {
  e = new GE(e, r), t = new WE(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = ms, o = zE, a = gs, s = ">", l = ">=";
      break;
    case "<":
      i = gs, o = XE, a = ms, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (YE(e, t, r))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const f = t.set[d];
    let c = null, h = null;
    if (f.forEach((p) => {
      p.semver === VE && (p = new su(">=0.0.0")), c = c || p, h = h || p, i(p.semver, c.semver, r) ? c = p : a(p.semver, h.semver, r) && (h = p);
    }), c.operator === s || c.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var Mo = KE;
const JE = Mo, QE = (e, t, n) => JE(e, t, ">", n);
var ZE = QE;
const ey = Mo, ty = (e, t, n) => ey(e, t, "<", n);
var ny = ty;
const Es = We(), ry = (e, t, n) => (e = new Es(e, n), t = new Es(t, n), e.intersects(t, n));
var iy = ry;
const oy = ti, ay = Ve;
var sy = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((f, c) => ay(f, c, n));
  for (const f of a)
    oy(f, t, n) ? (o = f, i || (i = f)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [f, c] of r)
    f === c ? s.push(f) : !c && f === a[0] ? s.push("*") : c ? f === a[0] ? s.push(`<=${c}`) : s.push(`${f} - ${c}`) : s.push(`>=${f}`);
  const l = s.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const ys = We(), jo = ei(), { ANY: Fi } = jo, En = ti, Bo = Ve, ly = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new ys(e, n), t = new ys(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = uy(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, cy = [new jo(">=0.0.0-0")], vs = [new jo(">=0.0.0")], uy = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Fi) {
    if (t.length === 1 && t[0].semver === Fi)
      return !0;
    n.includePrerelease ? e = cy : e = vs;
  }
  if (t.length === 1 && t[0].semver === Fi) {
    if (n.includePrerelease)
      return !0;
    t = vs;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = ws(i, p, n) : p.operator === "<" || p.operator === "<=" ? o = _s(o, p, n) : r.add(p.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = Bo(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const p of r) {
    if (i && !En(p, String(i), n) || o && !En(p, String(o), n))
      return null;
    for (const y of t)
      if (!En(p, String(y), n))
        return !1;
    return !0;
  }
  let s, l, d, f, c = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  c && c.prerelease.length === 1 && o.operator === "<" && c.prerelease[0] === 0 && (c = !1);
  for (const p of t) {
    if (f = f || p.operator === ">" || p.operator === ">=", d = d || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (s = ws(i, p, n), s === p && s !== i)
          return !1;
      } else if (i.operator === ">=" && !En(i.semver, String(p), n))
        return !1;
    }
    if (o) {
      if (c && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === c.major && p.semver.minor === c.minor && p.semver.patch === c.patch && (c = !1), p.operator === "<" || p.operator === "<=") {
        if (l = _s(o, p, n), l === p && l !== o)
          return !1;
      } else if (o.operator === "<=" && !En(o.semver, String(p), n))
        return !1;
    }
    if (!p.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && d && !o && a !== 0 || o && f && !i && a !== 0 || h || c);
}, ws = (e, t, n) => {
  if (!e)
    return t;
  const r = Bo(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, _s = (e, t, n) => {
  if (!e)
    return t;
  const r = Bo(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var fy = ly;
const xi = Xn, Ts = Jr, dy = Ie, As = ru, hy = an, py = w0, my = A0, gy = C0, Ey = $0, yy = I0, vy = D0, wy = L0, _y = M0, Ty = Ve, Ay = q0, Sy = W0, Cy = xo, by = K0, $y = Z0, Oy = Zr, Ry = Lo, Iy = iu, Py = ou, Ny = Uo, Dy = ko, Fy = au, xy = TE, Ly = ei(), Uy = We(), ky = ti, My = RE, jy = DE, By = UE, Hy = jE, qy = qE, Gy = Mo, Vy = ZE, Wy = ny, Yy = iy, zy = sy, Xy = fy;
var lu = {
  parse: hy,
  valid: py,
  clean: my,
  inc: gy,
  diff: Ey,
  major: yy,
  minor: vy,
  patch: wy,
  prerelease: _y,
  compare: Ty,
  rcompare: Ay,
  compareLoose: Sy,
  compareBuild: Cy,
  sort: by,
  rsort: $y,
  gt: Oy,
  lt: Ry,
  eq: Iy,
  neq: Py,
  gte: Ny,
  lte: Dy,
  cmp: Fy,
  coerce: xy,
  Comparator: Ly,
  Range: Uy,
  satisfies: ky,
  toComparators: My,
  maxSatisfying: jy,
  minSatisfying: By,
  minVersion: Hy,
  validRange: qy,
  outside: Gy,
  gtr: Vy,
  ltr: Wy,
  intersects: Yy,
  simplifyRange: zy,
  subset: Xy,
  SemVer: dy,
  re: xi.re,
  src: xi.src,
  tokens: xi.t,
  SEMVER_SPEC_VERSION: Ts.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Ts.RELEASE_TYPES,
  compareIdentifiers: As.compareIdentifiers,
  rcompareIdentifiers: As.rcompareIdentifiers
}, Kn = {}, Mr = { exports: {} };
Mr.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", f = "[object Boolean]", c = "[object Date]", h = "[object Error]", p = "[object Function]", y = "[object GeneratorFunction]", T = "[object Map]", w = "[object Number]", A = "[object Null]", $ = "[object Object]", x = "[object Promise]", k = "[object Proxy]", G = "[object RegExp]", S = "[object Set]", R = "[object String]", F = "[object Symbol]", E = "[object Undefined]", M = "[object WeakMap]", j = "[object ArrayBuffer]", H = "[object DataView]", Y = "[object Float32Array]", P = "[object Float64Array]", C = "[object Int8Array]", N = "[object Int16Array]", b = "[object Int32Array]", L = "[object Uint8Array]", D = "[object Uint8ClampedArray]", q = "[object Uint16Array]", z = "[object Uint32Array]", W = /[\\^$.*+?()[\]{}|]/g, K = /^\[object .+?Constructor\]$/, fe = /^(?:0|[1-9]\d*)$/, V = {};
  V[Y] = V[P] = V[C] = V[N] = V[b] = V[L] = V[D] = V[q] = V[z] = !0, V[s] = V[l] = V[j] = V[f] = V[H] = V[c] = V[h] = V[p] = V[T] = V[w] = V[$] = V[G] = V[S] = V[R] = V[M] = !1;
  var Ye = typeof He == "object" && He && He.Object === Object && He, m = typeof self == "object" && self && self.Object === Object && self, u = Ye || m || Function("return this")(), O = t && !t.nodeType && t, _ = O && !0 && e && !e.nodeType && e, Q = _ && _.exports === O, te = Q && Ye.process, oe = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), ge = oe && oe.isTypedArray;
  function we(g, v) {
    for (var I = -1, U = g == null ? 0 : g.length, ee = 0, X = []; ++I < U; ) {
      var ae = g[I];
      v(ae, I, g) && (X[ee++] = ae);
    }
    return X;
  }
  function rt(g, v) {
    for (var I = -1, U = v.length, ee = g.length; ++I < U; )
      g[ee + I] = v[I];
    return g;
  }
  function ce(g, v) {
    for (var I = -1, U = g == null ? 0 : g.length; ++I < U; )
      if (v(g[I], I, g))
        return !0;
    return !1;
  }
  function Me(g, v) {
    for (var I = -1, U = Array(g); ++I < g; )
      U[I] = v(I);
    return U;
  }
  function ui(g) {
    return function(v) {
      return g(v);
    };
  }
  function tr(g, v) {
    return g.has(v);
  }
  function cn(g, v) {
    return g == null ? void 0 : g[v];
  }
  function nr(g) {
    var v = -1, I = Array(g.size);
    return g.forEach(function(U, ee) {
      I[++v] = [ee, U];
    }), I;
  }
  function Tu(g, v) {
    return function(I) {
      return g(v(I));
    };
  }
  function Au(g) {
    var v = -1, I = Array(g.size);
    return g.forEach(function(U) {
      I[++v] = U;
    }), I;
  }
  var Su = Array.prototype, Cu = Function.prototype, rr = Object.prototype, fi = u["__core-js_shared__"], Wo = Cu.toString, ze = rr.hasOwnProperty, Yo = function() {
    var g = /[^.]+$/.exec(fi && fi.keys && fi.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), zo = rr.toString, bu = RegExp(
    "^" + Wo.call(ze).replace(W, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Xo = Q ? u.Buffer : void 0, ir = u.Symbol, Ko = u.Uint8Array, Jo = rr.propertyIsEnumerable, $u = Su.splice, vt = ir ? ir.toStringTag : void 0, Qo = Object.getOwnPropertySymbols, Ou = Xo ? Xo.isBuffer : void 0, Ru = Tu(Object.keys, Object), di = Lt(u, "DataView"), un = Lt(u, "Map"), hi = Lt(u, "Promise"), pi = Lt(u, "Set"), mi = Lt(u, "WeakMap"), fn = Lt(Object, "create"), Iu = Tt(di), Pu = Tt(un), Nu = Tt(hi), Du = Tt(pi), Fu = Tt(mi), Zo = ir ? ir.prototype : void 0, gi = Zo ? Zo.valueOf : void 0;
  function wt(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.clear(); ++v < I; ) {
      var U = g[v];
      this.set(U[0], U[1]);
    }
  }
  function xu() {
    this.__data__ = fn ? fn(null) : {}, this.size = 0;
  }
  function Lu(g) {
    var v = this.has(g) && delete this.__data__[g];
    return this.size -= v ? 1 : 0, v;
  }
  function Uu(g) {
    var v = this.__data__;
    if (fn) {
      var I = v[g];
      return I === r ? void 0 : I;
    }
    return ze.call(v, g) ? v[g] : void 0;
  }
  function ku(g) {
    var v = this.__data__;
    return fn ? v[g] !== void 0 : ze.call(v, g);
  }
  function Mu(g, v) {
    var I = this.__data__;
    return this.size += this.has(g) ? 0 : 1, I[g] = fn && v === void 0 ? r : v, this;
  }
  wt.prototype.clear = xu, wt.prototype.delete = Lu, wt.prototype.get = Uu, wt.prototype.has = ku, wt.prototype.set = Mu;
  function Qe(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.clear(); ++v < I; ) {
      var U = g[v];
      this.set(U[0], U[1]);
    }
  }
  function ju() {
    this.__data__ = [], this.size = 0;
  }
  function Bu(g) {
    var v = this.__data__, I = ar(v, g);
    if (I < 0)
      return !1;
    var U = v.length - 1;
    return I == U ? v.pop() : $u.call(v, I, 1), --this.size, !0;
  }
  function Hu(g) {
    var v = this.__data__, I = ar(v, g);
    return I < 0 ? void 0 : v[I][1];
  }
  function qu(g) {
    return ar(this.__data__, g) > -1;
  }
  function Gu(g, v) {
    var I = this.__data__, U = ar(I, g);
    return U < 0 ? (++this.size, I.push([g, v])) : I[U][1] = v, this;
  }
  Qe.prototype.clear = ju, Qe.prototype.delete = Bu, Qe.prototype.get = Hu, Qe.prototype.has = qu, Qe.prototype.set = Gu;
  function _t(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.clear(); ++v < I; ) {
      var U = g[v];
      this.set(U[0], U[1]);
    }
  }
  function Vu() {
    this.size = 0, this.__data__ = {
      hash: new wt(),
      map: new (un || Qe)(),
      string: new wt()
    };
  }
  function Wu(g) {
    var v = sr(this, g).delete(g);
    return this.size -= v ? 1 : 0, v;
  }
  function Yu(g) {
    return sr(this, g).get(g);
  }
  function zu(g) {
    return sr(this, g).has(g);
  }
  function Xu(g, v) {
    var I = sr(this, g), U = I.size;
    return I.set(g, v), this.size += I.size == U ? 0 : 1, this;
  }
  _t.prototype.clear = Vu, _t.prototype.delete = Wu, _t.prototype.get = Yu, _t.prototype.has = zu, _t.prototype.set = Xu;
  function or(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.__data__ = new _t(); ++v < I; )
      this.add(g[v]);
  }
  function Ku(g) {
    return this.__data__.set(g, r), this;
  }
  function Ju(g) {
    return this.__data__.has(g);
  }
  or.prototype.add = or.prototype.push = Ku, or.prototype.has = Ju;
  function it(g) {
    var v = this.__data__ = new Qe(g);
    this.size = v.size;
  }
  function Qu() {
    this.__data__ = new Qe(), this.size = 0;
  }
  function Zu(g) {
    var v = this.__data__, I = v.delete(g);
    return this.size = v.size, I;
  }
  function ef(g) {
    return this.__data__.get(g);
  }
  function tf(g) {
    return this.__data__.has(g);
  }
  function nf(g, v) {
    var I = this.__data__;
    if (I instanceof Qe) {
      var U = I.__data__;
      if (!un || U.length < n - 1)
        return U.push([g, v]), this.size = ++I.size, this;
      I = this.__data__ = new _t(U);
    }
    return I.set(g, v), this.size = I.size, this;
  }
  it.prototype.clear = Qu, it.prototype.delete = Zu, it.prototype.get = ef, it.prototype.has = tf, it.prototype.set = nf;
  function rf(g, v) {
    var I = lr(g), U = !I && vf(g), ee = !I && !U && Ei(g), X = !I && !U && !ee && la(g), ae = I || U || ee || X, de = ae ? Me(g.length, String) : [], Ee = de.length;
    for (var ne in g)
      ze.call(g, ne) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ne == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ee && (ne == "offset" || ne == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      X && (ne == "buffer" || ne == "byteLength" || ne == "byteOffset") || // Skip index properties.
      pf(ne, Ee))) && de.push(ne);
    return de;
  }
  function ar(g, v) {
    for (var I = g.length; I--; )
      if (ia(g[I][0], v))
        return I;
    return -1;
  }
  function of(g, v, I) {
    var U = v(g);
    return lr(g) ? U : rt(U, I(g));
  }
  function dn(g) {
    return g == null ? g === void 0 ? E : A : vt && vt in Object(g) ? df(g) : yf(g);
  }
  function ea(g) {
    return hn(g) && dn(g) == s;
  }
  function ta(g, v, I, U, ee) {
    return g === v ? !0 : g == null || v == null || !hn(g) && !hn(v) ? g !== g && v !== v : af(g, v, I, U, ta, ee);
  }
  function af(g, v, I, U, ee, X) {
    var ae = lr(g), de = lr(v), Ee = ae ? l : ot(g), ne = de ? l : ot(v);
    Ee = Ee == s ? $ : Ee, ne = ne == s ? $ : ne;
    var Fe = Ee == $, je = ne == $, _e = Ee == ne;
    if (_e && Ei(g)) {
      if (!Ei(v))
        return !1;
      ae = !0, Fe = !1;
    }
    if (_e && !Fe)
      return X || (X = new it()), ae || la(g) ? na(g, v, I, U, ee, X) : uf(g, v, Ee, I, U, ee, X);
    if (!(I & i)) {
      var Le = Fe && ze.call(g, "__wrapped__"), Ue = je && ze.call(v, "__wrapped__");
      if (Le || Ue) {
        var at = Le ? g.value() : g, Ze = Ue ? v.value() : v;
        return X || (X = new it()), ee(at, Ze, I, U, X);
      }
    }
    return _e ? (X || (X = new it()), ff(g, v, I, U, ee, X)) : !1;
  }
  function sf(g) {
    if (!sa(g) || gf(g))
      return !1;
    var v = oa(g) ? bu : K;
    return v.test(Tt(g));
  }
  function lf(g) {
    return hn(g) && aa(g.length) && !!V[dn(g)];
  }
  function cf(g) {
    if (!Ef(g))
      return Ru(g);
    var v = [];
    for (var I in Object(g))
      ze.call(g, I) && I != "constructor" && v.push(I);
    return v;
  }
  function na(g, v, I, U, ee, X) {
    var ae = I & i, de = g.length, Ee = v.length;
    if (de != Ee && !(ae && Ee > de))
      return !1;
    var ne = X.get(g);
    if (ne && X.get(v))
      return ne == v;
    var Fe = -1, je = !0, _e = I & o ? new or() : void 0;
    for (X.set(g, v), X.set(v, g); ++Fe < de; ) {
      var Le = g[Fe], Ue = v[Fe];
      if (U)
        var at = ae ? U(Ue, Le, Fe, v, g, X) : U(Le, Ue, Fe, g, v, X);
      if (at !== void 0) {
        if (at)
          continue;
        je = !1;
        break;
      }
      if (_e) {
        if (!ce(v, function(Ze, At) {
          if (!tr(_e, At) && (Le === Ze || ee(Le, Ze, I, U, X)))
            return _e.push(At);
        })) {
          je = !1;
          break;
        }
      } else if (!(Le === Ue || ee(Le, Ue, I, U, X))) {
        je = !1;
        break;
      }
    }
    return X.delete(g), X.delete(v), je;
  }
  function uf(g, v, I, U, ee, X, ae) {
    switch (I) {
      case H:
        if (g.byteLength != v.byteLength || g.byteOffset != v.byteOffset)
          return !1;
        g = g.buffer, v = v.buffer;
      case j:
        return !(g.byteLength != v.byteLength || !X(new Ko(g), new Ko(v)));
      case f:
      case c:
      case w:
        return ia(+g, +v);
      case h:
        return g.name == v.name && g.message == v.message;
      case G:
      case R:
        return g == v + "";
      case T:
        var de = nr;
      case S:
        var Ee = U & i;
        if (de || (de = Au), g.size != v.size && !Ee)
          return !1;
        var ne = ae.get(g);
        if (ne)
          return ne == v;
        U |= o, ae.set(g, v);
        var Fe = na(de(g), de(v), U, ee, X, ae);
        return ae.delete(g), Fe;
      case F:
        if (gi)
          return gi.call(g) == gi.call(v);
    }
    return !1;
  }
  function ff(g, v, I, U, ee, X) {
    var ae = I & i, de = ra(g), Ee = de.length, ne = ra(v), Fe = ne.length;
    if (Ee != Fe && !ae)
      return !1;
    for (var je = Ee; je--; ) {
      var _e = de[je];
      if (!(ae ? _e in v : ze.call(v, _e)))
        return !1;
    }
    var Le = X.get(g);
    if (Le && X.get(v))
      return Le == v;
    var Ue = !0;
    X.set(g, v), X.set(v, g);
    for (var at = ae; ++je < Ee; ) {
      _e = de[je];
      var Ze = g[_e], At = v[_e];
      if (U)
        var ca = ae ? U(At, Ze, _e, v, g, X) : U(Ze, At, _e, g, v, X);
      if (!(ca === void 0 ? Ze === At || ee(Ze, At, I, U, X) : ca)) {
        Ue = !1;
        break;
      }
      at || (at = _e == "constructor");
    }
    if (Ue && !at) {
      var cr = g.constructor, ur = v.constructor;
      cr != ur && "constructor" in g && "constructor" in v && !(typeof cr == "function" && cr instanceof cr && typeof ur == "function" && ur instanceof ur) && (Ue = !1);
    }
    return X.delete(g), X.delete(v), Ue;
  }
  function ra(g) {
    return of(g, Tf, hf);
  }
  function sr(g, v) {
    var I = g.__data__;
    return mf(v) ? I[typeof v == "string" ? "string" : "hash"] : I.map;
  }
  function Lt(g, v) {
    var I = cn(g, v);
    return sf(I) ? I : void 0;
  }
  function df(g) {
    var v = ze.call(g, vt), I = g[vt];
    try {
      g[vt] = void 0;
      var U = !0;
    } catch {
    }
    var ee = zo.call(g);
    return U && (v ? g[vt] = I : delete g[vt]), ee;
  }
  var hf = Qo ? function(g) {
    return g == null ? [] : (g = Object(g), we(Qo(g), function(v) {
      return Jo.call(g, v);
    }));
  } : Af, ot = dn;
  (di && ot(new di(new ArrayBuffer(1))) != H || un && ot(new un()) != T || hi && ot(hi.resolve()) != x || pi && ot(new pi()) != S || mi && ot(new mi()) != M) && (ot = function(g) {
    var v = dn(g), I = v == $ ? g.constructor : void 0, U = I ? Tt(I) : "";
    if (U)
      switch (U) {
        case Iu:
          return H;
        case Pu:
          return T;
        case Nu:
          return x;
        case Du:
          return S;
        case Fu:
          return M;
      }
    return v;
  });
  function pf(g, v) {
    return v = v ?? a, !!v && (typeof g == "number" || fe.test(g)) && g > -1 && g % 1 == 0 && g < v;
  }
  function mf(g) {
    var v = typeof g;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? g !== "__proto__" : g === null;
  }
  function gf(g) {
    return !!Yo && Yo in g;
  }
  function Ef(g) {
    var v = g && g.constructor, I = typeof v == "function" && v.prototype || rr;
    return g === I;
  }
  function yf(g) {
    return zo.call(g);
  }
  function Tt(g) {
    if (g != null) {
      try {
        return Wo.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function ia(g, v) {
    return g === v || g !== g && v !== v;
  }
  var vf = ea(/* @__PURE__ */ function() {
    return arguments;
  }()) ? ea : function(g) {
    return hn(g) && ze.call(g, "callee") && !Jo.call(g, "callee");
  }, lr = Array.isArray;
  function wf(g) {
    return g != null && aa(g.length) && !oa(g);
  }
  var Ei = Ou || Sf;
  function _f(g, v) {
    return ta(g, v);
  }
  function oa(g) {
    if (!sa(g))
      return !1;
    var v = dn(g);
    return v == p || v == y || v == d || v == k;
  }
  function aa(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function sa(g) {
    var v = typeof g;
    return g != null && (v == "object" || v == "function");
  }
  function hn(g) {
    return g != null && typeof g == "object";
  }
  var la = ge ? ui(ge) : lf;
  function Tf(g) {
    return wf(g) ? rf(g) : cf(g);
  }
  function Af() {
    return [];
  }
  function Sf() {
    return !1;
  }
  e.exports = _f;
})(Mr, Mr.exports);
var Ky = Mr.exports;
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.DownloadedUpdateHelper = void 0;
Kn.createTempUpdateFile = tv;
const Jy = Hn, Qy = Et, Ss = Ky, bt = yt, Nn = ie;
class Zy {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Nn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Ss(this.versionInfo, n) && Ss(this.fileInfo.info, r.info) && await (0, bt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, bt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, bt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, bt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, bt.readJson)(r);
    } catch (d) {
      let f = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), f += ` (error on read: ${d.message})`), n.info(f), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Nn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, bt.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await ev(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Nn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Kn.DownloadedUpdateHelper = Zy;
function ev(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, Jy.createHash)(t);
    a.on("error", o).setEncoding(n), (0, Qy.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function tv(e, t, n) {
  let r = 0, i = Nn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, bt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = Nn.join(t, `${r++}-${e}`);
    }
  return i;
}
var ni = {}, Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.getAppCacheDir = rv;
const Li = ie, nv = jr;
function rv() {
  const e = (0, nv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Li.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Li.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Li.join(e, ".cache"), t;
}
Object.defineProperty(ni, "__esModule", { value: !0 });
ni.ElectronAppAdapter = void 0;
const Cs = ie, iv = Ho;
class ov {
  constructor(t = Pt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Cs.join(process.resourcesPath, "app-update.yml") : Cs.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, iv.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
ni.ElectronAppAdapter = ov;
var cu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = pe;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Pt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, d, f) => {
        const c = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, c), (0, t.configureRequestOptions)(c), this.doDownload(c, {
          destination: a,
          options: s,
          onCancel: f,
          callback: (h) => {
            h == null ? l(a) : d(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const s = Pt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, d) {
      o.on("redirect", (f, c, h) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : d(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(cu);
var Jn = {}, ke = {}, av = 1 / 0, sv = "[object Symbol]", uu = /[\\^$.*+?()[\]{}|]/g, lv = RegExp(uu.source), cv = typeof He == "object" && He && He.Object === Object && He, uv = typeof self == "object" && self && self.Object === Object && self, fv = cv || uv || Function("return this")(), dv = Object.prototype, hv = dv.toString, bs = fv.Symbol, $s = bs ? bs.prototype : void 0, Os = $s ? $s.toString : void 0;
function pv(e) {
  if (typeof e == "string")
    return e;
  if (gv(e))
    return Os ? Os.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -av ? "-0" : t;
}
function mv(e) {
  return !!e && typeof e == "object";
}
function gv(e) {
  return typeof e == "symbol" || mv(e) && hv.call(e) == sv;
}
function Ev(e) {
  return e == null ? "" : pv(e);
}
function yv(e) {
  return e = Ev(e), e && lv.test(e) ? e.replace(uu, "\\$&") : e;
}
var vv = yv;
Object.defineProperty(ke, "__esModule", { value: !0 });
ke.newBaseUrl = _v;
ke.newUrlFromBase = ao;
ke.getChannelFilename = Tv;
ke.blockmapFiles = Av;
const fu = nn, wv = vv;
function _v(e) {
  const t = new fu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function ao(e, t, n = !1) {
  const r = new fu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function Tv(e) {
  return `${e}.yml`;
}
function Av(e, t, n) {
  const r = ao(`${e.pathname}.blockmap`, e);
  return [ao(`${e.pathname.replace(new RegExp(wv(n), "g"), t)}.blockmap`, e), r];
}
var me = {};
Object.defineProperty(me, "__esModule", { value: !0 });
me.Provider = void 0;
me.findFile = bv;
me.parseUpdateInfo = $v;
me.getFileList = du;
me.resolveFiles = Ov;
const mt = pe, Sv = ve, Rs = ke;
class Cv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, mt.configureRequestUrl)(t, r), r;
  }
}
me.Provider = Cv;
function bv(e, t, n) {
  if (e.length === 0)
    throw (0, mt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const r = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return r ?? (n == null ? e[0] : e.find((i) => !n.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function $v(e, t, n) {
  if (e == null)
    throw (0, mt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, Sv.load)(e);
  } catch (i) {
    throw (0, mt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function du(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, mt.newError)(`No files provided: ${(0, mt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Ov(e, t, n = (r) => r) {
  const i = du(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, mt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, mt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Rs.newUrlFromBase)(n(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, Rs.newUrlFromBase)(n(a.path), t).href
  }), i;
}
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.GenericProvider = void 0;
const Is = pe, Ui = ke, ki = me;
class Rv extends ki.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, Ui.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Ui.getChannelFilename)(this.channel), n = (0, Ui.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, ki.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Is.HttpError && i.statusCode === 404)
          throw (0, Is.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, ki.resolveFiles)(t, this.baseUrl);
  }
}
Jn.GenericProvider = Rv;
var ri = {}, ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
ii.BitbucketProvider = void 0;
const Ps = pe, Mi = ke, ji = me;
class Iv extends ji.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Mi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Ps.CancellationToken(), n = (0, Mi.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Mi.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, ji.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Ps.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, ji.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
ii.BitbucketProvider = Iv;
var gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.GitHubProvider = gt.BaseGitHubProvider = void 0;
gt.computeReleaseNotes = pu;
const et = pe, Wt = lu, Pv = nn, Yt = ke, so = me, Bi = /\/tag\/([^/]+)$/;
class hu extends so.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Yt.newBaseUrl)((0, et.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, Yt.newBaseUrl)((0, et.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
gt.BaseGitHubProvider = hu;
class Nv extends hu {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new et.CancellationToken(), s = await this.httpRequest((0, Yt.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, et.parseXml)(s);
    let d = l.element("entry", !1, "No published versions on GitHub"), f = null;
    try {
      if (this.updater.allowPrerelease) {
        const w = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Wt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (w === null)
          f = Bi.exec(d.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const $ = Bi.exec(A.element("link").attribute("href"));
            if ($ === null)
              continue;
            const x = $[1], k = ((r = Wt.prerelease(x)) === null || r === void 0 ? void 0 : r[0]) || null, G = !w || ["alpha", "beta"].includes(w), S = k !== null && !["alpha", "beta"].includes(String(k));
            if (G && !S && !(w === "beta" && k === "alpha")) {
              f = x;
              break;
            }
            if (k && k === w) {
              f = x;
              break;
            }
          }
      } else {
        f = await this.getLatestTagName(a);
        for (const w of l.getElements("entry"))
          if (Bi.exec(w.element("link").attribute("href"))[1] === f) {
            d = w;
            break;
          }
      }
    } catch (w) {
      throw (0, et.newError)(`Cannot parse releases feed: ${w.stack || w.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (f == null)
      throw (0, et.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let c, h = "", p = "";
    const y = async (w) => {
      h = (0, Yt.getChannelFilename)(w), p = (0, Yt.newUrlFromBase)(this.getBaseDownloadPath(String(f), h), this.baseUrl);
      const A = this.createRequestOptions(p);
      try {
        return await this.executor.request(A, a);
      } catch ($) {
        throw $ instanceof et.HttpError && $.statusCode === 404 ? (0, et.newError)(`Cannot find ${h} in the latest release artifacts (${p}): ${$.stack || $.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : $;
      }
    };
    try {
      let w = this.channel;
      this.updater.allowPrerelease && (!((i = Wt.prerelease(f)) === null || i === void 0) && i[0]) && (w = this.getCustomChannelName(String((o = Wt.prerelease(f)) === null || o === void 0 ? void 0 : o[0]))), c = await y(w);
    } catch (w) {
      if (this.updater.allowPrerelease)
        c = await y(this.getDefaultChannelName());
      else
        throw w;
    }
    const T = (0, so.parseUpdateInfo)(c, h, p);
    return T.releaseName == null && (T.releaseName = d.elementValueOrEmpty("title")), T.releaseNotes == null && (T.releaseNotes = pu(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: f,
      ...T
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, Yt.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Pv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, et.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, so.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
gt.GitHubProvider = Nv;
function Ns(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function pu(e, t, n, r) {
  if (!t)
    return Ns(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Wt.lt(e, a) && i.push({
      version: a,
      note: Ns(o)
    });
  }
  return i.sort((o, a) => Wt.rcompare(o.version, a.version));
}
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
oi.KeygenProvider = void 0;
const Ds = pe, Hi = ke, qi = me;
class Dv extends qi.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.baseUrl = (0, Hi.newBaseUrl)(`https://api.keygen.sh/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Ds.CancellationToken(), n = (0, Hi.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Hi.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, qi.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Ds.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, qi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
oi.KeygenProvider = Dv;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
ai.PrivateGitHubProvider = void 0;
const jt = pe, Fv = ve, xv = ie, Fs = nn, xs = ke, Lv = gt, Uv = me;
class kv extends Lv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new jt.CancellationToken(), n = (0, xs.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, jt.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Fs.URL(i.url);
    let a;
    try {
      a = (0, Fv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof jt.HttpError && s.statusCode === 404 ? (0, jt.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = r.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, xs.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, jt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Uv.getFileList)(t).map((n) => {
      const r = xv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, jt.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Fs.URL(i.url),
        info: n
      };
    });
  }
}
ai.PrivateGitHubProvider = kv;
Object.defineProperty(ri, "__esModule", { value: !0 });
ri.isUrlProbablySupportMultiRangeRequests = mu;
ri.createClient = qv;
const _r = pe, Mv = ii, Ls = Jn, jv = gt, Bv = oi, Hv = ai;
function mu(e) {
  return !e.includes("s3.amazonaws.com");
}
function qv(e, t, n) {
  if (typeof e == "string")
    throw (0, _r.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new jv.GitHubProvider(i, t, n) : new Hv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Mv.BitbucketProvider(e, t, n);
    case "keygen":
      return new Bv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Ls.GenericProvider({
        provider: "generic",
        url: (0, _r.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Ls.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && mu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, _r.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, _r.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var si = {}, Qn = {}, sn = {}, xt = {};
Object.defineProperty(xt, "__esModule", { value: !0 });
xt.OperationKind = void 0;
xt.computeOperations = Gv;
var Ot;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Ot || (xt.OperationKind = Ot = {}));
function Gv(e, t, n) {
  const r = ks(e.files), i = ks(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, d = r.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const f = i.get(l);
  let c = 0;
  const { checksumToOffset: h, checksumToOldSize: p } = Wv(r.get(l), d.offset, n);
  let y = a.offset;
  for (let T = 0; T < f.checksums.length; y += f.sizes[T], T++) {
    const w = f.sizes[T], A = f.checksums[T];
    let $ = h.get(A);
    $ != null && p.get(A) !== w && (n.warn(`Checksum ("${A}") matches, but size differs (old: ${p.get(A)}, new: ${w})`), $ = void 0), $ === void 0 ? (c++, o != null && o.kind === Ot.DOWNLOAD && o.end === y ? o.end += w : (o = {
      kind: Ot.DOWNLOAD,
      start: y,
      end: y + w
      // oldBlocks: null,
    }, Us(o, s, A, T))) : o != null && o.kind === Ot.COPY && o.end === $ ? o.end += w : (o = {
      kind: Ot.COPY,
      start: $,
      end: $ + w
      // oldBlocks: [checksum]
    }, Us(o, s, A, T));
  }
  return c > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${c} changed blocks`), s;
}
const Vv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Us(e, t, n, r) {
  if (Vv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Ot[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Wv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], d = i.get(s);
    if (d === void 0)
      r.set(s, o), i.set(s, l);
    else if (n.debug != null) {
      const f = d === l ? "(same size)" : `(size: ${d}, this size: ${l})`;
      n.debug(`${s} duplicated in blockmap ${f}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function ks(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.DataSplitter = void 0;
sn.copyData = gu;
const Tr = pe, Yv = Et, zv = qn, Xv = xt, Ms = Buffer.from(`\r
\r
`);
var lt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(lt || (lt = {}));
function gu(e, t, n, r, i) {
  const o = (0, Yv.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class Kv extends zv.Writable {
  constructor(t, n, r, i, o, a) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = lt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(r).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Tr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === lt.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = lt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === lt.BODY)
          this.readState = lt.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Tr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Tr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = lt.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== Xv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        gu(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Ms, n);
    if (r !== -1)
      return r + Ms.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Tr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
sn.DataSplitter = Kv;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.executeTasksUsingMultipleRangeRequests = Jv;
li.checkIsRangesSupported = co;
const lo = pe, js = sn, Bs = xt;
function Jv(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    Qv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function Qv(e, t, n, r, i) {
  let o = "bytes=", a = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let c = t.start; c < t.end; c++) {
    const h = t.tasks[c];
    h.kind === Bs.OperationKind.DOWNLOAD && (o += `${h.start}-${h.end - 1}, `, s.set(a, c), a++, l.push(h.end - h.start));
  }
  if (a <= 1) {
    const c = (h) => {
      if (h >= t.end) {
        r();
        return;
      }
      const p = t.tasks[h++];
      if (p.kind === Bs.OperationKind.COPY)
        (0, js.copyData)(p, n, t.oldFileFd, i, () => c(h));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${p.start}-${p.end - 1}`;
        const T = e.httpExecutor.createRequest(y, (w) => {
          co(w, i) && (w.pipe(n, {
            end: !1
          }), w.once("end", () => c(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(T, i), T.end();
      }
    };
    c(t.start);
    return;
  }
  const d = e.createRequestOptions();
  d.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(d, (c) => {
    if (!co(c, i))
      return;
    const h = (0, lo.safeGetHeader)(c, "content-type"), p = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(h);
    if (p == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const y = new js.DataSplitter(n, t, s, p[1] || p[2], l, r);
    y.on("error", i), c.pipe(y), c.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function co(e, t) {
  if (e.statusCode >= 400)
    return t((0, lo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, lo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.ProgressDifferentialDownloadCallbackTransform = void 0;
const Zv = qn;
var zt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(zt || (zt = {}));
class ew extends Zv.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = zt.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == zt.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = zt.COPY;
  }
  beginRangeDownload() {
    this.operationType = zt.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
ci.ProgressDifferentialDownloadCallbackTransform = ew;
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.DifferentialDownloader = void 0;
const yn = pe, Gi = yt, tw = Et, nw = sn, rw = nn, Ar = xt, Hs = li, iw = ci;
class ow {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, yn.configureRequestUrl)(this.options.newUrl, t), (0, yn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Ar.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Ar.OperationKind.DOWNLOAD ? o += d : a += d;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${qs(s)}, To download: ${qs(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, Gi.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, Gi.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, Gi.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, tw.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let $ = 0;
        for (const k of t)
          k.kind === Ar.OperationKind.DOWNLOAD && (A.push(k.end - k.start), $ += k.end - k.start);
        const x = {
          expectedByteCounts: A,
          grandTotal: $
        };
        d = new iw.ProgressDifferentialDownloadCallbackTransform(x, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const f = new yn.DigestTransform(this.blockAwareFileInfo.sha512);
      f.isValidateOnEnd = !1, l.push(f), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            f.validate();
          } catch (A) {
            s(A);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let c = null;
      for (const A of l)
        A.on("error", s), c == null ? c = A : c = c.pipe(A);
      const h = l[0];
      let p;
      if (this.options.isUseMultipleRangeRequest) {
        p = (0, Hs.executeTasksUsingMultipleRangeRequests)(this, t, h, r, s), p(0);
        return;
      }
      let y = 0, T = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const w = this.createRequestOptions();
      w.redirect = "manual", p = (A) => {
        var $, x;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const k = t[A++];
        if (k.kind === Ar.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, nw.copyData)(k, h, r, s, () => p(A));
          return;
        }
        const G = `bytes=${k.start}-${k.end - 1}`;
        w.headers.range = G, (x = ($ = this.logger) === null || $ === void 0 ? void 0 : $.debug) === null || x === void 0 || x.call($, `download range: ${G}`), d && d.beginRangeDownload();
        const S = this.httpExecutor.createRequest(w, (R) => {
          R.on("error", s), R.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), R.statusCode >= 400 && s((0, yn.createHttpError)(R)), R.pipe(h, {
            end: !1
          }), R.once("end", () => {
            d && d.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => p(A), 1e3)) : p(A);
          });
        });
        S.on("redirect", (R, F, E) => {
          this.logger.info(`Redirect to ${aw(E)}`), T = E, (0, yn.configureRequestUrl)(new rw.URL(T), w), S.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(S, s), S.end();
      }, p(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(r, o), o += a.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, Hs.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
Qn.DifferentialDownloader = ow;
function qs(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function aw(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(si, "__esModule", { value: !0 });
si.GenericDifferentialDownloader = void 0;
const sw = Qn;
class lw extends sw.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
si.GenericDifferentialDownloader = lw;
var Gs;
function qo() {
  if (Gs) return St;
  Gs = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.NoOpLogger = St.AppUpdater = void 0;
  const e = pe, t = Hn, n = jr, r = cl, i = yt, o = ve, a = Kr, s = ie, l = lu, d = Kn, f = ni, c = cu, h = Jn, p = ln(), y = ri, T = dl, w = ke, A = si;
  let $ = class Eu extends r.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(S) {
      if (this._channel != null) {
        if (typeof S != "string")
          throw (0, e.newError)(`Channel must be a string, but got: ${S}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (S.length === 0)
          throw (0, e.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = S, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(S) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: S
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, c.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(S) {
      this._logger = S ?? new k();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(S) {
      this.clientPromise = null, this._appUpdateConfigPath = S, this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig());
    }
    constructor(S, R) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new p.UpdaterSignal(this), this._appUpdateConfigPath = null, this.clientPromise = null, this.stagingUserIdPromise = new a.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new a.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (M) => {
        this._logger.error(`Error: ${M.stack || M.message}`);
      }), R == null ? (this.app = new f.ElectronAppAdapter(), this.httpExecutor = new c.ElectronHttpExecutor((M, j) => this.emit("login", M, j))) : (this.app = R, this.httpExecutor = null);
      const F = this.app.version, E = (0, l.parse)(F);
      if (E == null)
        throw (0, e.newError)(`App version is not a valid semver version: "${F}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = E, this.allowPrerelease = x(E), S != null && (this.setFeedURL(S), typeof S != "string" && S.requestHeaders && (this.requestHeaders = S.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(S) {
      const R = this.createProviderRuntimeOptions();
      let F;
      typeof S == "string" ? F = new h.GenericProvider({ provider: "generic", url: S }, this, {
        ...R,
        isUseMultipleRangeRequest: (0, y.isUrlProbablySupportMultiRangeRequests)(S)
      }) : F = (0, y.createClient)(S, this, R), this.clientPromise = Promise.resolve(F);
    }
    /**
     * Asks the server whether there is an update.
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let S = this.checkForUpdatesPromise;
      if (S != null)
        return this._logger.info("Checking for update (already in progress)"), S;
      const R = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), S = this.doCheckForUpdates().then((F) => (R(), F)).catch((F) => {
        throw R(), this.emit("error", F, `Cannot check for updates: ${(F.stack || F).toString()}`), F;
      }), this.checkForUpdatesPromise = S, S;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(S) {
      return this.checkForUpdates().then((R) => R != null && R.downloadPromise ? (R.downloadPromise.then(() => {
        const F = Eu.formatDownloadNotification(R.updateInfo.version, this.app.name, S);
        new Pt.Notification(F).show();
      }), R) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), R));
    }
    static formatDownloadNotification(S, R, F) {
      return F == null && (F = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), F = {
        title: F.title.replace("{appName}", R).replace("{version}", S),
        body: F.body.replace("{appName}", R).replace("{version}", S)
      }, F;
    }
    async isStagingMatch(S) {
      const R = S.stagingPercentage;
      let F = R;
      if (F == null)
        return !0;
      if (F = parseInt(F, 10), isNaN(F))
        return this._logger.warn(`Staging percentage is NaN: ${R}`), !0;
      F = F / 100;
      const E = await this.stagingUserIdPromise.value, j = e.UUID.parse(E).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${F}, percentage: ${j}, user id: ${E}`), j < F;
    }
    computeFinalHeaders(S) {
      return this.requestHeaders != null && Object.assign(S, this.requestHeaders), S;
    }
    async isUpdateAvailable(S) {
      const R = (0, l.parse)(S.version);
      if (R == null)
        throw (0, e.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${S.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const F = this.currentVersion;
      if ((0, l.eq)(R, F))
        return !1;
      const E = S == null ? void 0 : S.minimumSystemVersion, M = (0, n.release)();
      if (E)
        try {
          if ((0, l.lt)(M, E))
            return this._logger.info(`Current OS version ${M} is less than the minimum OS version required ${E} for version ${M}`), !1;
        } catch (P) {
          this._logger.warn(`Failed to compare current OS version(${M}) with minimum OS version(${E}): ${(P.message || P).toString()}`);
        }
      if (!await this.isStagingMatch(S))
        return !1;
      const H = (0, l.gt)(R, F), Y = (0, l.lt)(R, F);
      return H ? !0 : this.allowDowngrade && Y;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((F) => (0, y.createClient)(F, this, this.createProviderRuntimeOptions())));
      const S = await this.clientPromise, R = await this.stagingUserIdPromise.value;
      return S.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": R })), {
        info: await S.getLatestVersion(),
        provider: S
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const S = await this.getUpdateInfoAndProvider(), R = S.info;
      if (!await this.isUpdateAvailable(R))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${R.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", R), {
          versionInfo: R,
          updateInfo: R
        };
      this.updateInfoAndProvider = S, this.onUpdateAvailable(R);
      const F = new e.CancellationToken();
      return {
        versionInfo: R,
        updateInfo: R,
        cancellationToken: F,
        downloadPromise: this.autoDownload ? this.downloadUpdate(F) : null
      };
    }
    onUpdateAvailable(S) {
      this._logger.info(`Found version ${S.version} (url: ${(0, e.asArray)(S.files).map((R) => R.url).join(", ")})`), this.emit("update-available", S);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(S = new e.CancellationToken()) {
      const R = this.updateInfoAndProvider;
      if (R == null) {
        const E = new Error("Please check update first");
        return this.dispatchError(E), Promise.reject(E);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, e.asArray)(R.info.files).map((E) => E.url).join(", ")}`);
      const F = (E) => {
        if (!(E instanceof e.CancellationError))
          try {
            this.dispatchError(E);
          } catch (M) {
            this._logger.warn(`Cannot dispatch error event: ${M.stack || M}`);
          }
        return E;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: R,
        requestHeaders: this.computeRequestHeaders(R.provider),
        cancellationToken: S,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((E) => {
        throw F(E);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(S) {
      this.emit("error", S, (S.stack || S).toString());
    }
    dispatchUpdateDownloaded(S) {
      this.emit(p.UPDATE_DOWNLOADED, S);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, o.load)(await (0, i.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(S) {
      const R = S.fileExtraDownloadHeaders;
      if (R != null) {
        const F = this.requestHeaders;
        return F == null ? R : {
          ...R,
          ...F
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const S = s.join(this.app.userDataPath, ".updaterId");
      try {
        const F = await (0, i.readFile)(S, "utf-8");
        if (e.UUID.check(F))
          return F;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${F}`);
      } catch (F) {
        F.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${F}`);
      }
      const R = e.UUID.v5((0, t.randomBytes)(4096), e.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${R}`);
      try {
        await (0, i.outputFile)(S, R);
      } catch (F) {
        this._logger.warn(`Couldn't write out staging user ID: ${F}`);
      }
      return R;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const S = this.requestHeaders;
      if (S == null)
        return !0;
      for (const R of Object.keys(S)) {
        const F = R.toLowerCase();
        if (F === "authorization" || F === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let S = this.downloadedUpdateHelper;
      if (S == null) {
        const R = (await this.configOnDisk.value).updaterCacheDirName, F = this._logger;
        R == null && F.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const E = s.join(this.app.baseCachePath, R || this.app.name);
        F.debug != null && F.debug(`updater cache dir: ${E}`), S = new d.DownloadedUpdateHelper(E), this.downloadedUpdateHelper = S;
      }
      return S;
    }
    async executeDownload(S) {
      const R = S.fileInfo, F = {
        headers: S.downloadUpdateOptions.requestHeaders,
        cancellationToken: S.downloadUpdateOptions.cancellationToken,
        sha2: R.info.sha2,
        sha512: R.info.sha512
      };
      this.listenerCount(p.DOWNLOAD_PROGRESS) > 0 && (F.onProgress = (K) => this.emit(p.DOWNLOAD_PROGRESS, K));
      const E = S.downloadUpdateOptions.updateInfoAndProvider.info, M = E.version, j = R.packageInfo;
      function H() {
        const K = decodeURIComponent(S.fileInfo.url.pathname);
        return K.endsWith(`.${S.fileExtension}`) ? s.basename(K) : S.fileInfo.info.url;
      }
      const Y = await this.getOrCreateDownloadHelper(), P = Y.cacheDirForPendingUpdate;
      await (0, i.mkdir)(P, { recursive: !0 });
      const C = H();
      let N = s.join(P, C);
      const b = j == null ? null : s.join(P, `package-${M}${s.extname(j.path) || ".7z"}`), L = async (K) => (await Y.setDownloadedFile(N, b, E, R, C, K), await S.done({
        ...E,
        downloadedFile: N
      }), b == null ? [N] : [N, b]), D = this._logger, q = await Y.validateDownloadedPath(N, E, R, D);
      if (q != null)
        return N = q, await L(!1);
      const z = async () => (await Y.clear().catch(() => {
      }), await (0, i.unlink)(N).catch(() => {
      })), W = await (0, d.createTempUpdateFile)(`temp-${C}`, P, D);
      try {
        await S.task(W, F, b, z), await (0, e.retry)(() => (0, i.rename)(W, N), 60, 500, 0, 0, (K) => K instanceof Error && /^EBUSY:/.test(K.message));
      } catch (K) {
        throw await z(), K instanceof e.CancellationError && (D.info("cancelled"), this.emit("update-cancelled", E)), K;
      }
      return D.info(`New version ${M} has been downloaded to ${N}`), await L(!0);
    }
    async differentialDownloadInstaller(S, R, F, E, M) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const j = (0, w.blockmapFiles)(S.url, this.app.version, R.updateInfoAndProvider.info.version);
        this._logger.info(`Download block maps (old: "${j[0]}", new: ${j[1]})`);
        const H = async (C) => {
          const N = await this.httpExecutor.downloadToBuffer(C, {
            headers: R.requestHeaders,
            cancellationToken: R.cancellationToken
          });
          if (N == null || N.length === 0)
            throw new Error(`Blockmap "${C.href}" is empty`);
          try {
            return JSON.parse((0, T.gunzipSync)(N).toString());
          } catch (b) {
            throw new Error(`Cannot parse blockmap "${C.href}", error: ${b}`);
          }
        }, Y = {
          newUrl: S.url,
          oldFile: s.join(this.downloadedUpdateHelper.cacheDir, M),
          logger: this._logger,
          newFile: F,
          isUseMultipleRangeRequest: E.isUseMultipleRangeRequest,
          requestHeaders: R.requestHeaders,
          cancellationToken: R.cancellationToken
        };
        this.listenerCount(p.DOWNLOAD_PROGRESS) > 0 && (Y.onProgress = (C) => this.emit(p.DOWNLOAD_PROGRESS, C));
        const P = await Promise.all(j.map((C) => H(C)));
        return await new A.GenericDifferentialDownloader(S.info, this.httpExecutor, Y).download(P[0], P[1]), !1;
      } catch (j) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${j.stack || j}`), this._testOnlyOptions != null)
          throw j;
        return !0;
      }
    }
  };
  St.AppUpdater = $;
  function x(G) {
    const S = (0, l.prerelease)(G);
    return S != null && S.length > 0;
  }
  class k {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(S) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(S) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(S) {
    }
  }
  return St.NoOpLogger = k, St;
}
var Vs;
function Zn() {
  if (Vs) return mn;
  Vs = 1, Object.defineProperty(mn, "__esModule", { value: !0 }), mn.BaseUpdater = void 0;
  const e = Br, t = qo();
  let n = class extends t.AppUpdater {
    constructor(i, o) {
      super(i, o), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(i = !1, o = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(i, i ? o : this.autoRunAppAfterInstall) ? setImmediate(() => {
        Pt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(i) {
      return super.executeDownload({
        ...i,
        done: (o) => (this.dispatchUpdateDownloaded(o), this.addQuitHandler(), Promise.resolve())
      });
    }
    // must be sync (because quit even handler is not async)
    install(i = !1, o = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const a = this.downloadedUpdateHelper, s = a && a.file ? process.platform === "linux" ? a.file.replace(/ /g, "\\ ") : a.file : null, l = a == null ? null : a.downloadedFileInfo;
      if (s == null || l == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${i}, isForceRunAfter: ${o}`), this.doInstall({
          installerPath: s,
          isSilent: i,
          isForceRunAfter: o,
          isAdminRightsRequired: l.isAdminRightsRequired
        });
      } catch (d) {
        return this.dispatchError(d), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((i) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (i !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${i}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    wrapSudo() {
      const { name: i } = this.app, o = `"${i} would like to update"`, a = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), s = [a];
      return /kdesudo/i.test(a) ? (s.push("--comment", o), s.push("-c")) : /gksudo/i.test(a) ? s.push("--message", o) : /pkexec/i.test(a) && s.push("--disable-internal-agent"), s.join(" ");
    }
    spawnSyncLog(i, o = [], a = {}) {
      return this._logger.info(`Executing: ${i} with args: ${o}`), (0, e.spawnSync)(i, o, {
        env: { ...process.env, ...a },
        encoding: "utf-8",
        shell: !0
      }).stdout.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(i, o = [], a = void 0, s = "ignore") {
      return this._logger.info(`Executing: ${i} with args: ${o}`), new Promise((l, d) => {
        try {
          const f = { stdio: s, env: a, detached: !0 }, c = (0, e.spawn)(i, o, f);
          c.on("error", (h) => {
            d(h);
          }), c.unref(), c.pid !== void 0 && l(!0);
        } catch (f) {
          d(f);
        }
      });
    }
  };
  return mn.BaseUpdater = n, mn;
}
var vn = {}, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Bt = yt, cw = Qn, uw = dl;
class fw extends cw.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = yu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await dw(this.options.oldFile), i);
  }
}
er.FileWithEmbeddedBlockMapDifferentialDownloader = fw;
function yu(e) {
  return JSON.parse((0, uw.inflateRawSync)(e).toString());
}
async function dw(e) {
  const t = await (0, Bt.open)(e, "r");
  try {
    const n = (await (0, Bt.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Bt.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Bt.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Bt.close)(t), yu(i);
  } catch (n) {
    throw await (0, Bt.close)(t), n;
  }
}
var Ws;
function Ys() {
  if (Ws) return vn;
  Ws = 1, Object.defineProperty(vn, "__esModule", { value: !0 }), vn.AppImageUpdater = void 0;
  const e = pe, t = Br, n = yt, r = Et, i = ie, o = Zn(), a = er, s = ln(), l = me;
  let d = class extends o.BaseUpdater {
    constructor(c, h) {
      super(c, h);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(c) {
      const h = c.updateInfoAndProvider.provider, p = (0, l.findFile)(h.resolveFiles(c.updateInfoAndProvider.info), "AppImage", ["rpm", "deb"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: p,
        downloadUpdateOptions: c,
        task: async (y, T) => {
          const w = process.env.APPIMAGE;
          if (w == null)
            throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          let A = !1;
          try {
            const $ = {
              newUrl: p.url,
              oldFile: w,
              logger: this._logger,
              newFile: y,
              isUseMultipleRangeRequest: h.isUseMultipleRangeRequest,
              requestHeaders: c.requestHeaders,
              cancellationToken: c.cancellationToken
            };
            this.listenerCount(s.DOWNLOAD_PROGRESS) > 0 && ($.onProgress = (x) => this.emit(s.DOWNLOAD_PROGRESS, x)), await new a.FileWithEmbeddedBlockMapDifferentialDownloader(p.info, this.httpExecutor, $).download();
          } catch ($) {
            this._logger.error(`Cannot download differentially, fallback to full download: ${$.stack || $}`), A = process.platform === "linux";
          }
          A && await this.httpExecutor.download(p.url, y, T), await (0, n.chmod)(y, 493);
        }
      });
    }
    doInstall(c) {
      const h = process.env.APPIMAGE;
      if (h == null)
        throw (0, e.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, r.unlinkSync)(h);
      let p;
      const y = i.basename(h);
      i.basename(c.installerPath) === y || !/\d+\.\d+\.\d+/.test(y) ? p = h : p = i.join(i.dirname(h), i.basename(c.installerPath)), (0, t.execFileSync)("mv", ["-f", c.installerPath, p]), p !== h && this.emit("appimage-filename-updated", p);
      const T = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return c.isForceRunAfter ? this.spawnLog(p, [], T) : (T.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, t.execFileSync)(p, [], { env: T })), !0;
    }
  };
  return vn.AppImageUpdater = d, vn;
}
var wn = {}, zs;
function Xs() {
  if (zs) return wn;
  zs = 1, Object.defineProperty(wn, "__esModule", { value: !0 }), wn.DebUpdater = void 0;
  const e = Zn(), t = ln(), n = me;
  let r = class extends e.BaseUpdater {
    constructor(o, a) {
      super(o, a);
    }
    /*** @private */
    doDownloadUpdate(o) {
      const a = o.updateInfoAndProvider.provider, s = (0, n.findFile)(a.resolveFiles(o.updateInfoAndProvider.info), "deb", ["AppImage", "rpm"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: s,
        downloadUpdateOptions: o,
        task: async (l, d) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (d.onProgress = (f) => this.emit(t.DOWNLOAD_PROGRESS, f)), await this.httpExecutor.download(s.url, l, d);
        }
      });
    }
    doInstall(o) {
      const a = this.wrapSudo(), s = /pkexec/i.test(a) ? "" : '"', l = ["dpkg", "-i", o.installerPath, "||", "apt-get", "install", "-f", "-y"];
      return this.spawnSyncLog(a, [`${s}/bin/bash`, "-c", `'${l.join(" ")}'${s}`]), o.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return wn.DebUpdater = r, wn;
}
var _n = {}, Ks;
function Js() {
  if (Ks) return _n;
  Ks = 1, Object.defineProperty(_n, "__esModule", { value: !0 }), _n.RpmUpdater = void 0;
  const e = Zn(), t = ln(), n = me;
  let r = class extends e.BaseUpdater {
    constructor(o, a) {
      super(o, a);
    }
    /*** @private */
    doDownloadUpdate(o) {
      const a = o.updateInfoAndProvider.provider, s = (0, n.findFile)(a.resolveFiles(o.updateInfoAndProvider.info), "rpm", ["AppImage", "deb"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: s,
        downloadUpdateOptions: o,
        task: async (l, d) => {
          this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (d.onProgress = (f) => this.emit(t.DOWNLOAD_PROGRESS, f)), await this.httpExecutor.download(s.url, l, d);
        }
      });
    }
    doInstall(o) {
      const a = o.installerPath, s = this.wrapSudo(), l = /pkexec/i.test(s) ? "" : '"', d = this.spawnSyncLog("which zypper");
      let f;
      return d ? f = [d, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", a] : f = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", a], this.spawnSyncLog(s, [`${l}/bin/bash`, "-c", `'${f.join(" ")}'${l}`]), o.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return _n.RpmUpdater = r, _n;
}
var Tn = {}, Qs;
function Zs() {
  if (Qs) return Tn;
  Qs = 1, Object.defineProperty(Tn, "__esModule", { value: !0 }), Tn.MacUpdater = void 0;
  const e = pe, t = yt, n = Et, r = ie, i = Rf, o = qo(), a = me, s = Br, l = Hn;
  let d = class extends o.AppUpdater {
    constructor(c, h) {
      super(c, h), this.nativeUpdater = Pt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (p) => {
        this._logger.warn(p), this.emit("error", p);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(c) {
      this._logger.debug != null && this._logger.debug(c);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((c) => {
        c && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(c) {
      let h = c.updateInfoAndProvider.provider.resolveFiles(c.updateInfoAndProvider.info);
      const p = this._logger, y = "sysctl.proc_translated";
      let T = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), T = (0, s.execFileSync)("sysctl", [y], { encoding: "utf8" }).includes(`${y}: 1`), p.info(`Checked for macOS Rosetta environment (isRosetta=${T})`);
      } catch (G) {
        p.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${G}`);
      }
      let w = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const S = (0, s.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        p.info(`Checked 'uname -a': arm64=${S}`), w = w || S;
      } catch (G) {
        p.warn(`uname shell command to check for arm64 failed: ${G}`);
      }
      w = w || process.arch === "arm64" || T;
      const A = (G) => {
        var S;
        return G.url.pathname.includes("arm64") || ((S = G.info.url) === null || S === void 0 ? void 0 : S.includes("arm64"));
      };
      w && h.some(A) ? h = h.filter((G) => w === A(G)) : h = h.filter((G) => !A(G));
      const $ = (0, a.findFile)(h, "zip", ["pkg", "dmg"]);
      if ($ == null)
        throw (0, e.newError)(`ZIP file not provided: ${(0, e.safeStringifyJson)(h)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const x = c.updateInfoAndProvider.provider, k = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: $,
        downloadUpdateOptions: c,
        task: async (G, S) => {
          const R = r.join(this.downloadedUpdateHelper.cacheDir, k), F = () => (0, t.pathExistsSync)(R) ? !c.disableDifferentialDownload : (p.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let E = !0;
          F() && (E = await this.differentialDownloadInstaller($, c, G, x, k)), E && await this.httpExecutor.download($.url, G, S);
        },
        done: (G) => {
          if (!c.disableDifferentialDownload)
            try {
              const S = r.join(this.downloadedUpdateHelper.cacheDir, k);
              (0, n.copyFileSync)(G.downloadedFile, S);
            } catch (S) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${S.message}`);
            }
          return this.updateDownloaded($, G);
        }
      });
    }
    async updateDownloaded(c, h) {
      var p;
      const y = h.downloadedFile, T = (p = c.info.size) !== null && p !== void 0 ? p : (await (0, t.stat)(y)).size, w = this._logger, A = `fileToProxy=${c.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${A})`), this.server = (0, i.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${A})`), this.server.on("close", () => {
        w.info(`Proxy server for native Squirrel.Mac is closed (${A})`);
      });
      const $ = (x) => {
        const k = x.address();
        return typeof k == "string" ? k : `http://127.0.0.1:${k == null ? void 0 : k.port}`;
      };
      return await new Promise((x, k) => {
        const G = (0, l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), S = Buffer.from(`autoupdater:${G}`, "ascii"), R = `/${(0, l.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (F, E) => {
          const M = F.url;
          if (w.info(`${M} requested`), M === "/") {
            if (!F.headers.authorization || F.headers.authorization.indexOf("Basic ") === -1) {
              E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), w.warn("No authenthication info");
              return;
            }
            const Y = F.headers.authorization.split(" ")[1], P = Buffer.from(Y, "base64").toString("ascii"), [C, N] = P.split(":");
            if (C !== "autoupdater" || N !== G) {
              E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), w.warn("Invalid authenthication credentials");
              return;
            }
            const b = Buffer.from(`{ "url": "${$(this.server)}${R}" }`);
            E.writeHead(200, { "Content-Type": "application/json", "Content-Length": b.length }), E.end(b);
            return;
          }
          if (!M.startsWith(R)) {
            w.warn(`${M} requested, but not supported`), E.writeHead(404), E.end();
            return;
          }
          w.info(`${R} requested by Squirrel.Mac, pipe ${y}`);
          let j = !1;
          E.on("finish", () => {
            j || (this.nativeUpdater.removeListener("error", k), x([]));
          });
          const H = (0, n.createReadStream)(y);
          H.on("error", (Y) => {
            try {
              E.end();
            } catch (P) {
              w.warn(`cannot end response: ${P}`);
            }
            j = !0, this.nativeUpdater.removeListener("error", k), k(new Error(`Cannot pipe "${y}": ${Y}`));
          }), E.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": T
          }), H.pipe(E);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${A})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${$(this.server)}, ${A})`), this.nativeUpdater.setFeedURL({
            url: $(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${S.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(h), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", k), this.nativeUpdater.checkForUpdates()) : x([]);
        });
      });
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? (this.nativeUpdater.quitAndInstall(), this.closeServerIfExists()) : (this.nativeUpdater.on("update-downloaded", () => {
        this.nativeUpdater.quitAndInstall(), this.closeServerIfExists();
      }), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return Tn.MacUpdater = d, Tn;
}
var An = {}, Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
Go.verifySignature = pw;
const el = pe, vu = Br, hw = jr, tl = ie;
function pw(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, vu.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (a, s, l) => {
      var d;
      try {
        if (a != null || l) {
          Vi(n, a, l, i), r(null);
          return;
        }
        const f = mw(s);
        if (f.Status === 0) {
          try {
            const y = tl.normalize(f.Path), T = tl.normalize(t);
            if (n.info(`LiteralPath: ${y}. Update Path: ${T}`), y !== T) {
              Vi(n, new Error(`LiteralPath of ${y} is different than ${T}`), l, i), r(null);
              return;
            }
          } catch (y) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = y.message) !== null && d !== void 0 ? d : y.stack}`);
          }
          const h = (0, el.parseDn)(f.SignerCertificate.Subject);
          let p = !1;
          for (const y of e) {
            const T = (0, el.parseDn)(y);
            if (T.size ? p = Array.from(T.keys()).every((A) => T.get(A) === h.get(A)) : y === h.get("CN") && (n.warn(`Signature validated using only CN ${y}. Please add your full Distinguished Name (DN) to publisherNames configuration`), p = !0), p) {
              r(null);
              return;
            }
          }
        }
        const c = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(f, (h, p) => h === "RawData" ? void 0 : p, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${c}`), r(c);
      } catch (f) {
        Vi(n, f, null, i), r(null);
        return;
      }
    });
  });
}
function mw(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function Vi(e, t, n, r) {
  if (gw()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, vu.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function gw() {
  const e = hw.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
var nl;
function rl() {
  if (nl) return An;
  nl = 1, Object.defineProperty(An, "__esModule", { value: !0 }), An.NsisUpdater = void 0;
  const e = pe, t = ie, n = Zn(), r = er, i = ln(), o = me, a = yt, s = Go, l = nn;
  let d = class extends n.BaseUpdater {
    constructor(c, h) {
      super(c, h), this._verifyUpdateCodeSignature = (p, y) => (0, s.verifySignature)(p, y, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(c) {
      c && (this._verifyUpdateCodeSignature = c);
    }
    /*** @private */
    doDownloadUpdate(c) {
      const h = c.updateInfoAndProvider.provider, p = (0, o.findFile)(h.resolveFiles(c.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: c,
        fileInfo: p,
        task: async (y, T, w, A) => {
          const $ = p.packageInfo, x = $ != null && w != null;
          if (x && c.disableWebInstaller)
            throw (0, e.newError)(`Unable to download new version ${c.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !x && !c.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (x || c.disableDifferentialDownload || await this.differentialDownloadInstaller(p, c, y, h, e.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(p.url, y, T);
          const k = await this.verifySignature(y);
          if (k != null)
            throw await A(), (0, e.newError)(`New version ${c.updateInfoAndProvider.info.version} is not signed by the application owner: ${k}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (x && await this.differentialDownloadWebPackage(c, $, w, h))
            try {
              await this.httpExecutor.download(new l.URL($.path), w, {
                headers: c.requestHeaders,
                cancellationToken: c.cancellationToken,
                sha512: $.sha512
              });
            } catch (G) {
              try {
                await (0, a.unlink)(w);
              } catch {
              }
              throw G;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(c) {
      let h;
      try {
        if (h = (await this.configOnDisk.value).publisherName, h == null)
          return null;
      } catch (p) {
        if (p.code === "ENOENT")
          return null;
        throw p;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(h) ? h : [h], c);
    }
    doInstall(c) {
      const h = ["--updated"];
      c.isSilent && h.push("/S"), c.isForceRunAfter && h.push("--force-run"), this.installDirectory && h.push(`/D=${this.installDirectory}`);
      const p = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      p != null && h.push(`--package-file=${p}`);
      const y = () => {
        this.spawnLog(t.join(process.resourcesPath, "elevate.exe"), [c.installerPath].concat(h)).catch((T) => this.dispatchError(T));
      };
      return c.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), y(), !0) : (this.spawnLog(c.installerPath, h).catch((T) => {
        const w = T.code;
        this._logger.info(`Cannot run installer: error code: ${w}, error message: "${T.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), w === "UNKNOWN" || w === "EACCES" ? y() : w === "ENOENT" ? Pt.shell.openPath(c.installerPath).catch((A) => this.dispatchError(A)) : this.dispatchError(T);
      }), !0);
    }
    async differentialDownloadWebPackage(c, h, p, y) {
      if (h.blockMapSize == null)
        return !0;
      try {
        const T = {
          newUrl: new l.URL(h.path),
          oldFile: t.join(this.downloadedUpdateHelper.cacheDir, e.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: p,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: y.isUseMultipleRangeRequest,
          cancellationToken: c.cancellationToken
        };
        this.listenerCount(i.DOWNLOAD_PROGRESS) > 0 && (T.onProgress = (w) => this.emit(i.DOWNLOAD_PROGRESS, w)), await new r.FileWithEmbeddedBlockMapDifferentialDownloader(h, this.httpExecutor, T).download();
      } catch (T) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${T.stack || T}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return An.NsisUpdater = d, An;
}
var il;
function ln() {
  return il || (il = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.CancellationToken = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
    const t = pe;
    Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
      return t.CancellationToken;
    } });
    const n = yt, r = ie;
    var i = Zn();
    Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
      return i.BaseUpdater;
    } });
    var o = qo();
    Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
      return o.AppUpdater;
    } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
      return o.NoOpLogger;
    } });
    var a = me;
    Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
      return a.Provider;
    } });
    var s = Ys();
    Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
      return s.AppImageUpdater;
    } });
    var l = Xs();
    Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
      return l.DebUpdater;
    } });
    var d = Js();
    Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
      return d.RpmUpdater;
    } });
    var f = Zs();
    Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
      return f.MacUpdater;
    } });
    var c = rl();
    Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
      return c.NsisUpdater;
    } });
    let h;
    function p() {
      if (process.platform === "win32")
        h = new (rl()).NsisUpdater();
      else if (process.platform === "darwin")
        h = new (Zs()).MacUpdater();
      else {
        h = new (Ys()).AppImageUpdater();
        try {
          const w = r.join(process.resourcesPath, "package-type");
          if (!(0, n.existsSync)(w))
            return h;
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const A = (0, n.readFileSync)(w).toString().trim();
          switch (console.info("Found package-type:", A), A) {
            case "deb":
              h = new (Xs()).DebUpdater();
              break;
            case "rpm":
              h = new (Js()).RpmUpdater();
              break;
            default:
              break;
          }
        } catch (w) {
          console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", w.message);
        }
      }
      return h;
    }
    Object.defineProperty(e, "autoUpdater", {
      enumerable: !0,
      get: () => h || p()
    }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
    class y {
      constructor(A) {
        this.emitter = A;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(A) {
        T(this.emitter, "login", A);
      }
      progress(A) {
        T(this.emitter, e.DOWNLOAD_PROGRESS, A);
      }
      updateDownloaded(A) {
        T(this.emitter, e.UPDATE_DOWNLOADED, A);
      }
      updateCancelled(A) {
        T(this.emitter, "update-cancelled", A);
      }
    }
    e.UpdaterSignal = y;
    function T(w, A, $) {
      w.on(A, $);
    }
  }(yi)), yi;
}
var ue = ln();
function Ew(e, t = "") {
  e == null || e.webContents.send("refresh-data", { msg: t });
}
function uo(e) {
  return new Promise((t, n) => {
    e.all("SELECT * FROM sys_table WHERE sys_is_first_run = 0", (i, o) => {
      i && (console.error(i), n(!1)), t(!(o && o.length > 0));
    });
  });
}
const Sn = (e, t, n) => {
  const r = {
    state: t,
    msg: n || ""
  };
  e.webContents.send("web-update-message", r);
}, yw = (e, t) => {
  ue.autoUpdater.autoDownload = !1, ue.autoUpdater.setFeedURL("https://download.anixuil.top/webstartui/update/"), ue.autoUpdater.on("error", (n) => {
    Sn(e, 0, n.message), ue.autoUpdater.removeAllListeners();
  }), ue.autoUpdater.on("checking-for-update", () => {
    Sn(e, 1);
  }), ue.autoUpdater.on("update-not-available", () => {
    Sn(e, 5, "没有新版本"), ue.autoUpdater.removeAllListeners();
  }), ue.autoUpdater.on("update-available", () => {
    Sn(e, 2);
  }), ue.autoUpdater.on("update-downloaded", async () => {
    Sn(e, 3), await uo(t) ? (ue.autoUpdater.quitAndInstall(!0, !0), ue.autoUpdater.removeAllListeners()) : window.ipcRenderer.invoke("restore-first-run").then(() => {
      ue.autoUpdater.removeAllListeners();
    }).finally(() => {
      ue.autoUpdater.quitAndInstall(!0, !0), ue.autoUpdater.removeAllListeners();
    });
  }), ue.autoUpdater.on("download-progress", (n) => {
    e.webContents.send("web-update-message", n);
  }), ue.autoUpdater.checkForUpdates();
}, vw = (e) => {
  ue.autoUpdater.downloadUpdate();
}, Xt = If(import.meta.url), Wi = Xt("sqlite3"), Vo = Pe.dirname(Pf(import.meta.url));
process.env.APP_ROOT = Pe.join(Vo, "..");
const fo = process.env.VITE_DEV_SERVER_URL, e_ = Pe.join(process.env.APP_ROOT, "dist-electron"), wu = Pe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = fo ? Pe.join(process.env.APP_ROOT, "public") : wu;
let se;
const On = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map();
function ww(e) {
  return e.replace(/\x1B\[\d+m/g, "").replace(/\x1B\[[\d;]*[A-Za-z]/g, "").replace(/\[(\d+m|\d+;\d+m)/g, "");
}
function _w(e) {
  try {
    if (e.includes("{") && e.includes("}"))
      try {
        const t = JSON.parse(e);
        return JSON.stringify(t, null, 2);
      } catch {
      }
    return e.replace(/\],\s*library:/g, "] library:").replace(/(\w+):\s*'([^']*)'(?=,|\s|$)/g, "$1: $2").replace(/,\s*(?=[a-zA-Z])/g, ", ").trim();
  } catch {
    return e;
  }
}
function Tw(e, t) {
  let n = !1, r = [], i = null;
  return (...o) => {
    n ? r.push(o[1]) : (e.apply(null, [...o, r]), r = [], n = !0, i && clearTimeout(i), i = setTimeout(() => {
      n = !1, r.length > 0 && (e.apply(null, [o[0], o[1], r]), r = []);
    }, t));
  };
}
function Aw(e, t, n = []) {
  const r = On.get(e);
  if (!r) return;
  const i = qt.get(e);
  if (i && !i.destroyed)
    try {
      const o = [t, ...n].map((a) => {
        const s = ww(a);
        return _w(s);
      }).join("");
      i.cork(), i.write(o, (a) => {
        a && console.error("写入日志失败:", a), r.outputBuffer.push(o), se && se.webContents.send("log-update", {
          port: e,
          data: o
        });
      }), global.process.nextTick(() => {
        i.uncork();
      }), Math.random() < 0.05 && xe.readFile(r.logPath, "utf-8", (a, s) => {
        if (a) {
          console.error("读取日志失败:", a);
          return;
        }
        const l = s.split(`
`);
        if (l.length > 1e3) {
          const d = l.slice(-1e3).join(`
`);
          xe.writeFile(r.logPath, d, (f) => {
            f && console.error("更新日志失败:", f);
          });
        }
      });
    } catch (o) {
      console.error("处理日志失败:", o);
    }
}
const Sw = Tw(Aw, 500);
function ol(e, t) {
  Sw(e, t);
}
async function Cw(e) {
  return new Promise((t) => {
    const { exec: n } = Xt("child_process");
    n(`netstat -ano | findstr "127.0.0.1:${e}"`, (r, i) => {
      t(!r && i.toString().trim() !== "");
    });
  });
}
async function _u() {
  se = new ll({
    icon: Pe.join(process.env.VITE_PUBLIC, "favicon.ico"),
    // 关闭菜单
    autoHideMenuBar: !0,
    webPreferences: {
      preload: Pe.join(Vo, "preload.mjs")
    },
    width: 1080,
    height: 720
  }), se.webContents.on("did-finish-load", () => {
    se == null || se.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), fo ? (se.loadURL(fo), ue.autoUpdater.forceDevUpdateConfig = !0) : se.loadFile(Pe.join(wu, "index.html")), Se.handle("is-first-run", async () => {
    const e = await uo(qe);
    if (e) {
      const t = await Cn({
        table: "sys_table",
        type: "query",
        data: {}
      });
      if (t.length > 1) {
        for (let n = 1; n < t.length; n++)
          await Yi({ table: "sys_table", type: "delete", data: { sys_id: t[n].sysId } });
        Ct({ table: "sys_table", type: "update", data: { sys_is_first_run: 0 }, condition: { sys_id: t[0].sysId } });
      } else t.length === 1 ? Ct({ table: "sys_table", type: "update", data: { sys_is_first_run: 0 }, condition: { sys_id: t[0].sysId } }) : t.length === 0 && al({ table: "sys_table", type: "insert", data: { sys_is_first_run: 0 } });
    }
    return e;
  }), Se.handle("auto-update-cancel", async () => new Promise(async (e, t) => {
    ue.autoUpdater.removeAllListeners(), tt.relaunch(), tt.exit(), e(!0);
  })), Se.handle("restore-first-run", async () => new Promise(async (e, t) => {
    if (await uo(qe)) {
      const r = await Cn({
        table: "sys_table",
        type: "query",
        data: {}
      });
      if (r.length > 1) {
        for (let i = 1; i < r.length; i++)
          await Yi({ table: "sys_table", type: "delete", data: { sys_id: r[i].sys_id } });
        Ct({ table: "sys_table", type: "update", data: { sys_is_first_run: 1 }, condition: { sys_id: r[0].sys_id } }), e(!0);
      } else r.length === 1 ? (Ct({ table: "sys_table", type: "update", data: { sys_is_first_run: 1 }, condition: { sys_id: r[0].sys_id } }), e(!0)) : t(!1);
    } else
      t(!1);
  })), Se.on("update-log", async (e, t) => {
    switch (t.mode) {
      case "open":
        se == null || se.webContents.send("update-log", { mode: t.mode });
        break;
    }
  }), Se.handle("auto-check-update", () => se ? (yw(se, qe), !0) : !1), Se.handle("auto-update", () => se ? (vw(), !0) : !1), Se.handle("open-file-dialog", async () => {
    const { canceled: e, filePaths: t } = await Cf.showOpenDialog({
      properties: ["openDirectory"]
    });
    return e ? [] : t;
  }), Se.handle("getProjectInfoByPath", (e, t) => new Promise(async (n, r) => {
    try {
      const i = await xe.promises.readdir(t);
      let o = {};
      const a = i.find((p) => p === "package.json");
      if (!a) {
        r("未找到package.json文件");
        return;
      }
      const s = t + "/" + a, l = await xe.promises.readFile(s, "utf-8"), { name: d, version: f } = JSON.parse(l);
      o = { projectName: d, projectVersion: f };
      const c = ["vue.config.js", "vite.config.js", "vue.config.ts", "vite.config.ts"], h = i.find((p) => c.includes(p));
      if (h) {
        o.projectConfigFileName = h;
        const p = t + "/" + h, y = await xe.promises.readFile(p, "utf-8");
        o.projectConfig = y;
        const T = /port\s*:\s*(\d+)/, w = y.match(T);
        w ? o.projectPort = parseInt(w[1]) : o.projectPort = 8080;
        const A = /dev|serve|start/, $ = y.match(A);
        $ ? o.projectCommand = `npm run ${$[0]}` : o.projectCommand = "npm run dev";
      } else
        console.log("未找到配置文件");
      n(o);
    } catch (i) {
      console.error(i), r(i);
    }
  })), Se.handle("db", (e, t) => new Promise(async (n, r) => {
    t.data = sl(t.data), t != null && t.condition && (t.condition = sl(t.condition)), t.type === "insert" ? (t.data.create_time = (/* @__PURE__ */ new Date()).toLocaleString(), t.data.update_time = (/* @__PURE__ */ new Date()).toLocaleString()) : t.type === "update" && t.data.project_status == "1" && (t.data.update_time = (/* @__PURE__ */ new Date()).toLocaleString());
    try {
      switch (t.type) {
        case "insert":
          if ((await Cn({
            table: "project_table",
            type: "query",
            data: {
              project_local_url: t.data.project_local_url
            }
          })).length > 0) {
            r("已存在同路径项目，请勿重复添加");
            return;
          }
          const o = t.data.project_local_url + "\\" + t.data.project_config_file_name;
          console.log("configFilePath", o), await xe.promises.writeFile(o, t.data.project_config);
          const a = await al(t);
          n(a);
          break;
        case "delete":
          const s = await Yi(t);
          n(s);
          break;
        case "update":
          if (t.data.project_local_url) {
            const f = await Cn({
              table: "project_table",
              type: "query",
              data: {
                project_id: t.condition.project_id || t.data.project_id
              }
            });
            if (f.length === 0) {
              r("未找到项目");
              return;
            }
            if (f[0].projectLocalUrl !== t.data.project_local_url)
              t.data.project_status = "0";
            else {
              const c = t.data.project_local_url + "/" + t.data.project_config_file_name;
              await xe.promises.writeFile(c, t.data.project_config);
            }
          }
          const l = await Ct(t);
          n(l);
          break;
        case "query":
          const d = await Cn(t);
          n(d);
          break;
        default:
          r("未知数据库操作类型");
          break;
      }
    } catch (i) {
      console.log("err", i), r(i);
    }
  })), Se.handle("install", async (e, t) => new Promise((n, r) => {
    try {
      const { projectLocalUrl: i, type: o } = t, { exec: a } = Xt("child_process"), s = i.split(":")[0];
      a(
        `${s}: && cd ${i} && ${o || "npm"} install`,
        {
          maxBuffer: 1024 * 1024 * 1024
        },
        (l, d, f) => {
          if (l)
            return console.error(`执行出错: ${l.message}`), r(l), l;
          if (f)
            return console.error(`stderr: ${f}`), r(f), f;
          console.log(`stdout: ${d}`), n(!0);
        }
      );
    } catch (i) {
      return console.error(i), r(i), i;
    }
  })), Se.handle("openProjectUrl", async (e, t) => {
    const { projectPort: n } = t, { exec: r } = Xt("child_process");
    r(`start http://localhost:${n}`, (i, o, a) => {
      if (i) {
        console.error(`执行出错: ${i.message}`);
        return;
      }
      if (a) {
        console.error(`stderr: ${a}`);
        return;
      }
    });
  }), Se.handle("startProject", async (e, t) => {
    const { projectLocalUrl: n, projectPort: r, projectCommand: i, projectName: o, projectId: a } = t;
    try {
      if (await Cw(r))
        throw new Error(`端口 ${r} 已被占用，请更换端口`);
      const l = Pe.join(tt.getPath("userData"), "logs");
      xe.existsSync(l) || xe.mkdirSync(l, { recursive: !0 });
      const d = Pe.join(l, `${o}.log`);
      console.log("日志文件目录", d);
      const f = bf(d, {
        flags: "w",
        encoding: "utf8",
        highWaterMark: 64 * 1024,
        autoClose: !0
      });
      f.on("error", (T) => {
        console.error("日志写入流错误:", T), se == null || se.webContents.send("process-output", {
          port: r,
          output: `日志写入错误: ${T.message}`
        });
      });
      const { spawn: c } = Xt("child_process"), h = n.split(":")[0], p = c("cmd.exe", [
        "/c",
        `${h}: && cd "${n}" && ${i || "npm run dev"}`
      ], {
        shell: !0,
        maxBuffer: 1024 * 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: "1" }
      });
      On.set(r, {
        process: p,
        monitor: null,
        outputBuffer: [],
        logPath: d
      }), qt.set(r, f);
      const y = (T) => {
        ol(r, T.toString());
      };
      return p.stdout.on("data", y), p.stderr.on("data", y), p.on("exit", async (T) => {
        console.log("exit", T);
        try {
          if (T !== 0) {
            const A = `进程异常退出，退出码: ${T}`;
            ol(r, A);
          }
          const w = qt.get(r);
          w && !w.destroyed && await new Promise((A) => {
            setTimeout(() => {
              w.end(() => {
                qt.delete(r), A();
              });
            }, 1e3);
          }), await Ct({
            table: "project_table",
            type: "update",
            data: { project_status: "0" },
            condition: { project_id: a }
          }), On.delete(r), Ew(se, T !== 0 ? "项目关闭，如有疑问请查看日志" : "项目已停止");
        } catch (w) {
          console.error("项目关闭", w);
        }
      }), !0;
    } catch (s) {
      throw console.error("启动项目失败:", s), s;
    }
  }), Se.handle("stopProject", async (e, t) => {
    const { projectPort: n, projectId: r } = t;
    try {
      const i = On.get(n);
      if (i) {
        const o = qt.get(n);
        o && !o.destroyed && await new Promise((s) => {
          o.end(() => {
            qt.delete(n), s();
          });
        });
        const { spawn: a } = Xt("child_process");
        a("taskkill", ["/pid", i.process.pid, "/f", "/t"]), On.delete(n);
      }
      return await Ct({
        table: "project_table",
        type: "update",
        data: { project_status: "0" },
        condition: { project_id: r }
      }), !0;
    } catch (i) {
      throw console.error("停止项目失败:", i), i;
    }
  }), Se.handle("readProjectLog", async (e, t) => {
    const { projectName: n, lastPosition: r = 0 } = t, i = Pe.join(tt.getPath("userData"), "logs"), o = Pe.join(i, `${n}.log`);
    try {
      if (!xe.existsSync(o))
        return { content: "", position: 0 };
      const s = (await xe.promises.stat(o)).size;
      if (r === 0 || r > s)
        return {
          content: await xe.promises.readFile(o, "utf-8"),
          position: s
        };
      const l = await xe.promises.open(o, "r"), d = Buffer.alloc(s - r);
      return await l.read(d, 0, s - r, r), await l.close(), {
        content: d.toString("utf-8"),
        position: s
      };
    } catch (a) {
      return console.error("读取日志文件失败:", a), { content: "", position: 0 };
    }
  }), Se.setMaxListeners(20);
}
tt.on("window-all-closed", () => {
  process.platform !== "darwin" && (tt.quit(), se = null), qe.close((e) => {
    e ? console.error(e.message) : console.log("Close the database connection.");
  });
});
tt.on("activate", () => {
  ll.getAllWindows().length === 0 && _u();
});
tt.whenReady().then(_u);
const bw = process.env.NODE_ENV === "development" ? Pe.join(Vo, "webstartui.db") : Pe.join(tt.getPath("userData"), "webstartui.db"), qe = new Wi.Database(bw, Wi.OPEN_READWRITE | Wi.OPEN_CREATE, (e) => {
  e ? console.error(e.message) : console.log("Connected to the database.");
});
qe.serialize(() => {
  qe.run(`CREATE TABLE IF NOT EXISTS project_table (
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
  `, (e) => {
    e && console.error(e.message);
  }), qe.run(`CREATE TABLE IF NOT EXISTS sys_table (
    sys_id INTEGER PRIMARY KEY AUTOINCREMENT, -- 系统id
    sys_is_first_run BOOLEAN DEFAULT true, -- 是否是第一次运行
    sys_version TEXT, -- 系统版本
    sys_update_time datetime -- 系统更新时间
  );`, (e) => {
    e && console.error(e.message);
  });
});
function al(e) {
  return new Promise((t, n) => {
    const { table: r, data: i } = e, o = Object.keys(i), a = Object.values(i);
    let s = `INSERT INTO ${r} (${o.join(",")}) VALUES (${o.map(() => "?").join(",")});`;
    qe.run(s, a, function(l) {
      l ? n(l) : t(this.lastID);
    });
  });
}
function Yi(e) {
  return new Promise((t, n) => {
    const { table: r, data: i } = e, o = Object.keys(i), a = Object.values(i);
    let s = `DELETE FROM ${r} WHERE ${o.map((l) => `${l} = ?`).join(" AND ")};`;
    qe.run(s, a, function(l) {
      l ? n(l) : t(this.changes);
    });
  });
}
function Ct(e) {
  return new Promise((t, n) => {
    const { table: r, data: i } = e, o = Object.keys(i), a = Object.values(i), s = e.condition;
    if (!s) {
      n("缺少条件");
      return;
    }
    const l = Object.keys(s), d = Object.values(s);
    let f = `UPDATE ${r} SET ${o.map((c) => `${c} = ?`).join(",")} WHERE ${l.map((c) => `${c} = ?`).join(" AND ")};`;
    qe.run(f, [...a, ...d], function(c) {
      c ? n(c) : t(this.changes);
    });
  });
}
function Cn(e) {
  return new Promise((t, n) => {
    const { table: r, data: i } = e, o = Object.keys(i), a = Object.values(i);
    let s = "";
    o.length === 0 ? s = `SELECT * FROM ${r};` : s = `SELECT * FROM ${r} WHERE ${o.map((l) => `${l} = ?`).join(" AND ")};`, qe.all(s, a, (l, d) => {
      l ? n(l) : (d = d.map((f) => $w(f)), t(d));
    });
  });
}
function sl(e) {
  const t = {};
  for (const n in e)
    t[n.replace(/([A-Z])/g, "_$1").toLowerCase()] = e[n];
  return t;
}
function $w(e) {
  const t = {};
  for (const n in e)
    t[n.replace(/\_(\w)/g, function(r, i) {
      return i.toUpperCase();
    })] = e[n];
  return t;
}
export {
  e_ as MAIN_DIST,
  wu as RENDERER_DIST,
  fo as VITE_DEV_SERVER_URL
};
