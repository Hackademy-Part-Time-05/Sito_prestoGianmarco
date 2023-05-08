document.addEventListener("scroll", changeNavbar);

function changeNavbar(event) {
  const mainNavbar = document.querySelector("#mainNavbar");
  if (window.scrollY > 100) {
    mainNavbar.classList.add("thin");
    mainNavbar.classList.add("bg-white");
  } else {
    mainNavbar.classList.remove("thin");
    mainNavbar.classList.remove("bg-white");
  }
}

fetch("/announcements.json")
  .then(fromResponseToJson)
  .then(manipulateAnnouncements);

function fromResponseToJson(response) {
  return response.json();
}

function manipulateAnnouncements(announcements) {
  console.log(announcements);

  const categories = [];
  announcements.map(getCategory).forEach(pushCategory);

  console.log(categories);

  // const categories = new Set(announcements.map(getCategory));
  // console.log(categories);

  function getCategory(announcement) {
    return announcement.category;
  }
  function pushCategory(category) {
    if (!categories.includes(category)) {
      categories.push(category);
    }
  }

  const categoriesWrapper = document.querySelector("#categories .row");

  categories.forEach(createCategories);

  function createCategories(category) {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("col-lg-3", "col-md-6", "col-12");
    cardWrapper.innerHTML = `
        <div class="card card-presto border-0 d-flex justify-content-center align-items-center">
          <div class="background"></div>
          <span class="text-uppercase fs-3 fw-bold text-center">${category}</span>
        </div>
    `;
    categoriesWrapper.appendChild(cardWrapper);
  }
}
