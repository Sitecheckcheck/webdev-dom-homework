const buttonElement = document.getElementById("add-button");
const buttonDelElement = document.getElementById("delete-button");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const listElement = document.getElementById("list");
const inputElement = document.getElementById("input-box");
const loadingElement = document.getElementById('loading-box')
let x = 0;

function fetchRenderComments() {

  inputElement.classList.add('loading');

  return fetch(
    "https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments",
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
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
      renderComments();
    })
    .catch((error) => {
      alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}

buttonDelElement.addEventListener("click", () => {
  comments.pop();
  renderComments();
});

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
  inputClick();
};

fetchRenderComments();
likeButton();
checkParams();
renderComments();

buttonElement.addEventListener("click", () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    return;
  }

  inputElement.classList.add('loading');
  loadingElement.classList.remove('loading');

  fetch("https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments", {
    method: "POST",
    body: JSON.stringify({
      text: textInputElement.value,
      name: nameInputElement.value,
      forceError: true,
    }),
  })
    .then((response) => {
      
      if (response.status === 201) {
        
        return response.json();
      } else if (response.status === 400){
        x = 1;
        throw new Error ('Имя и комментарий должны быть не короче 3 символов');
      } else if (response.status === 500) {
        x = 2;
        throw new Error ('Сервер упал');
      } else {
        x = 1;
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
      if (x === 0) {
        alert('Кажется, у вас сломался интернет, попробуйте позже')
      } else if (x === 2) {
        buttonElement.click();
      }
      else {
        alert(error.message)
      };
      x=0;
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
  // const nameInputElement = document.getElementById("name-input");
  // const textInputElement = document.getElementById("text-input");
  // const buttonElement = document.getElementById("add-button");

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

function likeButton() {
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
        renderComments();
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

function inputClick() {
  const inputInElement = document.querySelectorAll(".add-form-text");
  for (const i of inputInElement) {
    i.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}
