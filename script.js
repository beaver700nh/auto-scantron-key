document.addEventListener("DOMContentLoaded", main);

function main() {
  populateAnswerSheets();
  configureButtonBindings();
}

function populateAnswerSheets() {
  const parent = document.querySelector(".ans-sheet");

  for (const [name] of Object.entries(AnswerSheets)) {
    const option = document.createElement("option");
    option.value = option.innerText = name;
    parent.appendChild(option);
  }
}

function configureButtonBindings() {
  document.querySelector(".generate").addEventListener("click", generate);
}

function generate() {
  const answerSheet = document.querySelector(".ans-sheet").value;

  if (!answerSheet) {
    return;
  }

  const {w, h} = AnswerSheets[answerSheet].dimensions;
  const pdf = new jspdf.jsPDF({unit: "in", format: [w, h]})
    .setProperties({title: "TODO"})
    .text("Hello world!", 0, 0.2);

  const content = `
    <iframe
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none;"
      src="${pdf.output("datauristring")}"
    ></iframe>
  `;

  window.open().document.write(content);
}
