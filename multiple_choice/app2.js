document.addEventListener('DOMContentLoaded', () => {
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

  let Quiz = {

    setTemplates() {
      this.questionTemplate = Handlebars.compile(document.querySelector('#question_template').innerHTML);
    },

    renderQuestions() {
      this.setTemplates();
      this.fieldSet.innerHTML = this.questionTemplate({questions: questions});
    },

    processResults(e) {
      e.preventDefault()

      this.toggleResetOn();
      this.getAnswers();
      this.displayResults()
    },

    displayResults() {
      Object.keys(answerKey).forEach(key => {
        let p = this.resultParagraphs[key];
        if (answerKey[key] !== this.answers[key]) {
          p.classList.add('wrong')
          if (this.answers[key] === undefined) {
            p.textContent = "You did not answer this question."
          } else {
            p.textContent = `Wrong answer: The correct answer is "${answerKey[key]}"`
          }
        } else {
          p.classList.add('correct')
          p.textContent = 'Correct Answer';
        }
      })
    },

    getAnswers() {
      this.answers = {};
      [...this.fieldSet.querySelectorAll('.question')].forEach(q => {
         let choices = [...q.querySelectorAll("input[type='radio']")];
         let pick = undefined;

         choices.forEach(choice => {
           if (choice.checked) { pick = choice.value }
         });

         this.resultParagraphs[q.dataset.id] = q.querySelector('p.result');
         this.answers[q.dataset.id] = pick;
      })
    },

    toggleResetOn() {
      this.submitBtn.classList.add('disabled');
      this.resetBtn.classList.remove('disabled');
    },

    toggleSubmitOn() {
      this.submitBtn.classList.remove('disabled');
      this.resetBtn.classList.add('disabled');
    },

    uncheckBoxes() {
      [...document.querySelectorAll("input[type='radio']")].forEach(inp => inp.checked = false);
    },

    resetGame(e) {
      this.toggleSubmitOn();
      this.uncheckBoxes()
      Object.values(this.resultParagraphs).forEach(p => {
        p.classList.remove('wrong');
        p.classList.remove('correct');
        p.textContent = ''
      })
    },

    bind() {
      this.submitBtn.addEventListener('click', this.processResults.bind(this));
      this.resetBtn.addEventListener('click', this.resetGame.bind(this))
    },

    init() {
      this.form = document.querySelector('form');
      this.resultParagraphs = {};
      this.submitBtn = this.form.querySelector('.submit');
      this.resetBtn = this.form.querySelector('.reset_form');
      this.fieldSet = this.form.querySelector('fieldset');
      this.renderQuestions();
      this.bind()
    }
  }

  Quiz.init()
})