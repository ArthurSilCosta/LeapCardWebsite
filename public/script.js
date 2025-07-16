// All constants
document.addEventListener("DOMContentLoaded", () => { 
    const showSignupButton = document.getElementById("showSignup");
    const showLoginButton = document.getElementById("showLogin");
    const initialOptions = document.getElementById("initialOptions");
    const signupContent = document.getElementById("signup");
    const loginContent = document.getElementById("login");
    const goToLoginButton = document.getElementById("goToLogin");
    const goToSignupButton = document.getElementById("goToSignup");
      // Sign up button event listener
    showSignupButton.addEventListener("click", () => {
        initialOptions.classList.add("hidden");
        loginContent.classList.remove("active");
        signupContent.classList.add("active");
    });
// Log in button event listener
    showLoginButton.addEventListener("click", () => {
        initialOptions.classList.add("hidden");
        signupContent.classList.remove("active");
        loginContent.classList.add("active");
    });
//  activating Log in button event listener
    goToLoginButton.addEventListener("click", () => {
        signupContent.classList.remove("active");
        loginContent.classList.add("active");
    });
// activating Sign up button event listener
    goToSignupButton.addEventListener("click", () => {
        loginContent.classList.remove("active");
        signupContent.classList.add("active");
    });
    // submit button to the form
    document.getElementById("registerForm").addEventListener("submit", (e) => {
        e.preventDefault();
        // checking if all the form is filled
        if (!e.target.checkValidity()) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
    
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                return res.text();
            })
            .then((message) => {
                alert(message);
            })
            .catch((err) => {
                console.error(err);
                alert("Registration failed.");
            });
    });

    document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            alert("Please enter your email or tracking number.");
            return;
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                return res.text();
            })
            .then((message) => {
                alert(message);
            })
            .catch((err) => {
                console.error(err);
                alert("Login failed.");
            });
    });
});
