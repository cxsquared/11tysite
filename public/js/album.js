(async () => {
  const columns = document.getElementsByClassName("column")

  const photoDataResponse = await fetch("/photos/data.json")

  if (!photoDataResponse.ok)
    return

  const photoData = await photoDataResponse.json()

  const maxColumn = columns.length
  const maxRows = 2
  const imagesPerPage = maxRows * maxColumn

  let currentColumn = 0
  let currentRow = 0

  let currentPage = 0;
  const maxPages = Math.floor(photoData.photos.length / imagesPerPage)

  function clearPhotoGrid() {
    for (let c = 0; c < maxColumn; c++) {
      const column = columns[c]
      if (!column)
        continue

      const rows = column.getElementsByClassName("row") 
      for (let r = 0; r < maxRows; r++) {
        const row = rows[r]
        if (!row)
          continue

        row.innerHTML = "";
      }
    }
  }

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

    const verticalClassName = photo.vertical ? " vertical" : "";
    const localDate = new Date(photo.takenAt * 1000).toLocaleString() // * 1000 cause I hate JS (they want miliseconds not seconds)

    row.innerHTML =
      /*html*/
      `<div class="photo-container${verticalClassName}"><img class="photo${verticalClassName}" onclick="(function(){ window.open('${photo.full_url}', '_blank').focus()})()" src="${photo.thumb_url}" loading="lazy" alt="${localDate}: ${escapeHTML(photo.description)}" title="${localDate}: ${escapeHTML(photo.description)}"><span class="date">${localDate}</span></div>`;

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

  function updateVisiblePhotos() {
    clearPhotoGrid();
    const start = currentPage * imagesPerPage
    const end = Math.min(start + imagesPerPage, photoData.photos.length);
    for(const photo of photoData.photos.slice(start, end)) {
      addToGrid(photo);
    }
  }

  function prevPage() {
    currentPage = Math.max(currentPage - 1, 0)
    currentColumn = 0
    currentRow = 0
    updateVisiblePhotos()
  }

  function nextPage() {
    currentPage = Math.min(currentPage + 1, maxPages)
    currentColumn = 0
    currentRow = 0
    updateVisiblePhotos()
  }

  document.addEventListener("keydown", async (e) => {
    // LEFT
    if (e.code === 'ArrowRight' || e.code === 'KeyK' || e.code === 'KeyD') {
       nextPage();
    }
    // RIGHT
    if (e.code === 'ArrowLeft' || e.code === 'KeyJ' || e.code === 'KeyA') {
      prevPage();
    }
  })

  updateVisiblePhotos();
})();
