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
    id: Date.now(),
    text: noteText,
    category: noteCategory.value.trim(),
    tags: noteTags.value.trim(),
  };

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
  li.setAttribute("data-id", noteData.id);
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
      updateNoteInLocalStorage(noteData); // Update the edited note in Local Storage
    }
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    removeNoteFromLocalStorage(noteData.id);
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

function updateNoteInLocalStorage(updatedNote) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.map((note) =>
    note.id === updatedNote.id ? updatedNote : note
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

function removeNoteFromLocalStorage(noteId) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter((note) => note.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(notes));
}
