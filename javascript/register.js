document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const usernameInput = document.querySelectorAll("input.text")[0];
    const emailInput = document.querySelectorAll("input.text")[1];
    const passwordInput = document.querySelector("input.Password");
    const registerBtn = document.querySelector(".btn");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (username && email && password) {
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="loader"></span> Registering...';

        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      } else {
        alert("Merci de remplir tous les champs !");
      }
    });
  });