const BASE_URL = 'http://localhost:3000/api/v1'
let questionsContainer;

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    questionsContainer = document.getElementById('questions-container');
    console.log('dom content loaded')
    app.adapter.loadQuestion(app.questionNumber).then(q => app.createQAndA(q));
})




Array.prototype.randomize = function() {
    var m = this.length, t, i;
    while(m) {
        i = Math.floor(Math.random() * m--);
        t = this[m];
        this[m] = this[i];
        this[i] = t;
    }
    return this;
}