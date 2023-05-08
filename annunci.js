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

  const categoryWrapper = document.querySelector("#categoryWrapper");

  categories.forEach(createCategoryCheckbox);

  function createCategoryCheckbox(category) {
    const categoryCheckboxElement = document.createElement("li");
    const categoryLower = category.toLowerCase();
    categoryCheckboxElement.innerHTML = `
      <input class="form-check-input checkbox-presto" type="checkbox" value="${categoryLower}">
      <label class="form-check-label checkbox-label-presto" for="${categoryLower}">
          ${category.toUpperCase()}
      </label>
    `;
    categoryCheckboxElement.addEventListener("input", filterAnnouncement);

    categoryWrapper.appendChild(categoryCheckboxElement);
  }

  createAnnouncementElements(announcements);

  const nameFilter = document.querySelector("#nameFilter");
  nameFilter.addEventListener("input", filterAnnouncement);

  const prices = announcements.map(getPrice);

  //
  //  Decostruttore ...
  //
  const maxRange = Math.max(...prices);
  // const minRange = Math.min(...prices); 

  let sliderRange = [0, maxRange];
  let slider = document.querySelector('#priceSlider');

  noUiSlider.create(slider, {
      start: [0, maxRange],
      connect: true,
      range: {
          'min': 0,
          'max': maxRange
      },
      tooltips: [true, true]
  });

  slider.noUiSlider.on("change", changeSliderRange);

  // const announcementWrapper = document.querySelector("#announcementWrapper");

  // announcements.forEach(createAnnouncement);

  // function createAnnouncement(announcement) {
  //   const cardWrapper = document.createElement("div");
  //   cardWrapper.classList.add("card", "card-announcement-presto");
  //   cardWrapper.innerHTML = `
  //       <img src="${announcement.productImage}" class="card-img">
  //       <div class="card-img-overlay h-100 d-flex flex-column justify-content-between">
  //         <h3 class="card-title text-center text-white">${announcement.productName}</h3>
  //         <div class="info-text p-2">
  //             <p class="card-text">${announcement.productDescription}</p>
  //             <p class="card-text caption">${announcement.productSpecs}</p>
  //             <p class="card-text text-end price">${announcement.price} €</p>
  //         </div>
  //       </div>
  //     </div>
  //   `;
  //   announcementWrapper.appendChild(cardWrapper);
  // }

  function getCategory(announcement) {
    return announcement.category;
  }
  function pushCategory(category) {
    if (!categories.includes(category)) {
      categories.push(category);
    }
  }
  function changeSliderRange(values) {
    sliderRange = values;
    filterAnnouncement();
  }
  function filterAnnouncement(event) {
    const checkboxes = document.querySelectorAll(
      "#categoryWrapper .checkbox-presto"
    );
    const selectedCategories = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selectedCategories.push(checkboxes[i].value);
      }
    }

    let filteredElements = announcements.filter(filterCategory);
    filteredElements = filteredElements.filter(filterName);
    filteredElements = filteredElements.filter(filterPrice);

    createAnnouncementElements(filteredElements);

    function filterCategory(announcement) {
      return (
        selectedCategories.length == 0 ||
        selectedCategories.includes(announcement.category.toLowerCase())
      );
    }
    function filterName(announcement) {
      return announcement.productName
        .toLowerCase()
        .includes(nameFilter.value.toLowerCase());
    }
    function filterPrice(announcement) {
      return announcement.price >= sliderRange[0] && announcement.price <= sliderRange[1];
    }
  }
  function getPrice(announcement) {
    return announcement.price;
  }
}

function createAnnouncementElements(announcements) {
  const announcementWrapper = document.querySelector("#announcementWrapper");
  announcementWrapper.innerHTML = "";
  announcements.forEach(createAnnouncement);

  function createAnnouncement(announcement) {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card", "card-announcement-presto");
    cardWrapper.innerHTML = `
        <img src="${announcement.productImage}" class="card-img">
        <div class="card-img-overlay h-100 d-flex flex-column justify-content-between">
          <h3 class="card-title text-center text-white">${announcement.productName}</h3>
          <div class="info-text p-2">
              <p class="card-text">${announcement.productDescription}</p>
              <p class="card-text caption">${announcement.productSpecs}</p>
              <p class="card-text text-end price">${announcement.price} €</p>
          </div>
        </div>
      </div>
    `;
    announcementWrapper.appendChild(cardWrapper);
  }
}
