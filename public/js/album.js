(async () => {
  const columns = document.getElementsByClassName("column")

  const photoDataResponse = await fetch("/photos/data.json")

  if (!photoDataResponse.ok)
    return

  const photoData = await photoDataResponse.json()

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

    const className = photo.vertical ? "photo vertical" : "photo";

    row.innerHTML =
      /*html*/
      `<img class="${className}" onclick="(function(){ window.open('${photo.full_url}', '_blank').focus()})()" src="${photo.thumb_url}" loading="lazy" alt"${new Date(photo.date).toLocaleString()}: ${escapeHTML(photo.description)}" title="${new Date(
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

  for(const photo of photoData.photos) {
    addToGrid(photo);
  }
})();
