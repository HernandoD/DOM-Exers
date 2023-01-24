document.addEventListener('DOMContentLoaded', () => {
  let formInputs = document.querySelectorAll('dd>input');
  let serializedDiv = document.querySelector('.serialized');
  let form = document.querySelector('form');

  const errors = {
    'first_name': 'First name is a required field.',
    'last_name': 'Last name is a required field.',
    'email': 'Email is a required field.',
    'password': 'Password is a required field.',
    'phone': 'Please enter a valid phone number.'
  }

  let ValidateForm = {
    invalidBox() {
      this.input.classList.add('invalid_field');
    },

    invalidSpan() {
      this.span.textContent = errors[this.input.id];
      this.span.classList.add('error_message')
    },

    isInvalid(input) {
      return !input.checkValidity();
    },

    processFocusOut(e) {
      this.input = e.target;
      this.span = this.input.nextElementSibling
      let nameAtt = this.input.getAttribute('name')

      if ((nameAtt) !== 'credit_card' && this.isInvalid(this.input)) {
        this.invalidBox();
        this.invalidSpan();
      } else if (nameAtt === 'credit_card') {
        if (this.input.value.length > 0 && this.input.value.length < 3) {
          this.invalidBox()
        }
      }
    },

    resetInvalidBox() {
      this.input.classList.remove('invalid_field');
    },

    resetInvalidSpan() {
      this.span.textContent = ''
      this.span.classList.remove('error_message')
    },

    processInFocus(e) {
      this.input = e.target;
      this.span = this.input.nextElementSibling
      let nameAtt = this.input.getAttribute('name')
      
      if (nameAtt !== 'credit_card' && this.input.classList.contains('invalid_field')) {
        this.resetInvalidBox();
        this.resetInvalidSpan()
      } else if (nameAtt === 'credit_card') {
        this.resetInvalidBox()
      }
    },

    handleNameFields(e) {
      let key = e.key;
      let regex =  new RegExp("[a-zA-Z'\s]", 'g');

      if (!regex.test(key)) {
        e.preventDefault()
      }
    },

    isNonNumeric(key) {
      let regex = new RegExp('[0-9]', 'g')

      return !regex.test(key)
    },

    handleCCFields(e) {
      if (this.isNonNumeric(e.key) && e.key !== 'Backspace') { 
        e.preventDefault();
      } else {
        this.handleForwarding(e)
      }
    },

    handleForwarding(e) {
      let key = e.key;
      this.input = e.target;

      let nextInput = this.getNextInput(this.input);

      if (this.input.value.length === 3) {
        if (nextInput) {
          nextInput.focus()
        } 
      }
    },

    getNextInput(inp) {
      let allInputs = document.querySelectorAll("input[name='credit_card']");

      let nextInp = undefined;

      allInputs.forEach((input, ind, arr) => {
        if (input.id === inp.id && ind !== arr.length - 1) {
          nextInp = arr[ind + 1];
        }
      })

      return nextInp;
    },

    processKeys(e) {
      this.id = e.target.id;

      if (this.id === 'first_name' || this.id === 'last_name') {
        this.handleNameFields(e)
      } else if (this.id.indexOf('cd') !== -1) {
        this.handleCCFields(e)
      }
    },

    processForm(e) {
      e.preventDefault()

      let data = new FormData(form);
      data = new URLSearchParams(data)
      let str = data.toString();

      let ind = str.indexOf('&credit_card=');
      let creditCardNumber = this.getCCNumber()
      str = str.slice(0, ind) + '&credit_card=' + creditCardNumber

      serializedDiv.append(str)
    },

    getCCNumber() {
      let number = '';

      [...document.querySelectorAll("input[name='credit_card']")].forEach(cc => {
        number += cc.value
      })

      return number;
    },
     
    bindEvents() {
      [...formInputs].forEach(inp => {
        inp.addEventListener('focusout', this.processFocusOut.bind(this));
        inp.addEventListener('focusin', this.processInFocus.bind(this));
        inp.addEventListener('keypress', this.processKeys.bind(this));
      })

      form.addEventListener('submit', this.processForm.bind(this))
    },

    init() {
      this.bindEvents()
    }
  }

  ValidateForm.init()
})