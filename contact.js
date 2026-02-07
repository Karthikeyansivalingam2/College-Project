const form = document.getElementById("contactForm");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const first = form.firstName.value.trim();
  const last = form.lastName.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(first.length < 3){
    alert("First name must be at least 3 characters");
    return;
  }

  if(last.length < 1){
    alert("Last name must be at least 3 characters");
    return;
  }

  if(!emailRegex.test(email)){
    alert("Enter valid email address");
    return;
  }

  if(message.length < 10){
    alert("Message must be at least 10 characters");
    return;
  }

  alert(" Message sent successfully!");
  form.reset();
});