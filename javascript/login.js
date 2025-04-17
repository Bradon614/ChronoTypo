
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const usernameInput = document.querySelector("input.text");
    const passwordInput = document.querySelector("input.Password");
    const loginBtn = document.querySelector(".btn");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (username !== "" && password !== "") {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loader"></span> Logging in...';

        setTimeout(() => {
          window.location.href = "index.html";
        }, 3000);
      } else {
        alert("Veuillez remplir les deux champs !");
      }
    });
  });