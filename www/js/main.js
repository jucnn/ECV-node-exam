baseUrlApi = `${window.location.protocol}//${window.location.host}`;

async function logout() {
  await fetch(baseUrlApi + '/auth/logout')
  .then((response) => (response.ok ? response.json() : response))
  .catch((error) => console.log(error));

  window.location.reload();

}

function like(type, operation, id, likeId) {
  let payload = {
    post: null,
    comment: null,
  };

  switch (type) {
    case "post":
      payload.post = id;
      break;
    case "comment":
      payload.comment = id;
      break;
    default:
      return;
  }

  let options = null;
  let urlApi = null;

  switch (operation) {
    case "delete":
      options = {
        method: "DELETE",
      };
      urlApi = baseUrlApi + `/api/like/${likeId}`;
      break;
    case "create":
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };
      urlApi = baseUrlApi + `/api/like`;
      break;
    default:
      return;
  }

  fetch(urlApi, options)
    .then((response) => (response.ok ? response.json() : response))
    .catch((error) => console.log(error));

  window.location.reload();
}

function deleteComment(id) {
  fetch(baseUrlApi + `/comment/${id}`, {
    method: "DELETE",
  })
    .then((response) => (response.ok ? response.json() : response))
    .catch((error) => console.log(error));

  window.location.reload();
}
