const btn = document.querySelector("button");
const input = document.querySelector("input");

btn.addEventListener("click", getTopAlbums);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

function getTopAlbums() {
  const inputValue = document.querySelector("input").value.toLowerCase().trim();
  const artistTopAlbumsUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${inputValue}&api_key=5520b2454cda41fe7c2e6349b1627f55&format=json`;

  if (inputValue === "") {
    document.querySelector("h2").innerText = "You must type an artist's name";
  }

  fetch(artistTopAlbumsUrl)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      // console.log(data);
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

        fetch(
          `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=5520b2454cda41fe7c2e6349b1627f55&artist=${inputValue}&album=${albumName}&format=json`
        )
          .then((res) => res.json()) // parse response as JSON
          .then((data2) => {
            // console.log(data2.album);

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

        document.querySelector(".albums").append(section);
        section.append(img, h2, p);
        h2.append(a);

        const albumSections = document.querySelectorAll(".album");
        albumSections.forEach((albumSection) => {
          albumSection.addEventListener("click", () => {
            const isTextSelected = window.getSelection().toString();

            if (a.href && !isTextSelected) {
              window.open(a.href);
            }
          });
        });

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
