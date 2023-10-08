const btn = document.querySelector("button");
const input = document.querySelector("input");

btn.addEventListener("click", getTopAlbums);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

const btnBackToTop = document.querySelector(".btn-back-to-top");
btnBackToTop.addEventListener("click", topFunction);
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnBackToTop.style.display = "block";
  } else {
    btnBackToTop.style.display = "none";
  }
}
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function getTopAlbums() {
  const inputValue = document.querySelector("input").value.toLowerCase().trim();
  const artistTopAlbumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
    inputValue
  )}&api_key=5520b2454cda41fe7c2e6349b1627f55&format=json`;

  if (inputValue === "") {
    document.querySelector("h2").innerText =
      "You must type the full name of an artist";
  }

  fetch(artistTopAlbumsUrl)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      const topAlbums = data.topalbums.album;
      const artistName = data.topalbums.album[0].artist.name;

      document.querySelector(".albums").innerHTML = "";
      document.querySelector("h2").innerText = `Artist: ${artistName}`;

      topAlbums.forEach((album) => {
        const albumName = album.name;
        const albumUrl = album.url;
        const albumCover = album.image[3]["#text"];
        const createSection = document.createElement("section");
        const createImg = document.createElement("img");
        const createH2 = document.createElement("h2");
        const createAnchor = document.createElement("a");
        const createParagraph = document.createElement("p");
        const createBtn = document.createElement("button");
        const createList = document.createElement("ol");

        fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=5520b2454cda41fe7c2e6349b1627f55&artist=${inputValue}&album=${albumName}&format=json`
        )
          .then((res) => res.json()) // parse response as JSON
          .then((data2) => {
            data2.album.tracks.track.forEach((track) => {
              const createListItem = document.createElement("li");
              createListItem.textContent = track.name;
              createList.appendChild(createListItem);
            });
            createSection.appendChild(createList);

            if (data2.album) {
              createParagraph.innerText = `${data2.album.listeners
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} listeners`;
            }
          });

        createImg.src = albumCover;
        createSection.classList.add("album");
        createAnchor.innerText = albumName;
        createAnchor.href = albumUrl;
        createAnchor.setAttribute("target", "_blank");
        createBtn.innerText = "See Tracklist";
        createBtn.classList.add("btn-tracklist");

        if (albumCover === "") {
          createImg.src = "./img/cd.png";
        }

        if (createAnchor.innerText.includes("null")) {
          createSection.style.display = "none";
        }

        createBtn.addEventListener("click", (e) => {
          createList.classList.toggle("show");
          e.stopPropagation();

          if (createList.classList.contains("show")) {
            createBtn.textContent = "Hide Tracklist";
          } else {
            createBtn.textContent = "See Tracklist";
          }
        });

        document.querySelector(".albums").append(createSection);
        createSection.append(createImg, createH2, createParagraph, createBtn);
        createH2.append(createAnchor);

        //make text selectable while making the whole container clickable to open link
        const albumSections = document.querySelectorAll(".album");
        albumSections.forEach((albumSection) => {
          albumSection.addEventListener("click", () => {
            const isTextSelected = window.getSelection().toString();
            if (createAnchor.href && !isTextSelected) {
              window.open(createAnchor.href);
            }
          });
        });

        //stop opening two links when clicking on the album name
        const clickableElements = Array.from(
          createSection.querySelectorAll("a")
        );
        clickableElements.forEach((el) =>
          el.addEventListener("click", (e) => e.stopPropagation())
        );
      });
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}
