
const url = "http://127.0.0.1:8000/api/v1";
const url1 = "http://127.0.0.1:8000/"
const urlContest = url + "/contest/";

const getRequest = (urlRequest, url404) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", urlRequest, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(xhr.responseText);
      console.log(response[0].a);
      let image = document.getElementById("main_img")
      image.setAttribute("src", `${url1}${response[0].f}`)
      let h = document.getElementById("main_text")
      h.textContent = response[0].h

      if (response[0]["a"] === true) {

        let button = document.createElement("a")
        button.textContent = "Зарегистрироваться"
        button.setAttribute("class","btn btn-default text-red")
        button.setAttribute("href",`${url1}register/`)

        document.getElementById("register_but").append(button)
        return response;
      } else {
        let tag = document.getElementById("contest_reigster")
        let text = document.createElement("h3")
        text.textContent = "Регистрация завершена, удачи всем зарегистрированным участникам!"
        text.setAttribute("class", "pt-5 pb-3 mx-3 form-subtitle text-red text-center")
        tag.append(text)
        // window.location = url404;
      }
    }
  };
  xhr.send();
};

document.addEventListener("DOMContentLoaded", (e) => {
  getRequest(urlContest, urlContest);
});