const form = document.getElementById("form__login");

function notifyUser(message) {
  const container = document.getElementById("container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}</h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 5500);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const obj = {
    email: email.value,
    password: password.value,
  };

  email.value = "";
  password.value = "";
  axios
    .post("http://localhost:5000/user/login", obj)
    .then((res) => {
      notifyUser(res.data.message);
      window.location.href = "http://127.0.0.1:5500/frontEnd/index.html";
      // alert(res.data.message)
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
});
