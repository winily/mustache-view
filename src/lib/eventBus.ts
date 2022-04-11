import utlis from "./util"

type OnFunction = (...args: any[]) => void

class Event {
  private readonly onList: Array<OnFunction> = []
  constructor(
    public readonly key: string,
    public readonly once: boolean = false
  ) { }

  on(fun: OnFunction): Event {
    this.onList.push(fun)
    return this
  }

  emit(...args: any[]): Event {
    this.onList.forEach(fun => fun(...args))
    return this
  }
}

type EventList = { [key: string]: Event }

class EventBus {
  private static readonly eventBus: EventBus = new EventBus()

  private readonly events: EventList = {}

  private constructor() { }

  emit(key: string, ...args: any[]): EventBus {
    this.events[key]?.emit(...args)
    this.events[key]?.once && this.off(key)
    return this
  }

  on(key: string, fun: OnFunction) {
    if (utlis.isDefined(this.events[key])) this.events[key].on(fun)
    else this.events[key] = new Event(key).on(fun)
    return this
  }

  once(key: string, fun: OnFunction): EventBus {
    if (utlis.isDefined(this.events[key])) this.events[key].on(fun)
    else this.events[key] = new Event(key, true).on(fun)
    return this
  }

  off(key: string): EventBus {
    delete this.events[key]
    return this
  }

  static getInstance() {
    return this.eventBus
  }
}

export const eventBus = EventBus.getInstance()

export const on = (key: string, fun: OnFunction) => {
  return eventBus.on(key, fun)
}

export const once = (key: string, fun: OnFunction) => {
  return eventBus.once(key, fun)
}

export const emit = (key: string, ...args: any[]) => {
  return eventBus.emit(key, ...args)
}