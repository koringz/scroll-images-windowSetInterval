/* koringz.github.io
*
* $author koringz
* $data 2015-9-20
* $version 0.1
*
* $author koringz
* $data 2015-12-25
* $version 0.2
*
*/
	var start_event,arr_class,init,Prev,Next,input_left,input_right,Container,Content,Grid,Next_grid,Img,style_img,i,j,default_img_width,all_img_length,current_img_length,half,Timer,current_scroll_Width,scroll_Width,speed;

	function doc_query(_name){
		return document.querySelector(_name)
	};
	
	Content = document.getElementsByClassName('content')[0];
	Grid = document.getElementById('grid');
	Next_grid = document.getElementsByClassName('next_grid')[0];
	Img = Grid.getElementsByTagName('a');
	input_left = document.getElementsByClassName('Left')[0];
	input_right = document.getElementsByClassName('Right')[0];
	grid.innerHTML += grid.innerHTML
	default_img_width = Img[0].offsetWidth; // 默认图片的宽度
	all_img_length = Img.length; // 图片的总数目
	current_img_length = 0; // 当前图片数目 
	half = all_img_length / 2;	// 一半的图片数目
	Timer = null;

	function auto(){
		scroll_right()
	}

	function scroll(grid,finally_distance){ // 200w
		if(Timer !== null && Timer !== undefined){
			clearInterval(Timer)
		}

		Timer = setInterval(function(){
			var moving = grid.offsetLeft;

			scroll_Width = parseInt(moving); 
			speed = (finally_distance - scroll_Width)/6;  // 从开始为100ms 到结束为0ms 
			speed = speed < 0 ?Math.floor(speed):Math.ceil(speed);

			if(scroll_Width !== finally_distance){ // scrollWidth起初是扑捉else的位移 后面接近传进来currentWidth的位移
				var v = scroll_Width + speed;
			 	grid.style.left = scroll_Width + speed +'px'; 
			}else{
				clearInterval(Timer); 
				// 内部清除时间并设置时间为null(空)，此时条件两边相同的情况下，时间不设置为空，时间仍然存在，时间会被定时器外部扑捉。
				// 定时器外部时间也要设置为空，否则下次执行event外部的时间不会消失反而会累计数字。
				Timer = null;
			}
		},38);
	}

	function scroll_left(){

		if (current_img_length > 0) {
			current_img_length -= 1;
		} else{
			current_img_length = half -1;	
			//向左一半的前一张结束，那么向右就是最后一张的前一张都会包括进去，除了最后一张单独判断
			Grid.style.left = - default_img_width * half + 'px';
			//表示scroll_Width获得此处的位移，当图片还没有开始运动css样式left就移动到这里了
		}
		ready()
	};
	function scroll_right(){

		if (current_img_length < all_img_length - 1) {	
			//运动到最后一张的前一张的数目，显示的却是最后一张图片，最后一张的起点坐标刚好是前一张的结束坐标
			current_img_length += 1;
		} else{	//否则运动到最后一张图 等价于 获取一半的最后一张图的前一张结束的坐标。此时half+1图就是最后一张的结束坐标
			current_img_length = half;
			Grid.style.left = -default_img_width * (half-1) + 'px';
		}
		ready()
	};

	function ready(){
		current_scroll_Width = -default_img_width*current_img_length; 
		scroll(Grid,current_scroll_Width)
	}

	input_left.addEventListener('click',function(){
		scroll_left()
	},false);
	input_right.addEventListener('click',function(){
		scroll_right()
	},false);
	