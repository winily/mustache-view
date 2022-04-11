import lodash from "lodash"


const utlis = {
    dpr: (): number => window.devicePixelRatio || 1,
    npx(px: number): number {
        return parseInt((px * utlis.dpr()).toString(), 10)
    },
    npxLine(px: number): number {
        const n = npx(px);
        return n !== 0 ? n - 0.5 : 0.5;
    },
    thinLineWidth(): number {
        return utlis.dpr() - 0.5;
    },
    px(npx: number) {
        return parseInt((npx / utlis.dpr()).toString(), 10)
    },
    createCanvas(boxDom: HTMLDivElement, width: number, height: number) {
        const canvasElement = document.createElement('canvas')
        canvasElement.width = utlis.npx(width);
        canvasElement.height = utlis.npx(height);
        boxDom.appendChild(canvasElement)
        const context = canvasElement.getContext("2d")
        return { el: canvasElement, context }
    },

    format(pattern: string, date: Date) {
        const format: any = { "y+": date.getFullYear(), "M+": date.getMonth() + 1, "d+": date.getDate(), "H+": date.getHours(), "m+": date.getMinutes(), "s+": date.getSeconds(), "S": date.getMilliseconds(), "h+": (date.getHours() % 12), "a": (date.getHours() / 12) <= 1 ? 'AM' : 'PM' };
        for (let key in format) {
            const regExp = new RegExp('(' + key + ')');
            const match = pattern.match(regExp);
            if (!match)
                continue;
            let zero = "";
            for (let i = 0; i < match[1].length; i++) zero += "0";
            const replacement = match[1].length == 1 ? format[key] : (zero + format[key]).substring((('' + format[key]).length));
            pattern = pattern.replace(match[1], replacement);
        }
        return pattern;
    },

    isDefined(value?: any) {
        return !lodash.isUndefined(value);
    },

    isURL(value: string) {
        return lodash.isString(value) && /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(value);
    },

    isHexColor(value: string) {
        return lodash.isString(value) && /^\#[0-9a-zA-Z]{3,6}$/.test(value);
    },

    getPrototype(value: any) {
        const temp = Object.prototype.toString.call(value);
        const result = temp.match(/^\[object (.*)\]/)
        return result ? result[1] : null;
    },

    isDiv(value: any) {
        return utlis.getPrototype(value) === "HTMLDivElement";
    },

    isCanvas(value: any) {
        return utlis.getPrototype(value) === "HTMLCanvasElement";
    },

    isImage(value: any) {
        return utlis.getPrototype(value) === "HTMLImageElement";
    },

    assert(expression: boolean, error: Error | string) {
        if (expression)
            return;
        throw lodash.isError(error) ? error : new Error(error);
    },

    optionsInject(that: any, options: any, initializers: any = {}, checkers: any = {}) {
        Object.keys(that).forEach(key => {
            let value = options[key];
            if (lodash.isFunction(initializers[key]))
                value = initializers[key](value);
            if (lodash.isFunction(checkers[key]))
                utlis.assert(checkers[key](value), `options property ${key} invalid`);
            if (lodash.isUndefined(value))
                return;
            if (lodash.isSymbol(that[key]) && !lodash.isSymbol(value))
                return;
            that[key] = value;
        });
    },

};

export default utlis

export const npx = utlis.npx
export const npxLine = utlis.npxLine
export const thinLineWidth = utlis.thinLineWidth


const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/** index number 2 letters
 * @example stringAt(26) ==> 'AA'
 * @param {number} index
 * @returns {string}
 */
export const stringAt = (index: number): string => {
    let str = '';
    let cindex = index;
    while (cindex >= alphabets.length) {
        cindex /= alphabets.length;
        cindex -= 1;
        str += alphabets[parseInt(cindex.toString(), 10) % alphabets.length];
    }
    const last = index % alphabets.length;
    str += alphabets[last];
    return str;
}

/** translate letter in A1-tag to number
 * @param {string} str "AA" in A1-tag "AA1"
 * @returns {number}
 */
export const indexAt = (str: string): number => {
    let ret = 0;
    for (let i = 0; i !== str.length; ++i) ret = 26 * ret + str.charCodeAt(i) - 64;
    return ret - 1;
}


// B10 => x,y
/** translate A1-tag to XY-tag
 * @param {tagA1} src
 * @returns {tagXY}
 */
export const expr2xy = (src: string): Array<number> => {
    let x = '';
    let y = '';
    for (let i = 0; i < src.length; i += 1) {
        if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
            y += src.charAt(i);
        } else {
            x += src.charAt(i);
        }
    }
    return [indexAt(x), parseInt(y, 10) - 1];
}

/** translate XY-tag to A1-tag
 * @example x,y => B10
 * @param {number} x
 * @param {number} y
 * @returns {tagA1}
 */
export const xy2expr = (x: number, y: number): string => {
    return `${stringAt(x)}${y + 1}`;
}

/** translate A1-tag src by (xn, yn)
 * @date 2019-10-10
 * @export
 * @param {tagA1} src
 * @param {number} xn
 * @param {number} yn
 * @returns {tagA1}
 */
export const expr2expr = (src: string, xn: number, yn: number, condition: (x: number, y: number) => boolean = () => true): string => {
    if (xn === 0 && yn === 0) return src;
    const [x, y] = expr2xy(src);
    if (!condition(x, y)) return src;
    return xy2expr(x + xn, y + yn);
}