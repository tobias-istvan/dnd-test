const container = document.getElementsByClassName("page")[0];

const lists = createLists(2);

function createLists(count) {
  const lists = [];
  for (let i = 0; i < count; i++) {
    const list = createList();
    container.appendChild(list);
    lists.push(list);
  }
  return lists;
}

function createList() {
  const list = document.createElement("div");
  const addCardButton = document.createElement("button");
  addCardButton.innerText = "Add Card";
  addCardButton.addEventListener("click", handleAddCardButtonClick);
  list.className = "list";
  list.appendChild(addCardButton);
  registerDropTarget(list);
  return list;
}

function createCard() {
  const card = document.createElement("div");
  card.className = "card";
  card.style.background = getRandomHex();
  return card;
}

/**
 * A small function to generate a random hex string.
 * @return random hex string
 */
function getRandomHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// ---------
function registerDropTarget(el) {
  el.addEventListener("drop", handleDropEvent);
  el.addEventListener("dragenter", handleDragEnter);
  el.addEventListener("dragleave", handleDragLeave);
  el.addEventListener("dragover", handleDragOver);
}

function registerDraggable(el) {
  el.setAttribute("draggable", true);
  el.addEventListener("dragstart", handleDragStart);
}

function isCard(el) {
  return el.matches(".card");
}

function clearOverStateInList(list) {
  list
    .querySelectorAll(".over")
    .forEach((card) => card.classList.remove("over"));
}

// event handlers
function handleAddCardButtonClick(ev) {
  ev.preventDefault();
  const card = createCard();
  ev.target.parentElement.appendChild(card);
  registerDraggable(card);
}

function handleDragStart(ev) {
  setTimeout(() => {
    ev.target.classList.add("hide");
  }, 0);
  ev.dataTransfer.dropEffect = "move";
  ev.dataTransfer.effectAllowed = "move";
  const dragId = `drag-${Date.now()}`;
  ev.target.setAttribute("data-dragid", dragId);
  ev.dataTransfer.setData("text/plain", dragId);
}

function handleDropEvent(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  const id = ev.dataTransfer.getData("text/plain");
  const dragged = document.querySelector(`[data-dragid=${id}]`);
  dragged.parentElement.removeChild(dragged);
  if (isCard(ev.target)) {
    ev.target.parentElement.insertBefore(dragged, ev.target);
    clearOverStateInList(ev.target.parentElement);
  } else {
    ev.target.appendChild(dragged);
    clearOverStateInList(ev.target);
  }
  dragged.classList.remove("hide");
  dragged.removeAttribute("data-dragid");
}

function handleDragEnter(ev) {
  if (isCard(ev.target)) {
    ev.target.classList.add("over");
  }
  ev.preventDefault();
}

function handleDragLeave(ev) {
  if (isCard(ev.target)) {
    ev.target.classList.remove("over");
  }
  ev.preventDefault();
}

function handleDragOver(ev) {
  ev.preventDefault();
}

window.addEventListener("dragover", (ev) => {
  ev.preventDefault();
});
window.addEventListener("dragend", (ev) => {
  ev.preventDefault();
});
// clean up if dropped outside of a drop zone
window.addEventListener("drop", (ev) => {
  const id = ev.dataTransfer.getData("text/plain");
  const dragged = document.querySelector(`[data-dragid=${id}]`);
  if (!dragged) {
    return;
  }
  dragged.classList.remove("hide");
  dragged.removeAttribute("data-dragid");
});
