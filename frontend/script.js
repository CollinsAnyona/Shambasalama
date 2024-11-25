// Get HTML elements
const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");

// Toggle between login and sign-up
registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Handle login functionality
document.querySelector(".sign-in form").addEventListener("submit", (event) => {
  event.preventDefault(); 
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username && password) {
    // Send login request to the API
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password");
        }
        return response.json();
      })
      .then((data) => {
        // Login successful, store the token in localStorage
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);
        window.location.href = "index.html"; 
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Invalid username or password. Please try again.");
      });
  } else {
    alert("Please enter both username and password."); 
  }
});

// Handle user registration
function signUpUser() {
  // Get values from inputs
  const username = document.getElementById("sign-up-user").value.trim();
  const password = document.getElementById("sign-up-pass").value.trim();
  const confirmPassword = document.getElementById("sign-up-ConPass").value.trim();

  // Check that password and confirm password match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Prepare data to send
  const userData = {
    username: username,
    password: password,
  };

  // Send registration data using fetch
  fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // On successful registration
      console.log("User registered successfully:", data);
      alert("User registered successfully!");
      container.classList.remove("active"); 
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      alert("An error occurred while creating the user.");
    });
}

// Call the user registration function when the sign-up button is clicked
document.getElementById("Up").addEventListener("click", signUpUser);
