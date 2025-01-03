const input = document.querySelector(".label-repo__search-repo");
const list = document.querySelector(".label-repo__repo-list");
const infoList = document.querySelector(".label-repo__info-list");
let timer;

function getRepos(key) {
  list.innerHTML = "";

  fetch(`https://api.github.com/search/repositories?q=${key}`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Ну куда вы, API rate limit превышен или доступ ограничен!"
          );
        }
        throw new Error(`Ошибка: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.items.length < 5) {
        throw new Error("Ошибка: Репозиториев меньше 5");
      } else {
        for (let i = 0; i < 5; i++) {
          list.insertAdjacentHTML(
            "beforeend",
            `<ul class="label-repo__ulMin" data-repo-id="${data.items[i].id}">
                  <li class="label-repo__liMin">${data.items[i].name}</li>
                </ul>`
          );

          const liElements = document.querySelectorAll(".label-repo__liMin");

          liElements[i].addEventListener("click", () => {
            const repoId = data.items[i].id;
            if (!infoList.querySelector(`[data-repo-id="${repoId}"]`)) {
              infoList.insertAdjacentHTML(
                "beforeend",
                `
                <div class="cont">
                <div class="first-cont">
                    <ul class="label-repo__ulMinInfo" data-repo-id="${repoId}">
                      <li class="label-repo__liMinInfo">Name: ${data.items[i].name}</li>
                      <li class="label-repo__liMinInfo">Owner: ${data.items[i].owner.login}</li>
                      <li class="label-repo__liMinInfo">Stars: ${data.items[i].stargazers_count}</li>
                    </ul>
                    </div>
                    <div class="last-cont">
                      <button class="bt-close">
                        <img src="img/close.png" alt="Закрыть" width="64px" class="img-close">
                      </button>
                    </div>
                  </div>
                `
              );
            }
          });
        }
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      list.insertAdjacentHTML(
        "beforeend",
        `<p style="color: red;">${error.message}</p>`
      );
    });
}

infoList.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("bt-close") ||
    event.target.closest(".bt-close")
  ) {
    const cont = event.target.closest(".cont");
    if (cont) {
      cont.remove();
    }
  }
});

input.addEventListener("input", () => {
  clearTimeout(timer);
  if (input.value.trim() === "") {
    list.innerHTML = "";
  } else {
    timer = setTimeout(() => {
      getRepos(input.value.trim());
    }, 400);
  }
});
