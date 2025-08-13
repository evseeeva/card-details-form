const inputs = document.querySelectorAll(".payment-form__input");

function writeFromInput(e) {
  const input = e.target;
  const value = input.value;
  const defaultValue = input.dataset.defaultValue;
  const element = document.getElementById(input.dataset.element);
  element.textContent = value.length > 0 ? value : defaultValue;
}

function clearNumberInput(e, regex) {
  const input = e.target;
  const clearedValue = input.value.replace(/\D/g, "");
  input.value = clearedValue;
}

function getErrorMessage(input) {
  const validity = input.validity;
  console.log(input.value.length);
  console.log(input.minLength);
  if (validity.valueMissing) return "Can't be blank";
  if (input.value.length < input.minLength)
    return `Enter at least ${input.dataset.length || input.minLength} numbers`;
  if (validity.patternMismatch) return "Wrong format";
}

function displayErrorUnderInput(e) {
  const input = e.target;
  const isValid = input.validity.valid;
  const message = getErrorMessage(input);
  const connectedValidationId = input.getAttribute("aria-describedby");
  const connectedValidation = connectedValidationId
    ? document.getElementById(connectedValidationId)
    : false;

  if (connectedValidation && message && !isValid) {
    connectedValidation.innerText = message;
    input.classList.add("input--invalid");
  } else {
    connectedValidation.innerText = "";
    input.classList.remove("input--invalid");
  }
}

inputs.forEach((input, index) => {
  // clearing non-numeric values
  if (input.inputMode === "numeric") {
    input.addEventListener("input", (e) => clearNumberInput(e, /\D/g));
  }
  if (input.name === "card-number") {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/(\d{4})(?=\d)/g, "$1 ");
    });
  }

  // display input values on card elements
  input.addEventListener("input", writeFromInput);

  // display error after entering value to input
  input.addEventListener("blur", displayErrorUnderInput, true);

  // display only custom error after submiting form
  input.addEventListener("invalid", function (e) {
    e.preventDefault();
    displayErrorUnderInput(e);
  });

  // auto focus to next field 
  input.addEventListener("input", () => {
    if (input.value.length === input.maxLength) {
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        input.blur();
      }
    }
  });
});
