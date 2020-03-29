window.onload = function () {
	IO.init();
	Game.start.start();
};

var Game = {
	Title: "Sherlock Homes, Inc.",
	Author: "Luca Diazzi",
	Key: "diazzi-homes",
	Date: "2020",
	Version: "0.2.4",
	Verbose: false,
	date: function () {
		var m = "January February March April May June July August September October November December";
		var t = Memory.read("time");
		m = m.split(" ")[t.month];
		y = t.year;
		return m + " " + y;
	}, pricetag: function (a) {
		return a.toLocaleString() + " " + Memory.read("currency");
	}, countryCurrency: function (a) {

	}, start: {
		start: function () {
			IO.clear();
			IO.write("SHERLOCK HOMES, Inc.", "sz-48 bolder");
			if (Memory.saved()) {
				IO.write("Welcome back!");
				IO.write("Do you want to resume the last game?");
				IO.confirm.set(Game.start.resume, Game.start.newGame);
			} else {
				IO.write("Hi!");
				IO.write("Do you want to become a real estate agent for today?");
				IO.write("Type Y to say yes, N to say no", "advice");
				IO.confirm.set(Game.start.wantToPlay, Game.start.notWantToPlay);
			}
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
		}, newGame: function () {
			Memory.reset();
			Game.start.start();
		}, resume: function () {
			Memory.resume();

			IO.clear();
			IO.write("SHERLOCK HOMES, Inc.", "sz-48 bolder");
			IO.write(Memory.read("name"), "sz-28 bolder");
			IO.write("THE <b class='bolder'>" + Memory.read("description") + "</b>");
			IO.write("REAL ESTATE AGENT");
			
			IO.write("");
			IO.write("Loading...", "advice");
			IO.wait(Game.office.intro, 2000);
		}, country: function (name) {
			Memory.write("name", name);
			IO.write("");
			IO.write("Nice to meet you, " + Memory.read("name") + ".");
			IO.write("Please tell me more about yourself.");
			IO.write("Where are you from?");
			IO.prompt.set(Game.start.ready);
		}, ready: function (country) {
			Memory.write("country", country);
			// Memory.write("currency", currency);
			IO.clear();
			IO.write("Fantastic!", "sz-48 bolder");
			IO.write("We sent your details to many agencies and");
			IO.write("you got an interview for an important one,");
			IO.write("");
			IO.write("SHERLOCK HOMES, Inc.", "sz-28 bolder");
			IO.write("");
			IO.write("Are you ready to start?");
			IO.write("");
			IO.write("Press any key to continue", "advice");
			IO.pause.set(Game.settings.describe);
		}
	}, settings: {
		describe: function () {
			IO.clear();
			IO.write("Interview", "sz-48 bolder");
			IO.write("First of all, how would you describe yourself in one word?");
			IO.prompt.set(Game.settings.currency);
		}, currency: function (note) {
			Memory.write("description", note);
			IO.write("");
			IO.write("Great.");
			IO.write("Now please remind me, what currency is used in " + Memory.read("country") + "?");
			IO.prompt.set(Game.settings.price);
			/*
			var Europe = "AUSTRIA BELGIUM CYPRUS NETHERLANDS ESTONIA FINLAND FRANCE GERMANY GREECE IRELAND"
			+ " ITALY LATVIA LITHUANIA LUXEMBOURG MALTA MONACO PORTUGAL SAN MARINO SLOVAKIA SLOVENIA SPAIN VATICAN CITY";
			var States = "USA UNITED STATES OF AMERICA";
			if (States.includes(Memory.read("country")))
				Memory.write("currency", "USD");
			else if (Europe.includes(Memory.read("country")))
				Memory.write("currency", "EUR");
			else
				return Game.start.askCurrency();
			*/
		}, price: function (currency) {
			Memory.write("currency", currency);
			IO.write("");
			IO.write("Mm-mh.");
			IO.write("And how much does a house cost in " +  Memory.read("country") + "?");
			IO.number.set(Game.settings.difficulty);
		}, difficulty: function (price) {
			IO.clear();
			Memory.write("price", price);
			IO.write("Interview", "sz-48 bolder");
			IO.write("What would you say about risking and investing?");
			IO.write("");
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
			IO.write("The interview went well.");
			IO.write("");
			IO.write("You will start to work for");
			IO.write("SHERLOCK HOMES, Inc.", "sz-28 bolder");
			IO.write("next week.");
			IO.write("We are now preparing your office.");
			IO.write("See you soon!");
			Memory.write("properties", []);
			Memory.write("renters", []);
			Memory.write("account", Memory.read("price")*0.75);
			Memory.write("difficulty", d);
			Memory.write("market", {
				index: 1.0,
				slope: 0.5,
				volatility: 0.2,
				frequency: 0.5,
				oscillation: 1.0,
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

			if (Memory.read("difficulty") == 3) {
				Memory.read("market").slope = 0.1;
				Memory.read("market").volatility = 0.2;
				Memory.read("market").oscillation = 1.0;
			} else if (Memory.read("difficulty") == 2) {
				Memory.read("market").slope = 0.2;
				Memory.read("market").volatility = 0.2;
				Memory.read("market").oscillation = 0.8;
			} else {
				Memory.read("market").slope = 0.3;
				Memory.read("market").volatility = 0.1;
				Memory.read("market").oscillation = 0.6;
			}

			IO.write("");
			IO.write("Please wait...", "advice");
			IO.wait(Game.settings.ready, 3000);
		}, ready: function () {
			IO.clear();
			IO.write("Hired!", "sz-48 bolder fg-green");
			IO.write("The interview went well.");
			IO.write("");
			IO.write("You will start to work for");
			IO.write("SHERLOCK HOMES, Inc.", "sz-28 bolder");
			IO.write("next week.");
			IO.write("We are now preparing your office.");
			IO.write("See you soon!");
			IO.write("");
			IO.write("Press any key to continue", "advice");
			IO.pause.set(Game.office.intro);
		}
	}, office: {
		intro: function () {
			Game.office.properties.generate();
			Memory.save();
			Game.office.main();
		}, main: function () {
			var index = (Memory.read("market").index).toFixed(2);
			var delta = (Memory.read("market").variation > 0 ? "+" : "") + (Memory.read("market").variation * 100).toFixed(1);
			var t = Memory.read("time").passed;
			var tips = [
				"Listings in the marketplace are updated every month.",
				"At the end of the year you have to pay taxes on your income.",
				"Sell when the market is up, buy when it's down.",
				"Don't have cash? Ask the bank for a loan.",
				"Investing is smart, but be aware of the risks.",
				"You can't manage efficiently more than three properties.",
				"Renting goes up only for properties not already rented.",
				"Buying or selling a property marks the end of the month.",
				"You can resume the game anytime if you need to go.",
				"Be always prepared to pay for the unexpected.",
				"Have you tried clicking on the title?",
			];
			IO.clear();
			// IO.write("Office", "sz-48 bolder");
			// IO.write("Sherlock Homes, Inc.", "sz-28 bolder");
			IO.write(Game.date());
			IO.write("<a href='javascript:Game.credits();' class='nd'>SHERLOCK HOMES, Inc.</a>", "sz-36 bolder");
			IO.write("");
			IO.write("Stock market index: " + index + " (" + delta + "%)", delta < 0 ? "fg-red" : "fg-green");
			IO.write("");
			IO.write("Checking Account");
			IO.write(Game.pricetag(Memory.read("account")), "sz-28");
			IO.write("");
			IO.write("PROPERTIES (1)");
			IO.write("MARKETPLACE (2)");
			IO.write("BANK (3)");
			IO.write("");
			IO.write("NEXT MONTH (0)");
			IO.write("");
			if (t == 24) {
				IO.write("It seems like you are enjoying the game.", "sz-16 fg-orange");
				IO.write("Please consider buying me <a href='https://paypal.me/LucaDiazzi'>a cup of coffee.</a> Thanks!", "sz-16 fg-orange");
			} else
				IO.write(tips[Math.floor(Math.random()*tips.length)], "sz-16 fg-gray-60");
			IO.options.set([
				Game.office.properties.main,
				Game.office.properties.buy,
				Game.office.bank.main
			],  t == 0 ? Game.office.first : Game.office.forward);
		}, first: function () {IO.clear();
			IO.write("Hey!", "sz-48 bolder");
			IO.write("If you want to be a real estate agent");
			IO.write("you have to buy at least a property!");
			IO.write("");
			IO.write("Press any key to go back", "advice");
			IO.pause.set(Game.office.main);
		}, forward: function () {
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

			m.index = (1 - m.oscillation) + Math.random() * m.oscillation;
			m.index *= m.volatility * Math.sin(m.frequency * t.passed);
			m.index += 1;
			m.index *= 1 + m.slope * t.passed / 12;
			
			m.variation = m.index/i - 1;

			for (var i in Memory.read("properties")) {
				Memory.read("properties")[i].price *= 1 + m.variation;
				Memory.read("properties")[i].price = 1000 * Math.round(Memory.read("properties")[i].price / 1000);
			}

			for (var i in Memory.read("marketplace")) {
				Memory.read("marketplace")[i].price *= 1 + m.variation;
				Memory.read("marketplace")[i].price = 1000 * Math.round(Memory.read("marketplace")[i].price / 1000);
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
						name: "Backyard Treehouse",
						price: 0.08,
						rent: 0.025,
						unlock: 1.0
					}, {
						name: "Seaside Lighthouse",
						price: 0.25,
						rent: 0.025,
						unlock: 2.00
					}, {
						name: "Tiny Home",
						price: 0.45,
						rent: 0.015,
						unlock: 0
					}, {
						name: "Downtown Apartment",
						price: 0.60,
						rent: 0.015,
						unlock: 0.00
					}, {
						name: "Modest House",
						price: 1.10,
						rent: 0.015,
						unlock: 2.00,
						unlock: 0.00
					}, {
						name: "Typical Trullo",
						price: 1.40,
						rent: 0.015,
						unlock: 2.00
					}, {
						name: "Mountain Chalet",
						price: 1.90,
						rent: 0.015,
						unlock: 1.00
					}, {
						name: "Offices Complex",
						price: 2.75,
						rent: 0.015,
						unlock: 0.00
					}, {
						name: "City Centre Attic",
						price: 4.50,
						rent: 0.015,
						unlock: 0.00
					}, {
						name: "Lakeside Hotel",
						price: 15,
						rent: 0.025,
						unlock: 5.00
					}, {
						name: "Historic Palace",
						price: 25,
						rent: 0.025,
						unlock: 10.00
					}, {
						name: "Luxury Mansion",
						price: 65,
						rent: 0.025,
						unlock: 20.00
					}, {
						name: "Countryside Castle",
						price: 250,
						rent: 0.025,
						unlock: 20.00
					}, {
						name: "Island Resort",
						price: 1200,
						rent: 0.025,
						unlock: 50.00
					}, {
						name: "National Parliament",
						price: 5000,
						rent: 0.030,
						unlock: 500.00
					}
				];

				var j = Memory.read("accounting").total.income;
				var a = Memory.read("account");

				for (var i = p.length - 1; i >= 0; i--) {
					// Da sistemare
					if (p[i].unlock * Memory.read("price") > j) {
						p.splice(i, 1);
					} else if (p[i].price * Memory.read("market").index * Memory.read("price") > 100 * a) {
						p.splice(i, 1);
					} else {
						p[i].price = 1000 * Math.round(p[i].price * Memory.read("market").index * Memory.read("price") / 1000);
						p[i].rent = 100 * Math.round(p[i].rent * p[i].price / 100);
					}
				}

				while (p.length > 3) {
					if (j == 0)
						var i = Math.floor(1 + Math.random() * (p.length - 1));
					else
						var i = Math.floor(Math.random() * p.length);
					p.splice(i, 1);
				}

				Memory.write("marketplace", p);
			}, main: function () {
				var choices = [];
				var k = 0;
				var t = Memory.read("time").passed;
				IO.clear();
				IO.write("Properties", "sz-48 bolder");
				if (Memory.read("properties").length == 0) {
					IO.write("You have no properties" + (t == 0 ? " yet" : "") + ".");
					IO.write("Visit the marketplace to find one!");
					IO.write("");
				} else {
					var p = Memory.read("properties");
					for (var i in p) {
						IO.write(p[i].name, "sz-28");
						IO.write(Game.pricetag(p[i].price));
						IO.write("VIEW (" + (k + 1) +")");
						choices.push(Game.office.properties.yoursDetail);
						IO.write(" ");
						k = k + 1;
					}
				}
				
				IO.write("MARKETPLACE (" + (k + 1) + ")");
				choices.push(Game.office.properties.buy);
				IO.write("BACK (0)");
				IO.options.set(choices, Game.office.main);
			}, yoursDetail: function (n) {
				var p = Memory.read("properties")[n - 1];
				var i = 100*(p.price/p.boughtFor - 1);
				Memory.write("properties_last", n - 1);
				IO.clear();
				IO.write(p.name, "sz-48 bolder");
				IO.write("Value");
				IO.write(Game.pricetag(p.price), "sz-28");
				IO.write((i >= 0 ? "+" : "") + i.toFixed(1) + "%", i < 0 ? "fg-red" : "fg-green");
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
				], Game.office.properties.main);
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
				Memory.read("accounting").month.income += m.price - m.boughtFor;
				Memory.read("accounting").year.income += m.price - m.boughtFor;
				Memory.read("accounting").total.income += m.price - m.boughtFor;
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
				IO.pause.set(Game.office.forward);
			}, buy: function (){
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
				], Game.office.main);
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
				var n = Memory.read("properties").length;
				var p = m.price;
				var a = Memory.read("account");
				if (p < a && n < 3)
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
				IO.pause.set(Game.office.forward);
			}, buyFail: function () {
				var l = Memory.read("marketplace_last");
				var m = Memory.read("marketplace")[l];
				var n = Memory.read("properties").length;
				var p = m.price;
				var a = Memory.read("account");
				IO.clear();
				IO.write("Sorry but...", "sz-48 bolder fg-red");
				IO.write("");

				if (p > a) {
					IO.write("You can't afford the following property:");
					IO.write(m.name, "sz-28");
					IO.write("");
					IO.write("with a price tag of");
					IO.write(Game.pricetag(m.price), "sz-28");
					IO.write("");
					IO.write("Please check your Bank Account!");
				} else if (n >= 3) {
					IO.write("You can't buy the following property:");
					IO.write(m.name, "sz-28");
					IO.write("");
					IO.write("as you already manage the maximum of 3 properties.");
					IO.write("Sell one and retry!");
				}
				
				IO.write("");
				IO.write("Press any key to get back to the office", "advice");
				IO.pause.set(Game.office.main);
			}
		}, bank: {
			main: function () {
				var l = Memory.read("accounting").month.last;
				IO.clear();
				IO.write("Bank", "sz-48 bolder");
				IO.write("Balance");
				IO.write(Game.pricetag(Memory.read("account")), "sz-28");
				IO.write("");
				IO.write("Last month");
				IO.write(Game.pricetag(l), "sz-28" + (l < 0 ? " fg-red" : " "));
				IO.write("");
				IO.write("INVEST (1)");
				IO.write("LOAN (2)");
				IO.write("BACK (0)");
				IO.options.set([
					Game.office.bank.invest,
					Game.office.bank.loan,
				], Game.office.main);
			}, invest: function () {
				IO.clear();
				IO.write("Bank", "sz-48 bolder");
				IO.write("Investments");
				IO.write(Game.pricetag(0), "sz-28");
				IO.write("0.0%");
				IO.write("");
				IO.write("Sorry!", "sz-24 fg-red");
				IO.write("This feature is work in progress", "fg-red");
				IO.write("");
				IO.write("Press any key to go back", "advice");
				IO.pause.set(Game.office.bank.main);
			}, loan: function () {
				IO.clear();
				IO.write("Bank", "sz-48 bolder");
				IO.write("Loan request");
				IO.write(Game.pricetag(200000), "sz-28");
				IO.write("0.0%");
				IO.write("");
				IO.write("Sorry!", "sz-24 fg-red");
				IO.write("This feature is work in progress", "fg-red");
				IO.write("");
				IO.write("Press any key to go back", "advice");
				IO.pause.set(Game.office.bank.main);
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
		IO.options.reset();
		IO.clear()
		IO.write("SHERLOCK HOMES, Inc.", "sz-48 bolder");
		IO.write("A game by LUCA DIAZZI");
		IO.write("&copy; 2020");
		IO.write("");
		IO.write("Version " + Game.Version);
		IO.write("");
		IO.write("It seems like you are enjoying the game.", "sz-16 fg-orange");
		IO.write("Please consider buying me <a href='https://paypal.me/LucaDiazzi'>a cup of coffee.</a> Thanks!", "sz-16 fg-orange");
		IO.write("");
		IO.write("Press any key to go back", "advice");
		IO.pause.set(Game.office.main);
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