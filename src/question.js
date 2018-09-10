class Question {
    constructor(id, content, difficulty) {
        this.id = id;
        this.content = content;
        this.difficulty = difficulty;
        this.answers = [];
        Question.all.push(this);
    }

    render() {
        let app = new App();
        questionsContainer.innerHTML = '';
        questionsContainer.innerHTML += `<ul>${this.content}
    ${this.answers.randomize().map(answer => `<li data-correct="${answer.correct}" >${answer.content}</li>`).join('')}
    </ul>`
        questionsContainer.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', app.showAnswer)
        })
    }

    addClickEvents() {
    let app = new App();
    this.answers.forEach(answer => {
        answer.addEventListener('click', app.showAnswer)
    })
}
    
}

Question.all = [];