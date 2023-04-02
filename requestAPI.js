export function apiGet() {
  return fetch(
    "https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments",
    {
      method: "GET",
    })
  .then(response => response.json());
}
  


export function apiPost(textValue, nameValue) {
  return fetch(
    "https://webdev-hw-api.vercel.app/api/v1/pavel-danilov/comments",
    {
      method: "POST",
      body: JSON.stringify({
        text: textValue,
        name: nameValue,
        forceError: false,
      }),
    }
  );
}
