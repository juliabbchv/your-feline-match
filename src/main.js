// Global variables

const formContainer = document.querySelector(".form-wrapper");
const resultContainer = document.querySelector(".result-container");
const testContainer = document.querySelector(".test-container");
const userInput = document.getElementById("form");
const inputs = document.querySelectorAll("input");
const inputWraps = document.querySelectorAll(".input-wrap");

// API setup

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

class CatApi {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = BASE_URL;
  }
  async getCats() {
    try {
      const response = await axios.get(
        `${this.baseURL}breeds?api_key=${this.apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error("Error is:", error);
    }
  }
}

const catApi = new CatApi();

//Function to generate match card

function createMatchCard(match) {
  const matchCard = document.createElement("div");
  const matchTitle = document.createElement("h2");
  const matchImage = document.createElement("img");
  const matchOrigin = document.createElement("p");
  const matchDescription = document.createElement("p");
  const matchTemperament = document.createElement("p");
  const matchLifeSpan = document.createElement("p");
  const matchLink = document.createElement("a");

  resultContainer.appendChild(matchCard);
  matchCard.appendChild(matchTitle);
  matchCard.appendChild(matchImage);
  matchCard.appendChild(matchOrigin);
  matchCard.appendChild(matchDescription);
  matchCard.appendChild(matchTemperament);
  matchCard.appendChild(matchLifeSpan);
  matchCard.appendChild(matchLink);

  matchCard.classList.add("result-card");
  matchTitle.classList.add("result-card__title");
  matchImage.classList.add("result-card__image");
  matchOrigin.classList.add("result-card__origin");
  matchDescription.classList.add("result-card__description");
  matchTemperament.classList.add("result-card__temperament");
  matchLifeSpan.classList.add("result-card__life-span");
  matchLink.classList.add("result-card__link");
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
  matchLink.innerText = `Click here for more information`;
  matchLink.href = match.vetstreet_url;

  return matchCard;
}

// Generate a cat match based on user input

async function catMatch() {
  const breeds = await catApi.getCats();
  let bestMatches = [];

  userInput.addEventListener("submit", (event) => {
    event.preventDefault();

    //Capture user-selected options
    const checkboxes = document.querySelectorAll(
      'input[name="choices"]:checked'
    );

    const selectedOptions = Array.from(checkboxes).map((checkbox) =>
      checkbox.value.toLowerCase()
    );

    const optionToKeyMap = {
      "Dog Friendly": "dog_friendly",
      "Child Friendly": "child_friendly",
      Grooming: "grooming",
      "Shedding Level": "shedding_level",
      Hairless: "hairless",
    };

    const resultDisplay = document.getElementById("display-result");

    if (selectedOptions.length === 0) {
      resultDisplay.innerHTML = `<h2 class="warning">Please select at least one option to find your match.</h2>
      <iframe class="no-match-animation" src="https://lottie.host/embed/6029cf3a-915c-4df3-9a01-70a6f527623d/laclvEUpqP.lottie"></iframe>`;
      return;
    }

    //Find breed matches based on selected options

    breeds.forEach((breed) => {
      let matchCount = 0;

      selectedOptions.forEach((option) => {
        const breedKey = optionToKeyMap[option];
        if (breedKey && breed[breedKey] > 0) {
          matchCount++;
        }
      });

      const temperamentArray = breed.temperament
        ? breed.temperament
            .split(", ")
            .map((trait) => trait.trim().toLowerCase())
        : [];

      selectedOptions.forEach((option) => {
        if (temperamentArray.includes(option.trim().toLowerCase())) {
          matchCount++;
        }
      });

      // Only include breeds that match at least one criterion
      if (matchCount > 0) {
        bestMatches.push({ ...breed, matchCount });
      }
    });

    if (bestMatches.length === 0) {
      resultDisplay.innerHTML = `<h2 class="warning">No matching breeds found. Try adjusting your preferences.</h2>`;
      return;
    }
    //Display match card

    console.log(bestMatches);

    const top6Matches = bestMatches.splice(0, 6);

    top6Matches.forEach((match) => {
      const matchCard = createMatchCard(match);
      resultDisplay.appendChild(matchCard);
    });
  });
}

catMatch();

// Add event listener

inputs.forEach((input, index) => {
  input.addEventListener("click", () => {
    if (input.checked) {
      inputWraps[index].style.backgroundColor = "#ccc9cd";
    } else {
      inputWraps[index].style.backgroundColor = "";
    }
  });
});

userInput.addEventListener("submit", () => {
  const returnBtn = document.createElement("button");
  returnBtn.innerText = `Find another match`;
  returnBtn.classList.add("return-btn");
  returnBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  resultContainer.appendChild(returnBtn);
});
