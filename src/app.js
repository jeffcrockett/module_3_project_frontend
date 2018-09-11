class App {
    constructor() {
        this.adapter = new Adapter();
        this.questionNumber = 1;
        this.startGame = this.startGame.bind(this);
        this.getNextQuestion = this.getNextQuestion.bind(this);
        this.timesUp = this.timesUp.bind(this);
        this.endGame = this.endGame.bind(this);
        this.renderNewForm = this.renderNewForm.bind(this);
        this.submitQuestion = this.submitQuestion.bind(this);
    }

    loadFrontPage() {
      questionsContainer.innerHTML = ""
      questionsContainer.innerHTML = `<h1>Welcome to Trivia Something!</h1>
      <button id='start-game'>Start Game</button>
      <button id='create-question'>Make new question</button>`
      document.querySelector('#create-question').addEventListener('click', this.renderNewForm)
      document.querySelector('#start-game').addEventListener('click', this.startGame);
    }

    renderNewForm() {
        console.log('rendering new form...')
        questionsContainer.innerHTML = '';
        questionsContainer.innerHTML += `
        <h1>Create a new trivia question</h1>
        <form id="new-question-form">
        Question: <br><textarea rows="2" cols="50" id="new-question-content"></textarea><br>

        Correct Answer: <br><input type="text" id="new-correct-answer"><br>
        Incorrect Answers: <br>
        <input type="text" class="new-incorrect-answer"><br>
        <input type="text" class="new-incorrect-answer"><br>
        <input type="text" class="new-incorrect-answer"><br>
        Difficulty: <select name="difficulty">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        </select>
        <input id="submit-question" type="submit">
        </form>
        `
        // debugger;
        document.querySelector('#new-question-form').addEventListener('submit', this.submitQuestion)
    }

    submitQuestion(event) {
        // debugger;
        event.preventDefault();
        let form = event.target;
        let newQuestionContent = form.querySelector('textarea').value;
        let newCorrectAnswer = form.querySelector('#new-correct-answer').value;
        // debugger;
        let newIncorrectAnswers = Array.from(form.querySelectorAll('.new-incorrect-answer')).map(answer => answer.value);
        let difficulty = form.querySelector('select').value;
        console.log(newQuestionContent, newCorrectAnswer, newIncorrectAnswers);
        const data = {content: newQuestionContent, difficulty: difficulty}
        const answers = [newCorrectAnswer, ...newIncorrectAnswers]
        this.adapter.postQuestionData(data, answers);

    }

    startGame() {
      document.getElementById('game-over').innerHTML = "";
      document.querySelector('#number-correct').innerHTML = "";
      document.querySelector('#number-incorrect').innerHTML = "";
      numberCorrect = 0
      numberIncorrect = 0
      this.adapter.loadQuestion(this.questionNumber).then(q => this.createQAndA(q))
    }

    createQAndA(q) {
        const question = new Question(q.id, q.content, q.difficulty);
        q.answers.forEach(a => {
            let answer = new Answer(a.id, a.content, a.correct, question);
        })
        question.render();
        this.startTimer();
    }

    startTimer() {
      answerClicked = false;
      let timerContainer = document.querySelector('#timer-container');
      let count = 10;
      timerContainer.innerHTML = `<div>${count}</div>`
      interval = setInterval(() => {
        timerContainer.querySelector('div').innerHTML = --count
        if (answerClicked === true || count === 0) {
          clearInterval(interval);
          this.timesUp();
        }
      }, 1000)
    }

    timesUp() {
      if (answerClicked === true) {
        document.querySelector('#timer-container').innerHTML = "";
      } else {
        document.querySelector('#timer-container').innerHTML = "Time's up!";
      }
      document.querySelectorAll('.answer-choice').forEach(btn => {
          if (btn.dataset.correct === 'true') {
              btn.classList.add('correct-answer');
            }
          })
      app.changeEventListeners();
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
