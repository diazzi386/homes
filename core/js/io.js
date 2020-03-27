var IO = {
	VERSION: "0.1.1",
	BUILD: "27 Mar. 2020",
	listen: null,
	theme: {
		rules: {},
		init: function () {
			IO.theme.rules = {};
			IO.theme.rules.body =
				IO.theme.rules.default =
				IO.theme.rules.input =
				IO.theme.rules.output =
				IO.theme.rules.enter =
				IO.theme.rules.error =
				IO.theme.rules.warning = "";

			if (Theme) for (var i in Theme)
				IO.theme.apply(i, Theme[i]);
			IO.theme.load();
		}, apply: function (tag, rule) {
			IO.theme.rules[tag] = rule;
			return IO.theme;
		}, load: function () {
			document.body.className = IO.theme.rules.body;
			IO.get('screen').className = IO.theme.rules.output;
		}
	}, scroll: function () {
		IO.get('screen').scrollTop = IO.get('screen').scrollHeight;
	}, clear: function () {
		IO.get('screen').innerHTML = "";
	}, get: function (id) {
		return document.getElementById(id);
	}, write: function (string, theme) {
		if (string == undefined)
			return;
		else if (string == "")
			string = "\n";
		if (IO.theme.rules[theme])
			theme = IO.theme.rules[theme];
		else if (theme == undefined)
			theme = "";
		theme = IO.theme.rules.default + " " + theme;
		string = "<p class='" + theme + "'>" + string + "</p>";
		IO.get('screen').innerHTML += string;
		IO.scroll();
	}, input: function (id) {
		var theme = IO.theme.rules.default + " " + IO.theme.rules.input;
		if (id)
			IO.get('screen').innerHTML += "<p class='input " + theme + "' id='" + id + "'>_</p>";
		else
			IO.get('screen').innerHTML += "<p class='input " + theme + "' id='" + id + "'>_</p>";
		IO.scroll();
	}, title: function (text) {
		document.title = text || Game.Title;
	}, init: function () {
		IO.theme.init();
		IO.title();
	}, error: function (message) {
		IO.write("ERROR: " + message, "error");
		return false;
	}, verbose: function (message) {
		if (Game.Verbose)
			IO.write(message, "diagnose");
	}, confirm: {
		yes: null,
		no: null,
		other: null,
		id: "input",
		set: function (y, n, o) {
			IO.input(IO.confirm.id);
			IO.confirm.yes = y;
			IO.confirm.no = n;
			IO.confirm.other = o;
			document.addEventListener('keyup', IO.confirm.type);
		}, type: function (e) {
			var key = e.keyCode ? e.keyCode : e.which;
			if (key == 89) {
				IO.get(IO.confirm.id).innerHTML = "YES";
				IO.get(IO.confirm.id).removeAttribute("id");
				document.removeEventListener('keyup', IO.confirm.type);
				return IO.confirm.yes();
			} else if (key == 78) {
				IO.get(IO.confirm.id).innerHTML = "NO";
				IO.get(IO.confirm.id).removeAttribute("id");
				document.removeEventListener('keyup', IO.confirm.type);
				return IO.confirm.no();
			} else if (IO.confirm.other)
				return IO.confirm.other();
		}
	}, prompt: {
		next: null,
		temp: null,
		id: "input",
		set: function (f) {
			IO.input(IO.prompt.id);
			IO.prompt.next = f;
			document.addEventListener('keyup', IO.prompt.type);
		}, type: function (e) {
			if (IO.get(IO.prompt.id).innerHTML == "_")
				IO.get(IO.prompt.id).innerHTML = "";
			var key = e.keyCode ? e.keyCode : e.which;
			if (key >= 65 && key <= 90)
				IO.get(IO.prompt.id).innerHTML += String.fromCharCode(key);
			else if (key == 8) {
				IO.get(IO.prompt.id).innerHTML = IO.get(IO.prompt.id).innerHTML.substr(0, IO.get(IO.prompt.id).innerHTML.length - 1);
				if (IO.get(IO.prompt.id).innerHTML == "" || IO.get(IO.prompt.id).innerHTML == " " )
						IO.get(IO.prompt.id).innerHTML = "_";
			} else if (key == 32) {
				IO.get(IO.prompt.id).innerHTML += " ";
				if (IO.get(IO.prompt.id).innerHTML == "" || IO.get(IO.prompt.id).innerHTML == " " )
					IO.get(IO.prompt.id).innerHTML = "_";
			} else if (key == 13 && IO.get(IO.prompt.id).innerHTML != "") {
				document.removeEventListener('keyup', IO.prompt.type);
				IO.prompt.temp = IO.get(IO.prompt.id).innerHTML;
				IO.get(IO.prompt.id).removeAttribute("id");
				return IO.prompt.next(IO.prompt.temp);
			} else {
				if (IO.get(IO.prompt.id).innerHTML == "" || IO.get(IO.prompt.id).innerHTML == " " )
					IO.get(IO.prompt.id).innerHTML = "_";
			}
		}
	}, pause: {
		next: null,
		id: "input",
		set: function (f) {
			// IO.input(IO.pause.id);
			IO.pause.next = f;
			document.addEventListener('keyup', IO.pause.type);
		}, type: function () {
			document.removeEventListener('keyup', IO.pause.type);
			// IO.get(IO.pause.id).removeAttribute("id");
			IO.pause.next();
		}
	}, number: {
		next: null,
		temp: null,
		id: "input",
		set: function (f) {
			IO.input(IO.number.id);
			IO.number.next = f;
			document.addEventListener('keyup', IO.number.type);
		}, type: function (e) {
			if (IO.get(IO.number.id).innerHTML == "_")
				IO.get(IO.number.id).innerHTML = "";
			var key = e.keyCode ? e.keyCode : e.which;
			if (key >= 48 && key <= 57)
				IO.get(IO.number.id).innerHTML += String.fromCharCode(key);
			else if (key >= 96 && key <= 105)
				IO.get(IO.number.id).innerHTML += String.fromCharCode(key - 48);
			else if (key == 8) {
				IO.get(IO.number.id).innerHTML = IO.get(IO.number.id).innerHTML.substr(0, IO.get(IO.number.id).innerHTML.length - 1);
				if (IO.get(IO.number.id).innerHTML == "")
						IO.get(IO.number.id).innerHTML = "_";
			} else if (key == 13 && IO.get(IO.number.id).innerHTML != "") {
				document.removeEventListener('keyup', IO.number.type);
				IO.number.temp = parseInt(IO.get(IO.number.id).innerHTML);
				IO.get(IO.number.id).removeAttribute("id");
				return IO.number.next(IO.number.temp);
			} else {
				if (IO.get(IO.number.id).innerHTML == "")
					IO.get(IO.number.id).innerHTML = "_";
			}
		}
	}, options: {
		id: "input",
		options: [],
		set: function (f) {
			// IO.input(IO.options.id);
			IO.options.options = f;
			document.addEventListener('keyup', IO.options.type);
		}, type: function (e) {
			var key = e.keyCode ? e.keyCode : e.which;
			if (key >= 48 && key <= 57)
				key = key - 48;
			else if (key >= 96 && key <= 105)
				key = key - 96;
			if (IO.options.options[key - 1]) {
				document.removeEventListener('keyup', IO.options.type);
				// IO.get(IO.options.id).removeAttribute("id");
				return IO.options.options[key - 1](key);
			}
		}
	}, wait: function (f, t) {
		setTimeout(f, t);
	}
};

window.onerror = function (msg, url, line, col, error) {
	IO.error("line " + line + " in file " + url);
};

var Memory = {
	values: {},
	write: function (n, v) {
		if (v == undefined)
			return;
		Memory.values[n] = v;
		v = JSON.stringify(v);
		IO.verbose("Variable set: " + n.toUpperCase() + " to " + v);
	}, read: function (n) {
		if (Memory.values[n] == undefined)
			IO.error("Variable not found: " + n.toUpperCase());
		else
			return Memory.values[n];
	}, load: function (e) {
		for (var i in e)
			Memory.values[i] = e[i];
	}
};