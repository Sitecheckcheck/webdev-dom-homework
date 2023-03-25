const buttonElement = document.getElementById("add-button");
const buttonDelElement = document.getElementById("delete-button");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const listElement = document.getElementById("list");
const inputElement = document.getElementById("input-box");

checkParams();

function fetchRenderComments(){
  return fetch("https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments", {
    method: "GET",
  }).then((response) => {
    response.json().then((responseData) => {
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

      comments = appComments;
      renderComments();
      checkParams();
    });
  });
};

let comments = [];

const renderComments = () => {
  const commentHtml = comments
    .map((comment, index) => {
      return `<li class="comment" data-index = '${index}'>
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${comment.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button data-index ='${index}' class="like-button ${
        comment.isLike ? "-active-like" : ""
      }"></button>
        </div>
      </div>
    </li>`;
    })
    .join("");

  listElement.innerHTML = commentHtml;
  likeButton();
  checkParams();
  inputClick();
};

fetchRenderComments();
renderComments();

function likeButton() {
  const likeElements = document.querySelectorAll(".like-button");
  for (const i of likeElements) {
    i.addEventListener("click", (event) => {
      event.stopPropagation();
      checkParams();
      if (i.classList.contains("-active-like")) {
        comments[i.dataset.index].isLike = false;
        comments[i.dataset.index].likes -= 1;
      } else {
        comments[i.dataset.index].isLike = true;
        comments[i.dataset.index].likes++;
      }
      renderComments();
    });
  }
}

likeButton();

function checkParams() {

  const nameInputElement = document.getElementById("name-input");
  const textInputElement = document.getElementById("text-input");
  const buttonElement = document.getElementById("add-button");
  
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

  buttonElement.addEventListener("click", () => {
    if (nameInputElement.value === "" || textInputElement.value === "") {
      return;
    }
  
    inputElement.innerHTML = "<p>Комментарий добавляется...</p>";
  
    fetch("https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments", {
      method: "POST",
      body: JSON.stringify({
        text: textInputElement.value,
        name: nameInputElement.value,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(()=>{
        return fetchRenderComments();
      })
      .then(() => {
        inputElement.innerHTML = `<input id="name-input" type="text" class="add-form-name" placeholder="Введите ваше имя">
        <textarea id="text-input" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
        <div class="add-form-row">
          <button id="add-button" class="add-form-button" disabled="" style="background-color: gray;">Написать</button>
        </div>
        <div class="add-form-row">
          <button id="delete-button" class="add-form-button">
            Удалить последний комментарий
          </button>
        </div>`;
      });
  
    nameInputElement.value = "";
    textInputElement.value = "";
  });
}

buttonElement.addEventListener("click", () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    return;
  }

  inputElement.innerHTML = "<p>Комментарий добавляется...</p>";

  fetch("https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments", {
    method: "POST",
    body: JSON.stringify({
      text: textInputElement.value,
      name: nameInputElement.value,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then(()=>{
      return fetchRenderComments();
    })
    .then(() => {
      inputElement.innerHTML = `<input id="name-input" type="text" class="add-form-name" placeholder="Введите ваше имя">
      <textarea id="text-input" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
      <div class="add-form-row">
        <button id="add-button" class="add-form-button" disabled="" style="background-color: gray;">Написать</button>
      </div>
      <div class="add-form-row">
        <button id="delete-button" class="add-form-button">
          Удалить последний комментарий
        </button>
      </div>`;
    });

  nameInputElement.value = "";
  textInputElement.value = "";
});

renderComments();

buttonDelElement.addEventListener("click", () => {
  listElement.innerHTML = listElement.innerHTML.substring(
    0,
    listElement.innerHTML.lastIndexOf('<li class="comment">')
  );
});

function inputClick() {
  const inputInElement = document.querySelectorAll(".add-form-text");
  for (const i of inputInElement) {
    i.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}

document.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    document.getElementById("add-button").click();
  }
  checkParams();
});
