# 6-2 不再惧怕CSS - CSS-in-JS

CSS-in-JS 不是指某一个具体的库，是指组织CSS代码的一种方式，代表库有 styled-component 和 emotion

## 传统CSS的缺陷

### 1. 缺乏模块组织

传统的JS和CSS都没有模块的概念，后来在JS界陆续有了 CommonJS 和 ECMAScript Module，CSS-in-JS可以用模块化的方式组织CSS，依托于JS的模块化方案，比如：

```jsx
// button1.ts
import styled from '@emotion/styled'

export const Button = styled.button`
  color: turquoise;
`
```

```jsx
// button2.ts
import styled from '@emotion/styled'

export const Button = styled.button`
  font-size: 16px;
`
```

### 2. 缺乏作用域

传统的CSS只有一个全局作用域，比如说一个class可以匹配全局的任意元素。随着项目成长，CSS会变得越来越难以组织，最终导致失控。CSS-in-JS可以通过生成独特的选择符，来实现作用域的效果

```
.css-1c4ktv6 > * {
    margin-top: 0;
    marign-bottom: 0;
}
```

```jsx
const css = styleBlock => {
  const className = someHash(styleBlock);
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .${className} {
      ${styleBlock}
    }
  `;
  document.head.appendChild(styleEl);
  return className;
};
const className = css(`
  color: red;
  padding: 20px;
`); // 'c23j4'
```

### 3. 隐式依赖，让样式难以追踪

比如这个CSS样式：

```css
.target .name h1 {
  color: red
}

body #container h1 {
  color: green
}
```

```html
<!doctype html>
<html lang="en">
<body>
  <div id='container'>
   <div class='target'>
     <div class='name'>
       <h1>我是啥颜色？</h1>
     </div>
   </div>
  </div>
</body>
</html>
```

那么这个h1元素最终显式为什么颜色？假如你想要追踪这个影响这个h1的样式，怎么追踪？

而CSS-in-JS的方案就简单直接、易于追踪

```html
export const Title = styled.h1`
  color: green;
`
<Title>
  我是啥颜色？
</Title>
```

### 4. 没有变量

传统的CSS规则里没有变量，但是在 CSS-in-JS 中可以方便地控制变量

```css
const Container = styled.div(props => ({
  display: 'flex',
  flexDirection: props.column && 'column'
}))
```

### 5. CSS选择器与HTML元素耦合

```css
.target .name h1 {
  color: red
}

body #container h1 {
  color: green
}
```

```html
<!doctype html>
<html lang="en">
<body>
  <div id='container'>
   <div class='target'>
     <div class='name'>
       <h1>我是啥颜色？</h1>
     </div>
   </div>
  </div>
</body>
</html>
```

如果你想把 `h1` 改成`h2`，必须要同时改动 CSS 和 HTML。而在CSS-in-JS中，HTML和CSS是结合在一起的，易于修改

## Emotion 介绍

Emotion 是目前最受欢迎的 CSS-in-JS 库之一，它还对 React 作了很好的适应，可以方便地创建 styled component，也支持写行内样式：

```css
/** @jsx jsx */
import { jsx } from '@emotion/react'

render(
  <div
    css={{
      backgroundColor: 'hotpink',
      '&:hover': {
        color: 'lightgreen'
      }
    }}
  >
    This has a hotpink background.
  </div>
)
```

这种写法比起React自带的style的写法功能更强大，比如可以处理级联、伪类等style处理的不了的情况

```css
<span style={{ color: "red" }}>{keyword}</span>
```