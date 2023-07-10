---
title: typedef
categories:
  - 01.开发学习笔记 markdown
  - 02.开发语言和计算机基础
  - c语言
---
# typedef 结构体：

``` c
 typedef struct player
 {
     //code
 }Play_st,*Play_p;
 
```
A),struct player play1;和 Play_st play1;是一样的
play1是player类型的变量

B),struct player *play2;和Play_p play2; Play_st *play2;是一样的
play2是指针变量 指向palyer类型的空间


## 自定义单链表例子

``` c

#include <stdlib.h>
#include <stdio.h>

typedef struct LNode1{
	int data;
	struct LNode1 *next;
}LNode, *LinkList;

//	typedef struct LNode1{
//		....
//	}LNode;
//	指自定义一个结构体LNode1 并另命名为LNode。

//	typedef struct Lnode1{
//		....
//	}*LinkList;
//	指把struct LNode1{}* 另命名为LinkList。
//	int *p;等价于int* p; 意思是定义一个指针变量p p指向int型的内存空间。
//	那么 struct LNode1{}* p; 意思是定义一个指针变量p p指向这种自定义类型的内存空间。
//	等价于 LNode* p;	
//	等价于LinkList p; p指向这种自定义类型的内存空间。

LinkList CreatList(LinkList L){

	LNode *s;
	int x;
	L = (LinkList)malloc(sizeof(LNode));
	L->next = NULL;
	printf("输入第一个节点：\n");
	scanf("%d", &x);

	while(x!=9999){
		s = (LNode*)malloc(sizeof(LNode));
		//分配一个LNode型存储单元，并将这LNode型存储单元的首地址存储到指针变量s中
		s->data = x;
		s->next = L->next;
		L->next = s;
		printf("输入：\n");
		scanf("%d", &x);
	}

	return L;
	
}

int main(){
	LinkList L;
	printf("开始 \n");
	LinkList p = CreatList(L);
	printf("%d",p->next->data);
	return 1;
}

```