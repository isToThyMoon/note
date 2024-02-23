// ————————————————————————————————————————————————————————————————————————————————
// 归并排序（Merge Sort）是一种分治算法，它将一个数组分成两个子数组，
// 然后递归地对子数组进行排序，最后将这两个有序子数组合并成一个有序数组。
// 两个有序数组合并成一个有序数组的问题 就好解决了。

// 合并两个有序子数组
function merge(left, right) {
	const result = [];
	let leftIndex = 0;
	let rightIndex = 0;

	while (leftIndex < left.length && rightIndex < right.length) {
		if (left[leftIndex] < right[rightIndex]) {
			result.push(left[leftIndex]);
			leftIndex++;
		} else {
			result.push(right[rightIndex]);
			rightIndex++;
		}
	}

	return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}
function mergeSort(arr) {
	if (arr.length <= 1) {
		// 递归出口
		return arr;
	}

	const middleIndex = Math.floor(arr.length / 2);
	const leftArr = arr.slice(0, middleIndex);
	const rightArr = arr.slice(middleIndex);

	// 递归处理左右子数组 mergeSort返回一个已经完成排序的数组
	const sortedLeft = mergeSort(leftArr);
	const sortedRight = mergeSort(rightArr);

	return merge(sortedLeft, sortedRight);
}

// mergeSort(array);
// log(mergeSort(array));
// 归并排序的时间复杂度是O(n*log(n))，其中n是数组的长度。它是一种高效的排序算法，适用于各种规模的数据集，
// 并且具有稳定性（相同元素的相对顺序不会改变）。这使得归并排序在实际应用中非常有价值。
// ————————————————————————————————————————————————————————————————————————————————
// 二维有序数组合并转一维有序数组(归并排序的思路)
// 归并加递归算法

// 思路，转化成合并两个一维数组的问题
// 然后把无数的数组 归并处理

// 示例输入，二维有序数组
const arr = [
	[1, 3, 5],
	[2, 4, 6],
	[0, 7, 8]
];

function mergeArray(array) {
	if (array.length <= 1) {
		return array[0] || [];
	}

	const middleIndex = Math.floor(array.length / 2);
	const leftArray = array.slice(0, middleIndex);
	const rightArray = array.slice(middleIndex);

	// 递归处理
	const mergedLeft = mergeArray(leftArray);
	const mergedRight = mergeArray(rightArray);

	// 归并处理
	return mergeTwoList(mergedLeft, mergedRight);
}

// 方法 用于合并两个有序数组 为一个有序数组
// 设置两个index 遍历对比 最后合并剩余部分
function mergeTwoList(leftList, rightList) {
	let result = [];
	let leftIndex = 0;
	let rightIndex = 0;

	while (leftIndex < leftList.length && rightIndex < rightList.length) {
		if (leftList[leftIndex] < rightList[rightIndex]) {
			result.push(leftList[leftIndex]);
			leftIndex++;
		} else {
			result.push(rightList[rightIndex]);
			rightIndex++;
		}
	}

	return result.concat(leftList.slice(leftIndex), rightList.slice(rightIndex));
}

console.log(mergeArray(arr));
