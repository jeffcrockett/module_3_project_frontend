class Adapter {

    loadQuestion(id) {
        return fetch(`${BASE_URL}/questions/${id}`)
            .then(res => res.json());
    }

    //     loadQuestions() {
    //     return fetch(`${BASE_URL}/questions`)
    //         .then(res => res.json())
    // }
}
