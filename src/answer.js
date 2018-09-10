class Answer {
    constructor(id, content, correct, question) {
        this.id = id;
        this.content = content;
        this.correct = correct;
        this.question = question;
        this.question.answers.push(this);
    }
}