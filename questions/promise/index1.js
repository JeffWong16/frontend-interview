var PromisePolyfill = (function() {
  function tryToResolve(value) {
    if (this === value) {
      throw Error('xxxx')
    }

    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      try {
        var then = value.then
        var thenAlreadyCalledOrThrow
        if (typeof then === 'function') {
          // 其他promise resolve后执行注册的函数
          then.bind(this)(
            function (value2){
              if (thenAlreadyCalledOrThrow) return
              thenAlreadyCalledOrThrow = true
              tryToResolve.bind(this, value2)()
            },
            function (reason2) {
              if (thenAlreadyCalledOrThrow) return
              thenAlreadyCalledOrThrow = true
              resolveOrReject.bind(this, 'reject', reason2)()
            }
          )
        } else {
          if (thenAlreadyCalledOrThrow) return
          thenAlreadyCalledOrThrow = true
          resolveOrReject.bind(this, 'resolve', value)()
        }
      }catch(e) {
        if (thenAlreadyCalledOrThrow) return 
        thenAlreadyCalledOrThrow = true
        resolveOrReject.bind(this, 'reject', e)()
      }
    }


  }

  function resolveOrReject(status, data) {
    if (status !== 'pending') return 
    this.status = status
    this.data = data
    if (status === 'resolve') {
      for (let i = 0, len = this.resolveList.length; i<len; i++) {
        this.resolveList[i](value)
      }
    } else {
      for (let i = 0, len = this.rejectList.length; i<len; i++) {
        this.rejectList[i](value)
      }
    }


  }

  function Promise (executor){
    if (!(this instanceof Promise)) {
      throw Error('Promise can not be called without new')
      return
    }

    if (typeof executor !== 'function') {
      throw Error(`${executor} should be a function`)
      return 
    }

    this.data  = ''
    this.status  = 'pending'
    this.resolveList = []
    this.rejectList = []


    try {
      executor(tryToResolve.bind(this), resolveOrReject.bind(this))
    } catch (e) {
      resolveOrReject.bind(this, 'reject', e)()
    }


  }

  Promise.prototype.then = function(onFullfilled, onRejected) {

    var executor = function(resolve, reject) {
      setTimeout(function() {
        try {
          var value = this.status === 'resolved'
          ? onFullfilled(this.data)
          : onRejected(this.data)
            resolve(value)
        } catch (e) {
          reject(e)
        }
      }.bind(this))
    }

    if (this.status !== 'pending') {
      return new Promise(executor.bind(this))
    } else {
      return new Promise(function(resolve, reject) {
        this.resolveList.push(executor.bind(this, resolve, reject))
        this.rejectList.push(executor.bind(this, resolve, reject))
      }.bind(this))
    }
  }
})