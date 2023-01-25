document.addEventListener('DOMContentLoaded', () => {
  let questionTemplate = Handlebars.compile(document.querySelector('#question_template').innerHTML);
  let fieldSet = document.querySelector('form>fieldset');
  let submitBtn = document.querySelector('.submit');
  let resetBtn = document.querySelector('.reset_form');

  const questions = [
  {
    id: 1,
    description: "Who is the author of <cite>The Hitchhiker's Guide to the Galaxy</cite>?",
    options: ['Dan Simmons', 'Douglas Adams', 'Stephen Fry', 'Robert A. Heinlein'],
  },
  {
    id: 2,
    description: 'Which of the following numbers is the answer to Life, the \
                  Universe and Everything?',
    options: ['66', '13', '111', '42'],
  },
  {
    id: 3,
    description: 'What is Pan Galactic Gargle Blaster?',
    options: ['A drink', 'A machine', 'A creature', 'None of the above'],
  },
  {
    id: 4,
    description: 'Which star system does Ford Prefect belong to?',
    options: ['Aldebaran', 'Algol', 'Betelgeuse', 'Alpha Centauri'],
  },
];

  const answerKey = { '1': 'Douglas Adams', '2': '42', '3': 'A drink', '4': 'Betelgeuse' };
  
  fieldSet.innerHTML = questionTemplate({questions: questions});

  function collectAnswers() {
    let ans = {};
    let questions = document.querySelectorAll('.question');

    [...questions].forEach(q => {
      let inputs = q.querySelectorAll('input');

      [...inputs].forEach(inp => {
        if (inp.checked) {
          ans[inp.name] = inp.value;
        }
      })
    })

    return ans;
  }

  let getResult = (key) => document.querySelector(`div[data-id="${key}"]`).querySelector('.result');

  function displayResults(answers) {
    Object.keys(answerKey).forEach(key => {
      result = getResult(key)
      if (answers[key] === answerKey[key]) {
        result.textContent = 'Correct';
        result.classList.add('correct')
      } else {
        result.textContent = `Wrong Answer: The correct answer is ${answerKey[key]}.`
        result.classList.add('wrong')
      }
    })

    submitBtn.classList.add('disabled');
    resetBtn.classList.remove('disabled');
  }

  function handleSubmit(e) {
    e.preventDefault();

    let answers = collectAnswers();

    displayResults(answers);
  }

  function reset(e) {
    if (submitBtn.classList.contains('disabled')) {
      [...document.querySelectorAll("input[type='radio']")].forEach(inp => inp.checked = false);
      [...document.querySelectorAll("p.result")].forEach(p => {
        p.textContent = ''
        p.classList.remove('wrong')
      });
      submitBtn.classList.remove('disabled');
      resetBtn.classList.add('disabled');
    }

  }

  document.querySelector('.submit').addEventListener('click', handleSubmit);
  resetBtn.addEventListener('click', reset)

})