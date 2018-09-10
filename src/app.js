class App {
    constructor() {
        this.adapter = new Adapter();
        this.questionNumber = 1;
        this.showAnswer = this.showAnswer.bind(this);
        this.getNextQuestion = this.getNextQuestion.bind(this);

    }

    createQAndA(q) {
        const question = new Question(q.id, q.content, q.difficulty);
        q.answers.forEach(a => {
            let answer = new Answer(a.id, a.content, a.correct, question)
        })
        question.render();
    }


    getNextQuestion() {
        this.questionNumber++;
        this.adapter.loadQuestion(this.questionNumber).then(question => this.createQAndA(question));
    }

    showAnswer(event) {
    if (event.target.dataset.correct === 'true') {
        event.target.innerHTML += `<div class="alert alert-success">        
                <strong>Well done!</strong></div>`

    }
    else {
        event.target.innerHTML += `<div class="alert alert-danger">        
                <strong>Wrong!</strong></div>`
        event.target.parentElement.querySelectorAll('li').forEach(li => {
            if (li.dataset.correct === 'true') {
                li.className = 'correct-answer';
            }
        })
    }
    document.querySelector('#questions-container').querySelectorAll('li').forEach(li => {
        li.removeEventListener('click', this.showAnswer);
    })
    document.getElementById('next-question').addEventListener('click', this.getNextQuestion)
    }

//     loadQuestions() {
//     return fetch(`${BASE_URL}/questions`)
//         .then(res => res.json())
// }
}