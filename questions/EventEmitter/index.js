class EventEmitter {
  constructor() {
    this.events = {}
  }
  on (eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [listener]
      return
    }
    this.events[eventName].push(listener)
  }
  off (eventName, listener) {
    let index = this.events[eventName].indexOf(listener)
    // console.log(this.events[eventName].length,2)
    if (index > -1) {
      // console.log(index, 777)
      this.events[eventName].splice(index, 1)
    }
  }
  once (eventName, listener) {
    let on =  (...args) =>  {
      this.off(eventName, on)
      listener.apply(this, args)
    }
    this.on(eventName, on)
  }
  emit(eventName, ...args) {
    this.events[eventName].forEach((fn) => {
      // console.log(fn.toString())
      fn(...args)
    })
  }
}