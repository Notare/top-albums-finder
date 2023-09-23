const btn = document.querySelector("button");
const input = document.querySelector("input");

btn.addEventListener("click", getTopAlbums);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

const btnTracklist = document.querySelector(".btn-tracklist");
btnTracklist.addEventListener("click", toggleTracklist);
function toggleTracklist() {
  const ol = document.querySelector("ol");

  if (ol.style.display === "" || ol.style.display === "none") {
    ol.style.display = "block";
  } else {
    ol.style.display = "none";
  }
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
        const section = document.createElement("section");
        const img = document.createElement("img");
        const h2 = document.createElement("h2");
        const a = document.createElement("a");
        const p = document.createElement("p");
        const btn = document.createElement("button");
        const ol = document.createElement("ol");

        fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=5520b2454cda41fe7c2e6349b1627f55&artist=${inputValue}&album=${albumName}&format=json`
        )
          .then((res) => res.json()) // parse response as JSON
          .then((data2) => {
            data2.album.tracks.track.forEach((track) => {
              const li = document.createElement("li");
              li.textContent = track.name;
              ol.appendChild(li);
            });
            section.appendChild(ol);
            ol.style.display = "none";

            if (data2.album) {
              p.innerText = `${data2.album.listeners
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} listeners`;
            }

            if (a.innerText.includes("null")) {
              section.remove();
            }

            if (albumCover === "") {
              img.src = "./img/cd.png";
            }
          });

        img.src = albumCover;
        section.classList.add("album");
        a.innerText = albumName;
        a.href = albumUrl;
        a.setAttribute("target", "_blank");
        btn.innerText = "Toggle Tracklist";
        btn.classList.add("btn-tracklist");
        ol.classList.add("tracklist");

        document.querySelector(".albums").append(section);
        section.append(img, h2, p, btn);
        h2.append(a);

        //make text selectable without while making the whole container clickable to open link
        // const albumSections = document.querySelectorAll(".album");
        // albumSections.forEach((albumSection) => {
        //   albumSection.addEventListener("click", () => {
        //     const isTextSelected = window.getSelection().toString();
        //     if (a.href && !isTextSelected) {
        //       window.open(a.href);
        //     }
        //   });
        // });

        //stop opening two links when clicking on the album name
        const clickableElements = Array.from(section.querySelectorAll("a"));
        clickableElements.forEach((el) =>
          el.addEventListener("click", (e) => e.stopPropagation())
        );
      });
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}
