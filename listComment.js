export const getListElementComments = (comment, index) => {
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
  };