#include <stdio.h>
#include <stdlib.h>	
//宏定义布尔类型
#define BOOL int
#define TRUE 1
#define FALSE 0

//冒泡排序（交换）两层循环
void BubbleSort(int A[], int n){
	for (int i = 0; i < n-1; i++){
		//定义一个布尔变量
		BOOL flag = FALSE;

		for (int j = n-1; j > i; j--){
			if (A[j-1] > A[j])
			{
				//swap(A[j-1],A[j]);
				flag = TRUE;
			}
		}

		if (flag == FALSE){
			return ;
		}
	}
}

//选择排序（选择）两层循环
void SelectSort(int A[], int n){
	for (int i = 0; i < n-1; i++){
		int min = i;

		for (int j = n-1; j > i; j--){
			if (A[min]>A[j]){
				min=j;
			}
		}

		if (min!=i){
			//swap(A[i],A[min]);
		}	
	}
}

//插入排序（插入）两层循环
void InsertSort(int A[], int n){
	int i, j, temp;
	for (i = 1; i <= n-1; i++){
		if (A[i-1] > A[i]){
			temp = A[i];

			for(j = i-1; j>=0 && A[j] > temp; --j){
				A[j+1] = A[j];	
			}
			A[j+1] = temp;
		}
	}
}

//折半插入排序（插入）两层循环
void HalfSearchInsertSort(int A[], int n){
	int i, j, temp, low, high, mid;
	for (i = 1; i <= n-1; ++i){
		if(A[i-1] > A[i]){
			temp = A[i];
			low = 0; high = i-1;

			while(low <= high){
				mid = (low + high)/2;

				if (A[mid] < temp){
					low = mid + 1;
				}
				else high = mid -1;
			}

			//high + 1 = low
			for (j = i-1; j >= low; j--){
				A[j+1] = A[j];
			}
			A[low] = temp;
			
		}
	}
}

//希尔排序（插入） 三层循环
//内两层for循环的含义，一个gap定义下，原数列被分成gap个小组。
//对每一个小组内第二个开始的数往后作插入排序
void ShellSort(int A[], int n){
	for (int gap = n/2; gap > 0; gap /= 2)
	{

		for (int i = gap; i <= n-1; ++i)
		{
			int temp = A[i];
			int j;
			for (j = i-gap; j >= 0 && A[j] > temp; j-=gap)
			{
				A[j+gap] = A[j];
			}
			A[j+gap] = temp;
			
		}

	}
	return ;
}	

//快速排序（交换）递归算法 利用分治思想
//最坏情况下（元素刚好是反向的）速度比较慢，达到 O(n^2)（和选择排序一个效率），
//但是如果在比较理想的情况下时间复杂度 O(nlogn)
//确定一个值作为piovt，小于放左边，大于放右边，此时就有一个值为pivot的数放在排好位置。
//递归分治左右部分，最后所有值归位。
int Partition();
void QuickSort();

void QuickSort(int A[], int low, int high){
	if(low < high){
		int pivotpos = Partition(A, low, high);
		QuickSort(A, low, pivotpos-1);
		QuickSort(A, pivotpos+1, high);
	}
}

int Partition(int A[],int low, int high){
	int pivot = A[low];
	while(low < high){
		while(low < high && A[high] >= pivot){
			high--;
		}
		A[low]= A[high];

		while(low<high && A[low]<= pivot){
			low++;
		}
		A[high] = A[low];
	}
// 直到low = high
	A[low] = pivot;
	return low;
}

//归并排序
//归并排序相比较之前的排序算法而言加入了分治法的思想
//左边排好 右边排好 左右一起排
void Merge();
void MergeSort();

void MergeSort(int A[], int low, int high){
	if(low < high){
		int mid = (low + high)/2;
		MergeSort(A, low, mid);
		MergeSort(A, mid + 1, high);
		Merge(A, low, mid, high);
	}
}

void Merge(int A[], int low, int mid, int high){
	int *B = (int*)malloc(sizeof(int) * (high - low +2));
	for (int i = low; i <= high; ++i)
	{
		B[i] = A[i];
	}

	int i,j,k;

	for (i = low, j=mid+1, k =i; i<=mid &&j <=high; ++k)
	{
		if(B[i] < B[j]){
			A[k] = B[i++];
		}
		else{
			A[k] = B[j++];
		}
	}

	while(i <= mid) A[k++] = B[i++];
	while(j <= high) A[k++] = B[j++];
	free(B);
}

//堆排序（选择）
//利用二叉堆（相比较完全二叉树而言，二叉堆的所有父节点的值都大于（或者小于）它的孩子节点）
//建立堆
void heapify();
void HeapSort();

void HeapSort(int A[], int n){
	//建堆
	for(int i = n/2-1; i >=0; i--){
		heapify(A, i, n);
	}
	//一个个从堆顶取元素 选择排序
	for(int i= n-1; i>=0; i--){
		swap(A[0], A[i]);
		//剩余元素继续建立堆
		heapify(A,  0, i);
	}
}

void heapify(int A[], int i, int n){
	int largest = i;
	int l = 2*i + 1;
	int r = 2*i + 2;

	if(l < n && A[l] > A[largest]){
		largest = l;
	}

	if(r < n && A[r] > A[largest]){
		largest = r;
	}

	if (largest != i)
	{
		swap(A[i], A[largest]);
		//递归定义子树 原因：当第一次建堆后，根A[0]是最大值，取出最大值的方式从末尾A[n-1]开始与根交换，
		//处于叶子的A[n-1]值被放在的根位置，需要继续下沉，一路下沉到叶子结点
		heapify(A, largest, n);
	}
}





















// 基数排序（非比较型排序）
// 按照分配 回收 分配 回收……排序
int getMax(int A[], int n){
	int max = A[0];
	for (int i = 1; i <= n-1; ++i)
	{
		if (max < A[i])
		{
			max = A[i];
		}
	}
	return max;
}

void countSort(int A[], int n, int exp){
	int output[n];
	int i, count[10] = {0};

	for(i=0; i<=n-1; i++){
		count[ (A[i]/exp)%10 ]++;
	}

	for (i=1; i<10; ++i)
	{
		count[i] += count[i-1];
	}

	for(i = n-1; i>=0; i--){
		output[ count[ (A[i]/exp)%10 ] - 1 ] = A[i];
		count[ (A[i]/exp)%10 ]--;
	}

	for(i=0; i<=n-1; i++){
		A[i] = output[i];
	}
}

void radixSort(int A[], int n){
	int max = getMax(A, n);
	for(int exp=1; max/exp>0; exp*=10){
		countSort(A, n, exp);
	}
}
