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
				canvas.id = (object.id) ? object.id : 'background';
				canvas.style.position = 'absolute';
				canvas.style.zIndex = (object.layer) ? object.layer : 0;
			game.canvas[canvas.id] = canvas;
			window.document.body.appendChild (canvas);
		}
	},

	draw:
	{
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
	}
};