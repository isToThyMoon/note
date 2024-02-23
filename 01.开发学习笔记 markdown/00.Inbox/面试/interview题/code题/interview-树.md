/\*

- @Author: tothymoon-mac istothymoon@gmail.com
- @Date: 2023-11-03 00:13:55
- @LastEditors: tothymoon-mac istothymoon@gmail.com
- @LastEditTime: 2023-11-03 00:21:06
- @FilePath: /snippets/00.interview/interview-树.js
- @Description:
  \*/

// ————————————————————————————————————————————————————————————————————————————————

## 树的遍历 求二叉树所有节点数字之和

```js
// 实现函数接受任意二叉树，求二叉树所有根到叶子路径组成的数字之和
class TreeNode {
	constructor(value, left, right) {
		this.value = value;
		this.left = left;
		this.right = right;
	}
	// value:number
	// left?:TreeNode
	// right?:TreeNode
}

const rootNode = new TreeNode(1);
const node2 = new TreeNode(2);
const node3 = new TreeNode(3);
const node4 = new TreeNode(4);
const node5 = new TreeNode(5);
const node6 = new TreeNode(6);
rootNode.left = node2;
rootNode.right = node3;
node2.left = node4;
node2.right = node5;
node3.left = node6;

function sumNodes(root) {
	// 深度优先遍历 递归实现
	function dfs(node, resultList = []) {
		if (node) {
			node.value && resultList.push(node.value);
			node.left && dfs(node.left, resultList); // 递归左树
			node.right && dfs(node.right, resultList); // 递归右树
		}
		return resultList.reduce((acc, cur) => {
			return acc + cur;
		}, 0);
	}

	// 广度优先 通过一个队实现
	function bfs(node) {
		const queue = [node];
		const resultList = [];
		while (queue.length > 0) {
			const node = queue.shift();
			node.value && resultList.push(node.value);
			node.left && queue.push(node.left);
			node.right && queue.push(node.right);
		}
		return resultList.reduce((acc, cur) => {
			return acc + cur;
		}, 0);
	}

	return dfs(root);
	// return bfs(root);
}

// console.log(sumNodes(rootNode));
// 遍历顺序 1
// 遍历顺序 2
// 遍历顺序 4
// 遍历顺序 5
// 遍历顺序 3
// 遍历顺序 6
// 21
```

// ————————————————————————————————————————————————————————————————————————————————

# 树相关题

## 反转二叉树

```js
function invertTree(rootNode) {
	if (rootNode === null) {
		return null; // 处理空节点的情况
	}
	const temp = rootNode.left;
	rootNode.left = invertTree(rootNode.right);
	rootNode.right = invertTree(temp);

	return rootNode;
}
```
