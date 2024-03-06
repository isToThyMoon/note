# 寻找最大的 K 个数

数组中的第 K 个最大元素，只要找到第 K 个最大的元素返回即可。
"寻找最大的 K 个数" 意味着在一个给定的数据集中，你需要找到其中的 K 个最大的数值。
举例来说，如果有一个数组 `[3, 7, 1, 9, 5, 2, 6]`，要找到其中最大的三个数，
那么这个问题的解决方法将返回 `[9, 7, 6]`，因为这是数组中最大的三个数。

这通常涉及到对数据进行排序或使用其他算法来找到这些最大值。

这种问题通常出现在数据分析、统计、计算机科学和工程中，
有时需要在大型数据集中查找最大的数值，以便进行进一步的分析、筛选或处理。
在实际应用中，可能会有不同的算法和数据结构用于解决这个问题，具体取决于问题的规模和性能要求。
// ——————————————————————————————————————————————————————————————————————————————————————

要查找最大的 K 个数，你可以使用不同的算法和数据结构，取决于输入数据的规模和要求。以下是几种常见的方法：

1. 普遍排序法：先排序后选择
   - 将输入数组排序，然后选择最后的 K 个元素即可。
   - 这是最简单的方法，时间复杂度为 O(N log N)，其中 N 是数组的大小。
   - 缺点是它会修改原始数组，如果不允许修改原始数据，需要先复制数组再进行排序。

```javascript
function findLargestK(nums, k) {
  nums.sort((a, b) => b - a);
  return nums.slice(0, k);
}
```

2. 快速选择算法：
   快速选择算法是一种选择第 K 大元素的高效方法，它是基于快速排序的变种。
   该算法的期望时间复杂度为 O(N)，其中 N 是数组的大小。
   通过快速选择，你可以直接找到第 K 大的元素，然后返回它和它之前的元素即可。

设 N 为数组长度。根据快速排序原理，如果某次哨兵划分后，基准数的索引正好是 N−k ，则意味着它就是第 k 大的数字 。此时就可以直接返回它，无需继续递归下去了。

```javascript
// 平均O(n)的算法
//  寻找最大的K个元素
function findKthlargest(nums, k) {
  // 定义快速选择函数
  function quickSelect(nums, k) {
    // 随机选择一个基准数
    let pivot = nums[Math.floor(Math.random() * nums.length)];
    // 初始化三个数组，用于存放大于、小于和等于基准数的元素
    const rightList = [];
    const leftList = [];
    const equalList = [];

    // 遍历数组，将元素划分至对应的数组中
    for (const num of nums) {
      if (num > pivot) {
        rightList.push(num);
      } else if (num < pivot) {
        leftList.push(num);
      } else {
        equalList.push(num);
      }
    }

    if (k <= rightList.length) {
      // 第k大元素在rightList中，继续递归划分rightList
      return quickSelect(rightList, k);
    } else if (k > rightList.length + equalList.length) {
      // 第k大元素在leftList中，继续递归划分leftList，并更新k的值
      return rightList.concat(
        equalList,
        quickSelect(leftList, k - rightList.length - equalList.length)
      );
    } else {
      // 第k大元素等于pivot
      return rightList.concat(equalList);
    }
  }

  // 调用快速选择函数，传入原始数组和k
  return quickSelect(Array.from(new Set(nums)), k);
}

// 测试
var array = [5, 4, 6, 1, 9, 3, 0, 5, 3, 7, 2, 8, 4, 10, 6];
console.log(array.sort((a, b) => a - b));
console.log(findKthlargest(array, 7));
```

在每次递归调用中，对数组进行了一次完整的遍历，所以快速选择的平均时间复杂度为 O(n)。
由于递归调用是基于划分后的子数组，递归深度可以看作是对 n 的对数级别的操作。
最终结果是对 n 的对数级别的操作和 O(n)级别的操作的组合，因此整体的时间复杂度可以近似为 O(n)

3. 堆（Heap）：
   堆排思想 不断取出最大的堆顶点，得到 K 个最大数

```javascript
var array = [5, 4, 6, 1, 9, 3, 0, 5, 3, 7, 2, 8, 4, 10, 6];

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

function heapSortFindK(array, k) {
  const result = [];

  for (let i = Math.floor(array.length / 2); i >= 0; i--) {
    heapify(array, i, array.length);
  }

  for (let i = array.length - 1; i > array.length - 1 - k; i--) {
    result.push(array[0]);
    [array[0], array[i]] = [array[i], array[0]];
    heapify(array, 0, i);
  }
  return result;
}

console.log(heapSortFindK(array, 5));
```

这些方法提供了不同的方式来查找最大的 K 个数，选择哪种方法取决于数据规模和性能需求。

小顶堆方法：
时间复杂度：O(n log k)，其中 n 是数组的长度，k 是我们要找的元素的排名。这是因为我们需要将每个元素都添加到堆中，添加元素的时间复杂度为 O(log k)，所以总的时间复杂度为 O(n log k)。
空间复杂度：O(k)，这是因为我们需要创建一个大小为 k 的堆。
快速选择算法（分治法）：
时间复杂度：平均情况下为 O(n)，最坏情况下为 O(n^2)，但最坏情况发生的概率非常小。这是因为我们每次都能排除掉一部分元素，所以平均情况下的时间复杂度为 O(n)。但如果我们每次选择的基准都是最大或最小的元素，那么我们就需要遍历所有的元素，所以最坏情况下的时间复杂度为 O(n^2)。
空间复杂度：O(1)，这是因为我们只需要常数级别的额外空间。
所以，如果 k 远小于 n，那么使用小顶堆的方法可能更优。如果 k 接近 n，那么快速选择算法可能更优。但在实际情况中，由于快速选择算法的常数因子较小，所以即使在最坏情况下，它的性能也往往优于小顶堆的方法。

# 数组中的第 K 个最大元素

https://leetcode.cn/problems/kth-largest-element-in-an-array/solutions/2361969/215-shu-zu-zhong-de-di-k-ge-zui-da-yuan-d786p/

快速选择法：

这个代码使用了快速选择算法，时间复杂度主要取决于快速选择的性能。在平均情况下，快速选择的时间复杂度是 O(n)，其中 n 是数组的长度。但是在最坏情况下，可能达到 O(n^2)。

对于每一次递归调用，都对数组进行了一次完整的遍历，因此递归的深度最多为数组的长度。在每一层递归中，都进行了一次线性的遍历。因此，总体来说，平均时间复杂度是 O(n)，最坏情况下是 O(n^2)。

需要注意的是，这里采用了随机选择基准数的方式，有助于在平均情况下提高算法的性能。在实际应用中，由于随机性的存在，算法通常在平均情况下表现较好。然而，最坏情况下的性能仍然可能存在。

```js
function findKthlargest(nums, k) {
  // 定义快速选择函数
  function quickSelect(nums, k) {
    // 随机选择一个基准数
    let pivot = nums[Math.floor(Math.random() * nums.length)];
    // 初始化三个数组，用于存放大于、小于和等于基准数的元素
    const rightList = [];
    const leftList = [];
    const equalList = [];

    // 遍历数组，将元素划分至对应的数组中
    for (const num of nums) {
      if (num > pivot) {
        rightList.push(num);
      } else if (num < pivot) {
        leftList.push(num);
      } else {
        equalList.push(num);
      }
    }

    if (k <= rightList.length) {
      // 第k大元素在rightList中，继续递归划分rightList
      return quickSelect(rightList, k);
    } else if (k > rightList.length + equalList.length) {
      // 第k大元素在leftList中，继续递归划分leftList，并更新k的值
      return quickSelect(leftList, k - rightList.length - equalList.length);
    } else {
      // 第k大元素等于pivot
      return pivot;
    }
  }

  // 调用快速选择函数，传入原始数组和k
  return quickSelect(nums, k);
}

// 测试
var array = [5, 4, 6, 1, 9, 3, 0, 5, 3, 7, 2, 8, 4, 10, 6];
console.log(findKthlargest(array, 4));
```
