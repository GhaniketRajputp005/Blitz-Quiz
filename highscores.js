const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; // getting our highscore array from localstorage

highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;// array to string
  })
  .join("");

  // .map is an array method that creates a new array by calling a provided function on every element in the original array.
