const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');// getting score value out of localstorage 

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
// localStorage - built in browser API - stores keyvalue pairs in browser
//getitem - if found retrieves the data associated with the key, else null
//parse - means if it is found in local storage and is valid JSON string, it will be parsed into a Javascript array.
const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore; // showing final score in place of h1 tag

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});// this event listener enables save button, as soon as user enters username in name field.

saveHighScore = (e) => {
    e.preventDefault(); //to stop the default action of an element from happening.Submitting a form moves it to a new page when a user clicks on a <button> or <input type="submit">

    const score = { // object
        score: mostRecentScore,
        name: username.value,
    };

    // store score & descending sort & cut off any score that is not in top five
    // highscore is an array of objects
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);// a and b are two elements(objects) from the high score array.
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));// stringifying the highscore object again before saving it in localstorage
    window.location.assign('/');// when scores are saved redirects to home page
    //  window - is global object , location - property of window
};
