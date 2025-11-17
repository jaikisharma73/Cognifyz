 function validateForm() {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!name || !email || !password) {
                alert("All fields are required!");
                return false;
            }
            return true;
        }