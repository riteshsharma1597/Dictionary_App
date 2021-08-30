let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let api_Key = "ef73d341-2f14-4b50-8b4d-5f09c68f03f2";
let notFound = document.querySelector(".not_found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  //Clear Previous Data
  audioBox.innerHTML = "";
  notFound.innerText = "";
  defBox.innerText = "";

  //Get Input Data
  let word = input.value;

  //Call API get Data
  if (word === "") {
    alert("Word is required");
    return;
  }

  getData(word);
});

async function getData(word) {
  //AJAX Call

  loading.style.display = "block";

  const response =
    await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${api_Key}
    `);

  const data = await response.json();

  //If empty result
  if (!data.length) {
    loading.style.display = "none";
    notFound.innerText = "no result found";
    return;
  }

  //If result is Suggestions
  if (typeof data[0] === "string") {
    loading.style.display = "none";

    let heading = document.createElement("h3");
    heading.innerText = " Did you mean? ";
    notFound.appendChild(heading);
    data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      notFound.appendChild(suggestion);
    });
    return;
  }

  //Result found
  loading.style.display = "none";

  let definition = data[0].shortdef[0];
  defBox.innerText = definition;

  //Sound
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    renderSound(soundName);
  }

  console.log(data);
}

function renderSound(soundName) {
  //https://media.merriam-webster.com/soundc11
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${api_Key}`;

  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}
