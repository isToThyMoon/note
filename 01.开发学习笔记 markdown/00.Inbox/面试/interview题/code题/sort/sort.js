var array = [5, 4, 6, 1, 9, 3, 0, 5, 3, 7, 2, 8, 4, 10, 6];

// # 内部排序
// 插入排序：直接插入排序 折半插入排序 希尔排序（shell）
// 选择排序：简单选择排序 堆排序（建堆 插入和调整）
// 交换排序：冒泡排序 快速排序（划分 过程特征）
// 归并排序 （归并路数 归并过程）
// 基数排序

// # 外部排序
// 多路归并排序

// 插入排序 ——————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————————————————
// 直接插入排序
// 简单的排序算法，它通过逐个将未排序的元素插入到已排序的部分来进行排序。
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    // 已排序部分的最后一个元素的索引
    let j = i - 1;
    // 当前待插入的元素
    const curItem = arr[i];
    // 将大于当前元素的元素向后移动，为当前元素腾出插入位置
    while (j >= 0 && arr[j] > curItem) {
      arr[j + 1] = arr[j];
      j--;
    }
    // while循环结束时，arr[j] <= curItem;或者j=-1了
    // 将当前元素插入到合适的位置
    arr[j + 1] = curItem;
  }
}
// 时间复杂度是 O(n^2)，其中 n 是数组的长度。
// 这是因为对于每个未排序的元素，它都可能需要在已排序部分的最坏情况下移动全部已排序元素。
// 因此，时间复杂度为 O(n^2)，这使得它在大型数据集上不太高效。
// 然而，直接插入排序在某些情况下可能比其他排序算法更快，
// 例如，当输入数据已经接近有序时，它的性能更好。
// 但总体来说，对于大型数据集，更高效的排序算法如快速排序或归并排序通常更受欢迎。

// ——————————————————————————————————————————————————————————
// 折半插入排序（二分法）
// 折半插入排序（Binary Insertion Sort）是一种改进的插入排序算法，
// 它在插入元素时使用二分查找的方式在已排序好的部分中来找到正确的插入位置，从而减少比较的次数。
function binaryInsertionSort(arr) {
  const length = arr.length;
  for (let i = 1; i < length; i++) {
    // 当前等待插入的item
    const current = arr[i];
    // 等待插入item之前的部分应该是已经排序好的，需要找到正确位置把current插入进去
    // leftIndex是找到的插入位置 后续元素依次后移动
    let leftIndex = 0;
    let rightIndex = i - 1;

    // 使用二分查找找到插入位置leftIndex
    // 这里也可以leftIndex < rightIndex作为判断 找到leftIndex = rightIndex的点
    // 然后额外判断插入位置 更好理解一点
    while (leftIndex <= rightIndex) {
      const midIndex = Math.floor((leftIndex + rightIndex) / 2);
      if (current < arr[midIndex]) {
        rightIndex = midIndex - 1;
      } else {
        leftIndex = midIndex + 1;
      }
    }

    // 当 leftIndex === rightIndex
    // const midIndex = Math.floor((leftIndex + rightIndex) / 2);
    // if (current < arr[middleIndex]) {
    // 	rightIndex = middleIndex - 1;
    // 	// left之后的后移
    // 	// left位置的赋值为current
    // } else {
    // 	// left +1 之后的后移
    // 	// left + 1位置的赋值为current
    // 	leftIndex = middleIndex + 1;
    // }
    // 所以再进行一次while循环

    // left之后的后移 到current的index i位置为止 正好i位置的current要赋值给current
    // left位置的赋值为current
    for (let j = i; j > leftIndex; j--) {
      arr[j] = arr[j - 1];
    }
    arr[leftIndex] = current;
  }
}

// binaryInsertionSort(array);
// log(array);

// ——————————————————————————————————————————————————————————
// 希尔排序（shell）
// 希尔排序（Shell Sort）是一种改进的插入排序算法，它通过将原始数组分成多个子数组，并对这些子数组进行插入排序来实现排序。
// 希尔排序的主要思想是使数组中任意间隔为 h 的元素都是有序的，然后逐渐减小 h 直到 h 等于 1，最终完成排序。
// 内两层for循环的含义，一个gap定义下，原数列被分成gap个小组。
// 对每一个小组内第二个开始的数往后作插入排序
function shellSort(arr) {
  for (
    let gap = Math.floor(arr.length / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i];
      let j;
      // 对arr[i]之前的间隔为gap的数组作插排
      for (j = i - gap; j >= 0 && temp < arr[j]; j -= gap) {
        arr[j + gap] = arr[j];
      }
      arr[j + gap] = temp;
    }
  }
}
// shellSort(array);
// console.log(array);

// 选择排序 ——————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————————————————
// 简单选择排序（选择）两层循环
// 选择排序的基本思想是在未排序的部分中找到最小的元素，
// 并将其与未排序部分的第一个元素交换位置。
// 以此类推，得到从小到大的排序结果。
function selectSort(arr) {
  var length = arr.length;
  // 外部循环用于控制遍历的轮数
  for (let i = 0; i < length - 1; i++) {
    // 内部循环用于查找未排序部分中的最小元素，然后进行交换
    for (let j = i + 1; j < length; j++) {
      // 选择排序中也有交换的部分，就是在未排序部分遍历时只要满足条件就与未排序第一个交换。
      if (arr[i] > arr[j]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
}
// 复杂度为O(n^2)

// ——————————————————————————————————————————————————————————
// 堆排序（建堆 插入和调整）
// 堆排序（Heap Sort）是一种基于二叉堆数据结构的排序算法，它是一种选择排序的变种。
// 可以在最坏情况下以 O(n log n) 的时间复杂度对一个数组进行排序。
// 堆排序的主要思想是将待排序的元素构建成一个二叉堆（最大堆或最小堆），
// 然后依次将堆顶元素（最大值或最小值）取出并放入已排序部分，直到堆为空。

// 要理解堆排的核心首先要知道怎么将一个数组看成一个完全二叉树

// 完全二叉树：
// 所有叶子节点都在最底层或倒数第二层，且位于该层的最左边。
// 所有非叶子节点（内部节点）都有两个子节点，即每个内部节点都有一个左子节点和一个右子节点。
// 如果某个内部节点只有一个子节点，那么它只能是左子节点。

// 这样的结构在存储和表示上有一些优势，它可以使用数组来紧凑表示。
// 对于任意节点在数组中的索引 i，它的左子节点位于索引 2i + 1 的位置，右子节点位于索引 2i + 2 的位置。

// 利用二叉堆（相比较完全二叉树而言，二叉堆的所有父节点的值都大于（或者小于）它的孩子节点）

function heapSort(arr) {
  // 构建最大堆
  buildMaxHeap(arr);

  // 堆排序的核心部分，它实现了从最大堆中不断将最大的元素取出，然后重新调整堆的过程。
  // 这个循环的目的是不断将堆顶元素（最大元素）与堆中的最后一个元素进行交换，然后排除最后一个元素，
  // 再通过调整堆使剩余元素重新构成一个最大堆。
  for (let i = arr.length - 1; i > 0; i--) {
    // 不断交换堆顶元素和堆中最后一个元素，然后调整堆,缩小堆的大小。
    // 接着，对新的堆应用 heapify 函数，选出新的最大值位于堆顶。
    // 重复这个过程直到堆为空，同时将交换的元素逐渐构建为已排序部分。
    // 交换堆顶元素和堆中最后一个元素
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, 0, i);
  }
}

function buildMaxHeap(arr) {
  // 首先 构建最大堆
  // 对小于Math.floor(arr.length / 2) - 1的index都要建一次堆
  // 从底向上逐个构建最大堆。这确保了所有非叶子节点都满足最大堆的性质
  // Math.floor(arr.length / 2) - 1确保这是最后一个叶子节点的父节点的索引 这样确保了所有节点都参与了运算
  for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
    heapify(arr, i, arr.length);
  }
}

function heapify(arr, i, size) {
  // heapify 函数用于调整堆的性质。它会比较当前节点与其左右子节点的值，并将最大值移到当前节点。
  // 然后，递归地对移动的子节点进行相同的操作，以确保整个子树满足最大堆的性质。
  let largestIndex = i;
  const leftChildIndex = 2 * i + 1;
  const rightChildIndex = 2 * i + 2;

  if (leftChildIndex < size && arr[leftChildIndex] > arr[largestIndex]) {
    largestIndex = leftChildIndex;
  }

  if (rightChildIndex < size && arr[rightChildIndex] > arr[largestIndex]) {
    largestIndex = rightChildIndex;
  }
  if (largestIndex !== i) {
    // 需要交换
    [arr[i], arr[largestIndex]] = [arr[largestIndex], arr[i]];
    // 递归交换后的这个index下的子树 也要满足二叉堆，最大值在上
    // 构建最大堆时，是从底往上构建的，想象一种情况，最小值在最上方，它需要一路沉底，才能使一路的非叶子节点都满足最大堆
    // 所以在swap后需要对这个沉下来的节点继续heapify，使得它与它的两个子节点也满足最大堆。
    // 依次类推 需要递归实现
    heapify(arr, largestIndex, size);
  }
}
// heapSort(array);
// console.log('heap', array);
// 交换排序 ——————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————————————————
//冒泡排序
// （交换）两层循环
// 冒泡排序的基本思想是通过不断比较相邻的两个元素，
// 如果它们的大小顺序不对就交换它们，从而使较大（或较小）的元素逐步“冒泡”到数组的一端。
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 标志变量，用于表示本轮是否发生了交换，如果没有交换说明数组已经有序，可以提前结束
    let swapped = false;
    for (let j = arr.length - 1; j > i; j--) {
      if (arr[j - 1] > arr[j]) {
        let temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;

        swapped = true;
      }
    }
    // 如果本轮没有发生交换，表示数组已经有序，可以提前结束
    if (!swapped) {
      break;
    }
  }
}

// 冒泡排序的时间复杂度是O(n^2)
// 最坏情况下，需要进行n次遍历，每次遍历需要比较n次。
// 每一轮遍历中，需要比较的次数逐渐减少 第一轮n-1次 以此类推
// 总的比较次数可以表示为：
// n-1 + n-2 + n-3 + ... + 2 + 1 等差数列求和
// 因此，总的比较次数是n*(n-1)/2，这导致了冒泡排序的时间复杂度为O(n^2)
// 在最坏情况下和平均情况下，冒泡排序的时间复杂度都是O(n^2)，这使得它在大规模数据集上的性能相对较差，不适用于大型数据排序。
// 但在一些特殊情况下，如数据已经近乎有序的情况下，冒泡排序可能表现出较好的性能。

// ——————————————————————————————————————————————————————————
// 快速排序（分治 划分）
// 通过分治法的思想将一个数组分成两个子数组，然后对这两个子数组进行排序。
// 递归也是重点
// 是一种交换排序（Exchange Sort）算法
// 选择一个基准元素，将数组分成小于基准的部分和大于基准的部分，然后递归地对这两个部分进行排序，
// 最后将它们合并起来。在排序的过程中，快速排序会不断地交换元素的位置，以达到排序的目的。
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  //
  const pivot = arr[Math.floor(Math.random() * arr.length)];

  const less = arr.filter((ele) => ele < pivot);
  const equal = arr.filter((ele) => ele === pivot);
  const greater = arr.filter((ele) => ele > pivot);

  const sortedLess = quickSort(less);
  const sortedGreater = quickSort(greater);

  return [...sortedLess, ...equal, ...sortedGreater];
}
// 快速排序的时间复杂度平均情况下为O(n*log(n))，最坏情况下为O(n^2)，
// 其中n是数组的长度。虽然最坏情况下性能不如归并排序稳定，
// 但在实践中通常比大多数其他排序算法更快，尤其是对于大型数据集。
// 此外，通过随机选择基准元素，可以一定程度上避免最坏情况的发生，使得平均情况下性能非常出色。

// 归并排序 ——————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————————————————
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

// 基数排序 ——————————————————————————————————————————————————————————————————————————————————————
// ——————————————————————————————————————————————————————————
// 基数排序（Radix Sort）是一种非比较性的整数排序算法，
// 它根据数字的每一位来排序元素。基数排序适用于整数或字符串等可以分解成单个数字或字符的数据。
// 基数排序的基本思想是从最低有效位（个位）到最高有效位（最高位），依次对元素进行排序。每次排序都将元素分配到不同的桶（或队列）中，
// 然后按顺序将这些桶中的元素合并成一个新的数组。这个过程重复进行，直到所有位都被处理，最终得到有序的结果。
function radixSort(arr) {
  // 先找到数组中的最大值，确定最高位数
  const max = Math.max(...arr);

  // 计算最高位数 如1234 有4位 Math.log10(1234) 约等于3.091315
  const maxDigitCount = Math.floor(Math.log10(max)) + 1;

  for (let k = 0; k < maxDigitCount; k++) {
    // 创建10个桶 用于分配数字（0-9一共10个数）
    // 每个桶都是一共数组
    const buckets = Array.from({ length: 10 }, () => []);

    // 将数字分配到桶中
    for (let i = 0; i < arr.length; i++) {
      const digit = getDigit(arr[i], k);
      buckets[digit].push(arr[i]);
    }
    // 合并所有桶
    arr = [].concat(...buckets);
    // 第一次k = 0，获取所有待排数字个位值 并放入对应的0-9桶中，
    // 合并所有桶，合成一个数组，这样数字按个位数大小有了个排序
    // 依次类推，个十百千位直到最高位 每次放桶得到一次只看位数的数值排序，完成最高位即完成了所有排序
  }
  return arr;
}

// 获取数字指定位的数字（从右到左 从0开始）
// 如 getDigit(1234, 2) 得到千分位数字2
function getDigit(num, place) {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

// console.log(radixSort(array));

// 外部排序：多路归并排序 ——————————————————————————————————————————————————————————————————————————————————————
