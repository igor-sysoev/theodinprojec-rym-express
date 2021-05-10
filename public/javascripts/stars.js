const divs = document.querySelectorAll(".rating");

const ratingStars = [...document.getElementsByClassName("rating__star")];
const ratingInput = document.querySelector(".rating_input");

const initStarDisplay = (div) => {
  const rating = parseInt(div.querySelector("#secret_rating").innerText);
  for (let i = 0; i < 5; i++) {
    const el = document.createElement("i");

    el.classList.add("fa-star", i > rating ? "far" : "fas");
    div.appendChild(el);
  }
};

const initRatingSystem = () => {
  const fillStar = (star) => {
    star.classList.remove("far");
    star.classList.add("fas");
    star.filled = true;
  };
  const removeStarFill = (star) => {
    star.classList.remove("fas");
    star.classList.add("far");
    star.filled = false;
  };

  const fillStars = (i) => {
    ratingStars.forEach((star) => removeStarFill(star)); // remove fill in the beginning ;

    ratingInput.value = i;

    for (let d = i; d <= i; d--) {
      let currentStar = ratingStars[d];
      currentStar?.filled ? removeStarFill(currentStar) : fillStar(currentStar);
    }
  };

  ratingStars.forEach((star, i) => {
    star.addEventListener("click", () => fillStars(i));
  });

  if (ratingInput?.value) {
    let newVal = parseInt(ratingInput.value);
    fillStars(newVal);
  }
};

if (ratingStars.length) {
  initRatingSystem(); //if stars are present already that means we need to control em, else it's just for the display, dude.
} else {
  divs.forEach((div) => {
    initStarDisplay(div);
  });
}
