const grid = document.createElement("div");
grid.className = "grid";

let searchElem = null;

const HORIZONTAL = 5;
const VERTICAL = 7;
const USER_COUNT = HORIZONTAL * VERTICAL;

grid.style.gridTemplateColumns = "1fr ".repeat(HORIZONTAL);
grid.style.gridTemplateRows = "1fr ".repeat(VERTICAL);

const getRandomUserInfoList = async () => {
  try {
    const res = await fetch(`https://randomuser.me/api/?results=${USER_COUNT}`);
    if (!res.ok) {
      throw "Failed to get user-info";
    }

    const data = await res.json();
    if (!("results" in data)) {
      throw "Failed to get user-info";
    }

    return data.results;
  } catch (err) {
    return { err: err };
  }
};

const createElement = (className, parent) => {
  let item = document.createElement(className);
  parent.appendChild(item);
  return item;
};

const getUserElementId = (i) => {
  return `user-${i}`;
};

const getUserPicId = (i) => {
  return `user-pic-${i}`;
};

const getUserHeadingId = (i) => {
  return `user-heading-${i}`;
};

const getUserEmailId = (i) => {
  return `user-email-${i}`;
};

const getUserInfoId = (i) => {
  return `user-info-${i}`;
};

const getUserMoreInfoId = (i) => {
  return `user-more-info-${i}`;
};

const getUserLocationId = (i) => {
  return `user-loc-${i}`;
};

for (let i = 0; i < USER_COUNT; i++) {
  const gridItem = createElement("div", grid);

  gridItem.id = getUserElementId(i);
  gridItem.className = "grid-item";

  let img = createElement("img", gridItem);
  let figcaption = createElement("figcaption", gridItem);
  let heading = createElement("span", figcaption);
  let email = createElement("a", figcaption);
  let info = createElement("p", figcaption);
  let moreInfo = createElement("p", figcaption);
  let location = createElement("p", figcaption);

  img.className = "profile-pic";
  heading.className = "profile-heading";
  email.className = "profile-email";
  info.className = "profile-info";
  moreInfo.className = "profile-info";
  location.className = "profile-location";

  img.id = getUserPicId(i);
  heading.id = getUserHeadingId(i);
  email.id = getUserEmailId(i);
  info.id = getUserInfoId(i);
  moreInfo.id = getUserMoreInfoId(i);
  location.id = getUserLocationId(i);
}

const clearUserInfoList = () => {
  grid.childNodes.forEach((userItem) => {
    let img = userItem.childNodes[0];
    img.src = "";

    let figcaption = userItem.childNodes[1];
    let name = figcaption.childNodes[0];

    name.innerText = "";

    let email = figcaption.childNodes[1];
    email.innerText = "";

    let info = figcaption.childNodes[2];
    info.innerText = "";

    let moreInfo = figcaption.childNodes[3];
    moreInfo.innerText = "";

    let location = figcaption.childNodes[4];
    location.innerText = "";
  });
};

const dateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const dateFmt = new Intl.DateTimeFormat("en-US", dateTimeFormatOptions);
const createUserGrid = async () => {
  let userInfoList = null;
  try {
    userInfoList = await getRandomUserInfoList();
  } catch (e) {
    document.getElementById("root").innerHTML = `Error: ${err}`;
    return;
  }

  let i = 0;
  userInfoList.forEach((userInfo) => {
    if (!("picture" in userInfo) || !("large" in userInfo.picture)) {
      return;
    }

    let img = document.getElementById(getUserPicId(i));
    let heading = document.getElementById(getUserHeadingId(i));
    let email = document.getElementById(getUserEmailId(i));
    let info = document.getElementById(getUserInfoId(i));
    let moreInfo = document.getElementById(getUserMoreInfoId(i));
    let location = document.getElementById(getUserLocationId(i));

    const name = `${userInfo.name.first} ${userInfo.name.last}`;
    img.src = `${userInfo.picture.large}`;

    heading.innerText = `${userInfo.name.title}. ${name}, ${userInfo.dob.age}`;
    email.href = `mailto:${userInfo.email}`;
    email.innerText = `✉️ ${userInfo.email}`;
    info.innerText = `Known around these parts as ${
      userInfo.login.username
    }, ${name} has been a registered user for ${
      userInfo.registered.age
    } years, since ${dateFmt.format(new Date(userInfo.registered.date))}.`;

    moreInfo.innerHTML = `Born on ${dateFmt.format(
      new Date(userInfo.dob.date)
    )}, ${userInfo.name.first} currently resides in ${
      userInfo.location.country
    } and can be contacted through their telephone number <a href=tel:${
      userInfo.cell
    }>${userInfo.cell}</a>`;
    location.innerText = `📌 ${userInfo.location.street.name}, ${userInfo.location.city}. ${userInfo.location.state}, ${userInfo.location.country} ${userInfo.location.postcode}`;
    i++;
  });

  searchElem.disabled = "";
  document.getElementById("refreshButton").disabled = "";
};

createUserGrid();
const includesSearchInput = (
  name,
  email,
  info,
  moreInfo,
  location,
  searchInput
) => {
  return (
    name.toLowerCase().includes(searchInput) ||
    email.toLowerCase().includes(searchInput) ||
    info.toLowerCase().includes(searchInput) ||
    moreInfo.toLowerCase().includes(searchInput) ||
    location.toLowerCase().includes(searchInput)
  );
};

const handleSearchInput = (event) => {
  event.preventDefault();
  const searchInput = event.target.value.toLowerCase();

  /*grid.childNodes.forEach((userItem) => {
    let figcaption = userItem.childNodes[1];
    let name = figcaption.childNodes[0].innerText;
    let email = figcaption.childNodes[1].innerText;
    let info = figcaption.childNodes[2].innerText;
    let moreInfo = figcaption.childNodes[3].innerText;
    let location = figcaption.childNodes[4].innerText;

    if (includesSearchInput(name, email, info, location, searchInput)) {
      userItem.style.display = "flex";
      return;
    }

    userItem.style.display = "none";
  });*/

  for (let i = 0; i < USER_COUNT; i++) {
    const elem = document.getElementById(getUserElementId(i));
    const heading = document.getElementById(getUserHeadingId(i)).innerText;
    const email = document.getElementById(getUserEmailId(i)).innerText;
    const info = document.getElementById(getUserInfoId(i)).innerText;
    const moreInfo = document.getElementById(getUserMoreInfoId(i)).innerText;
    const location = document.getElementById(getUserLocationId(i)).innerText;

    if (
      includesSearchInput(heading, email, info, moreInfo, location, searchInput)
    ) {
      elem.style.display = "flex";
      continue;
    }

    elem.style.display = "none";
  }
};

const refresh = (event) => {
  event.preventDefault();
  event.target.disabled = "disabled";

  searchElem.value = "";
  searchElem.disabled = "disabled";

  clearUserInfoList();
  createUserGrid();

  event.target.disabled = "";
};

document.addEventListener("DOMContentLoaded", async () => {
  searchElem = document.getElementById("search");
  searchElem.value = "";

  document.getElementById("root").appendChild(grid);
});
