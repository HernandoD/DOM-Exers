class GroceryList {
  constructor() {
    this.form = document.querySelector('form');
    this.list = document.querySelector('#grocery-list');
    this.itemTemplate = Handlebars.compile(document.querySelector('#item').innerHTML);
    this.bind()
  }

  handleSubmit(e) {
    e.preventDefault()
    let target = e.target;

    if (target.tagName === 'INPUT' && target.getAttribute('type') === 'submit') {
      if (document.querySelector('#name').value.length === 0) { return };
      let item = this.collectInputs();
      this.list.insertAdjacentHTML('beforeend', this.itemTemplate(item))
      this.form.reset()
    }
  }

  collectInputs() {
    let item = {};

    [...this.form.querySelectorAll('input')].forEach(inp => {
      if (inp.id === 'name') {
        item.name = inp.value
      }

      if (inp.id === 'quantity') {
        if (inp.value.length === 0) {
          item.quantity = 1;
        } else {
          item.quantity = inp.value;
        }
      }
    })

    return item;
  }

  bind() {
    this.form.addEventListener('click', this.handleSubmit.bind(this));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GroceryList()
})