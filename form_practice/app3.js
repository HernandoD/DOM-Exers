const errorMessages = {
  'first_name': 'First Name is required field.',
  'last_name': 'Last Name is a required field.',
  'email': 'Email is a required field.',
  'invalid-email': 'Please enter a valid email.',
  'password': 'Password is a required field.',
  'invalid-password': 'Password must be at least 10 characters long.',
}

class Form {
  constructor() {
    this.form = document.querySelector('form');
    this.serialBox = document.querySelector('.serialized');
    this.bind()
  }

  handleFocusOut(e) {
    let target = e.target;

    if (target.tagName === 'INPUT' && target.id.indexOf('cd') === -1) {
      this.validateInput(target)
    }

    if (target.tagName === 'INPUT' && target.id.indexOf('cd') !== -1) {
      this.validateInput(target)
    }
  }

  handleFocusIn(e) {
    let target = e.target;

    if (target.tagName === 'INPUT' && target.id.indexOf('cd') === -1) {
      this.removeInputInvalid(target)
    }

    if (target.tagName === 'INPUT' && target.id.indexOf('cd') !== -1) {
      this.removeInputInvalid(target)
    }
  }

  removeInputInvalid(input) {
    let span = input.nextElementSibling;

    if (span && !this.isCreditCard(input)) { span.textContent = '' };
    input.classList.remove('invalid_field')
  }

  validateInput(input) {
    if (!input.checkValidity() && !this.isCreditCard(input)) {
      let span = input.nextElementSibling;
      let id = input.id;
      let error = errorMessages[id]; 

      if (input.id === 'email' && input.value.length > 0) { error = errorMessages['invalid-email'] }
      if (input.id === 'password' && input.value.length > 0) { error = errorMessages['invalid-password']}
      input.classList.add('invalid_field');
      span.textContent = error;

    }

    if (this.isCreditCard(input) && !input.checkValidity()) {
      input.classList.add('invalid_field');
    }

  }

  areInvalidNamesKeys(target, key) {
    return target.tagName === 'INPUT' && !/[a-zA-Z'\s]/g.test(key) 
                                      && (target.id === 'first_name' || target.id === 'last_name')
  }

  areInvalidPhoneKeys(target, key) {
    return target.tagName === 'INPUT' && target.id === 'phone' && (!/\d+/g.test(key)) && key !== '-'
  }

  areInvalidCreditDigits(target, key) {
    return this.isCreditCard(target) && (!/\d+/g.test(key)) && (key !== 'Backspace')
  }

  handleKeypressInput(e) {
    let target = e.target;
    let key = e.key;

    if (this.areInvalidNamesKeys(target, key)) { 
      e.preventDefault();
    }

    if (this.areInvalidPhoneKeys(target, key)){
      e.preventDefault()
    }
  }

  handleCreditCardInput(e) {
    let target = e.target;
    let key = String.fromCharCode(e.which);
    
    if (this.areInvalidCreditDigits(target, key) && e.key !== 'Backspace') {
      e.preventDefault()
    }

    if (e.key === 'Tab' && this.isCreditCard(target)) {
      this.skipToNextInput(target)
    }
  }

  getCDInput(id) {
    return this.form.querySelector(id)
  }

  skipToNextInput(target) {
    let id = target.id;

    if (['cd1', 'cd2', 'cd3'].includes(id)) {
       if (id === 'cd1') { this.getCDInput('#cd2').focus() };
       if (id === 'cd2') { this.getCDInput('#cd3').focus() };
       if (id === 'cd3') { this.getCDInput('#cd4').focus() };
    }
  }

  isCreditCard(target) {
    return target.tagName === 'INPUT' && target.getAttribute('name') === 'credit_card'
  }

  handleCreditCardChange(e) {
    let target = e.target;

    if (target.tagName === 'INPUT' && this.isCreditCard(target)) {
      let value = target.value;

      if (value.length === 4) {
        this.skipToNextInput(target)
      }
    }
  }

  handleSubmitClick(e) {
    e.preventDefault();
    let target = e.target;

    if (target.tagName === 'BUTTON' && target.getAttribute('type') === 'submit') {
      let data = new FormData(this.form)
      let nonCCString = new URLSearchParams(data).toString();
      nonCCString = nonCCString.slice(0, nonCCString.indexOf('credit_card'))
      nonCCString += 'credit_card=';
      let ccNumbers = this.getCCNumbers();
      let urlEncodedString = nonCCString + ccNumbers;
      this.serialBox.insertAdjacentText('beforeend', urlEncodedString)
    }
  }

  getCCNumbers() {
    let num = '';
    [...this.form.querySelectorAll("input[name='credit_card']")].forEach(input => {
      num += input.value;
    })

    return num
  }

  bind() {
    this.form.addEventListener('focusout', this.handleFocusOut.bind(this));
    this.form.addEventListener('focusin', this.handleFocusIn.bind(this));
    this.form.addEventListener('keypress', this.handleKeypressInput.bind(this));
    this.form.addEventListener('keydown', this.handleCreditCardInput.bind(this));
    this.form.addEventListener('input', this.handleCreditCardChange.bind(this));
    this.form.addEventListener('click', this.handleSubmitClick.bind(this))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Form();
})