import API from "./API.js";

const catApi = new API();

async function allBreeds() {
  try {
    const cats = await catApi.getCats();
    return cats;
  } catch (error) {
    console.log("error");
  }
}

allBreeds().then((result) => console.log(result));

// Get temperaments as a string

async function catTemperaments() {
  const temperamentList = [];
  try {
    const cats = await catApi.getCats();
    cats.forEach((cat) => {
      if (cat.temperament) {
        temperamentList.push(cat.temperament);
      }
    });
  } catch (error) {
    console.error("error");
  }

  const temperamentArray = temperamentList
    .map((temperament) => temperament.split(" "))
    .flat();

  return temperamentArray;
}

// Word frequency count & top 70 words

function wordFrequency(words) {
  const wordCount = words.reduce((countMap, word) => {
    countMap[word] = (countMap[word] || 0) + 1;
    return countMap;
  }, {});

  const top70Words = Object.entries(wordCount)
    .sort(([, count1], [, count2]) => count2 - count1)
    .slice(0, 70);

  return top70Words;
}

catTemperaments().then((wordsArray) => {
  const frequentWords = wordFrequency(wordsArray);
  console.log(frequentWords);
});

//Function to generate match card

function createMatchCard(match) {
  const formContainer = document.querySelector(".form-wrapper");
  const resultContainer = document.querySelector(".result-container");
  const testContainer = document.querySelector(".test-container");

  const matchCard = document.createElement("div");
  const matchTitle = document.createElement("h2");
  const matchImage = document.createElement("img");
  const matchOrigin = document.createElement("p");
  const matchDescription = document.createElement("p");
  const matchTemperament = document.createElement("p");
  const matchLifeSpan = document.createElement("p");

  resultContainer.appendChild(matchCard);
  matchCard.appendChild(matchTitle);
  matchCard.appendChild(matchImage);
  matchCard.appendChild(matchOrigin);
  matchCard.appendChild(matchDescription);
  matchCard.appendChild(matchTemperament);
  matchCard.appendChild(matchLifeSpan);

  matchCard.classList.add("result-card");
  matchTitle.classList.add("result-card__title");
  matchImage.classList.add("result-card__image");
  matchOrigin.classList.add("result-card__origin");
  matchDescription.classList.add("result-card__description");
  matchTemperament.classList.add("result-card__temperament");
  matchLifeSpan.classList.add("result-card__life-span");
  formContainer.classList.add("form-wrapper__hidden");
  testContainer.classList.add("display-result");

  matchTitle.innerText = `${match.name}`;
  matchImage.src = match.image?.url || "https://via.placeholder.com/300";
  matchImage.alt = match.name;
  matchImage.width = 300;
  matchOrigin.innerText = `Origin: ${match.origin || "Unknown"}`;
  matchDescription.innerText = `Description: ${
    match.description || "No description available."
  }`;
  matchTemperament.innerText = `Temperament: ${match.temperament}`;
  matchLifeSpan.innerText = `Life Span: ${match.life_span} years`;

  return matchCard;
}

// Generate a cat match based on user input

const userInput = document.getElementById("form");

async function catMatch() {
  const breeds = await catApi.getCats();

  userInput.addEventListener("submit", (event) => {
    event.preventDefault();

    //Capture user-selected options
    const checkboxes = document.querySelectorAll(
      'input[name="choices"]:checked'
    );

    const selectedOptions = Array.from(checkboxes).map(
      (checkbox) => checkbox.value
    );

    const resultDisplay = document.getElementById("display-result");

    if (selectedOptions.length === 0) {
      resultDisplay.innerHTML = `<h2 class="warning">Please select at least one option to find your match.</h2>
      <iframe class="no-match-animation" src="https://lottie.host/embed/6029cf3a-915c-4df3-9a01-70a6f527623d/laclvEUpqP.lottie"></iframe>`;
      return;
    }

    //Find the best match
    const matches = breeds.map((breed) => {
      const temperamentArray = breed.temperament
        ? breed.temperament.split(", ").map((trait) => trait.trim())
        : [];

      const matchCount = temperamentArray.filter((trait) =>
        selectedOptions.some(
          (option) => option.trim().toLowerCase() === trait.trim().toLowerCase()
        )
      ).length;

      return { ...breed, matchCount };
    });

    //Sort breeds by match count

    const sortedMatches = matches.sort((a, b) => b.matchCount - a.matchCount);

    const maxMatchCount = sortedMatches[0].matchCount;
    const bestMatches = sortedMatches.filter(
      (match) => match.matchCount === maxMatchCount
    );

    // Select top 6 random best matches

    function shuffle(array) {
      const shuffledArray = array.sort(() => Math.random() - 0.5);
      return shuffledArray.slice(0, 6);
    }

    let randomBestMatches = shuffle(bestMatches);
    if (randomBestMatches.length < 6) {
      const remainingMatches = sortedMatches.filter(
        (match) => !bestMatches.includes(match)
      );
      const additionalMatches = shuffle(remainingMatches).slice(
        0,
        6 - randomBestMatches.length
      );
      randomBestMatches = randomBestMatches.concat(additionalMatches);
    }

    //Display match card

    randomBestMatches.forEach((match) => {
      const matchCard = createMatchCard(match);
      resultDisplay.appendChild(matchCard);
    });
  });
}

catMatch();
