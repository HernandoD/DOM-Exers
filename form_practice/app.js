document.addEventListener('DOMContentLoaded', () => {
  let inputs = [...document.querySelector('form').querySelectorAll('input')].filter(inp => inp.id !== 'phone' && inp.getAttribute('name') !== 'credit_card');
  let creditCards = [...document.querySelectorAll("input[name='credit_card']")];
  let target;
  let inputBox;
  let span;
  let cdInd;

  function createErrorFields(msg) {
    inputBox.classList.add('invalid_field');
    span.textContent =  msg;
    span.classList.add('error_message')    
  }

  function validateName(type) {
    if (!inputBox.checkValidity()) {
       createErrorFields(`${type} name is a required field.`)
    } 
  }

  function validateEmail() {
    if (!inputBox.checkValidity()) {
      createErrorFields('Please enter a valid email.')
    }
  }

  function validatePassword() {
    if (!inputBox.checkValidity()) {
      createErrorFields('Password field is required.')
    }
  }

  document.addEventListener('focusout', e => {
     target = e.target;

     if (target.tagName === 'INPUT') {
       let value = target.value;
       inputBox = target;
       span = inputBox.nextElementSibling;
       
       switch (target.id) {
        case 'first_name':
          validateName('First');
          break;
        case 'last_name':
          validateName('Last');
          break;
        case 'email': 
          validateEmail(value);
          break;
        case 'password':
          validatePassword(value);
          break;
       }
     }
  })

  function handleFocus(e) {
    target = e.target;

    if (target.tagName === 'INPUT') {
      inputBox = target;
      span = inputBox.nextElementSibling;

      if (span.className === 'error_message') {
        inputBox.classList.remove('invalid_field');
        span.textContent = ''
      }

      if (!checkAnyInvalid()) {
        document.querySelector('.form_errors').textContent = ''
      }
    }
  }

  function checkAnyInvalid() {
    return !inputs.every(inp => inp.checkValidity())
  }

  function checkAllInvalid() {
    return inputs.every(inp => !inp.checkValidity())
  }

  function markAllInputsInvalid() {
    inputs.forEach(inp => {
      let span = inp.nextElementSibling
      inp.classList.add('invalid_field');
      let word = getMsgWord(inp);
      span.textContent = `${word} is a required field.`
      span.classList.add('error_message') 
    })
  }

  function getMsgWord(input) {
    let id = input.id
    let Words = {
      'first_name': 'First Name',
      'last_name': 'Last Name',
      'email': 'Email',
      'password': 'Password'
    }
    
    return Words[id]
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (checkAllInvalid()) {
      markAllInputsInvalid()      
    } else if (checkAnyInvalid()) {
      markAnyInvalid()
      document.querySelector('.form_errors').textContent = 'Form cannot be submitted until errors are corrected.'
    } else {
      processForm(e)
    }
  }

  function markAnyInvalid() {
    inputs.forEach(inp => {
      if (!inp.checkValidity()) {
        inp.classList.add('invalid_field');
        let span = inp.nextElementSibling
        let msgWord = getMsgWord(inp);
        span.textContent = `${msgWord} is a required field`
      }
    })
  }

  function onlyNumeric(key) {
    return !key.match(/[0-9]/)
  }

  function handleKeys(e) {
    let key = e.key;

    if ((e.target.id === 'first_name' || e.target.id === 'last_name') && !key.match(/[a-zA-Z\s']/)) {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1)
      e.preventDefault();
    } else if (e.target.getAttribute('name') === 'credit_card' && (onlyNumeric(key) && key !== 'Backspace')) {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1)
      e.preventDefault()
    } else if (e.target.getAttribute('name') === 'credit_card') {
      handleDigits(e.target, key)
    }
  }

  function getInputIndex(input) {
    let ind;
    creditCards.forEach((inp, index) => {
      if (inp.id === input.id) {ind = index}
    })

    return ind;
  }

  function getNextInput(input) {
    let index = getInputIndex(input);

    if (index < 3) {
      return index + 1;
    } else {
      return null;
    }
  }
  
  function handleDigits(input, key) {
    let nextInputIndex = getNextInput(input);

    if (input.value.length === 4) {
      if (nextInputIndex) {
        input.classList.remove('invalid_field')
        creditCards[nextInputIndex].focus()
      }
    } else if (input.value.length !== 4) {
      input.classList.add('invalid_field')
    }
  }

  function getCreditCardNumber() {
    let number = ''
    creditCards.forEach(inp => number += inp.value);
    return number;
  }

  function processForm(e) {
    let content = document.querySelector('#block_content')
    let creditCardNumber = getCreditCardNumber();

    e.preventDefault();
    let form = e.target.closest('form');
    let data = new FormData(form);
    data = new URLSearchParams(data);
    let ccInd = data.toString().indexOf('&credit_card=');
    data = data.toString().slice(0, ccInd);
    let ccString = '&credit_card=' + creditCardNumber;
    data = data + ccString;
    content.append(data)
  }

  document.addEventListener('focusin', handleFocus);
  document.querySelector("button[type='submit']").addEventListener('click', handleSubmit);
  document.addEventListener('keyup', handleKeys);
  
})