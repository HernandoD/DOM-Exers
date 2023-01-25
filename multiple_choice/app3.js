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

class QuizGame {
  constructor() {
    this.form = document.querySelector("form[method='post']");
    this.fieldSet = this.form.querySelector('fieldset');
    this.formErrors = this.form.querySelector('.form_errors');
    this.questionTemp = Handlebars.compile(document.querySelector('#question_template').innerHTML)
    this.setQuestions();
    this.questionsArr = [...this.form.querySelectorAll('.question')];
    this.resetBtn = document.querySelector('.reset_form');
    this.subBtn = document.querySelector('.submit')
    this.bind();
  }

  handleSubmit(e) {
    let target = e.target;

    if (target.className === 'submit') {
      this.allAnswers = this.collectAnswers();
      this.labelResults();
      this.resetBtn.classList.remove('disabled');
      this.subBtn.classList.add('disabled');
    }
  }

  labelResults() {
    this.questionsArr.forEach(question => {
      let id = question.dataset.id;
      let result = question.querySelector('p.result');

      if (!this.allAnswers[id]) {
        result.textContent = `You didn't not answer this question. Correct answer is: "${answerKey[id]}"`;
        result.classList.add('wrong')
      } else if (this.allAnswers[id] !== answerKey[id]) {
        result.textContent = `Wrong Answer. The correct answer is: "${answerKey[id]}".`
        result.classList.add('wrong')
      } else {
        result.textContent = 'Correct Answer';
        result.classList.add('correct');
      }
    })
  }

  collectAnswers() {
    let answerObj = {};

    this.questionsArr.forEach(question => {
      let labels = [...question.querySelectorAll('label')];
      labels.forEach(label => {
        let input = label.querySelector('input');

        if (input.checked) {
          let id = input.getAttribute('name');
          answerObj[(`${id}`)] = input.value
        }
      })
    })

    return answerObj;
  }

  resetGame(e) {
    this.form.reset();
    [...document.querySelectorAll('p.result')].forEach(p => {
      p.textContent = '';
      p.classList.remove('wrong');
      p.classList.remove('correct')
    })

    this.resetBtn.classList.add('disabled');
    this.subBtn.classList.remove('disabled')
  }

  bind() {
    this.form.addEventListener('click', this.handleSubmit.bind(this));
    this.resetBtn.addEventListener('click', this.resetGame.bind(this))
  }

  setQuestions() {
    this.fieldSet.insertAdjacentHTML('beforeend', this.questionTemp({questions: questions}))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new QuizGame()
})

