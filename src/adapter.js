class Adapter {

    loadQuestion(id) {
        return fetch(`${BASE_URL}/questions/${id}`)
            .then(res => res.json());
    }


    postQuestionData(data, answerData) {
        console.log(data);
        fetch(`${BASE_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => {
                this.postAnswerData(answerData, json.id)
            });
    }

    postAnswerData(data, id) {
        console.log(data, id);
        data.forEach((d, index) => {
            let dData = {
                content: d,
                correct: index === 0 ? true : false,
                question_id: id
            }
            fetch(`${BASE_URL}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dData)
            }).then(res => res.json()).then(json => console.log(json));
        })
       
    }

        loadQuestions(number1, number2) {
            return fetch(`${BASE_URL}/questions`)
                .then(res => res.json())
                .then(json => {
                    let questions = json.slice(number1, number2);
                    app.renderEditPage(questions);
                })
    }

    patchQuestion(data) {
        console.log('data is', data);
        const questionContent = Object.keys(data[0])[0]
        const correctAnswer = data[1];
        const incorrectAnswers = data[2];
        const questionId = Object.values(data[0])[0]
        const div = data[data.length-1]
        console.log({ content: questionContent })
        console.log(questionId);
        fetch(`${BASE_URL}/questions/${questionId}/`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({content: questionContent})
        }).then(res => res.json()).then(json => {
            this.patchAnswers(correctAnswer, incorrectAnswers)
            let targetQuestion = Question.all.find(q => q.id === parseInt(questionId));
            // debugger;
            targetQuestion.content = json.content
            targetQuestion.answers.forEach(answer => {
                if(answer.correct) {
                    answer.content = Object.keys(correctAnswer)[0]
                }
                else {
                    Object.entries(incorrectAnswers).forEach(incorrectAnswer => {
                        if(parseInt(incorrectAnswer[1]) === answer.id){
                            answer.content = incorrectAnswer[0]
                        }
                    })
                }
            })
            console.log('updated question is', targetQuestion)
            console.log(json);
            targetQuestion.renderEditable(div);
        })
    }

    patchAnswers(correctAnswer, incorrectAnswers) {
        // debugger;
        let correctAnswerId = Object.values(correctAnswer)[0];
        let correctAnswerContent = Object.keys(correctAnswer)[0];
        let incorrectAnswersArray = Object.entries(incorrectAnswers)
        // debugger;
        fetch(`${BASE_URL}/answers/${correctAnswerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({content: correctAnswerContent, correct: true })
        }).then(res => res.json()).then(json => {
            console.log(json);
        })
        incorrectAnswersArray.forEach(answer => {
            fetch(`${BASE_URL}/answers/${answer[1]}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ content: answer[0], correct: false })
        }).then(res => res.json()).then(json => {
            console.log(json);        
            // debugger;
        });
        

    })
}
}
