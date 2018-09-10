const BASE_URL = 'http://localhost:3000/api/v1'
let questionsContainer;
let questionNumber = 1; 

document.addEventListener('DOMContentLoaded', () => {

    questionsContainer = document.getElementById('questions-container');
    console.log('dom content loaded')
    loadQuestion(questionNumber).then(question => renderQuestion(question));
})

function getNextQuestion(event) {
    questionNumber++;
    loadQuestion(questionNumber).then(question => renderQuestion(question));
}


function addClickEvents(question) {
    question.answers.forEach(answer => {
        answer.addEventListener('click', showAnswer)
    })
}

function showAnswer(event) {
    // console.log(typeof event.target.dataset.correct);
    if(event.target.dataset.correct === 'true') {
        event.target.innerHTML += `<div class="alert alert-success">        
                <strong>Well done!</strong></div>`
        
    }
    else {
        event.target.innerHTML += `<div class="alert alert-danger">        
                <strong>Wrong!</strong></div>`
        event.target.parentElement.querySelectorAll('li').forEach(li => {
            if (li.dataset.correct === 'true') {
                console.log(li);
                li.className = 'correct-answer';
            }
        })
    }
    endOfQuestion();
}

function endOfQuestion() {
    document.querySelector('#questions-container').querySelectorAll('li').forEach(li => {
        li.removeEventListener('click', showAnswer);
    })
    document.getElementById('next-question').addEventListener('click', getNextQuestion)
}

function loadQuestion(id) {
    return fetch(`${BASE_URL}/questions/${id}`)
    .then(res => res.json());
}

function loadQuestions() {
    return fetch(`${BASE_URL}/questions`)
        .then(res => res.json())
}



function renderQuestion(question) {
    questionsContainer.innerHTML = '';
    // debugger;
    questionsContainer.innerHTML += `
    <ul style="z-index:${question.id}">${question.content}
    ${question.answers.randomize().map(answer => `<li data-correct="${answer.correct}" >${answer.content}</li>`).join('')}
    </ul>`
    questionsContainer.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', showAnswer)
    })
}


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