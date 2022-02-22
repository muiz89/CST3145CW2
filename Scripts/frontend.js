
// Created RegEx for name to be at least one character long
var nameRegExp = new RegExp("^[A-Za-z]{1,}$");
// Created RegEx for the phone number to start with '07' and have 9 other digits
var phoneRegExp = new RegExp("^07[0-9]{9,9}$");

var webstore = new Vue({
    el: '#app',
    data: {
        showProduct: true,
        sitename: 'Extra Curricular',
        cartButton: '<i class="fas fa-shopping-cart"></i> Checkout',
        // Using two way binding it changes these empty fields depending on what the user inputs
        searchTerm: '',
        sortStyle: '',
        // Array for cart for items to get added
        cart: [],
        order: {
            firstName: '',
            lastName: '',
            phoneNo: ''
        },
        lessonButton: "<i class='fas fa-plus'></i> Add to cart",
        // Uses products from external file
        products: {},
        inCartButton: "Remove"
    },
    methods: {
        // Adds the product id to cart and decreases a space by 1
        addToCart: function (product) {
            this.cart.push(product.id);
            product.spaces--;
        },
        // Checks if there is still available product left
        canAdd: function (product) {
            return product.spaces > 0;
        },
        // Depending on the boolean value shows the product or checkout page
        showCheckout() {
            this.showProduct = this.showProduct ? false : true;
        },
        // Counts how many times an item is in the cart
        counter(id) {
            let counter = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    counter++;
                }
            }
            if (counter > 0) {
                return counter;
            }
        },
        // If the product is in the cart at least once it will display it on the checkout page
        showInCart(product, id) {
            let counter = this.counter(id);
            if (counter > 0) {
                return product.name;
            }
        },
        // When the button is clicked sends out an alert and refreshes the page
        placeOrder() {
            alert('Order Placed!');
            location.reload();
        },
        // Removes the product id from the array and increases the space of the product if it exists in the array in the first place
        removeFromCart(product) {
            const index = this.cart.indexOf(product.id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
            product.spaces++;
        }
    },
    computed: {
        // Checks how many items in cart
        cartCount: function () {
            return this.cart.length || '';
        },
        cartLenth: function () {
            return cartCount > 0;
        },
        // Checks if any fields are empty or fail the RegEx
        emptyFields() {
            return (!nameRegExp.test(this.order.firstName) || !nameRegExp.test(this.order.firstName) || !phoneRegExp.test(this.order.phoneNo))
        },
        // Sorts products by price low to high
        sortedProducts() {
            function compare(a,b) {
                if (a.price > b.price) return 1;
                if (a.price < b.price) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        // Sorts products by price high to low
        sortedProductsHigh() {
            function compare(a,b) {
                if (a.price < b.price) return 1;
                if (a.price > b.price) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        // Sorts products alphabetically from A to Z
        alphabetProducts() {
            function compare(a,b) {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        // Sorts products from Z to A
        alphabetProductsZ() {
            function compare(a,b) {
                if (a.name < b.name) return 1;
                if (a.name > b.name) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        // Uses a lambda function to check whether the search term inputted is included in
        // The product name, location, price or spaces.  It is not case sensitive
        searchField() {
        
            return this.products.filter(product => {
                return (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                        product.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                        // For the data saved as integers, they get cast to String which lets it match any typed numbers 
                        product.price.toString().includes(this.searchTerm.toLowerCase()) ||
                        product.spaces.toString().includes(this.searchTerm.toLowerCase()))
            })
        }
    },
    created:
    function() {
        fetch('https://cst3145-lukas.herokuapp.com/collection/products').then(
            function(response) {
                response.json().then(
                    function(json) {
                        webstore.products = json;
                    }
                )
            }
        )
    }
});
