const noteInput = document.getElementById("noteInput");
const noteCategory = document.getElementById("noteCategory");
const noteTags = document.getElementById("noteTags");
const noteList = document.getElementById("noteList");
const darkModeToggle = document.getElementById("darkModeToggle");

// Load notes and dark mode preference from Local Storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadNotesFromLocalStorage();
  loadDarkModePreference();
});

document.getElementById("addNoteButton").addEventListener("click", () => {
  const noteText = noteInput.value.trim();
  if (!noteText) return;

  const noteData = {
    text: noteText,
    category: noteCategory.value.trim(),
    tags: noteTags.value.trim(),
  };

  // Add the note to the UI and Local Storage
  addNoteToUI(noteData);
  saveNoteToLocalStorage(noteData);

  [noteInput, noteCategory, noteTags].forEach((input) => (input.value = ""));
});

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
  saveDarkModePreference(darkModeToggle.checked);
});

function addNoteToUI(noteData) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${noteData.text} 
    <span>Category: ${noteData.category}</span>
    <span>Tags: ${noteData.tags}</span>
    <button class="edit">Edit</button>
    <button class="delete">Delete</button>
  `;

  li.querySelector(".edit").addEventListener("click", () => {
    const newText = prompt("Edit your note:", noteData.text);
    if (newText !== null) {
      noteData.text = newText;
      li.firstChild.textContent = newText;
      updateNotesInLocalStorage();
    }
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    removeNoteFromLocalStorage(noteData);
  });

  noteList.appendChild(li);
}

// Local Storage functions
function saveNoteToLocalStorage(note) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((note) => addNoteToUI(note));
}

function updateNotesInLocalStorage() {
  const notes = [];
  document.querySelectorAll("#noteList li").forEach((li) => {
    const text = li.firstChild.textContent.trim();
    const category = li
      .querySelector("span:nth-child(2)")
      .textContent.replace("Category: ", "");
    const tags = li
      .querySelector("span:nth-child(3)")
      .textContent.replace("Tags: ", "");
    notes.push({ text, category, tags });
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}

function removeNoteFromLocalStorage(noteToRemove) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter((note) => note.text !== noteToRemove.text);
  localStorage.setItem("notes", JSON.stringify(notes));
}
