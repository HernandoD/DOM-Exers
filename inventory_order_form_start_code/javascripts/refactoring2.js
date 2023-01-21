document.addEventListener('DOMContentLoaded', () => {


  let inventory = (() => {
    return {
      lastID: 0,
      collection: [],
      setDate() {
        let date = new Date();
        document.querySelector('#order_date').textContent = date.toUTCString();
      },
      cacheTemplate() {
        this.template = Handlebars.compile(document.querySelector('#inventory_item').innerHTML);
        document.querySelector('#inventory_item').remove();
      },

      add() {
        this.lastID += 1;

        let item = {
          id: this.lastID,
          name: '',
          stock_number: '',
          quantity: 1,
        }

        this.collection.push(item);

        return item;
      },

      newItem(e) {
        e.preventDefault();

        let item = this.add();

        document.querySelector('#inventory>tbody').insertAdjacentHTML('beforeend',this.template(item))
      },

      deleteItem(e) {
        e.preventDefault();
        let target = e.target

        if (target.classList.contains('delete')) {
          let item = this.findParent(e);
          this.remove(this.findID(item));
          item.remove();
        }
      },

      remove(id) {
        this.collection = this.collection.filter(item => item.id !== id)
      },

      findID(item) {
        return +document.querySelector("input[type='hidden']").value
      },

      findParent(e) {
        return e.target.closest('tr');
      },

      get(id) {
        let foundItem;

        this.collection.forEach(item => {
          if (item.id === id) {
            foundItem = item;
          }
        })

        return foundItem;
      },

      updateItem(e) {
        let target = e.target;

        if (target.tagName === 'INPUT') {
          let item = this.findParent(e);

          this.update(item);
        }
      },

      update(item) {
        let id = this.findID(item);
            item = this.get(id);

            item.name = document.querySelector("[name^=item_name]").value;
            item.stock_number = document.querySelector("[name^=item_stock_number]").value;
            item.quantity = document.querySelector("[name^=item_quantity]").value;
      },

      bindEvents() {
        document.querySelector('#add_item').addEventListener('click', this.newItem.bind(this));
        document.querySelector('#inventory').addEventListener('click', this.deleteItem.bind(this));
        document.querySelector('#inventory').addEventListener('focusout', this.updateItem.bind(this));
      },

      init() {
        this.setDate()
        this.cacheTemplate()
        this.bindEvents()
      }
    }
  })();

  inventory.init()
})