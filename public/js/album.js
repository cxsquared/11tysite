(async () => {
  const board = document.getElementById("board");
  const photos = document.getElementById("photos");

  const tempPhoto = {
    id: 1,
    date: Date.UTC(new Date()),
    description: "this is a tes",
  };

  function addToGrid(photo) {
    photos.innerHTML =
      /*html*/
      `<img onclick="(function(){ window.open('/img/rawphotos/${photo.id}.png', '_blank').focus()})()" src="/img/thumb-rawphotos/${photo.id}.png" loading="lazy" alt"${new Date(photo.date).toLocaleString()}: ${escapeHTML(photo.description)}" title="${new Date(
        photo.date,
      ).toLocaleString()}: ${escapeHTML(photo.description)}">`;
  }

  function escapeHTML(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>")
      .replace(/\"/g, "&quot;")
      .replace(/\'/g, "&#039;");
  }

  addToGrid(tempPhoto);
})();
