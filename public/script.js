/* eslint-disable indent */
var LOAD_ITEM = 4;
var watcher;

new Vue({
	el: "#app",
	data: {
		search: "cat",
		lastSearch: "",
		loading: false,
		total: 0,
		cart: [],
		products: [],
		results: []
	},
	methods: {
		addToCart: function(product) {
			this.total += product.price;
			console.log("total is: " + this.total);

			var hasBeenAdded = false;
			for (var i = 0; i < this.cart.length; i++) {
				if (this.cart[i].id === product.id) {
					this.cart[i].qty++;
					hasBeenAdded = true;
				}
			}
			if (!hasBeenAdded) {
				this.cart.push({
					id: product.id,
					title: product.title,
					price: product.price,
					qty: 1
				});
			}
		},
		increment: function(item) {
			item.qty++;
			this.total += item.price;
		},
		decrement: function(item) {
			item.qty--;
			this.total -= item.price;
			if (item.qty <= 0) {
				var i = this.cart.indexOf(item);
				this.cart.splice(i, 1);
			}
		},
		onSubmit: function() {
			this.products = [];
			this.results = [];
			this.loading = true;
			var path = "/search?q=".concat(this.search);
			this.$http.get(path).then(function(response) {
				this.results = response.body;
				this.lastSearch = this.search;
				this.afterUpdated();
				this.loading = false;
			});
		},
		afterUpdated: function() {
			if (this.products.length < this.results.length) {
				var tempProducts = this.results.slice(
					this.products.length,
					LOAD_ITEM + this.products.length
					);
					this.products = this.products.concat(tempProducts);
			}
			console.log("after updated" + tempProducts);
		}
	},
	filters: {
		currency: function(price) {
			return "£".concat(price.toFixed(2));
		}
	},
	created: function() {
		console.log("oncreated");
		this.onSubmit();
	},
	updated: function() {
		console.log("on update");
		var sensor = document.querySelector("#product-list-bottom");
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.afterUpdated);
	},
	beforeUpdate: function() {
		console.log("on beforeUpdate");
		if (watcher != null) {
			watcher.destroy;
			watcher == null;
			console.log("watcher destroyed");
		}
	}
});
