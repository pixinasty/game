var window = window;

	window.ontick = function (listener, interval)
	{
		var event = {};
			event.time = 0;
			event.type = 'tick';

		window.setInterval
		(
			function ()
			{
				event.time += interval;
				listener (event);
			},

			interval
		);
	};

var game =
{
	canvas:
	{
		resize: function (force)
		{
			if (force || (game.event.type == 'resize') || (game.event.type == 'run'))
			{
				for (var id in game.canvas)
				{
					switch (id)
					{
						case 'height': break;
						case 'resize': break;
						case 'width': break;

						default:
							game.canvas.height = window.innerHeight;
							game.canvas.width = window.innerWidth;

							game.canvas[id].height = game.canvas.height;
							game.canvas[id].width = game.canvas.width;
							break;
					};
				};
			};
		}
	},

	create:
	{
		set button (object)
		{
			var button = {};
				button.action = object.action;
				button.color = (object.color) ? object.color : '#fff';
				button.h = object.h;
				button.hide = false;
				button.image = object.image;
				button.layer = (object.layer) ? (object.layer) : 'background';
				button.name = object.name;
				button.r = object.r;
				button.text = {}; object.text = (object.text) ? object.text : {};
				button.text.color = (object.text.color) ? object.text.color : '#000';
				button.text.text = object.text.text;
				button.type = (object.type) ? object.type : 'box';
				button.w = object.w;
				button.x = object.x;
				button.y = object.y;

			//TODO: добавить в конструктор canvas возможность создавать его в любом объекте, а не только в window
				button.click = function ()
				{
					if (game.event.type == 'mousedown')
					{
						var h = game.rel.y (button.h);
						var w = game.rel.x (button.w);
						var x = game.rel.x (button.x);
						var y = game.rel.y (button.y);
						if ((game.event.x >= x) && (game.event.x <= x + w))
						{
							if ((game.event.y >= y) && (game.event.y <= y + h))
							{
								button.action ();
							};
						};
					};
				};

				button.show = function ()
				{
					if (game.event.type == 'resize')
					{
						game.canvas[button.layer].clear (button.name);
						button.hide = false;
					};

					if (!button.hide)
					{
						switch (button.type)
						{
							case 'box':
								var h = button.h;
								var w = button.w;
								var x = button.x;
								var y = button.y;
								game.canvas[button.layer].draw.box (x, y, w, h, true, button.name);

								//TODO: вынести в отдельный метод, добавить метод очистки элемента по id или name.
								var size = h;
								game.canvas[button.layer].context.font = game.rel.y (size) + 'px Arial';
								var width = game.canvas[button.layer].context.measureText(button.text.text).width;
								for (size; game.rel.x (w) < width; size -= 0.001)
								{
									game.canvas[button.layer].context.font = game.rel.y (size) + 'px Arial';
									width = game.canvas[button.layer].context.measureText(button.text.text).width;
								};

								game.canvas.background.draw.text =
								{
									align: 'center',
									baseline: 'middle',
									color: button.text.color,
									name: button.name,
									size: size,
									text: button.text.text,
									x: x + w/2,
									y: y + h/2
								};
								break;

							case 'circle':
								break;

							case 'sprite':
								var image = button.image;

								var h = button.h;
								var w = button.w;
								var x = button.x;
								var y = button.y;

								game.canvas.background.draw.sprite =
								{
									h: h,
									src: image,
									w: w,
								 	x: x,
									y: y,
								};
								break;
						};
						button.hide = true;
					};
				};

				button.update = function ()
				{
					button.click ();
					button.show ();
				};
			game.input.push (button);
		},

		set canvas (object)
		{
			var canvas = window.document.createElement ('canvas');

				canvas.clear = function (name)
				{
					var scene = this.draw.scene;
					if (scene)
					{
						var clear = [];
						for (var i = 0; i < scene.length; i++)
						{
							if (scene[i].name != name)
							{
								clear.push (scene[i]);
							};
						};
						this.draw.scene = clear;
					};
				};

				canvas.context = canvas.getContext ('2d');
				canvas.draw = game.draw;
				canvas.draw.context = canvas.context;
				canvas.id = (object.id) ? object.id : 'background';
				canvas.style.position = 'absolute';
				canvas.style.zIndex = (object.layer) ? object.layer : 0;
			game.canvas[canvas.id] = canvas;
			window.document.body.appendChild (canvas);
		}
	},

	draw:
	{
		box: function (x, y, w, h, fill, name)
		{
			var box = {};
				box.fill = fill;
				box.h = h;
				box.name = name;
				box.type = 'box';
				box.w = w;
				box.x = x;
				box.y = y;
			this.scene.push (box);
		},

		circle: function (x, y, r, fill, name)
		{
			var circle = {};
				circle.fill = fill;
				circle.name = name;
				circle.r = r;
				circle.type = 'circle';
				circle.x = x;
				circle.y = y;
			this.scene.push (circle);
		},

		line: function (x0, y0, x1, y1, name)
		{
			var line = {};
				line.name = name;
				line.type = 'line';
				line.x0 = x0;
				line.x1 = x1;
				line.y0 = y0;
				line.y1 = y1;
			this.scene.push (line);
		},

		scene: [],

		set sprite (object)
		{
			var sprite = {};
				sprite.name = object.name;
				sprite.src = object.src;
				sprite.type = 'sprite';
				sprite.x = object.x;
				sprite.y = object.y;

			var scene = this.scene;

			var image = new Image ();
				image.src = object.src;

				image.onload = function ()
				{
					sprite.h = (object.h) ? object.h : image.height;
					sprite.image = image;
					sprite.w = (object.w) ? object.w : image.width;

					scene.push (sprite);
				};
		},

		set style (object)
		{
			var style = {};
				style.color = object.color;
				style.name = object.name;
				style.type = 'style';
				style.size = object.size;
			this.scene.push (style);
		},

		set text (object)
		{
			var text = {};
				text.align = (object.align) ? object.align : 'left';
				text.baseline = (object.baseline) ? object.baseline : 'alphabetic';
				text.color = (object.color) ? object.color : this.context.fillStyle;
				text.color0 = this.context.fillStyle;
				text.font = (object.font) ? object.font : 'Arial';
				text.name = object.name;
				text.size = (object.size) ? object.size : 12;
				text.text = object.text;
				text.type = 'text';
				text.x = (object.x) ? object.x : 0;
				text.y = (object.y) ? object.y : 0;
			this.scene.push (text);
		}
	},

	event: {},

	input: [],

	interface: function ()
	{
		for (var i = 0; i < game.input.length; i++)
		{
			game.input[i].update ();
		};
	},

	listener: function (event)
	{
		game.event = event;
		game.update ();
	},

	set log (text)
	{
		if (text)
		{
			window.console.log (text);
		};
	},

	option:
	{
		interval: 1000
	},

	paint: function ()
	{
		for (var id in game.canvas)
		{
			switch (id)
			{
				case 'height': break;
				case 'resize': break;
				case 'width': break;

				default: game.painter (game.canvas[id].draw); break;
			};
		};
	},

	painter: function (draw)
	{
		draw.context.clearRect (0, 0, game.canvas.width, game.canvas.height);
		for (var i = 0; i < draw.scene.length; i++)
		{
			var call = draw.scene[i];
			switch (call.type)
			{
				case 'box':
					var h = game.rel.y (call.h);
					var w = game.rel.x (call.w);
					var x = game.rel.x (call.x);
					var y = game.rel.y (call.y);
					draw.context.beginPath ();
					draw.context.rect (x, y, w, h);
					var fill = (call.fill) ? draw.context.fill () : draw.context.stroke ();
					break;

				case 'circle':
					var r = game.rel.s (call.r);
					var x = game.rel.x (call.x);
					var y = game.rel.y (call.y);
					draw.context.beginPath ();
					draw.context.arc (x, y, r, 0, 2 * Math.PI);
					var fill = (call.fill) ? draw.context.fill () : draw.context.stroke ();
					break;

				case 'line':
					var x0 = game.rel.x (call.x0);
					var x1 = game.rel.x (call.x1);
					var y0 = game.rel.y (call.y0);
					var y1 = game.rel.y (call.y1);
					draw.context.beginPath ();
					draw.context.moveTo (x0, y0);
					draw.context.lineTo (x1, y1);
					draw.context.stroke ();
					break;

				case 'sprite':
					var h = game.rel.y (call.h);
					var w = game.rel.x (call.w);
					var x = game.rel.x (call.x);
					var y = game.rel.y (call.y);
					draw.context.beginPath ();
					draw.context.drawImage (call.image, x, y, w, h);
					break;

				case 'style':
					draw.context.beginPath ();
					draw.context.fillStyle = call.color;
					draw.context.lineWidth = game.rel.s (call.size);
					draw.context.strokeStyle = call.color;
					break;

				case 'text':
					var x = game.rel.x (call.x);
					var y = game.rel.y (call.y);
					draw.context.beginPath ();
					draw.context.font = game.rel.s (call.size) + 'px ' + call.font;
					draw.context.fillStyle = call.color;
					draw.context.textAlign = call.align;
					draw.context.textBaseline = call.baseline;
					draw.context.fillText (call.text, x, y);
					draw.context.fillStyle = call.color0;
					break;
			};
		};
	},

	preload: function ()
	{
		game.create.canvas = {};

		window.onload = game.listener;
		window.onmousedown = game.listener;
		window.onmouseup = game.listener;
		window.onresize = game.listener;
		window.ontick (game.listener, game.option.interval);
	},

	random: function (min, max, floor)
	{
		var random = (floor) ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
		return random;
	},

	rel:
	{
		s: function (s)
		{
			var min = (game.canvas.height < game.canvas.width) ? game.canvas.height : game.canvas.width;
			return ((s < 1) && (s > 0)) ? Math.floor (s * min) : s;
		},

		x: function (x)
		{
			return ((x < 1) && (x > 0)) ? Math.floor (x * game.canvas.width) : x;
		},

		y: function (y)
		{
			return ((y <=1) && (y > 0)) ? Math.floor (y * game.canvas.height) : y;
		}
	},

	run: function ()
	{
		game.preload ();

		game.event = { type: 'run' };
		game.update ();
	},

	update: function ()
	{
		game.canvas.resize ();
		game.interface ();
		game.paint ();
	}
};