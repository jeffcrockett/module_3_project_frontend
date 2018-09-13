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

    renderEditable(div) {
        if(div) {
            div.innerHTML = '';
            div.innerHTML += `<div id="question-${this.id}"class="question-div"><span>${this.content}</span>
        <button id="edit-question-${this.id}" data-question-id="${this.id}" class="btn edit-button">Edit</button>
        <button data-question-id="${this.id}" class="btn delete-button">Delete</button><br>
    ${this.answers.map(answer => `<br><button id="answer-${answer.id}" class='btn btn-dark answer-choice' data-correct="${answer.correct}" >${answer.content}</button><br>`).join('')}
    </div>`
        }
        else {
        questionsContainer.innerHTML += `<div id="question-${this.id}"class="question-div"><span>${this.content}</span>
        <button id="edit-question-${this.id}" data-question-id="${this.id}" class="btn edit-button">Edit</button>
        <button data-question-id="${this.id}" class="btn delete-button">Delete</button><br>
    ${this.answers.map(answer => `<br><button id="answer-${answer.id}" class='btn btn-dark answer-choice' data-correct="${answer.correct}" >${answer.content}</button><br>`).join('')}
    </div>`
        }
        // debugger;
    
    }



//     addClickEvents() {
//     let app = new App();
//     this.answers.forEach(answer => {
//         answer.addEventListener('click', app.showAnswer)
//     })
// }

}

Question.all = [];
