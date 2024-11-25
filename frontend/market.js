const { error } = require("console");

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch and display market prices
fetch(`${API_BASE_URL}/market-prices`)
  .then((response) => response.json())
  .then((data) => {
    const table = document.getElementById("prices-table");
    table.innerHTML = data.map(item => createTableRow(item.crop, item.price, item.market)).join('');
  })
  .catch((err) => console.error("Error:", err));

// Fetch and display buyers
function fetchBuyers() {
  fetch(`${API_BASE_URL}/buyers`)
    .then((response) => response.json())
    .then((data) => {
      const buyersList = document.getElementById('buyers-list');
      buyersList.innerHTML = ''; // Clear existing list
      data.forEach((buyer) => {
        const listItem = `<li>${buyer.name} - Contact: ${buyer.contact}</li>`;
        buyersList.innerHTML += listItem;
      });
    })
    .catch((error) => console.error('Error fetching buyers:', error));
}

// Post produce form submission
document.getElementById('produce-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form reload

  const cropName = document.getElementById('crop-name').value;
  const quantity = document.getElementById('quantity').value;
  const location = document.getElementById('location').value;

  const produceData = { cropName, quantity, location };

  fetch(`${API_BASE_URL}/post-produce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produceData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // After posting produce, refresh the produce list
      if (data.success) {
        alert(data.message || 'Produce posted successfully!');
        // Clear form
        document.getElementById('produce-form').reset();
        // Dynamically update the produce list
        updateProduceList();
      } else {
        alert('Error posting produce.' + data.message);
      }
    })
    .catch((error) => console.error('Error posting produce:', error));
    alert('Error:' + error.message);
});

// Update the produce list by fetching the latest data
function updateProduceList() {
  fetch(`${API_BASE_URL}/produce`)
    .then((response) => response.json())
    .then((data) => {
      const produceList = document.getElementById('buyers-list');
      produceList.innerHTML = ''; // Clear existing list
      data.forEach((produce) => {
        const listItem = `<li>${produce.cropName} - ${produce.quantity}kg - ${produce.location}</li>`;
        produceList.innerHTML += listItem;
      });
    })
    .catch((error) => console.error('Error fetching produce:', error));
}

// Call the functions to initialize data
fetchBuyers();
updateProduceList(); // Fetch and display initial produce data

// Add reusable function for creating table rows for market prices
function createTableRow(crop, price, market) {
  return `
    <tr>
      <td>${crop}</td>
      <td>${price} KES</td>
      <td>${market}</td>
    </tr>
  `;
}

// Handle error messages for form validation
function showError(message) {
  alert(message); // You can replace this with a styled error message.
}

// Example usage in the form submission handler
document.getElementById("produce-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const cropName = document.getElementById("crop-name").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!cropName || !quantity || !location) {
    showError("All fields are required.");
    return;
  }
});
