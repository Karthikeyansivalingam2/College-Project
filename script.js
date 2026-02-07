document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');

    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = signinForm.querySelectorAll('input');
            const username = inputs[0].value;
            const password = inputs[1].value;

            // Simple validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }

            try {
                // Call Backend API
                // Currently using a mock login, but ready for real auth
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: username, password: password }) // server expects 'email' key
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login Successful!');
                    // Save User State
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                } else {
                    alert('Login Failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Is the server running?');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = signupForm.querySelectorAll('input');
            // Assuming order: Username, Email, Password, Confirm Password
            const username = inputs[0].value;
            const email = inputs[1].value;
            const password = inputs[2].value;
            const confirmPassword = inputs[3].value;

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration Successful! Please login.');
                    // Switch to login view
                    document.body.classList.remove("signup");
                } else {
                    alert('Registration Failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration.');
            }
        });
    }
});
