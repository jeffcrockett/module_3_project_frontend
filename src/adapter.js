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

    //     loadQuestions() {
    //     return fetch(`${BASE_URL}/questions`)
    //         .then(res => res.json())
    // }
}
