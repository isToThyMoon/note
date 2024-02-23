// ————————————————————————————————————————————————————————————————————————————————
// 用 typescript 实现函数 caller，接收一个函数作为第一个参数，其返回参数类型由接收的函数参数决定

function caller<T extends (...args: any[]) => any>(func: T): ReturnType<T> {
  return func();
}

// 示例用法
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string): string {
  return `Hello, ${name}!`;
}

const result1 = caller(add); // result 的类型为 number
const result2 = caller(greet); // result 的类型为 string
