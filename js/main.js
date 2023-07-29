document.querySelector("button").addEventListener("click", getFetch);

function getFetch() {
  const inputValue = document.querySelector("input").value.toLowerCase();
  const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${inputValue}&api_key=5520b2454cda41fe7c2e6349b1627f55&format=json`;

  fetch(url)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      const topAlbums = data.topalbums.album;
      const artistName = data.topalbums.album[0].artist.name;
      console.log(data);

      document.querySelector("h2").innerText = `Artist: ${artistName}`;
      topAlbums.forEach((album) => {
        const albumName = album.name;
        const playCount = album.playcount;
        const albumUrl = album.url;
        const albumCover = album.image[3]["#text"];
        const section = document.createElement("section");
        const img = document.createElement("img");
        const h2 = document.createElement("h2");
        const a = document.createElement("a");
        const p = document.createElement("p");

        img.src = albumCover;
        a.innerText = albumName;
        a.href = albumUrl;
        a.setAttribute("target", "_blank");
        p.innerText = playCount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        document
          .querySelector(".albums")
          .appendChild(section)
          .append(img, h2, p);
        h2.appendChild(a);
      });
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}
