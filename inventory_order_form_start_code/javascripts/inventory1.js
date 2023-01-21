let inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],

    setDate() {
      let date = new Date();
      document.querySelector('#order_date').textContent = date.toUTCString();
    },

    cacheTemplate() {
      this.template = Handlebars.compile(document.querySelector('#inventory_item').innerHTML);
      document.querySelector('#inventory_item').remove();
      console.log(this.template)
    },

    add() {
      this.lastId += 1;

      let item = {
        id: this.lastId,
        name: '',
        stock_number: '',
        quantity: 1,
      }; 

      this.collection.push(item);
      return item;
    },

    newItem(e) {
      e.preventDefault();
      let item = this.add();
      document.querySelector('#inventory>tbody').insertAdjacentHTML('beforeend', this.template(item))

    },

    findParent(target) {
      console.log(target)
      return target.closest('tr');
    },

    findID(item) {
      return item.querySelector("input[type='hidden']").value;
    },

    deleteItem(e) {
      e.preventDefault();

      let item = this.findParent(e.target);
      this.remove(this.findID(item));
      item.remove()
    },

    remove(id) {
      return this.collection.filter(item => item.id !== id)
    },

    get(id) {
      let foundItem;

      this.collection.forEach(item => {
        if (item.id === Number(id)) {
          foundItem = item;
        }
      })

      return foundItem;
    },

    update(item) {
      let id = this.findID(item);

      foundItem = this.get(id);

      foundItem.name = item.querySelector("input[name^item_name]").value;
      foundItem.stock_number = item.querySelector("input[name^item_stock_number").value;
      foundItem.quantity = item.querySelector("input[name^item_quantity]").value;
    },

    updateItem(e) {
      let item = this.findParent(e.target);

      this.update(item)
    },

    bindEvents() {
      document.querySelector('#add_item').addEventListener('click', this.newItem.bind(this));
      document.querySelector('#inventory').addEventListener('click', e => {
        if (e.target.className === 'delete') {
          this.deleteItem(e)
        }
      });
      document.querySelector('#inventory').addEventListener('blur', e => {
        if (e.target.tagName === 'INPUT') {
          this.updateItem.bind(this)(e)
        }
      }, true)
    },

    init() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents()
    }
  }
})()

document.addEventListener('DOMContentLoaded', () => {
  inventory.init.bind(inventory)()
})