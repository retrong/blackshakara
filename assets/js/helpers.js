const loadStates = async () => {
  const stateSelect = document.getElementById("ec-select-state");

  if (!stateSelect) return;

  const data = await fetch("../../data/states.json");

  let states = await data.json();

  for (let i = 0; i < states.length; i++) {
    var option = document.createElement("option");
    option.value = states[i];
    option.innerHTML = states[i];

    // then append it to the select element
    stateSelect.appendChild(option);
  }
};

loadStates();
