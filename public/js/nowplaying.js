const now = [
  {
    name: "Kingdom Hearts: Birth By Sleep",
    image:
      "https://assets-prd.ignimgs.com/2022/01/18/kingdom-hearts-birth-by-sleep-button-crop-1642535836197.jpg",
    verb: "playing",
  },
  {
    name: "Old School Runescape",
    image: "https://www.runescape.com/img/rsp777/social-share.jpg?1",
    verb: "playing",
  },
  {
    name: "iRacing",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1rSzjE7Kh77GBP92rqYy51vziv5DP8wI5-Q&s",
    verb: "playing",
  },
  {
    name: "Jet Lag Season 11",
    image: "https://static.tvtropes.org/pmwiki/pub/images/jetlag.png",
    verb: "watching",
  },
];

function preloadImages() {
  for (var i = 0; i < now.length; i++) {
    var img = new Image();
    img.src = now[i].image;
    now[i].preloadImage = img;
  }
}

function featuredNow() {
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
}

document.onread
preloadImages();
featuredNow();
setInterval(featuredNow, 10000);
