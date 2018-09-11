class App {
    constructor() {
        this.adapter = new Adapter();
        this.questionNumber = 1;
        this.startGame = this.startGame.bind(this)
        this.getNextQuestion = this.getNextQuestion.bind(this);
        this.timesUp = this.timesUp.bind(this)
        this.endGame = this.endGame.bind(this)
    }

    loadFrontPage() {
      questionsContainer.innerHTML = ""
      questionsContainer.innerHTML = `<h1>Welcome to Trivia Something!</h1><button id='start-game'>Start Game</button>`
      document.querySelector('#start-game').addEventListener('click', this.startGame);
    }

    startGame() {
      document.querySelector('#number-correct').innerHTML = ""
      document.querySelector('#number-incorrect').innerHTML = ""
      numberCorrect = 0
      numberIncorrect = 0
      this.adapter.loadQuestion(this.questionNumber).then(q => this.createQAndA(q))
    }

    createQAndA(q) {
        const question = new Question(q.id, q.content, q.difficulty);
        q.answers.forEach(a => {
            let answer = new Answer(a.id, a.content, a.correct, question)
        })
        question.render();
        this.startTimer()
    }

    startTimer() {
      answerClicked = false
      let timerContainer = document.querySelector('#timer-container')
      let count = 10
      timerContainer.innerHTML = `<div>${count}</div>`
      interval = setInterval(() => {
        timerContainer.querySelector('div').innerHTML = --count
        if (answerClicked === true || count === 0) {
          clearInterval(interval)
          this.timesUp()
        }
      }, 1000)
    }

    timesUp() {
      if (answerClicked === true) {
        document.querySelector('#timer-container').innerHTML = ""
      } else {
        document.querySelector('#timer-container').innerHTML = "Time's up!"
      }
      document.querySelectorAll('.answer-choice').forEach(btn => {
          if (btn.dataset.correct === 'true') {
              btn.classList.add('correct-answer')
            }
          })
      app.changeEventListeners()
    }

    getNextQuestion() {
        this.questionNumber++;
        this.adapter.loadQuestion(this.questionNumber).then(question => this.createQAndA(question));
    }

    showAnswer(event) {
    if (event.target.dataset.correct === 'true') {
        numberCorrect++
        document.querySelector('#number-correct').innerHTML = `${numberCorrect} Correct`
        event.target.innerHTML += `<div class="alert alert-success">
                <strong>Well done!</strong></div>`

    }
    else {
        numberIncorrect++
        document.querySelector('#number-incorrect').innerHTML = `${numberIncorrect} Incorrect`
        event.target.innerHTML += `<div class="alert alert-danger">
                <strong>Wrong!</strong></div>`
        event.target.parentElement.querySelectorAll('button').forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct-answer');
            }
        })
        if (numberIncorrect === 3) {
          app.endGame()
          return
        }
      }
    app.changeEventListeners()
    answerClicked = true
    }

    changeEventListeners() {
      document.querySelectorAll('.answer-choice').forEach(btn => {
        btn.removeEventListener('click', clickAnswer)
      })
      document.getElementById('next-question').addEventListener('click', this.getNextQuestion)
    }

    endGame() {
      clearInterval(interval)
      document.querySelector('#game-over').innerHTML = `GAME OVER.<button id="play-again">Play again</button>`
      document.querySelectorAll('.answer-choice').forEach(btn => {
        btn.removeEventListener('click', clickAnswer)
      })
      document.querySelector('#play-again').addEventListener('click', this.startGame)
    }

}
