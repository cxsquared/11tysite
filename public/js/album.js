(async () => {
  const columns = document.getElementsByClassName("column")

  const tempPhotos = []
  for(let i = 0; i < 6; i++) {
    tempPhotos.push({
      id: i + 1,
      date: Date.UTC(new Date()),
      description: "this is a tes",
    })
  }

  const maxColumn = columns.length
  const maxRows = 2

  let currentColumn = 0
  let currentRow = 0

  function addToGrid(photo) {
    let column = columns[currentColumn]

    if (!column) {
      currentColumn = 0
      currentRow = 0
      column = columns[currentColumn] 

      if (!column)
        return
    }

    const rows = column.getElementsByClassName("row") 
    let row = rows[currentRow]

    if (!row) {
      currentColumn = (currentColumn + 1) % maxColumn
      currentRow = 0
      addToGrid(photo)
      return
    }

    row.innerHTML =
      /*html*/
      `<img class="photo" onclick="(function(){ window.open('/img/album/${photo.id}.png', '_blank').focus()})()" src="/img/album/thumb-${photo.id}.png" loading="lazy" alt"${new Date(photo.date).toLocaleString()}: ${escapeHTML(photo.description)}" title="${new Date(
        photo.date,
      ).toLocaleString()}: ${escapeHTML(photo.description)}">`;

    currentRow++

    if (currentRow >= maxRows) {
      currentColumn = (currentColumn + 1) % maxColumn
      currentRow = 0
    }
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

  for(const photo of tempPhotos) {
    addToGrid(photo);
  }
})();
