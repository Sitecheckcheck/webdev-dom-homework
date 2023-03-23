const buttonElement = document.getElementById("add-button");
const buttonDelElement = document.getElementById("delete-button");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const listElement = document.getElementById("list");
const inputElement = document.querySelectorAll(".add-form");
// let isLoading = false;

// renderInput();

function getApi() {
  
  const result = fetch(
    "https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments",
    {
      method: "GET",
    }
  );

  result.then((response) => {
    const jsonPromise = response.json();
    jsonPromise.then((responseData) => {
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
      isLoading = false;
      // renderInput();
      checkParams();  
    });    
  });
}

getApi();


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
  // editComment();
  // answer();
  // saveComment();
  // answer();
  inputClick();
};

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

// buttonElement.disabled = true;

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

buttonElement.addEventListener("click", () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    return;
  }

  isLoading = true;
  // renderInput();

  fetch("https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments", {
    method: "POST",
    body: JSON.stringify({
      text: textInputElement.value,
      name: nameInputElement.value,
    }),
  })
    .then(() => {
      // isLoading = false;
      getApi();
    })

    .catch(() => {
      conosle.log("произошла ошибка");
    });

  nameInputElement.value = "";
  textInputElement.value = "";
  
  renderComments();
  checkParams();

  // answer();
  // editComment();
});

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

// let inputHtml = "";

function renderInput() {
  for (const i of inputElement) {

  if (isLoading === true) {
    i.innerHTML = `
    <p>
      Комментарий добавляется...
    </p>  
  `;
  } else {
    i.innerHTML = `   
    <input id="name-input" type="text" class="add-form-name" placeholder="Введите ваше имя">
    <textarea id="text-input" type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div class="add-form-row">
      <button id="add-button" class="add-form-button" disabled="" style="background-color: gray;">Написать</button>
    </div>
    <div class="add-form-row">
      <button id="delete-button" class="add-form-button">
        Удалить последний комментарий
      </button>
    </div>
    `;
  }

  checkParams();
};}

checkParams();

// function answer() {
//   const commentBox = document.querySelectorAll(".comment");
//   let x = "";
//   let addQuote = () => {};
//   for (const i of commentBox) {
//     i.addEventListener("click", () => {
//       x = `QUOTE_BEGIN ${comments[i.dataset.index].name}: \n ${
//         comments[i.dataset.index].comment
//       } QUOTE_END`;
//       // textInputElement.value = `QUOTE_BEGIN ${comments[i.dataset.index].name}: \n ${comments[i.dataset.index].comment} QUOTE_END`;
//       textInputElement.value =
//         ">" +
//         comments[i.dataset.index].comment +
//         "\n\n" +
//         comments[i.dataset.index].name +
//         "," +
//         " ";
//       function addQuote() {
//         textInputElement.value = `QUOTE_BEGIN ${
//           comments[i.dataset.index].name
//         }: \n ${comments[i.dataset.index].comment} QUOTE_END`;
//       }
//     });
//   }
// }

// comments.push({
//   name: nameInputElement.value
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;"),
//   date: now.replace(",", " "),
//   comment: textInputElement.value
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;"),
//   likeCount: 0,
//   likeIn: "",
//   button: "редактировать",
// });

// function editComment() {
//   const editElement = document.querySelectorAll(".remove");

//   for (const i of editElement) {
//     const commentOld = comments[i.dataset.index].comment;
//     i.addEventListener("click", (event) => {
//       event.stopPropagation();
//       comments[i.dataset.index].comment = `<textarea
//       id="text-input-in"
//       type="textarea"
//       class="add-form-text"

//       rows="4"
//     ></textarea>`;

//       comments[i.dataset.index].button = "сохранить";

//       renderComments();
//       const textInputElement = document.getElementById("text-input-in");
//       textInputElement.value = commentOld;
//     });
//   }
// }

// function saveComment() {
//   const editElement = document.querySelectorAll(".remove");
//   const textInputElementIn = document.getElementById("text-input-in");

//   for (const i of editElement) {
//     i.addEventListener("click", (event) => {
//       console.log(textInputElementIn.value);
//       event.stopPropagation();
//       comments[i.dataset.index].comment = textInputElementIn.value;
//       comments[i.dataset.index].button = "редактировать";
//       renderComments();
//     });
//     inputClick ();
//   }
// }
