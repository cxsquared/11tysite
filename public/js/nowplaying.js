var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

let now = null 

function preloadImages() {
  for (var i = 0; i < now.length; i++) {
    var img = new Image();
    img.src = now[i].image;
    now[i].preloadImage = img;
  }
}

function setNow() {
  var featuredNow = now[Math.floor(Math.random() * now.length)];

  var imageElement = document.createElement("img");
  imageElement.src = featuredNow.preloadImage.src;
  imageElement.style.width = "100%";
  imageElement.style.height = "100%";
  imageElement.style.objectFit = "cover";
  var imgContainer = document.getElementById("now-image");
  imgContainer.innerHTML = "";
  imgContainer.appendChild(imageElement);

  var titleContainer = document.getElementById("now-title");
  titleContainer.textContent = "Now " + featuredNow.verb;

  var nameContainer = document.getElementById("now-name");
  nameContainer.textContent = featuredNow.name;

  var link = document.getElementById("now-link");
  link.href = featuredNow.url;
}

function featuredNow() {
  if (!now) {
    getJSON('/data/media.json', 
      function(err, data) {
        if (err !== null)
          return;

        now = data.now;
        preloadImages();
        setNow();
      }
    )
    return;
  } 

  setNow();
}

featuredNow();
setInterval(featuredNow, 10000);
