# JS数据结构操作篇

## 实现一个LRU缓存

LRU - least recently used，即实现`const lru = new LRUCache(capacity)`

可以使用`lru.put(1,1);lru.put(2,2);lru.get(1)`，此时存了两个，再put一个的时候已经满了，那么会将少使用的去掉即去掉`2,2`，此时再访问它就访问不到了，返回 -1

```js
const LRUCache = function(capacity) {
    this.cacheQueue = new Map();
    this.capacity = capacity;
}
LRUCache.protype.get = function(key) {
    if (this.cacheQueue.has(key)) {
        // 如果找到了, 这个key需要提升新鲜度
        const result = this.cacheQueue.get(key);
        this.cacheQueue.delete(key);
        this.cacheQueue.set(key, result); // 以队尾为最新的
        return result;
    }
    return -1;
}
LRUCache.protype.put = function(key, value) {
    if (this.cacheQueue.has(key)) {
        this.cacheQueue.delete(key);
    }
    if (this.cacheQueue.size >= capacity) {
        // 删除map的第一个, 即最长未使用的
        this.cacheQueue.set(key, value);
        this.cacheQueue.delete(this.cacheQueue.keys().next().value);
    } else {
        this.cacheQueue.set(key, value);
    }
}
```

## 求环形链表

参考leetcode 141题，可以用快慢指针，如下，也可以用Map存储并比较每一步

```js
const hasCycle = function(head) {
    let fast = slow = head;
    while (fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
        if (fast === slow) {
            return true
        }
    }
	return false
}
```

## 二叉树的前序、中序、后序遍历

- 前序：根左右

- 中序：左根右

- 后序：左右根

```js
const treeRoot = {
    val: 1,
    left: {
        val: 2,
        left: {val: 4},
        right: {val: 5}
    },
    right: {
        val: 3,
        left: {val: 6},
        right: {val: 7}
    }
}
// 前序
const preOrder = function(node) {
    if (node) {
        console.log(node.val);
        preOrder(node.left);
        preOrder(node.right);
    }
}
// 中序
const inOrder = function(node) {
    if (node) {
        inOrder(node.left);
        console.log(node.val);
        inOrder(node.right);
    }
}
// 后序
const postOrder = function(node) {
    if (node) {
        postOrder(node.left);
        postOrder(node.right);
        console.log(node.val);
    }
}
```

## 树的层序遍历

参考leetcode 102题目

```js
var levelOrder = function(root) {
    if (!root) retun [];
    let queue = [root];
    let result = [];
    while (queue.length) {
        let tmpQueue = [];
        let tmpResult = [];
        let len = queue.length;
        for (let i = 0; i < len; i++) {
            let node = queue.shift();
            tmpResult.push(node.val);
            node.left && tmpQueue.push(node.left);
            node.right && tmpQueue.push(node.right);
        };
        result.push(tmpResult);
        tmpResult = [];
        queue = tmpQueue;
    }
    return result;
}
```

## 获取二叉树的层级

参考leetcode 104题目

其实返回上面的层序遍历的length即可，或者递归root的左右边，每次 +1 即可

```js
var maxDepth = function(root) {
    if (!root) return 0;
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}
```

## 实现类数组转数组

```js
const arrayLike = document.querySelectorAll('div');

// 1- 扩展运算符
[...arrayLike]
// 2- prototype
Array.prototype.slice.apply(arrayLike)
Array.prototype.concat.apply([], arrayLike)
Array.apply(null, arrayLike)
// 3- Array.from
Array.from(arrayLike)
```

## 实现DOM转JSON

```js
const dom = document.getElementById('head');
function dom2json(dom) {
    let obj = {};
	obj.name = dom.tagName;
    obj.children = [];
    dom.childNodes.forEach(child => obj.children.push(dom2json(child)))
    return obj;
}
dom2json(dom)
```

## 实现JSON转DOM

```js
const json = {
	tag: 'div',
	attrs: {
		id: 'app',
		class: 'root',
	},
	children: [
		{
			tag: 'ul',
			children: [
				{ tag: 'li', children: ['list1'] },
				{ tag: 'li', children: ['list2'] },
				{ tag: 'li', children: ['list3'] },
				{ tag: 'li', children: ['list4'] },
				{ tag: 'li', children: ['list5'] },
			],
		},
	],
};
function json2dom(vnode) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return document.createTextNode(String(vnode));
	} else {
		const _dom = document.createElement(vnode.tag);
		if (vnode.attrs) {
			Object.entries(vnode.attrs).forEach(([key, value]) => {
				_dom.setAttribute(key, value);
			});
		}
		vnode.children.forEach((child) => {
			_dom.appendChild(json2dom(child));
		});
        return _dom;
	}
};
```

## 实现树转数组

树如下，转为数组，并带有parenId

```js
const root = [
	{
		id: 1,
		text: '根节点',
		children: [
			{
				id: 2,
				text: '一级节点1',
			},
			{
				id: 3,
				text: '一级节点2',
				children: [
					{
						id: 5,
						text: '二级节点2-1',
					},
					{
						id: 6,
						text: '二级节点2-2',
					},
					{
						id: 7,
						text: '二级节点2-3',
					},
				],
			},
			{
				id: 4,
				text: '一级节点3',
			},
		],
	},
];
```

```js
function treeToList(tree) {
	let res = [];
	const dfs = (tree, parentId) => {
		tree.forEach((node) => {
			node.parentId = parentId;
			res.push(node);
			if (node.children) {
				dfs(node.children, node.id);
				delete node.children; // push完删除
			}
		});
	};
	dfs(tree, 0);
	return res;
}
```

## 实现数组转树

拿到上面的转换数组，如何再转回去

```js
const list = [
	{ id: 1, text: '根节点', parentId: 0 },
	{ id: 2, text: '一级节点1', parentId: 1 },
	{ id: 3, text: '一级节点2', parentId: 1 },
	{ id: 5, text: '二级节点2-1', parentId: 3 },
	{ id: 6, text: '二级节点2-2', parentId: 3 },
	{ id: 7, text: '二级节点2-3', parentId: 3 },
	{ id: 4, text: '一级节点3', parentId: 1 },
];
```

```js
const listToTree = (list) => {
	const deps = {};
	let result = [];
	// 将数组转为map，方便查找
	list.forEach((item) => (deps[item.id] = item));
	for (let i in deps) {
		if (deps[i].parentId != 0) {
			if (!deps[deps[i].parentId].children) {
				deps[deps[i].parentId].children = [];
			}
			deps[deps[i].parentId].children.push(deps[i]);
		} else {
			result.push(deps[i]);
		}
	}
	return result;
};
```

## 实现数组扁平化

```js
const arr = [1,2,3,[4,5,[6,7,8],9,10]]
function flatten(arr) {
	if (!arr.length) return;
	return arr.reduce(
		(prev, cur) =>
			Array.isArray(cur) ? [...prev, ...flatten(cur)] : [...prev, cur],
		[],
	);
}
```

## 实现对象扁平化

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
            e: 3
        }
    }
};
function flat(obj) {
	if (typeof obj !== 'object' || obj === null) return;
	let res = {};

	const dfs = (cur, prefix) => {
		if (typeof cur === 'object' && cur !== null) {
			Object.keys(cur).forEach((key) => {
				dfs(cur[key], `${prefix}${prefix ? '.' : ''}${key}`);
			});
		} else {
			res[prefix] = cur;
		}
	};
	dfs(obj, '');
	return res;
}
```

