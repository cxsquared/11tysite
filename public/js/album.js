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
      currentRow = 0
      addToGrid(photo)
      return
    }

    const className = photo.vertical ? "photo vertical" : "photo";
    const localDate = new Date(photo.takenAt * 1000).toLocaleString() // * 1000 cause I hate JS (they want miliseconds not seconds)

    row.innerHTML =
      /*html*/
      `<img class="${className}" onclick="(function(){ window.open('${photo.full_url}', '_blank').focus()})()" src="${photo.thumb_url}" loading="lazy" alt="${localDate}: ${escapeHTML(photo.description)}" title="${localDate}: ${escapeHTML(photo.description)}">`;

    currentColumn++

    if (currentColumn >= maxColumn) {
      currentColumn = 0 
      currentRow = (currentRow + 1) % maxRows 
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
