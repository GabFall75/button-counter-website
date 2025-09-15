// Step 1: Get references to the HTML elements we need
const counterElement = document.getElementById("counter");
const buttonElement = document.getElementById("click-button");

// Step 2: Create a variable to store the count
let count = 0;

// Step 3: Add a "click" event listener to the button
buttonElement.addEventListener("click", () => {
    // a. Increase the count by one
    count++;

    // b. Update the text of the counter element on the page
    counterElement.textContent = count;
});

console.log("Hello from JavaScript!");