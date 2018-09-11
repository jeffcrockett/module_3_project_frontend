class Question {
    constructor(id, content, difficulty) {
        this.id = id;
        this.content = content;
        this.difficulty = difficulty;
        this.answers = [];
        Question.all.push(this);
    }

    render() {
        // let app = new App();
        questionsContainer.innerHTML = '';
        questionsContainer.innerHTML += `<ul>${this.content}<br>
    ${this.answers.randomize().map(answer => `<br><button class='btn btn-light answer-choice' data-correct="${answer.correct}" >${answer.content}</button><br>`).join('')}
    </ul><button id="next-question" type="button" class="btn btn-secondary">Next</button>`
        questionsContainer.querySelectorAll('.answer-choice').forEach(btn => {
            btn.addEventListener('click', clickAnswer)
        })
    }

//     addClickEvents() {
//     let app = new App();
//     this.answers.forEach(answer => {
//         answer.addEventListener('click', app.showAnswer)
//     })
// }

}

Question.all = [];
