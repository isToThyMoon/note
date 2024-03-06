/* eslint-disable no-mixed-spaces-and-tabs */
/*
 * @Author: tothymoon-mac istothymoon@gmail.com
 * @Date: 2023-10-22 00:56:24
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2024-02-25 18:01:00
 * @FilePath: /note/01.开发学习笔记 markdown/00.Inbox/面试/interview题/手写promise/class_promise.js
 * @Description:
 */
class CutePromise {
  // status 记录当前状态，初始化是 pending
  status = "pending"; // 'pending' 'resolved' 'rejected'
  value = null; // value 记录异步任务成功的执行结果
  reason = null; // reason 记录异步任务失败的原因

  // 缓存两个队列，维护 resolved 和 rejected 各自对应的处理函数
  // 主要是将then处理函数推入，需要在Promise延迟决议后执行队列内的函数
  onResolvedQueue = [];
  onRejectedQueue = [];

  constructor(executor) {
    try {
      // 把 resolve 和 reject 能力赋予执行器 并执行
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = (value) => {
    // 只有pending状态处理，其他不做操作
    if (this.status === "pending") {
      this.status = "resolved";
      this.value = value;
      // 执行 resolved 队列里的任务
      // promise.then 方法中的回调会被放置到微任务队列中，然后异步调用。
      // 所以，我们需要将回调的调用放入异步队列，
      // 这里我们可以放到 setTimeout 中进行延迟调用，虽然不太符合规范
      setTimeout(() => {
        this.onResolvedQueue.forEach((onResolved) => {
          onResolved(this.value);
        });
      });
    }
  };

  reject = (reason) => {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
      setTimeout(() => {
        this.onRejectedQueue.forEach((onRejected) => {
          onRejected(this.reason);
        });
      });
    }
  };

  // 决议程序
  // 第二个入参returnValue是then中回调函数的返回值
  // then每次会创建返回一个新的Promise对象叫promise2
  // 决议程序就是将新Promise用returnValue决议掉
  // 如果then回调函数返回的是一个新的Promise 需要把新Promise的结果作为promise2的决议结果
  static resolutionProcedure = (
    promise2,
    returnValue,
    promise2Resolve,
    promise2Reject,
    label = "resolve"
  ) => {
    // 这里 hasCalled 这个标识，是为了确保 resolve、reject 不要被重复执行
    let hasCalled;

    if (returnValue === promise2) {
      // 决议程序规范：如果 resolve 结果和 promise2相同则reject，这是为了避免死循环
      return promise2Reject(new TypeError("避免死循环，抛出错误"));
    }

    // 分类 returnValue类型是thenable对象还是其他
    if (
      returnValue !== null &&
      (typeof returnValue === "object" || typeof returnValue === "function")
    ) {
      try {
        // returnValue 是新promise
        // this 是
        const then = returnValue?.then;
        if (typeof then === "function") {
          // 如果第一次then的回调函数返回的是一个promise对象，需要拿到它决议后的入参交给下一链式的回调函数
          then.call(
            returnValue,
            (value) => {
              console.log("return 是promise 执行它的then OnResolve");
              if (hasCalled) return;
              hasCalled = true;
              CutePromise.resolutionProcedure(
                promise2,
                value,
                promise2Resolve,
                promise2Reject
              );
            },
            (err) => {
              console.log("return 是promise 执行它的then OnReject");
              if (hasCalled) return;
              hasCalled = true;
              CutePromise.resolutionProcedure(
                promise2,
                err,
                promise2Resolve,
                promise2Reject,
                "reject"
              );
            }
          );
        } else {
          // then 不是function或者没有then方法，只是普通对象，用该returnValue为promise2决议
          promise2Resolve(returnValue);
        }
      } catch (error) {
        if (hasCalled) return;
        hasCalled = true;
        promise2Reject(error);
      }
    } else {
      if (label === "reject") {
        promise2Reject(returnValue);
        return;
      }
      promise2Resolve(returnValue);
    }
  };

  then = (onResolved, onRejected) => {
    // 如果成功回调不是函数，使用默认的成功回调
    onResolved =
      typeof onResolved === "function" ? onResolved : (value) => value;
    // 如果失败回调不是函数，使用默认的失败回调
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const resolveByStatus = (promise2Resolve, promise2Reject) => {
      // setTimeout(() => {
      try {
        const returnValue = onResolved(this.value);
        CutePromise.resolutionProcedure(
          promise2,
          returnValue,
          promise2Resolve,
          promise2Reject
        );
      } catch (error) {
        promise2Reject(error);
      }
      // });
    };
    const rejectByStatus = (promise2Resolve, promise2Reject) => {
      // setTimeout(() => {
      try {
        const returnValue = onRejected(this.reason);
        CutePromise.resolutionProcedure(
          promise2,
          returnValue,
          promise2Resolve,
          promise2Reject
        );
      } catch (error) {
        promise2Reject(error);
      }
      // });
    };

    let promise2 = new CutePromise((promise2Resolve, promise2Reject) => {
      if (this.status === "resolved") {
        resolveByStatus(promise2Resolve, promise2Reject);
      } else if (this.status === "rejected") {
        rejectByStatus(promise2Resolve, promise2Reject);
      } else if (this.status === "pending") {
        this.onResolvedQueue.push(function () {
          resolveByStatus(promise2Resolve, promise2Reject);
        });
        this.onRejectedQueue.push(function () {
          rejectByStatus(promise2Resolve, promise2Reject);
        });
      }
    });

    return promise2;
  };
}

// test
let cutePromise = new CutePromise(function (resolve, reject) {
  setTimeout(() => {
    resolve("dada");
    // reject("dada");
  }, 1000);
});
console.log("1");
cutePromise
  .then(
    (value) => {
      console.log("我是第 1 个任务", value);
      return new CutePromise(function (resolve, reject) {
        setTimeout(() => {
          reject("didi");
        }, 1000);
      });
    },
    (error) => {
      console.log("第一个任务失败", error);
    }
  )
  .then(
    (value) => {
      console.log("我是第 2 个任务", value);
    },
    (reason) => {
      console.log("我是第 2 个任务reject", reason);
    }
  );

console.log("2");
