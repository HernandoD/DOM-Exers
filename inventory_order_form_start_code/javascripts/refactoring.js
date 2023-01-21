document.addEventListener('DOMContentLoaded', () => {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      let orderDate = document.querySelector('#order_date');
      orderDate.textContent = date.toUTCString()
    },

    cacheTemplate: function() {
      let iTmpl = Handlebars.compile(document.querySelector('#inventory_item').innerHTML);
      this.template = iTmpl;
    },
    add: function() {
      this.lastId++;
      var item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item);

      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      var found_item;

      this.collection.forEach(function(item) {
        if (String(item.id) === String(id)) {
          found_item = item;
          return false;
        }
      });

      return found_item;
    },
    update: function(tr) {
      var id = this.findID(tr);
          item = this.get(id);

      item.name = tr.querySelector("[name^=item_name]").value;
      item.stock_number = tr.querySelector("[name^=item_stock_number]").value;
      item.quantity = tr.querySelector("[name^=item_quantity]").value;
    },
    newItem: function(e) {
      e.preventDefault();
      var item = this.add();

      let table = document.querySelector('#inventory>tbody');

      table.insertAdjacentHTML('beforeend', this.template(item)) 
    },
    findParent: function(e) {
      return e.target.closest("tr");
    },
    findID: function(item) {
      return item.querySelector("input[type=hidden]").value;
    },
    deleteItem: function(e) {
      e.preventDefault();
      let item = this.findParent(e);
      this.remove(this.findID(item));
      item.remove()
    },
    updateItem: function(e) {
      var item = this.findParent(e);

      this.update(item);
    },
    bindEvents: function() {
      document.querySelector('#add_item').addEventListener('click', this.newItem.bind(this));
      document.querySelector('#inventory').addEventListener('click', e => {
        if (e.target.tagName === 'A' && e.target.className === 'delete') {
          this.deleteItem.bind(this)(e);
        }
      });
      document.querySelector('#inventory').addEventListener('focusout', e => {
        if (e.target.tagName === 'INPUT') {
          this.updateItem.bind(this)(e)
        }
      })
    },
    init: function() {
      this.setDate(); 
      this.cacheTemplate();
      this.bindEvents();
    },
  }

  inventory.init();
})