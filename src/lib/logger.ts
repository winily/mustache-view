
import utli from './util'

/**
 * 日志打印
 * 
 * 对原有的控制台输出进行了封装
 * 主要实现输出时附带时间点、调用者位置、日志等级
 */

type StackLocation = { scriptName: string, codeLine: number, codeColumn: Number }

export default class Logger {
  private getStackTopCodeLocation(level: number = 3): StackLocation {
    const stackArray = new Error()?.stack?.replace(/\s{4}at./g, '').split('\n');
    if (!stackArray || stackArray.length == 0 || !stackArray[level + 1])
      return { scriptName: "", codeLine: -1, codeColumn: -1 };
    let scriptPath, codeLine, codeColumn, match;
    if ((match = stackArray[level + 1].match(/^(.+):(\d+):(\d+)$/)))
      ([, scriptPath, codeLine, codeColumn] = match);
    else if ((match = stackArray[level + 1].match(/^(.+)\s\((.+):(\d+):(\d+)\)$/)))
      ([, , scriptPath, codeLine, codeColumn] = match);
    else if ((match = stackArray[level + 1].match(/(.+):(\d+):(\d+)\)$/)))
      ([, scriptPath, codeLine, codeColumn] = match);
    if (!codeLine || !codeColumn) return { scriptName: "", codeLine: -1, codeColumn: -1 };
    let scriptName = "unknown";
    if (scriptPath) {
      const match = scriptPath.match(/([\w_\-]+).js$/);
      if (match && match[1]) scriptName = match[1];
    }
    return { scriptName, codeLine: parseInt(codeLine), codeColumn: parseInt(codeColumn) };
  }
  private generateLogHead(level: string) {
    const { scriptName, codeLine, codeColumn }: StackLocation = this.getStackTopCodeLocation();
    return `[${utli.format("yyyy-MM-dd HH:mm:ss.S", new Date())}][${level}][${scriptName}<${codeLine || "?"},${codeColumn || "?"}>]`;
  }

  log(...args: any[]) {
    console.log(this.generateLogHead("LOG"), ...args)
  }

  info(...args: any[]) {
    console.info(`%c${this.generateLogHead("INFO")}`, "color:#0091ea", ...args)
  }

  warn(...args: any[]) {
    console.warn(this.generateLogHead("WARNING"), ...args)
  }

  error(...args: any[]) {
    console.error(this.generateLogHead("ERROR"), ...args)
  }
}

