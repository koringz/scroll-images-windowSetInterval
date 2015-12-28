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
 * $author koringz
 * $data 2015-12-27
 * $version 0.3
 *
 */

 /*
 *
 *
 * 首先，你需要导入外部js：koringz.js
 *
 *
 */


 var start_event, arr_class, init, Prev, Next, input_left, input_right, Container, Content, Grid, Next_grid, Img, style_img, i, j, default_img_width, all_img_length, current_img_length, half, Timer, current_scroll_Width, scroll_Width, speed, objTime;
Content = getElementNode('.content');
Grid = getElementNode('#grid');
Grid.innerHTML += Grid.innerHTML;
Next_grid = getElementNode('.next_grid');
Img = Grid.getElementsByTagName('a');
input_left = getElementNode('.Left');
input_right = getElementNode('.Right');
default_img_width = Img[0].offsetWidth;
all_img_length = Img.length;
current_img_length = 0;
half = all_img_length / 2;
Timer = null;
objTime = {};

function auto() {
	input_right.onclick()
};
Content.onmouseover = function() {
	clearInterval(Timer)
};
Content.onmouseout = function() {
	Timer = setInterval(auto, 3000)
};
Timer = setInterval(auto, 3000);

function scroll(grid, finally_distance, objectTime) {
	if (objectTime.Timer !== null && objectTime.Timer !== undefined) {
		clearInterval(objectTime.Timer)
	}
	objectTime.Timer = setInterval(function() {
		var moving = grid.offsetLeft;
		scroll_Width = parseInt(moving);
		speed = (finally_distance - scroll_Width) / 6;
		speed = speed < 0 ? Math.floor(speed) : Math.ceil(speed);
		if (scroll_Width !== finally_distance) {
			var v = scroll_Width + speed;
			grid.style.left = scroll_Width + speed + 'px'
		} else {
			clearInterval(objectTime.Timer);
			objectTime.Timer = null
		}
	}, 38)
};

function ready() {
	current_scroll_Width = -default_img_width * current_img_length;
	scroll(Grid, current_scroll_Width, objTime)
};

function scroll_left() {
	if (current_img_length > 0) {
		current_img_length -= 1
	} else {
		current_img_length = half - 1;
		Grid.style.left = -default_img_width * half + 'px'
	}
	ready()
};

function scroll_right() {
	if (current_img_length < all_img_length - 1) {
		current_img_length += 1
	} else {
		current_img_length = half;
		Grid.style.left = -default_img_width * (half - 1) + 'px'
	}
	ready()
};
input_left.onclick = function() {
	scroll_left()
}
input_right.onclick = function() {
	scroll_right()
}