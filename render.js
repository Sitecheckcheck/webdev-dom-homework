import { likeButton } from "./script.js";
import { inputClick } from "./script.js";

export const renderComments = (comments, element, getListComments) => {
  const commentHtml = comments
    .map((comment, index) => getListComments(comment, index))
    .join("");

  element.innerHTML = commentHtml;
  likeButton();
  inputClick();
};
