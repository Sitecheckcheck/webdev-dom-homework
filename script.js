import { apiGet, apiPost } from "./requestAPI.js";
import { getListElementComments } from "./listComment.js";
import { renderComments } from "./render.js";

const buttonElement = document.getElementById("add-button");
const buttonDelElement = document.getElementById("delete-button");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const listElement = document.getElementById("list");
const inputElement = document.getElementById("input-box");
const loadingElement = document.getElementById('loading-box');

function fetchRenderComments() {

  inputElement.classList.add('loading');

  apiGet()
    .then((responseData) => {
      const options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        timezone: "UTC",
        hour: "numeric",
        minute: "2-digit",
      };

      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date).toLocaleString("ru-RU", options),
          text: comment.text,
          likes: comment.likes,
          isLike: false,
        };
      });

      inputElement.classList.remove('loading');
      loadingElement.classList.add('loading');

      comments = appComments;
      renderComments(comments, listElement, getListElementComments);
      likeButton();
      inputClick();
    })
    .catch((error) => {
      alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}

buttonDelElement.addEventListener("click", () => {
  comments.pop();
  renderComments(comments, listElement, getListElementComments);
  likeButton();
  inputClick();
});

let comments = [];

fetchRenderComments();
likeButton();
checkParams();
renderComments(comments, listElement, getListElementComments);

buttonElement.addEventListener("click", () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    return;
  }

  inputElement.classList.add('loading');
  loadingElement.classList.remove('loading');

  apiPost(textInputElement.value, nameInputElement.value)
    .then((response) => {
      
      if (response.status === 201) {
        
        return response.json();
      } else if (response.status === 400){
        throw new Error ('Имя и комментарий должны быть не короче 3 символов');
      } else if (response.status === 500) {
        throw new Error ('Сервер упал');
      } else {
        throw new Error ('Что то пошло не так');
      }
    })
    .then(() => {
      return fetchRenderComments();
    })
    .then(() => {
      inputElement.classList.remove('loading');
      loadingElement.classList.add('loading');
      nameInputElement.value = "";
      textInputElement.value = "";
    })
    .catch((error) => {
      console.log(error);
      if (error.message === 'Имя и комментарий должны быть не короче 3 символов' || error.message === 'Что то пошло не так') {
        alert(error.message)
      } else if (error.message === 'Сервер упал') {
        buttonElement.click();
      }
      else {
        alert('Кажется, у вас сломался интернет, попробуйте позже')
      };
      inputElement.classList.remove('loading');
      loadingElement.classList.add('loading');
    });
});

document.addEventListener("keyup", function (e) {
  checkParams();
  if (e.keyCode === 13) {
    document.getElementById("add-button").click();
  }
});

function checkParams() {

  if (
    nameInputElement.value.length != 0 &&
    textInputElement.value.length != 0
  ) {
    buttonElement.style.backgroundColor = "#bcec30";
    buttonElement.disabled = false;
  } else {
    buttonElement.style.backgroundColor = "gray";
    buttonElement.disabled = true;
    buttonElement.style.opacity = "";
  }
}

export function likeButton() {
  const likeElements = document.querySelectorAll(".like-button");
  for (const i of likeElements) {
    i.addEventListener("click", (event) => {
      event.stopPropagation();
      i.classList.add("-loading-like");
      delay(500).then(() => {
        if (i.classList.contains("-active-like")) {
          comments[i.dataset.index].isLike = false;
          comments[i.dataset.index].likes -= 1;
        } else {
          comments[i.dataset.index].isLike = true;
          comments[i.dataset.index].likes++;
        }
        i.classList.remove("-loading-like");
        renderComments(comments, listElement, getListElementComments);
        likeButton();
        inputClick();
      });
    });
  }
}

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export function inputClick() {
  const inputInElement = document.querySelectorAll(".add-form-text");
  for (const i of inputInElement) {
    i.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}
