window.onload = function () {
	IO.init();

	/*
	Memory.load({
		"name": "LUCA",
		"description": "ANXIOUS",
		"country": "ITALY",
		"currency": "EUR",
		"salary": 50000,
		"price": 200000,
		"properties": [],
		"renters": [],
		"account": 0.75*200000,
		"difficulty": 2,
		"time": {
			"month": 2,
			"year": 2020,
			"passed": 0,
		}, "market": {
			volatility: 0.2,
			frequency: 1,
			slope: 0.5,
			index: 1.0,
			variation: 0.0
		}, "accounting": {
			month: {
				income: 0,
				expenses: 0,
				bought: 0,
				sold: 0,
				balance: 0,
				last: 0,
			}, year: {
				income: 0,
				expenses: 0,
				bought: 0,
				sold: 0,
				balance: 0
			}, total: {
				income: 0,
				expenses: 0,
				bought: 0,
				sold: 0,
				balance: 0
			}
		}
	});

	Game.office.intro();

	*/
	
	Game.start.start();
};



var Game = {
	Title: "Sherlock Homes",
	Author: "Luca Diazzi",
	Date: "2020",
	Version: "0.1.5",
	Verbose: false,
	date: function () {
		var m = "January February March April May June July August September October November December";
		var t = Memory.read("time");
		m = m.split(" ")[t.month];
		y = t.year;
		return m + " " + y;
	}, pricetag: function (a) {
		return a + " " + Memory.read("currency");
	}, countryCurrency: function (a) {

	}, start: {
		start: function () {
			IO.clear();
			IO.write("Sherlock Homes, Inc.", "sz-48 bolder");
			IO.write("Hi!");
			IO.write("Do you want to become a real estate agent for today?");
			IO.write("Type Y to say yes, N to say no", "advice");
			IO.confirm.set(Game.start.wantToPlay, Game.start.notWantToPlay);
		}, wantToPlay: function () {
			IO.write("");
			IO.write("Great!");
			IO.write("What's your name?");
			IO.write("Type on your keyboard", "advice");
			IO.prompt.set(Game.start.country);
		}, notWantToPlay: function () {
			IO.clear();
			IO.write("SAD!", "sz-48 bolder");
			IO.write("Come back to visit us again, bye!");
			IO.write("Press any key to restart", "advice");
			IO.write("");
			Game.credits();
			IO.pause.set(Game.start.start);
		}, country: function (name) {
			Memory.write("name", name);
			IO.write("");
			IO.write("Nice to meet you, " + Memory.read("name") + ".");
			IO.write("Please tell me more about yourself. Where are you from?");
			IO.prompt.set(Game.start.currency);
		}, currency: function (country) {
			Memory.write("country", country);
			IO.write("");
			IO.write(Memory.read("country") + ", what a wonderful country!");
			var Europe = "AUSTRIA BELGIUM CYPRUS NETHERLANDS ESTONIA FINLAND FRANCE GERMANY GREECE IRELAND"
				+ " ITALY LATVIA LITHUANIA LUXEMBOURG MALTA MONACO PORTUGAL SAN MARINO SLOVAKIA SLOVENIA SPAIN VATICAN CITY";
			var States = "USA UNITED STATES OF AMERICA";
			if (States.includes(Memory.read("country")))
				Memory.write("currency", "USD");
			else if (Europe.includes(Memory.read("country")))
				Memory.write("currency", "EUR");
			else
				return Game.start.askCurrency();
			IO.write("So your currency is " + Memory.read("currency") + "?");
			IO.confirm.set(Game.start.ready, Game.start.askCurrency, Game.what);
		}, askCurrency: function () {
			IO.write("");
			IO.write("Please remind me, what currency is used in " + Memory.read("country") + "?");
			IO.prompt.set(Game.start.ready);
		}, ready: function (currency) {
			Memory.write("currency", currency);
			IO.clear();
			IO.write("Fantastic!", "sz-48 bolder");
			IO.write("You are almost ready to become a real estate agent.");
			IO.write("Just one more thing before we move on.");
			IO.write("How would you describe yourself in one word?");
			IO.prompt.set(Game.start.noted);
		}, noted: function (note) {
			IO.write("");
			Memory.write("description", note);
			IO.write("I will remember that.");
			IO.write("Let's begin!");
			IO.write("Press any key to start", "advice");
			IO.pause.set(Game.settings.price);
		}
	}, settings: {
		price: function () {
			IO.clear();
			IO.write("House Prices", "sz-48 bolder");
			IO.write("First of all, let me ask.");
			IO.write("How much does a house cost in " +  Memory.read("country") + "?");
			IO.number.set(Game.settings.expensive);
		}, expensive: function (price) {
			Memory.write("price", price);
			IO.write("WOW!", "sz-48 bolder");
			IO.write(Game.pricetag(Memory.read("price")) + "?");
			if (Memory.read("price") >= 100000)
				IO.write("That's expensive!");
			else
				IO.write("That's cheap!");
			IO.write("");
			Memory.write("salary", price * 0.2);
			IO.write("So people make around " + Game.pricetag(Memory.read("salary")) + " a year?");
			IO.confirm.set(Game.settings.askDifficulty, Game.settings.askSalary, Game.what);
		}, askSalary: function () {
			IO.write("Then how much do people make a year?");
			IO.number.set(Game.settings.askDifficulty);
		}, askDifficulty: function (salary) {
			Memory.write("salary", salary);
			IO.write("");
			IO.write("What would you say about risking and investing?");
			IO.write("IT SCARES ME (1)");
			IO.write("I'M OKAY WITH IT (2)");
			IO.write("I LOVE IT (3)");
			IO.write("");
			IO.write("Press buttons 1 to 3 to select", "advice");
			IO.options.set([
				Game.settings.preparing,
				Game.settings.preparing,
				Game.settings.preparing
			]);
		}, preparing: function (d) {
			IO.clear();
			IO.write("Hired!", "sz-48 bolder fg-green");
			IO.write("You will start to work for");
			IO.write("Sherlock Homes, Inc.", "sz-28 bolder");
			IO.write("next week.");
			IO.write("We are now preparing your office.");
			IO.write("See you soon!");
			Memory.write("properties", []);
			Memory.write("renters", []);
			Memory.write("account", Memory.read("price")*0.75);
			Memory.write("difficulty", d);
			Memory.write("market", {
				volatility: 0.2,
				frequency: 1,
				slope: 0.5,
				index: 1.0,
				variation: 0.0
			});
			Memory.write("time", {
				month: new Date().getMonth(),
				year: new Date().getFullYear(),
				passed: 0,
			});
			Memory.write("accounting", {
				month: {
					income: 0,
					expenses: 0,
					bought: 0,
					sold: 0,
					balance: 0,
					last: 0
				}, year: {
					income: 0,
					expenses: 0,
					bought: 0,
					sold: 0,
					balance: 0
				}, total: {
					income: 0,
					expenses: 0,
					bought: 0,
					sold: 0,
					balance: 0
				}
			});
			IO.write("");
			IO.write("Please wait...", "advice");
			IO.wait(Game.settings.ready, 3000);
		}, ready: function () {
			IO.write("");
			IO.write("Done!");
			IO.write("Press any key to continue", "advice");
			IO.pause.set(Game.office.intro);
		}
	}, office: {
		intro: function () {
			IO.clear();
			IO.write(Game.date(), "sz-60 fg-blue bolder");
			IO.write("Sherlock Homes, Inc.", "sz-28 bolder");
			IO.write("");
			IO.write(Memory.read("name"), "sz-28 bolder");
			IO.write("THE ", "ilb sz-14");
			IO.write(Memory.read("description"), "bolder ilb sz-14");
			IO.write("REAL ESTATE AGENT", "sz-14");
			IO.write("");
			IO.write("Press any key to go to work", "advice");

			// Game.office.properties.generate();

			IO.pause.set(Game.office.main);
		}, main: function () {
			IO.clear();
			IO.write("Office", "sz-48 bolder");
			IO.write("Sherlock Homes, Inc.", "sz-28 bolder");
			IO.write(Game.date());
			IO.write("");
			IO.write("PROPERTIES (1)");
			IO.write("BANK ACCOUNT (2)");
			IO.write("");
			
			var index = (Memory.read("market").index).toFixed(2);
			var delta = (Memory.read("market").variation * 100).toFixed(1);
			IO.write("Stock market index: " + index + " (" + delta + "%)", delta < 0 ? "fg-red" : "fg-green");
			IO.write("");
			IO.write("NEXT MONTH (0)");
			IO.write("");
			IO.write("Press buttons 0 to 3 to select", "advice");
			var t = Memory.read("time").passed;
			IO.options.set([
				Game.office.properties.main,
				Game.office.bank.main
			],  t == 0 ? Game.office.first : Game.office.report);
		}, report: function () {
			for (var i in Memory.read("properties")) {
				if (!Memory.read("properties")[i].done)
					Memory.read("properties")[i].done = true;
				else {
					Memory.write("account", Memory.read("account") + Memory.read("properties")[i].rent);
					Memory.read("accounting").month.income += Memory.read("properties")[i].rent;
					Memory.read("accounting").year.income += Memory.read("properties")[i].rent;
					Memory.read("accounting").total.income += Memory.read("properties")[i].rent;
				}
			}
			IO.clear();
			IO.write("Report of the Month", "sz-48 bolder fg-indigo");
			IO.write("");
			IO.write("Balance");
			IO.write(Game.pricetag(Memory.read("account")), "sz-28");
			IO.write("");
			IO.write("Income");
			IO.write(Game.pricetag(Memory.read("accounting").month.income), "sz-28");
			IO.write("");
			IO.write("Expenses");
			IO.write(Game.pricetag(Memory.read("accounting").month.expenses), "sz-28");
			IO.write("");
			IO.write("Press any key to continue", "advice");
			IO.pause.set(Game.office.forward);
		}, first: function () {IO.clear();
			IO.write("Hey!", "sz-48 bolder");
			IO.write("If you want to be a real estate agent");
			IO.write("you got to buy at least a property!");
			IO.write("");
			IO.write("Press any key to go back", "advice");
			IO.pause.set(Game.office.main);
		}, save: function () {
		}, forward: function () {
			var t = Memory.read("time");
			var m = Memory.read("market");
			var i = m.index;
			t.passed += 1;
			t.month = (t.month + 1)%12;
			if (t.month == 0) {
				t.year += 1;
				Memory.read("accounting").year.balance = Memory.read("account");
				Memory.read("accounting").year.income = 0;
				Memory.read("accounting").year.expenses = 0;
			}

			m.index = 1 + m.slope / 12 * t.passed + m.volatility * Math.sin(m.frequency * t.passed);
			m.variation = m.index/i - 1;

			for (var i in Memory.read("properties")) {
				Memory.read("properties")[i].price *= 1 + m.variation;
				Memory.read("properties")[i].price = 5000 * Math.round(Memory.read("properties")[i].price / 5000);
			}

			for (var i in Memory.read("marketplace")) {
				Memory.read("marketplace")[i].price *= 1 + m.variation;
				Memory.read("marketplace")[i].price = 5000 * Math.round(Memory.read("marketplace")[i].price / 5000);
			}

			Memory.write("time", t);
			Memory.write("market", m);
			Memory.read("accounting").month.balance = Memory.read("account");
			Memory.read("accounting").month.last = Memory.read("accounting").month.income - Memory.read("accounting").month.expenses;
			Memory.read("accounting").month.income = 0;
			Memory.read("accounting").month.expenses = 0;

			Game.office.intro();
		}, properties: {
			generate: function () {
				var p = [
					{
						name: "Apartment downtown",
						price: 0.6,
						rent: 0.012
					}, {
						name: "Modest house",
						price: 0.9,
						rent: 0.015
					}, {
						name: "Luxury mansion",
						price: 2.3,
						rent: 0.025
					}
				];

				for (var i in p) {
					// Da sistemare
					p[i].price = 5000 * Math.round(p[i].price * Memory.read("market").index * Memory.read("price") / 5000);
					p[i].rent = 100 * Math.round(p[i].rent * Memory.read("market").index * Memory.read("price") / 100);
				}
				Memory.write("marketplace", p);
			}, main: function () {
				var choices = [];
				var k = 0;
				IO.clear();
				IO.write("Properties", "sz-48 bolder");
				if (Memory.read("properties").length == 0) {
					IO.write("You have no properties yet.");
					IO.write("");
				} else {
					var p = Memory.read("properties");
					for (var i in p) {
						IO.write(p[i].name, "sz-28");
						IO.write("VIEW (" + (k + 1) +")");
						choices.push(Game.office.properties.yoursDetail);
						IO.write(" ");
						k = k + 1;
					}
				}
				
				IO.write("BUY (" + (k + 1) + ")");
				choices.push(Game.office.properties.buy);
				IO.write("BACK (0)");
				IO.options.set(choices, Game.office.main);
			}, yoursDetail: function (n) {
				var p = Memory.read("properties")[n - 1];
				Memory.write("properties_last", n - 1);
				IO.clear();
				IO.write(p.name, "sz-48 bolder");
				IO.write("Value");
				IO.write(Game.pricetag(p.price), "sz-28");
				IO.write("");
				IO.write("Bought for");
				IO.write(Game.pricetag(p.boughtFor), "sz-28");
				IO.write("");
				IO.write("Renting for");
				IO.write(Game.pricetag(p.rent), "sz-28");
				IO.write("");
				IO.write("SELL (1)");
				IO.write("BACK (0)");
				IO.options.set([
					Game.office.properties.sellConfirm
				], Game.office.main);
			}, sellConfirm: function () {
				var l = Memory.read("properties_last");
				var m = Memory.read("properties")[l];
				IO.clear();
				IO.write(m.name, "sz-48 bolder");
				IO.write("Do you really want to sell this property?");
				IO.confirm.set(Game.office.properties.sellSuccess, Game.office.properties.main);
			}, sellSuccess: function () {
				var n = Memory.read("properties_last");
				var a = Memory.read("account");
				var p = Memory.read("properties");
				var m = p.splice(n, 1)[0];
				a = a + m.price;
				Memory.write("account", a);
				Memory.write("properties", p);
				Memory.read("accounting").month.income += m.price;
				Memory.read("accounting").year.income += m.price;
				Memory.read("accounting").total.income += m.price;
				IO.clear();
				IO.write("Awesome!", "sz-48 bolder fg-green");
				IO.write("");
				IO.write("You just sold the following property:");
				IO.write(m.name, "sz-28");
				IO.write("");
				IO.write("for a whopping amount of");
				IO.write(Game.pricetag(m.price), "sz-28");
				IO.write("");
				IO.write("Press any key to continue", "advice");
				IO.pause.set(Game.office.report);
			}, buy: function (){
				Game.office.properties.generate();
				IO.clear();
				IO.write("Marketplace", "sz-48 bolder");
				IO.write("Properties on the market this month:");
				IO.write("");
				var p = Memory.read("marketplace");
				for (var i = 0; i < p.length; i++) {
					IO.write(p[i].name, "sz-28");
					IO.write(Game.pricetag(p[i].price));
					IO.write("VIEW (" + (i + 1) + ")");
					IO.write("");
				}
				IO.write("BACK (0)");
				IO.options.set([
					Game.office.properties.buyDetail,
					Game.office.properties.buyDetail,
					Game.office.properties.buyDetail
				], Game.office.properties.main);
			}, buyDetail: function (n) {
				var p = Memory.read("marketplace")[n - 1];
				Memory.write("marketplace_last", n - 1);
				IO.clear();
				IO.write(p.name, "sz-48 bolder");
				IO.write("Selling for");
				IO.write(Game.pricetag(p.price), "sz-28");
				IO.write("");
				IO.write("Renting for");
				IO.write(Game.pricetag(p.rent), "sz-28");
				IO.write("");
				IO.write("Do you want to buy the property?");
				IO.confirm.set(Game.office.properties.buyCheck, Game.office.properties.buy);
			}, buyCheck: function () {
				var l = Memory.read("marketplace_last");
				var m = Memory.read("marketplace")[l];
				var p = m.price;
				var a = Memory.read("account");
				if (p < a)
					Game.office.properties.buySuccess();
				else
					Game.office.properties.buyFail();
			}, buySuccess: function () {
				var n = Memory.read("marketplace_last");
				var m = Memory.read("marketplace");
				var a = Memory.read("account");
				var p = Memory.read("properties");
				m = m.splice(n, 1)[0];
				m.boughtFor = m.price;
				p.push(m);
				a = a - m.price;
				Memory.write("account", a);
				Memory.write("properties", p);
				Memory.read("accounting").month.expenses += m.price;
				Memory.read("accounting").year.expenses += m.price;
				Memory.read("accounting").total.expenses += m.price;
				IO.clear();
				IO.write("Awesome!", "sz-48 bolder fg-green");
				IO.write("");
				IO.write("You just bought the following property:");
				IO.write(m.name, "sz-28");
				IO.write("");
				IO.write("for a whopping amount of");
				IO.write(Game.pricetag(m.price), "sz-28");
				IO.write("");
				IO.write("Press any key to continue", "advice");
				IO.pause.set(Game.office.report);
			}, buyFail: function () {
				var n = Memory.read("marketplace_last");
				var p = Memory.read("marketplace")[n];
				IO.clear();
				IO.write("Sorry but...", "sz-48 bolder fg-red");
				IO.write("");
				IO.write("You can't afford the following property:");
				IO.write(p.name, "sz-28");
				IO.write("");
				IO.write("with a price tag of");
				IO.write(Game.pricetag(p.price), "sz-28");
				IO.write("");
				IO.write("Please check your Bank Account!");
				IO.write("");
				IO.write("Press any key to get back to the office", "advice");
				IO.pause.set(Game.office.main);
			}
		}, bank: {
			main: function () {
				var l = Memory.read("accounting").month.last;
				IO.clear();
				IO.write("Bank Account", "sz-48 bolder");
				IO.write("Balance");
				IO.write(Game.pricetag(Memory.read("account")), "sz-28");
				IO.write("");
				IO.write("Last month");
				IO.write(Game.pricetag(l), "sz-28" + (l < 0 ? " fg-red" : " "));
				IO.write("");
				IO.write("ASK FOR A LOAN (1)");
				IO.write("BACK (0)");
				IO.options.set([
					Game.office.main
				], Game.office.main);
			}, loan: function () {

			}
		}, services: {
			main: function () {
				IO.clear();
				IO.write("Services", "sz-48 bolder");
				IO.write("STOCK MARKET INDEXES (1)");
				IO.write("");
				IO.write("BACK (0)");
				IO.options.set([
					Game.office.services.stock
				], Game.office.main);
			}, stock: function () {
				var index = (Memory.read("market").index).toFixed(2);
				var delta = (Memory.read("market").variation * 100).toFixed(1);
				IO.clear();
				IO.write("Stock Market", "sz-48 bolder");
				IO.write("Index");
				IO.write(index, "sz-28");
				IO.write("");
				IO.write("Variation");
				IO.write(delta + "%", "sz-28" + (delta < 0 ? " fg-red" : " "));
				IO.write("");
				// Prices are rising, time to sell
				IO.write("Press any key to go back", "advice");
				IO.pause.set(Game.office.services.main);
			}
		}
	}, what: function () {
		IO.write("What?");
	}, over: function () {
		IO.clear();
		IO.write("GAME OVER!", "sz-48 bolder fg-red");
		IO.write("Press any key to restart", "advice");
		IO.write("");
		Game.credits();
		IO.pause.set(Game.start.start);
	}, credits: function () {
		IO.write("SHERLOCK HOMES", "bolder");
		IO.write("A game by LUCA DIAZZI", "sz-14");
		IO.write("&copy; 2020", "sz-14");
	}, license: function () {
		IO.write(
			"\nThe MIT License (MIT)\n" +
			"Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
			"of this software and associated documentation files (the \"Software\"), to deal\n" +
			"in the Software without restriction, including without limitation the rights\n" +
			"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n" +
			"copies of the Software, and to permit persons to whom the Software is\n" +
			"furnished to do so, subject to the following conditions:\n\n" +
			"The above copyright notice and this permission notice shall be included in all\n" +
			"copies or substantial portions of the Software.\n\n" +
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n" +
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n" +
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n" +
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n" +
			"SOFTWARE.\n\n", "sz-10"
		);
	}
};