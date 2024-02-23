// 二分查找涉及的很多的边界条件，逻辑比较简单，但就是写不好。
// 例如到底是 while(left < right) 还是 while(left <= right)，到底是right = middle呢，还是要right = middle - 1呢？
// 大家写二分法经常写乱，主要是因为对区间的定义没有想清楚，区间的定义就是不变量。
// 要在二分查找的过程中，保持不变量，就是在while寻找中每一次边界的处理都要坚持根据区间的定义来操作，这就是循环不变量规则。
// 写二分法，区间的定义一般为两种，左闭右闭即[left, right]，或者左闭右开即[left, right)。

// 第一种左闭右闭
// 定义 target 是在一个在左闭右闭的区间里，也就是[left, right] （这个很重要非常重要）。
// while (left <= right) 要使用 <= ，因为left == right是有意义的，所以使用 <=
// if (nums[middle] > target) right 要赋值为 middle - 1，
// 因为当前这个nums[middle]一定不是target，那么接下来要查找的左区间结束下标位置就是 middle - 1
var search = function (nums, target) {
	// right是数组最后一个数的下标，num[right]在查找范围内，是左闭右闭区间
	let mid,
		left = 0,
		right = nums.length - 1;
	// 当left=right时，由于nums[right]在查找范围内，所以要包括此情况
	while (left <= right) {
		// 位运算 + 防止大数溢出
		mid = left + ((right - left) >> 1);
		// 如果中间数大于目标值，要把中间数排除查找范围，所以右边界更新为mid-1；如果右边界更新为mid，那中间数还在下次查找范围内
		if (nums[mid] > target) {
			right = mid - 1; // 去左面闭区间寻找
		} else if (nums[mid] < target) {
			left = mid + 1; // 去右面闭区间寻找
		} else {
			return mid;
		}
	}
	return -1;
};
// ————————————————————————————————————————————————————————————————————————————————
// 第二种 左闭右开
// 定义 target 是在一个在左闭右开的区间里，也就是[left, right) ，那么二分法的边界处理方式则截然不同。
// 有如下两点：
// while (left < right)，这里使用 < ,因为left == right在区间[left, right)是没有意义的
// if (nums[middle] > target) right 更新为 middle，
// 因为当前nums[middle]不等于target，去左区间继续寻找，
// 而寻找区间是左闭右开区间，所以right更新为middle，即：下一个查询区间不会去比较nums[middle]
var search2 = function (nums, target) {
	// right是数组最后一个数的下标+1，nums[right]不在查找范围内，是左闭右开区间
	let mid,
		left = 0,
		right = nums.length;
	// 当left=right时，由于nums[right]不在查找范围，所以不必包括此情况
	while (left < right) {
		// 位运算 + 防止大数溢出
		mid = left + ((right - left) >> 1);
		// 如果中间值大于目标值，中间值不应在下次查找的范围内，但中间值的前一个值应在；
		// 由于right本来就不在查找范围内，所以将右边界更新为中间值，如果更新右边界为mid-1则将中间值的前一个值也踢出了下次寻找范围
		if (nums[mid] > target) {
			right = mid; // 去左区间寻找
		} else if (nums[mid] < target) {
			left = mid + 1; // 去右区间寻找
		} else {
			return mid;
		}
	}
	return -1;
};

// ————————————————————————————————————————————————————————————————————————————————
// 以下二分相关例题：

// 35. 搜索插入位置
// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
// 请必须使用时间复杂度为 O(log n) 的算法。
// 示例 1:
// 输入: nums = [1,3,5,6], target = 5
// 输出: 2

// 示例 2:
// 输入: nums = [1,3,5,6], target = 2
// 输出: 1

// 示例 3:
// 输入: nums = [1,3,5,6], target = 7
// 输出: 4

function searchNum(nums, target) {
	let left = 0,
		right = nums.length - 1,
		mid;
	while (left <= right) {
		mid = left + ((right - left) >> 1);
		if (target < nums[mid]) {
			right = mid - 1;
		} else if (target > nums[mid]) {
			left = mid + 1;
		} else if (target === nums[mid]) {
			return mid;
		}
	}
	return left;
}

console.log('searchNum', searchNum([1, 3, 5, 6], -1));
// ————————————————————————————————————————————————————————————————————————————————
// 34. 在排序数组中查找元素的第一个和最后一个位置
// 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
// 如果数组中不存在目标值 target，返回 [-1, -1]。
// 进阶：你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？
// 示例 1：
// 输入：nums = [5,7,7,8,8,10], target = 8
// 输出：[3,4]

// 示例 2：
// 输入：nums = [5,7,7,8,8,10], target = 6
// 输出：[-1,-1]

// 示例 3：
// 输入：nums = [], target = 0
// 输出：[-1,-1]
function searchNumList(nums, target) {
	let left = 0,
		right = nums.length - 1,
		mid;
	while (left <= right) {
		mid = left + ((right - left) >> 1);
		if (target < nums[mid]) {
			right = mid - 1;
		} else if (target > nums[mid]) {
			left = mid + 1;
		} else if (target === nums[mid]) {
			// return mid;
			// result.push(mid);
			let resultLeft = mid - 1,
				resultRight = mid + 1;
			while (resultLeft >= 0 && nums[resultLeft] === target) {
				resultLeft--;
			}
			while (resultRight < nums.length && nums[resultRight] === target) {
				console.log(resultRight);
				resultRight++;
			}
			return [resultLeft + 1, resultRight - 1];
		}
	}
	return [-1, -1];
}

console.log('searchNum', searchNumList([2, 2], 2));

// 这种方法还不算效率最高
// 更好的办法是查找到小于target的边界和大雨target的边界：
var searchRange2 = function (nums, target) {
	const getLeftBorder = (nums, target) => {
		let left = 0,
			right = nums.length - 1;
		let leftBorder = -2; // 记录一下leftBorder没有被赋值的情况
		while (left <= right) {
			let middle = left + ((right - left) >> 1);
			if (nums[middle] >= target) {
				// 寻找左边界，nums[middle] == target的时候更新right
				right = middle - 1;
				leftBorder = right;
			} else {
				left = middle + 1;
			}
		}
		return leftBorder;
	};

	const getRightBorder = (nums, target) => {
		let left = 0,
			right = nums.length - 1;
		let rightBorder = -2; // 记录一下rightBorder没有被赋值的情况
		while (left <= right) {
			let middle = left + ((right - left) >> 1);
			if (nums[middle] > target) {
				right = middle - 1;
			} else {
				// 寻找右边界，nums[middle] == target的时候更新left
				left = middle + 1;
				rightBorder = left;
			}
		}
		return rightBorder;
	};

	let leftBorder = getLeftBorder(nums, target);
	let rightBorder = getRightBorder(nums, target);
	// 情况一
	if (leftBorder === -2 || rightBorder === -2) return [-1, -1];
	// 情况三
	if (rightBorder - leftBorder > 1) return [leftBorder + 1, rightBorder - 1];
	// 情况二
	return [-1, -1];
};

// ————————————————————————————————————————————————————————————————————————————————
// 求x的平方根 只要整数部分
function mysqurt(x) {
	let left = 0,
		right = x,
		mid;
	while (left <= right) {
		mid = left + ((right - left) >> 1);
		if (mid * mid <= x) {
			left = mid + 1;
		} else if (mid * mid > x) {
			right = mid - 1;
		}
	}
	return left - 1;
}
console.log(mysqurt(4));
