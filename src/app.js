class App {
    constructor() {
        this.adapter = new Adapter();
        this.questionNumber = 0
        this.startGame = this.startGame.bind(this);
        this.getNextQuestion = this.getNextQuestion.bind(this);
        this.timesUp = this.timesUp.bind(this);
        this.endGame = this.endGame.bind(this);
        this.renderNewForm = this.renderNewForm.bind(this);
        this.submitQuestion = this.submitQuestion.bind(this);
        this.editQuestions = this.editQuestions.bind(this);
    }

    loadFrontPage() {
        console.log(categoriesObject);
        document.querySelector('#game-over').innerHTML = '';
        document.querySelector('#timer-container').innerHTML = '';
        document.querySelector('#number-correct').innerHTML = '';
        document.querySelector('#number-incorrect').innerHTML = '';


      questionsContainer.innerHTML = ""
      questionsContainer.innerHTML = `<h1>Welcome to Trivia Something!</h1>
      <h3>Select a category to play</h3>
      <div>
      <select>
        <option value="books">Books</option>
        <option value="computers">Computers</option>
        <option value="film">Film</option>
        <option value="general knowledge">General knowledge</option>
        <option value="history">History</option>
        <option value="music">Music</option>
        <option value="science">Science</option>
        <option value="sports">Sports</option>
        <option value="television">Television</option>
        <option value="video games">Video games</option>
      </select>
      <button id='start-game'>Start Game</button><hr>
      </div>
      <button class="btn" id='create-question'>Make new question</button>
      <button class="btn" id='edit-questions'>Edit questions</button>`
      document.querySelector('#create-question').addEventListener('click', app.renderNewForm)
      document.querySelector('#start-game').addEventListener('click', app.startGame);
      document.querySelector('#edit-questions').addEventListener('click', app.editQuestions)
    }

    editQuestions() {
        startingIndex = 0;
        endingIndex = 10;
        console.log('editing questions...');
        questionsContainer.innerHTML = "";
        this.adapter.loadQuestions(startingIndex, endingIndex);
    }

    renderEditPage(questions) {
        questionsContainer.innerHTML += `<button id="back">Back</button><hr>`
        questions.forEach(question => {
            this.renderEditableQuestion(question);
        })
        questionsContainer.innerHTML += `<hr><button id="get-more-questions">Get more questions</button>`
        // debugger
        document.querySelector('#back').addEventListener('click', this.loadFrontPage)
        document.querySelectorAll(`.edit-button`).forEach(e => {
        e.addEventListener('click', app.renderEditForm)});
        document.querySelectorAll('.delete-button').forEach(e => {
            e.addEventListener('click', app.adapter.deleteQuestion);
        })
        document.querySelector('#get-more-questions').addEventListener('click', () => {
          startingIndex += 10
          endingIndex += 10
          questionsContainer.innerHTML = ""
          app.adapter.loadQuestions(startingIndex, endingIndex)
        })
    }

    renderEditForm(event) {
        const div = event.target.parentElement;
        const questionContent = event.target.parentElement.querySelector('span').innerText;
        console.log(event.target.parentElement.querySelectorAll('.answer-choice'))
        const answers = Array.from(event.target.parentElement.querySelectorAll('.answer-choice')).map(answer => answer.innerText)
        const answerIds = Array.from(event.target.parentElement.querySelectorAll('.answer-choice')).map(answer => (answer.id.split('-')[1]))
        console.log(questionContent);
        console.log(answers);
        console.log(answerIds);
        div.innerHTML = '';
        div.innerHTML += `<form id="edit-${div.id}">
        <label>Question: </label><br>
        <input id="edit-question-content" type="text" size="100" value="${questionContent}"><br>
        <label>Answers: (select correct)</label><br>
        <div class="edit-answer">
        <input id="answer-${answerIds[0]}-text" type="text" value="${answers[0]}">
        <input id="answer-${answerIds[0]}"value="${answers[0]}" name="correct" type="radio" checked>
        </div>
        <br>
        <div class="edit-answer">
        <input id="answer-${answerIds[1]}-text"type="text" value="${answers[1]}">
        <input id="answer-${answerIds[1]}" value="${answers[1]}" name="correct" type="radio">
        </div>
        <br>
        <div class="edit-answer">
        <input id="answer-${answerIds[2]}-text" type="text" value="${answers[2]}">
        <input id="answer-${answerIds[2]}" value="${answers[2]}" name="correct" type="radio">
        </div>
        <br>
        <div class="edit-answer">
        <input id="answer-${answerIds[3]}-text" type="text" value="${answers[3]}">
        <input id="answer-${answerIds[3]}" value="${answers[3]}"name="correct" type="radio">
        </div>
        <br>
        <input type="submit">
        </form>`
        document.querySelector(`#edit-${div.id}`).addEventListener('submit', app.handleEditFormSubmit);
    }

    handleEditFormSubmit(event) {
        event.preventDefault();
        let questionDiv = event.target.parentElement;
        let questionObject = {};
        let correctAnswerObject = {};
        let incorrectAnswersObject = {};
        const questionContent = event.target.querySelector('#edit-question-content').value
        let questionId = event.target.parentElement.id.split('-')[1]
        questionObject[questionContent] = questionId;
        const radioButtons = Array.from(event.target.querySelectorAll('input')).filter(inp => inp.name === 'correct');
        const correctAnswer = radioButtons.find(btn => btn.checked).previousElementSibling
        const correctAnswerValue = radioButtons.find(btn => btn.checked).previousElementSibling.value
        const incorrectAnswers = radioButtons.filter(btn => !btn.checked).map(btn => btn.previousElementSibling);
        const incorrectAnswersValues = radioButtons.filter(btn => !btn.checked).map(btn => btn.previousElementSibling.value);
        console.log('correct answer is', correctAnswer);
        console.log('incorrect answers are', incorrectAnswers);
        correctAnswerObject[correctAnswerValue] = correctAnswer.id.split('-')[1]
        incorrectAnswers.forEach(answer => {
            incorrectAnswersObject[answer.value] = answer.id.split('-')[1];
        })
        console.log(questionObject);
        console.log(correctAnswerObject);
        console.log(incorrectAnswersObject);
        const data = [questionObject, correctAnswerObject, incorrectAnswersObject, questionDiv];
        app.adapter.patchQuestion(data);
    }

    renderEditableQuestion(q) {
        let question = new Question(q.id, q.content, q.difficulty);
        q.answers.forEach(a => {
            let answer = new Answer(a.id, a.content, a.correct, question);
        })
        question.renderEditable()
    }

    someFunction() {
        console.log('clicked');
    }

    renderNewForm() {
        console.log('rendering new form...')
        questionsContainer.innerHTML = '';
        questionsContainer.innerHTML += `
        <h1>Create a new trivia question</h1>
        <form id="new-question-form">
        Question: <br><textarea rows="2" cols="50" id="new-question-content" required></textarea><br>

        Correct Answer: <br><input type="text" id="new-correct-answer"><br>
        Incorrect Answers: <br>
        <input type="text" class="new-incorrect-answer" required><br>
        <input type="text" class="new-incorrect-answer" required><br>
        <input type="text" class="new-incorrect-answer" required><br>
        Difficulty: <select name="difficulty" required>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        </select>
        Category: <select id="category" required>
        <option value="books">Books</option>
        <option value="computers">Computers</option>
        <option value="film">Film</option>
        <option value="general knowledge">General knowledge</option>
        <option value="history">History</option>
        <option value="music">Music</option>
        <option value="science">Science</option>
        <option value="sports">Sports</option>
        <option value="television">Television</option>
        <option value="video games">Video games</option>
        </select>
        <input id="submit-question" type="submit">
        </form><hr>
        <button id="back-to-main">Back</button>
        `
        document.querySelector('#new-question-form').addEventListener('submit', this.submitQuestion)
        document.querySelector('#back-to-main').addEventListener('click', this.loadFrontPage)
    }

    populateCategories() {
        fetch(`${BASE_URL}/categories`)
        .then(res => res.json())
        .then(json => json.forEach(category => {
            categoriesObject[category.name] = category.id;
        }))
    }

    submitQuestion(event) {
        event.preventDefault();
        let form = event.target;
        let newQuestionContent = form.querySelector('textarea').value;
        let newCorrectAnswer = form.querySelector('#new-correct-answer').value;
        let newIncorrectAnswers = Array.from(form.querySelectorAll('.new-incorrect-answer')).map(answer => answer.value);
        let difficulty = form.querySelector('select').value;
        let newCategory = form.querySelector('#category').value
        let categoryId = categoriesObject[newCategory.capitalize()];
        console.log(newQuestionContent, newCorrectAnswer, newIncorrectAnswers);
        const data = {content: newQuestionContent, difficulty: difficulty, category_id: categoryId}
        const answers = [newCorrectAnswer, ...newIncorrectAnswers]
        this.adapter.postQuestionData(data, answers);

    }

    startGame(event) {
      questionsArray = [];
      let categoryName = event.target.previousElementSibling.value;
      app.adapter.fetchCategory(categoryName);
      console.log(questionsArray);
    
    }

    createQuestionsArray(json) {
        questionsArray = [];
        json.questions.forEach(q => questionsArray.push(q));
        numberCorrect = 0
        numberIncorrect = 0
        document.getElementById('game-over').innerHTML = "";
        document.querySelector('#number-correct').innerHTML = `${numberCorrect} Correct`;
        document.querySelector('#number-incorrect').innerHTML = `${numberIncorrect} Incorrect`;
        this.createQAndA(questionsArray[this.questionNumber])

    }


    createQAndA(q) {
        let question = new Question(q.id, q.content, q.difficulty);
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
        if (timerContainer.querySelector('div')) {
          timerContainer.querySelector('div').innerHTML = --count
        }
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
        numberIncorrect += 1
        if(numberIncorrect >= 3) {
            this.endGame();
        }
        document.querySelector('#number-incorrect').innerHTML = `${numberIncorrect} Incorrect`;
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
        this.createQAndA(questionsArray[this.questionNumber]);
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
      if(numberCorrect > highScore) {
          highScore = numberCorrect;
      }
      document.querySelector('#high-score-number').innerHTML = highScore;
      document.querySelector('#game-over').innerHTML = `
      GAME OVER.
      <div>
      <select>
        <option value="books">Books</option>
        <option value="computers">Computers</option>
        <option value="film">Film</option>
        <option value="general knowledge">General knowledge</option>
        <option value="history">History</option>
        <option value="music">Music</option>
        <option value="science">Science</option>
        <option value="sports">Sports</option>
        <option value="television">Television</option>
        <option value="video games">Video games</option>
      </select>
      <button id="play-again">Play again</button>
      <button id="main-page">Main page</button>
      </div>
      `
      document.querySelectorAll('.answer-choice').forEach(btn => {
        btn.removeEventListener('click', clickAnswer)
      })
      document.querySelector('#play-again').addEventListener('click', this.startGame)
      document.querySelector('#main-page').addEventListener('click', this.loadFrontPage)
    }

}
