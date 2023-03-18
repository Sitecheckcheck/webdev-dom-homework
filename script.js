const buttonElement = document.getElementById("add-button");
const buttonDelElement = document.getElementById("delete-button");
const nameInputElement = document.getElementById("name-input");
const textInputElement = document.getElementById("text-input");
const listElement = document.getElementById("list");

const comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22 12:08",
    comment: "Это будет первый комментарий на этой странице",
    likeCount: 3,
    likeIn: "",
    button: "редактировать",
  },
  {
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    comment: "Мне нравится как оформлена эта страница! ❤",
    likeCount: 75,
    likeIn: "-active-like",
    button: "редактировать",
  },
];

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
          ${comment.comment.replaceAll('QUOTE_BEGIN', "<div class='quote'>").replaceAll('QUOTE_END', '</div>')}
        </div>
        <!-- <button data-index ='${index}' class='remove add-form-button'>${comment.button}</button> -->
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likeCount}</span>
          <button data-index ='${index}' class="like-button ${comment.likeIn}"></button>
        </div>
      </div>
    </li>`;
    })
    .join("");

  listElement.innerHTML = commentHtml;
  likeButton();
  checkParams();
  // editComment();
  answer();
  // saveComment();
  // answer();
  inputClick ()
};

renderComments();

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

function likeButton() {
  const likeElements = document.querySelectorAll(".like-button");
  for (const i of likeElements) {
    i.addEventListener("click", (event) => {
      event.stopPropagation();
      if (i.classList.contains("-active-like")) {
        comments[i.dataset.index].likeIn = "";
        comments[i.dataset.index].likeCount -= 1;
      } else {
        comments[i.dataset.index].likeIn = "-active-like";
        comments[i.dataset.index].likeCount++;
      }
      renderComments();
    });
  }
}

buttonElement.disabled = true;

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

document.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    document.getElementById("add-button").click();
  }
  checkParams();
});

buttonElement.addEventListener("click", () => {
  if (nameInputElement.value === "" || textInputElement.value === "") {
    return;
  }

  const options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  };

  let now = new Date().toLocaleString("ru-RU", options);

  comments.push({
    name: nameInputElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
    date: now.replace(",", " "),
    comment: textInputElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
    likeCount: 0,
    likeIn: "",
    button: "редактировать",
  });

  nameInputElement.value = "";
  textInputElement.value = "";

  renderComments();
  answer();
  // editComment();
});

buttonDelElement.addEventListener("click", () => {
  listElement.innerHTML = listElement.innerHTML.substring(
    0,
    listElement.innerHTML.lastIndexOf('<li class="comment">')
  );
});


function answer() {
  const commentBox = document.querySelectorAll(".comment");
  let x = ''
  for (const i of commentBox) {
    i.addEventListener("click", () => {
      x = `QUOTE_BEGIN ${comments[i.dataset.index].name}: \n ${comments[i.dataset.index].comment} QUOTE_END`;
      textInputElement.value = `QUOTE_BEGIN ${comments[i.dataset.index].name}: \n ${comments[i.dataset.index].comment} QUOTE_END`;
      //  ">" + comments[i.dataset.index].comment + "\n\n" + comments[i.dataset.index].name + ',' + ' ';
    }); 
  } 
};


function inputClick () {
  const inputInElement = document.querySelectorAll('.add-form-text');
  for (const i of inputInElement) {
    i.addEventListener('click', (event)=>{
      event.stopPropagation();
    });
  }
}