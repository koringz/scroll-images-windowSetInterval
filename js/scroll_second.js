/* koringz.github.io
 *
 * $author koringz
 * $date 2015-9-20
 * $version 0.1
 *
 * $author koringz
 * $date 2015-12-25
 * $version 0.2
 *
 * $author koringz
 * $date 2015-12-28
 * $version 0.4
 *
 */
var start_event, arr_class, init, Prev, Next, input_left, input_right, Container, Content, Grid, Next_grid, Img, style_img, i, j, default_img_width, all_img_length, current_img_length, half, Timer, current_scroll_Width, scroll_Width, speed, objTime;

// querySelector(attribute)属性节点 支持 clientWidth and scrollWidth
// querySelectorAll(tagname)标签节点 支持 NodeList[length]

Content = getElementNode('.content');
Grid = getElementNode('#grid');
Grid.innerHTML += Grid.innerHTML;
Next_grid = getElementNode('.next_grid');
Img = Grid.getElementsByTagName('a');
input_left = getElementNode('#Left');
input_right = getElementNode('#Right');

default_img_width = Img[0].offsetWidth; // 默认图片的宽度
all_img_length = Img.length; // 图片的总数目
current_img_length = 0; // 当前图片数目 
half = all_img_length / 2; // 一半的图片数目
Timer = null;
objTime = {}

function auto() {
	input_right.onclick()
};

// 当我鼠标没有触发事件，或者键盘没有触发事件，就会隔3秒执行一次函数，就是周期为3秒滚动一次代码，后面重复此操作。
// 但是，我们忽视了一点，这个时间Timer被内部函数清楚了，导致每次点击触发事件函数外部的时间都为空。
// 所以想让时间被外部扑捉，且时间不为空的状态，就需要设定一个类似的时间对象，内部清楚时间，外部还是能扑捉到时间。
// 也就是说，时间对象可以不同，内部清楚时间对象，外部扑捉累计时间。

// *注：时间必须是对象，其他的属性和变量都不能表示时间的对象，函数是自下而上一层一层的冒泡的原理。
// 所以最好是把对象设置为一个可以调用的参数，此参数可一层层的往上到触发事件还原给事件追踪。
// 经测试一定为函数外部

Content.onmouseover = function(){
	clearInterval(Timer)
};
Content.onmouseout = function(){
	Timer = setInterval(auto,3000)
};
Timer = setInterval(auto,3000);

function scroll(grid, finally_distance, objectTime) { // 200w
	if (objectTime.Timer !== null && objectTime.Timer !== undefined) {
		clearInterval(objectTime.Timer)
	}
	objectTime.Timer = setInterval(function() {
		var moving = grid.offsetLeft;
		// 使用offsetLeft存在误差值，当你快速点击按钮时，轮播出现闪屏，这是运动时产生的误差。
		// 原因是点击第一次，触发事件，if条件处理成功，外部sscroll_right方法扑捉到正确的left位移。
		// 快速点击第二次，触发事件，if条件处理未成功，外部sscroll_right方法扑捉到错误的left位移。
		// 导致第一次的事件一直继续运动，且speed本来趋于1，后来被第二次触发的事件破外了speed的值。
		// 也就是说speed又重新被计算一次，且刚好符合单线程原则，speed最大的值一直被交替来回的复用。
		// 解决方法就是让left一直从外部通过参数传进来，想了想还需要找浏览器帮忙，刚好符合js的单线程原则。

		// 以上论证结果是错误的，真正出现问题不在left位移，而是Timer不应该声明在函数内部

		// 总结三点：object param bom 单线程 Async
		// 我们需要把css扔给客户端抓去

		// var moving = grid.style[attr];
		scroll_Width = parseInt(moving);
		speed = (finally_distance - scroll_Width) / 6; // 从开始为100ms 到结束为0ms 
		speed = speed < 0 ? Math.floor(speed) : Math.ceil(speed);

		if (scroll_Width !== finally_distance) { // scrollWidth起初是扑捉else的位移 后面接近传进来currentWidth的位移
			var v = scroll_Width + speed;
			grid.style.left = v + 'px';
		} else {
			clearInterval(objectTime.Timer);
			// 内部清除时间并设置时间为null(空)，此时条件两边相同的情况下，时间不设置为空，时间仍然存在，时间会被定时器外部扑捉。
			// 定时器外部时间也要设置为空，否则下次执行event外部的时间不会消失反而会累计数字。
			objectTime.Timer = null;
		}
	}, 36);
};

function ready() {
	current_scroll_Width = -default_img_width * current_img_length;
	scroll(Grid, current_scroll_Width, objTime)
};

function scroll_left() {

	if (current_img_length > 0) {
		current_img_length -= 1;
	} else {
		current_img_length = half - 1;
		//向左一半的前一张结束，那么向右就是最后一张的前一张都会包括进去，除了最后一张单独判断
		Grid.style.left = -default_img_width * half + 'px';
		//表示scroll_Width获得此处的位移，当图片还没有开始运动css样式left就移动到这里了
	}
	ready()
};

function scroll_right() {

	if (current_img_length < all_img_length - 1) {
		//运动到最后一张的前一张的数目，显示的却是最后一张图片，最后一张的起点坐标刚好是前一张的结束坐标
		current_img_length += 1;
	} else { //否则运动到最后一张图 等价于 获取一半的最后一张图的前一张结束的坐标。此时half+1图就是最后一张的结束坐标
		current_img_length = half;
		Grid.style.left = -default_img_width * (half - 1) + 'px';
	}
	ready()
};


input_left.onclick = function(){ scroll_left()}
input_right.onclick = function(){ scroll_right()}


// addLister(input_left, "click", scroll_left);
// addLister(input_right, "click", scroll_right);


// 总结如下：图片排列顺序没有改变，改变的是移动的镜框，移动的镜框有二种情况，
// 第一种是从首图开始移动到尾图，第二种就是从尾图开始走到首图。
// 移动的方向改变，第一种是正方向的计算，第二种就是负方向的运动
// 注意Timer时间一定要在函数外面定义为null才能避免闪屏