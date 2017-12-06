new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    search: 'anime',
    searched: '',
    hidden: true
  },
  methods: {
    onSubmit() {
      this.items = [];
      this.hidden = true;

      this.$http.get(`/search/${this.search}`)
        .then(res => { 
          console.log('received');
          this.items = res.data;

          this.searched = this.search;
          this.hidden = false;
        });
    },
    addItem(newItem) {
      this.total += newItem.price;

      let item = this.cart.find(item => item.id === newItem.id);

      if(item) {
        item.qty++;

        return;
      }

      let cartItem = Object.assign({}, newItem, { qty: 1 });

      this.cart.push(cartItem);
    },
    removeItem(cartItem, index) {
      this.total -= cartItem.price;

      if(--cartItem.qty <= 0) {
        this.cart.splice(index, 1);
      }
    }
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  },
  mounted: function() {
    this.onSubmit();
  }
})