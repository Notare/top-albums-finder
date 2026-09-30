const searchForm = document.querySelector(".search-form");
const searchStatusHeading = document.querySelector(".input-section h2");
searchForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  getAlbums();
});

function getAlbums() {
  const inputValue = document.querySelector("input").value.toLowerCase().trim();
  const artistTopAlbumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
    inputValue,
  )}&api_key=5520b2454cda41fe7c2e6349b1627f55&format=json`;
  const containerLandingPage = document.querySelector(
    ".container-landing-page",
  );
  containerLandingPage.style.minHeight = "auto";

  searchStatusHeading.textContent = "Loading...";

  fetch(artistTopAlbumsUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      document.querySelector(".albums").innerHTML = "";

      const topAlbums = data.topalbums?.album;
      if (!Array.isArray(topAlbums) || topAlbums.length === 0) {
        searchStatusHeading.textContent =
          "It looks like the artist you entered isn't in the database. Double-check the spelling or try a different one.";
        return;
      }

      const artist = topAlbums[0].artist.name;
      if (inputValue === artist.toLowerCase()) {
        searchStatusHeading.textContent = `Artist: ${artist}`;

        topAlbums.forEach((album) => {
          const name = album.name;
          const url = album.url;
          const coverUrl = album.image[3]["#text"];
          const cardEl = document.createElement("section");
          const coverImgEl = document.createElement("img");
          const nameEl = document.createElement("h2");
          const linkEl = document.createElement("a");
          const listenersEl = document.createElement("p");
          const tracklistBtn = document.createElement("button");
          const tracklistEl = document.createElement("ol");

          fetch(
            `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=5520b2454cda41fe7c2e6349b1627f55&artist=${encodeURIComponent(inputValue)}&album=${encodeURIComponent(name)}&format=json`,
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
              }
              return res.json();
            })
            .then((data2) => {
              if (!data2?.album) {
                tracklistBtn.disabled = true;
                tracklistBtn.textContent = "Tracklist unavailable";
                return;
              }

              const listeners = data2.album.listeners;
              listenersEl.textContent =
                `${listeners
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} listeners` ||
                "Number of listeners and tracklist not found";

              const tracks = data2.album.tracks?.track;
              if (!Array.isArray(tracks) || tracks.length === 0) {
                tracklistBtn.disabled = true;
                tracklistBtn.textContent = "Tracklist unavailable";
                return;
              }

              tracks.forEach((track) => {
                const tracklistItem = document.createElement("li");
                tracklistItem.textContent = track.name;
                tracklistEl.appendChild(tracklistItem);
              });
              cardEl.appendChild(tracklistEl);
            })
            .catch((err) => {
              console.error(`Could not load details for ${name}`, err);
              tracklistBtn.disabled = true;
              tracklistBtn.textContent = "Tracklist unavailable";
            });

          coverImgEl.src = coverUrl;
          cardEl.classList.add("album");
          linkEl.textContent = name;
          linkEl.href = url;
          linkEl.setAttribute("target", "_blank");
          tracklistBtn.textContent = "See Tracklist";
          tracklistBtn.classList.add("btn-tracklist");
          // releaseDateEl.textContent = releaseDate;

          if (coverUrl === "") {
            coverImgEl.src = "./img/cover-not-found.png";
          }

          if (linkEl.textContent.includes("null")) {
            cardEl.style.display = "none";
          }

          tracklistBtn.addEventListener("click", (ev) => {
            tracklistEl.classList.toggle("show");
            ev.stopPropagation();

            if (tracklistEl.classList.contains("show")) {
              tracklistBtn.textContent = "Hide Tracklist";
            } else {
              tracklistBtn.textContent = "See Tracklist";
            }
          });

          document.querySelector(".albums").append(cardEl);
          cardEl.append(coverImgEl, nameEl, listenersEl, tracklistBtn);
          nameEl.append(linkEl);

          //make text selectable while making the whole container clickable to open link
          cardEl.addEventListener("click", () => {
            const isTextSelected = window.getSelection().toString();
            if (linkEl.href && !isTextSelected) {
              window.open(linkEl.href);
            }
          });

          //stop opening two links when clicking on the album name
          const clickableElements = Array.from(cardEl.querySelectorAll("a"));
          clickableElements.forEach((el) =>
            el.addEventListener("click", (ev) => ev.stopPropagation()),
          );
        });
      } else {
        searchStatusHeading.textContent =
          "It looks like the artist you entered isn't in the database. Double-check the spelling or try a different one.";
      }
    })
    .catch((err) => {
      console.log(`error ${err}`);
      searchStatusHeading.textContent =
        "We couldn’t load the albums right now. Please try again.";
      document.querySelector(".albums").innerHTML = "";
    });
}

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
