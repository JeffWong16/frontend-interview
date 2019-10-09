class Scheduler {
  constructor() {
    this.tasksLength = 0
    this.queue = []
    this.maxTasklength = 2
  }
  add(promiseCreator) {
    return new Promise((resolve) => {
      let handler = () => promiseCreator().then((res) => {
        resolve(res)
        this.tasksLength--
        this.runNext()
      })
      if (this.tasksLength < this.maxTasklength) {
        this.tasksLength++
        handler()
      } else {
        this.queue.push(handler)
      }
    })
  }
  runNext () {
    if(this.queue.length) {
      this.tasksLength++
      this.queue.shift()()
    }
  }
}
const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})
const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')// output: 2 3 1 4
