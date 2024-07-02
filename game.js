const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {}; //object
let acceptingAnswers = false; // to create a delay nd allow the user to answer only when question and answers are loaded
let score = 0;
let questionCounter = 0;
let availableQuesions = []; // copy of full questionset  and to take questions out of available queston arrya as we use them, so that we have unique questions always to give to user

let questions = []; // our question set

// fetch("questions.json") fetch api to load local questions
fetch(
    'https://opentdb.com/api.php?amount=30&category=9&difficulty=easy&type=multiple' //a modern JavaScript API for making network requests. returns a Promise that resolves to the Response object representing the entire HTTP response.
)
    .then((res) => { // then method is used to handle the Promise returned by fetch.then takes a callback function that is executed once the Promise is resolved.

        return res.json();//res.json() is a method that reads the Response stream and parses it as JSON. means the callback returns a new Promise that resolves with the JSON data.
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => { // map is used here to convert array into string of question and choices
            const formattedQuestion = { // we get questions from api & then we return that after formatting it into our format
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];// a copy of an array of incorrect ans

            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;// to randomize the position of the correct answer among the incorrect answers

            answerChoices.splice(
                formattedQuestion.answer - 1,// index where it will insert
                0,// no removal
                loadedQuestion.correct_answer // insert it
            );
            // now answerchoices has both correct and incorrect answers in random order

            answerChoices.forEach((choice, index) => { 
                formattedQuestion['choice' + (index + 1)] = choice;
            });//creates a dynamic property name for each answer choice

            return formattedQuestion;
        });

        startGame(); // wait to call startgame untill i get my questions back
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 3;

startGame = () => {  // going to use this as reset
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];// take this array and put it's all content in new array 
    // also we are not assinging as it is bcoz if we dont use spread operator, then changes made in one array will also reflect in other basically they point to the same array but we need to maintain a copy.
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};


// TO load question and choices
getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        //when user is out of question just save score to local storage as key being mostrecentscore and value being score itself as strings
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar by manipulating width property
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length); // it'll have number between 0 to available questions included
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;
    // to set the question the html element the inner text to current question that we just loaded and it's question and not answer property
    // this just pulls one of our questions correctly, to pull multiple we use foreach on choices array and assign text with question
    // dataset['number'] is the custom attribute we used

    choices.forEach((choice) => {
        const number = choice.dataset['number'];// retreives the value of data-number attribute e.g 1,2 3 etc.
        choice.innerText = currentQuestion['choice' + number];
        //This approach is commonly used to dynamically populate HTML elements based on data retrieved from an object or an API response.
    });

    availableQuesions.splice(questionIndex, 1);// duplicate questions will not be displayed again because the question we just used will be spliced.
    acceptingAnswers = true;// now allowing user to answer
};

// to handle selected choice
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        // e contains the choice user made
        if (!acceptingAnswers) return;

        acceptingAnswers = false;// to delay here and not clicking immediately after clicking an option
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];


        //  to select which option we have chosen and based on that applying a class to it for color and removing it after a certain time
        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') { // keeping track of score
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);// this is how to apply classes in js
        //added incorrect/correct class in parent element's container 

        // setting a timeout function to have a delay not to remove class/choosen class immediately.
        
        setTimeout(() => {  // a function takes a callback function
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
