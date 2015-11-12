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
		set canvas (object)
		{
			var canvas = window.document.createElement ('canvas');
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
		box: function (x, y, w, h, fill)
		{
			var box = {};
				box.fill = fill;
				box.h = h;
				box.type = 'box';
				box.w = w;
				box.x = x;
				box.y = y;
			this.scene.push (box);
		},

		circle: function (x, y, r, fill)
		{
			var circle = {};
				circle.fill = fill;
				circle.r = r;
				circle.type = 'circle';
				circle.x = x;
				circle.y = y;
			this.scene.push (circle);
		},

		line: function (x0, y0, x1, y1)
		{
			var line = {};
				line.type = 'line';
				line.x0 = x0;
				line.x1 = x1;
				line.y0 = y0;
				line.y1 = y1;
			this.scene.push (line);
		},

		scene: [],

		set sprite (json)
		{
			var sprite = {};
				sprite.src = json.src;
				sprite.type = 'sprite';
				sprite.x = json.x;
				sprite.y = json.y;

			var scene = this.scene;

			var image = new Image ();
				image.src = json.src;

				image.onload = function ()
				{
					sprite.h = (json.h) ? json.h : image.height;
					sprite.image = image;
					sprite.w = (json.w) ? json.w : image.width;

					scene.push (sprite);
				};
		},

		set style (json)
		{
			var style = {};
				style.color = json.color;
				style.type = 'style';
				style.size = json.size;
			this.scene.push (style);
		},

		set text (json)
		{
			var text = {};
				text.color = (json.color) ? json.color : this.context.fillStyle;
				text.color0 = this.context.fillStyle;
				text.font = (json.font) ? json.font : 'Arial';
				text.size = (json.size) ? json.size : 12;
				text.text = json.text;
				text.type = 'text';
				text.x = (json.x) ? json.x : 0;
				text.y = (json.y) ? json.y : 0;
			this.scene.push (text);
		}
	},

	event: {},

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

		game.log = game.event.type; //debug
		window.document.title = (game.event.type == 'tick') ? game.event.time/1000 : window.document.title; //debug

		game.paint ();
	}
};