## Scheduler 调度普通任务

Scheduler 的核心源码位于 package/scheduler/src/forks/Scheduler.js，如下：

![image-20240419172255356](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240419172255356.png)

### SchedulerCallback

该函数的主要目的就是用调度任务，该方法的分析如下:

```js
const getCurrentTime = () => performance.now();

// 有两个队列分别存储普通任务和延时任务
// 里面采用了一种叫小顶堆的算法, 保证每次从队列中取出的是优先级最高的任务(时间即将过期的)
var taskQueue = []; // 存放普通任务
var timerQueue = []; // 存放延时任务

// Timeout 对应的值
var userBlockingPriorityTimeout = 250;
var normalPriorityTimeout = 5000;
var lowPriorityTimeout = 10000;
var maxSigned31BitInt = 1073741823;
/**
 * 
 * @param {*} priorityLevel 优先级等级
 * @param {*} callback 具体要做的任务
 * @param {*} options { delay: number } 这是一个对象, 该对象有 delay 属性, 表示要延迟的时间
 * @returns 
 */
function unstable_scheduleCallback(priorityLevel, callback, options) {
  // 获取当前的时间
  var currentTime = getCurrentTime();

  var startTime;
  // 整个这个 if else 就是在设置起始时间, 如果有延时, 起始时间就需要添加上这个延时
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    // 如果设置了延迟时间, 那么 startTime 就为当前时间 + 延时时间
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;
  // 根据传入的优先级等级来设置 timeout
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = -1;
      break;
    case UserBlockingPriority:
      timeout = userBlockingPriorityTimeout;
      break;
    case IdlePriority:
      timeout = maxSigned31BitInt;
      break;
    case LowPriority:
      timeout = lowPriorityTimeout;
      break;
    case NormalPriority:
    default:
      timeout = normalPriorityTimeout;
      break;
  }
  // 接下来就计算出过期时间
  // 计算出来的时间有些比当前时间要早, 绝大部分比当前时间要晚一些
  var expirationTime = startTime + timeout;
  // 创建一个新的任务
  var newTask = {
    id: taskIdCounter++, // 任务 id
    callback, // 该任务具体要做的事情
    priorityLevel, // 任务的优先级别
    startTime, // 任务开始时间
    expirationTime, // 任务过期时间
    sortIndex: -1, // 用于后面在小顶堆(这是一种算法, 可以始终在任务队列中拿出最优先的任务) 进行排序的索引
  };
  if (enableProfiling) {
    newTask.isQueued = false;
  }

  if (startTime > currentTime) {
    // 说明这是一个延时任务
    newTask.sortIndex = startTime;
    // 把该任务推入到 timerQueue 的任务队列中
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 进入此 if, 说明 taskQueue 里面的任务已经执行完毕了
      // 并且从 timerQueue 里面取出一个最新的任务又是当前任务
      // 下面的 if else 就是一个开关
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // 如果是延时认为, 调用 requestHostTimeout 进行任务的调度
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 说明不是延时任务
    newTask.sortIndex = expirationTime; // 设置了 sortIndex 后, 可以在任务队列里面
    // 推入到 taskQueue 任务队列
    push(taskQueue, newTask);
    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }
    // 最终调用 requestHostCallback 进行任务的调度
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback();
    }
  }

  // 向外部返回任务
  return newTask;
}
```

该方法主要注意以下几个关键点：

+ 关于任务队列有两个，一个 taskQueue，另一个是 timerQueue，taskQueue 存放普通任务，timerQueue 存放延时任务，任务队列内部用到了小顶堆的算法，保证始终放进去 (push) 的任务能够进行正常的排序，回头通过 peek 取出任务时，始终取出的是时间优先级最高的那个任务
+ 根据传入的不同的priorityLevel，会进行不同的 timeout 的设置，任务的 timeout 时间也就不一样了，有的比当前时间还要小，这个代表立即需要执行的，绝大部分时间比当前时间大。
+ 不同的任务，最终调用的函数不一样
  + 普通任务调用 requestHostCallback
  + 延时任务调用 requestHostTimeout

### requestHostCallback

该方法主要就是调用 `schedulePerformWorkUntilDeadline` 方法

```js
/**
 * requestHostCallback 主要就是调用 schedulePerformWorkUntilDeadline 方法
 */
function requestHostCallback() {
	if (!isMessageLoopRunning) {
		isMessageLoopRunning = true;
		schedulePerformWorkUntilDeadline(); // 大多数情况下是实例化 MessageChannel 进行后面的调度
	}
}
```

### schedulePerformWorkUntilDeadline

该方法一开始是 undefined，根据不同的环境选择不同生成宏任务的方式(一般就是 MessageChannel)

```js
const localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
const localSetImmediate =
	typeof setImmediate !== 'undefined' ? setImmediate : null; // IE and Node.js + jsdom

let schedulePerformWorkUntilDeadline; // undefined
if (typeof localSetImmediate === 'function') {
	// Node.js 和 旧的IE 环境
	schedulePerformWorkUntilDeadline = () => {
		localSetImmediate(performWorkUntilDeadline);
	};
} else if (typeof MessageChannel !== 'undefined') {
	// 大多数情况下,使用的是MessageChannel
	const channel = new MessageChannel();
	const port = channel.port2;
	channel.port1.onmessage = performWorkUntilDeadline;
	schedulePerformWorkUntilDeadline = () => {
		port.postMessage(null);
	};
} else {
	// setTimeout进行兜底
	schedulePerformWorkUntilDeadline = () => {
		localSetTimeout(performWorkUntilDeadline, 0);
	};
}
```

### performWorkUntilDeadline

该方法主要就是在调用 flushWork，调用之后返回一个布尔值，根据布尔值来判断是否还有剩余的任务，如果还有，就是用messageChannel进行一个宏任务的包装， 放入到任务队列里面

```js
let startTime = -1; // 用于记录任务开始执行的时间，默认值为-1

// 执行工作直至截止时间的函数
const performWorkUntilDeadline = () => {
  if (isMessageLoopRunning) {
    // 获取当前的时间
    const currentTime = getCurrentTime();
    // 这里的startTime 并非 unstable_scheduleCallback 方法里面的 startTime
    // 而是一个全局变量, 默认值为 -1
    // 用来测量任务的执行时间, 从而能够知道主线程被阻塞了多久
    startTime = currentTime;

    // 如果调度程序任务抛出，请退出当前浏览器任务，以便可以观察到错误。
    // 故意不使用try-catch，因为这会使一些调试技术更加困难。相反，如果“flushWork”出错，那么“hasMoreWork”将保持为真，我们将继续工作循环。
    let hasMoreWork = true; // 默认还有需要做的任务
    try {
      // 返回一个布尔, true代表工作没做完, false 代表没有任务了
      hasMoreWork = flushWork(currentTime);
    } finally {
      if (hasMoreWork) {
        // 如果还有任务需要执行，调度下一个消息事件
        // 就使用 MessageChannel 进行一个 message 事件的调度, 就将任务放入到任务队列里面
        schedulePerformWorkUntilDeadline();
      } else {
        // 说明任务做完了，将消息循环标记为未运行
        isMessageLoopRunning = false;
      }
    }
  }
};
```

### flashWork

核心就是调用 workLoop 函数

```js
const SchedulerResumeEvent = 8;
let mainThreadIdCounter = 0;

/**
 * 
 * @param {*} initialTime 做这个任务时开始执行的时间
 * @returns 
 */
function flushWork(initialTime) {
  // 如果启用了性能分析，标记调度程序恢复
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  }

  // 下次调度工作时，我们将需要一个宿主回调。
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // 我们已经安排了一个超时，但现在不再需要。取消它。
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  // 正在执行工作
  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        // 核心实际上是这一句,执行工作循环
        return workLoop(initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          // 如果当前任务不为空，标记任务发生错误
          markTaskErrored(currentTask, currentTime);
          // 当前任务不再排队
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {
      // 核心实际上是这一句,执行工作循环
      return workLoop(initialTime);
    }
  } finally {
    // 重置当前任务、当前优先级级别和正在执行工作的状态
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (enableProfiling) {
      const currentTime = getCurrentTime();
      // 标记调度程序暂停
      markSchedulerSuspended(currentTime);
    }
  }
}

// 标记调度程序未暂停
export function markSchedulerUnsuspended(ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      // 记录调度程序恢复事件
      logEvent([SchedulerResumeEvent, ms * 1000, mainThreadIdCounter]);
    }
  }
}
// 标记调度程序暂停
export function markSchedulerSuspended(ms) {
  if (enableProfiling) {
    mainThreadIdCounter++;

    if (eventLog !== null) {
      logEvent([SchedulerSuspendEvent, ms * 1000, mainThreadIdCounter]);
    }
  }
}
```

### workLoop

```js
/**
 * 
 * @param {*} initialTime 做这个任务时开始执行的时间
 * @returns 
 */
function workLoop(initialTime) {
  let currentTime = initialTime;
  // 该方法实际上是用来遍历 timerQueue, 判断是否已经有到期了的任务
  // 如果有, 将这个任务放入到 taskQueue 中
  advanceTimers(currentTime);
  // 从 taskQueue 里面取一个任务出来
  currentTask = peek(taskQueue);
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      // currentTask.expirationTime > currentTime 说明任务还没有过期
      // shouldYieldToHost 任务是否应该暂停, 归还主线程
      // 跳出 while
      break;
    }
    // 没有进入到上面的 if, 说明这个任务到过期时间, 并且有剩余时间来执行, 没有到达需要浏览器渲染的时候
    // 那我们就执行该任务即可
    const callback = currentTask.callback; // 拿到这个任务
    if (typeof callback === 'function') {
      // 说明当前的任务是一个函数, 我们执行该任务
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      if (enableProfiling) {
        markTaskRun(currentTask, currentTime);
      }
      // 任务的执行实际上就是在这一句
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        currentTask.callback = continuationCallback;
        if (enableProfiling) {
          markTaskYield(currentTask, currentTime);
        }
        advanceTimers(currentTime);
        return true;
      } else {
        if (enableProfiling) {
          markTaskCompleted(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
        advanceTimers(currentTime);
      }
    } else {
      // 直接弹出
      pop(taskQueue);
    }
    // 再从 taskQueue 里面取一个任务出来
    currentTask = peek(taskQueue);
  }
  // Return whether there's additional work
  if (currentTask !== null) {
    // 如果不为空, 代表还有更多的任务, 那么回头外部的 hasMoreWork 拿到的也就是true
    return true;
  } else {
    // 说 taskQueu 这个队列空了,那么我们就从 timerQueue 里面去看延时任务
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    // 没有进入上面的if, 说明 timerQueue 里面的任务也完了, 返回false, 回头外部的 hasMoreWork 拿到的也就是false
    return false;
  }
}
```

首先有一个 while 循环，该while循环保证了能够从任务队列中不停的取任务出来

```js
while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    //...
}
```

当然，不是说一直从任务队列里面取任务出来执行就完事，每次取出一个任务后，我们还需要一系列的判断

```js
if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
    break;
}
```

+ currentTask.expirationTime > currentTime 表示任务还没有过期
+ shouldYieldToHost 任务是否应该暂停，归还主线程
+ 如果进入if，说明因为某些原因不能再执行任务，需要立即归还主线程，那么我们就跳出while

### shouldYieldToHost 

首先计算 timeElapsed，然后判断是否超时，没有的话就返回 false，表示不需要归还，否则就返回 true，表示需要归还

frameInterval 默认设置是 5ms

```js
function shouldYieldToHost() {
  // getCurrentTime 获取当前时间
  // startTime 是我们任务开始时的时间，一开始是-1,之后任务开始时，将任务开始时的时间赋值给了它
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    // 主线程只被阻塞了一点点时间，远远没打到需要归还的时间锚点
    return false;
  }
  // 需要归还
  return true;
}
```

### advanceTimers

该方法就是遍历整个 timerQueue，查看是否有已经过期的方法，如果有，不是直接执行，而是将这个过期的方法添加到 taskQueue

```js
function advanceTimers(currentTime) {
  // 从timerQueue里面获取一个任务
  let timer = peek(timerQueue);
  // 遍历整个 timerQueue
  while (timer !== null) {
    if (timer.callback === null) {
      // 这个任务没有对应的要执行的 callback，直接从这个队列弹出
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // 进入这个分支说明当前的任务已经不再是延时任务
      // 我们需要将其转移到 taskQueue
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer); // 推入到 taskQueue
      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      return;
    }
    // 从 timerQueue 再取一个新的进行判断
    timer = peek(timerQueue);
  }
}
```

