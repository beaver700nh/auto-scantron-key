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
  const answerSheet = document.querySelector(".ans-sheet");
  const sheetProperties = AnswerSheets[answerSheet.value];

  if (!answerSheet) {
    return;
  }

  const {w, h} = sheetProperties.dimensions;
  const pdf = new jspdf.jsPDF({unit: "in", format: [w, h]})
    .setProperties({title: "TODO"})
    .setLineWidth(0.01)
    .addPage();

  addBackground_DEBUG(pdf, sheetProperties, w, h);
  addMetadata(pdf, sheetProperties);

  exportPDF(pdf);
}

function addBackground_DEBUG(pdf, sheetProperties, w, h) {
  for (const [page, url] of Object.entries(sheetProperties.images)) {
    pdf.setPage(page);
    pdf.addImage(url, "JPEG", 0, 0, w, h);
  }
}

function addMetadata(pdf, sheetProperties) {
  for (const [, {page, x, y, w, h}] of Object.entries(sheetProperties.inputs.meta)) {
    pdf.setPage(page);
    pdf.rect(x, y, w, -h);
    pdf.rect(
      x + Constants.Margin,
      y - Constants.Margin,
      w - 2 * Constants.Margin,
      -h + 2 * Constants.Margin,
    );
  }
}

function exportPDF(pdf) {
  const content = `
    <iframe
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none;"
      src="${pdf.output("datauristring")}"
    ></iframe>
  `;

  window.open().document.write(content);
}
