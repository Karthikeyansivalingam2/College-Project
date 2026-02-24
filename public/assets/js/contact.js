const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const first = form.firstName.value.trim();
  const last = form.lastName.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (first.length < 3) {
    alert("First name must be at least 3 characters");
    return;
  }

  if (last.length < 1) {
    alert("Last name must be at least 3 characters");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Enter valid email address");
    return;
  }

  if (message.length < 10) {
    alert("Message must be at least 10 characters");
    return;
  }

  const enquiryData = {
    name: `${first} ${last}`,
    email: email,
    mobile: "Contact Page", // No mobile field in this form, using placeholder
    company: "General Inquiry",
    package: message
  };

  fetch('/api/enquire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Message sent successfully! Ref: " + data.enquiryId);
        form.reset();
      } else {
        alert("Error sending message.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error.");
    });
});