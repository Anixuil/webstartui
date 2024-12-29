// 设置主题
window.setGlobalTheme = (theme = 'light') => {
    window.globalTheme = theme
    if (theme === 'dark') {
        document.body.classList.add('ani-theme-dark')
        document.body.classList.remove('ani-theme-light')
        // 删除light的class
        document.documentElement.classList.remove('light')
        // 暗黑模式需要给html添加dark的class
        document.documentElement.classList.add('dark')
    } else {
        document.body.classList.add('ani-theme-light')
        document.body.classList.remove('ani-theme-dark')
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
    }
}

window.setGlobalThemeColor = (color = '') => {
    color = color || (window.globalTheme === 'dark' ? '#4A148C' : '#1e1e1e')
    window.globalThemeColor = color
    const el: HTMLElement | null = document.documentElement;
    if (el === null) {
        throw new Error('Invalid document element')
    }
    el.style.setProperty('--el-color-primary', color)
    el.style.setProperty('--ani-primary-light-color', color);
    el.style.setProperty('--ani-primary-dark-color', color);
    for (let i = 1; i <= 9; i++) {
        el.style.setProperty(`--el-color-primary-light-${i}`, lighten(color, i / 10))
        el.style.setProperty(`--el-color-primary-dark-${i}`, darken(color, i / 10))
    }
}

/*判断是否支持主题色*/

if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
    window.setGlobalTheme('light')
}

/*判断是否处于深色模式*/
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    window.setGlobalTheme('dark')
}

/*判断是否处于浅色模式*/
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    window.setGlobalTheme('light')
}



/*模式切换听器*/
var listeners: Record<string, Function> = {
    dark: function (mediaQueryList: MediaQueryList) {
        if (mediaQueryList.matches) {
            // ElMessage.success('您切换到深色模式了！')
            console.log('switch to dark mode');
            window.setGlobalTheme('dark')
            window.setGlobalThemeColor()
        }
    },
    light: function (mediaQueryList: MediaQueryList) {
        if (mediaQueryList.matches) {
            // ElMessage.success('您切换到浅色模式了！')
            console.log('switch to light mode');
            window.setGlobalTheme('light')
            window.setGlobalThemeColor()
        }
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addListener((ev: MediaQueryListEvent) => listeners.dark(ev))
window.matchMedia('(prefers-color-scheme: light)').addListener((ev: MediaQueryListEvent) => listeners.light(ev))

export function hex2Rgb(color: string) {
    color = color.replace('#', '')
    const result: RegExpMatchArray | null = color.match(/../g)
    for (let i = 0; i < 3; i++) {
        if (result === null) {
            throw new Error('Invalid color value')
        }
        result[i] = parseInt(result[i], 16).toString()
    }
    return result
}
export function rgb2Hex(r: number, g: number, b: number) {
    const hexs = [r.toString(16), g.toString(16), b.toString(16)]
    for (let i = 0; i < 3; i++) {
        if (hexs[i].length === 1) {
            hexs[i] = '0' + hexs[i]
        }
    }
    const result = '#' + hexs.join('')
    return result
}
export function lighten(color: string, level: number) {
    const rgb: RegExpMatchArray | null = hex2Rgb(color)
    if (rgb === null) {
        throw new Error('Invalid color value')
    }
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor((255 - Number(rgb[i])) * level + Number(rgb[i])).toString()
    }
    const result = rgb2Hex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]))
    return result
}
export function darken(color: string, level: number) {
    const rgb: RegExpMatchArray | null = hex2Rgb(color)
    if (rgb === null) {
        throw new Error('Invalid color value')
    }
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(Number(rgb[i]) * (1 - level)).toString();
    }
    const result = rgb2Hex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]))
    return result
}