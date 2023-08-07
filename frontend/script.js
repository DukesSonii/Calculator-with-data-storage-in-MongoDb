let display = document.getElementById("result");

function appendToDisplay(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    display.value = eval(display.value);
    saveCalculation(display.value); // Send calculation data to the server
  } catch (error) {
    display.value = "Error";
  }
}

function saveCalculation(result) {
  const expression = display.value;
  const data = { expression, result };

  fetch("http://localhost:3300/api/calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the JSON response here
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Error saving calculation:", error));
}

// Function to retrieve all calculations from the server
function getCalculations() {
  fetch("http://localhost:3300/api/calculations")
    .then((response) => response.json())
    .then((calculations) => {
      // Handle the fetched calculations data here (e.g., display in a history section)
      console.log(calculations);
    })
    .catch((error) => console.error("Error fetching calculations:", error));
}

// Attach event listeners to the buttons
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".buttons button").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.textContent;
      if (value === "=") {
        calculate();
      } else if (value === "C") {
        clearDisplay();
      } else {
        appendToDisplay(value);
      }
    });
  });
});
