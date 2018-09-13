const BASE_URL = 'http://localhost:3000/api/v1'
let questionsContainer 
let clickAnswer;
let answerClicked;
let numberCorrect;
let numberIncorrect;
let app;
let interval;
let startingIndex;
let endingIndex;
let highScore = 0;
let questionsArray = [];
let categoriesObject = {};


document.addEventListener('DOMContentLoaded', () => {
    app = new App();
    app.populateCategories();

    questionsContainer = document.getElementById('questions-container');
    clickAnswer = app.showAnswer
    answerClicked = false
    numberCorrect = 0
    numberIncorrect = 0
    gameOver = false
    console.log('dom content loaded')
    app.loadFrontPage()
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

String.prototype.capitalize = function() {
    return `${this[0].toUpperCase()}${this.slice(1).toLowerCase()}`
}
