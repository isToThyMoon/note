/\*

- @Author: tothymoon-mac istothymoon@gmail.com
- @Date: 2023-11-06 23:48:03
- @LastEditors: tothymoon-mac istothymoon@gmail.com
- @LastEditTime: 2023-11-07 00:04:27
- @FilePath: /snippets/00.interview/code 题/寻找最大 k 个数.JS
- @Description:
  \*/

// ——————————————————————————————————————————————————————————————————————————————————————
// "寻找最大的 K 个数" 意味着在一个给定的数据集中，你需要找到其中的 K 个最大的数值。
// 这通常涉及到对数据进行排序或使用其他算法来找到这些最大值。

// 举例来说，如果有一个数组 `[3, 7, 1, 9, 5, 2, 6]`，要找到其中最大的三个数，
// 那么这个问题的解决方法将返回 `[9, 7, 6]`，因为这是数组中最大的三个数。

// 这种问题通常出现在数据分析、统计、计算机科学和工程中，
// 有时需要在大型数据集中查找最大的数值，以便进行进一步的分析、筛选或处理。
// 在实际应用中，可能会有不同的算法和数据结构用于解决这个问题，具体取决于问题的规模和性能要求。
// ——————————————————————————————————————————————————————————————————————————————————————

要查找最大的 K 个数，你可以使用不同的算法和数据结构，取决于输入数据的规模和要求。以下是几种常见的方法：

1. 排序法：
   - 将输入数组排序，然后选择最后的 K 个元素即可。
   - 这是最简单的方法，时间复杂度为 O(N log N)，其中 N 是数组的大小。
   - 缺点是它会修改原始数组，如果不允许修改原始数据，需要先复制数组再进行排序。

```javascript
function findLargestK(nums, k) {
	nums.sort((a, b) => b - a);
	return nums.slice(0, k);
}
```

2. 堆（Heap）：
   堆排思想 不断取出最大的堆顶点，得到 K 个最大数

```javascript
var array = [5, 4, 6, 1, 9, 3, 0, 5, 3, 7, 2, 8, 4, 10, 6];

function heapSortFindK(array, k) {
	const result = [];
	buildMaxHeap(array);

	for (let i = array.length - 1; i > array.length - 1 - k; i--) {
		result.push(array[0]);
		[array[0], array[i]] = [array[i], array[0]];
		heapify(array, 0, i);
	}
	return result;
}

function buildMaxHeap(array) {
	for (let i = Math.floor(array.length / 2); i >= 0; i--) {
		heapify(array, i, array.length);
	}
}
function heapify(array, i, size) {
	let largestIndex = i;
	let leftIndex = 2 * i + 1;
	let rightIndex = 2 * i + 2;

	if (leftIndex < size && array[leftIndex] > array[largestIndex]) {
		largestIndex = leftIndex;
	}
	if (rightIndex < size && array[rightIndex] > array[largestIndex]) {
		largestIndex = rightIndex;
	}

	if (largestIndex !== i) {
		[array[largestIndex], array[i]] = [array[i], array[largestIndex]];
		heapify(array, largestIndex, size);
	}
}

console.log(heapSortFindK(array, 5));
```

3. 快速选择算法：
   - 快速选择算法是一种选择第 K 大元素的高效方法，它是基于快速排序的变种。
   - 该算法的期望时间复杂度为 O(N)，其中 N 是数组的大小。
   - 通过快速选择，你可以直接找到第 K 大的元素，然后返回它和它之前的元素即可。

```javascript
function findLargestK(nums, k) {
  const quickSelect = (arr, left, right, k) => {
    if (left === right) return arr[left];

    const pivotIndex = partition(arr, left, right);
    if (k === pivotIndex) {
      return arr[k];
    } else if (k < pivotIndex) {
      return quickSelect(arr, left, pivotIndex - 1, k);
    } else {
      return quickSelect(arr, pivotIndex + 1, right, k);
    }
  };

  const partition = (arr, left, right) => {
    const pivot = arr[right];
    let i = left;
    for (let j = left; j < right; j++) {
      if (arr[j] > pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    [arr[i], arr[right]] = [arr[right], arr[i];
    return i;
  };

  const kthLargest = quickSelect(nums, 0, nums.length - 1, k - 1);
  return nums.slice(0, k);
}
```

这些方法提供了不同的方式来查找最大的 K 个数，选择哪种方法取决于数据规模和性能需求。
