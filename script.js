/**
 * IMPORTANT
 * =========
 *
 * One time setup to support printing (Windows):
 *
 * 1. Printers & Scanners
 * 2. Select your printer
 * 3. Printer properties
 * 4. Advanced
 * 5. Driver set to whatever supports custom forms
 *   -> Probably proprietary driver for your printer
 * 6. OK
 * 7. Printers & Scanners
 * 8. Print server properties
 * 9. Create a new form
 * 10. Form name
 * 11. Paper size
 * 12. Margin zero
 * 13. Save form
 * 14. OK
 * 15. Print PDF button
 * 16. More settings
 * 17. Paper size set to name of form
 * 18. Scale set to "Fit to paper"
 * 19. Print
 */

document.addEventListener("DOMContentLoaded", main);

var TestData = {
  answers: {},
};

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
  document.querySelector(".upload").addEventListener("click", upload);
  document.querySelector(".generate").addEventListener("click", generate);
}

function upload() {
  // TODO

  // TestData.answers = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];

  TestData.answers = {
     0: 0,  1: 1,  2: 2,  3: 3,  4: 4,
    10: 0, 11: 1, 12: 2, 13: 3, 14: 4,
    95: 0, 96: 1, 97: 2, 98: 3, 99: 4,
  };
}

class Generator {
  constructor(sheetProperties) {
    this.sheetProperties = sheetProperties;

    const {w, h} = sheetProperties.dimensions;
    this.pdf = new jspdf.jsPDF({unit: "in", format: [w, h]})
      .setLineWidth(0.01)
      .addPage()
      .setFont("courier", "bold")
      .setFontSize(12);

    const markFunction = this.pdf[sheetProperties.bubble.type];
    const markDimensions = sheetProperties.bubble.type === "circle" ?
      [sheetProperties.bubble.r] :
      [sheetProperties.bubble.w, sheetProperties.bubble.h];

    this.pdf.__Mark = (blockData, question, bubble) => {
      markFunction.call(
        this.pdf,
        blockData.x + question * blockData.dQuestion.x + bubble * blockData.dBubble.x,
        blockData.y + question * blockData.dQuestion.y + bubble * blockData.dBubble.y,
        ...markDimensions, "F",
      );
    };
  }

  generate(testData) {
    this.pdf.setDocumentProperties({title: testData.meta.subject});

    this.drawBackground();

    // this.drawMetadata();
    this.generateMetadata(testData.meta);

    // this.drawBubbles("keys");
    if (
      // If the answer sheet has multiple rows per key block,
      // it is probably a KEY/ITEM/COUNT block format and can be autofilled.
      Object.values(this.sheetProperties.inputs.keys).some(({questions}) => questions !== 1)
    ) {
      this.generateKeys(testData.answers);
    }

    // this.drawBubbles("answers");
    this.generateAnswers(testData.answers);
  }

  drawBackground() {
    const {w, h} = this.sheetProperties.dimensions;
    for (const [page, url] of Object.entries(this.sheetProperties.images)) {
      this.pdf.setPage(page);
      this.pdf.addImage(url, "JPEG", 0, 0, w, h);
    }
  }

  drawMetadata() {
    for (const [name, {page, x, y, w, h}] of Object.entries(this.sheetProperties.inputs.meta)) {
      this.pdf
        .setPage(page)
        .setFillColor(255, 255, 0)
        .rect(x, y, w, -h, "F")
        .setDrawColor(255, 0, 0)
        .rect(
          x + Constants.Margin,
          y - Constants.Margin,
          w - 2 * Constants.Margin,
          -h + 2 * Constants.Margin,
          "S",
        )
        .setDrawColor(0, 0, 0)
        .text(name, x + Constants.Margin, y - Constants.Margin);
    }
  }

  generateMetadata(meta) {
    for (const [name, {page, x, y}] of Object.entries(this.sheetProperties.inputs.meta)) {
      this.pdf
        .setPage(page)
        .setDrawColor(0, 0, 0)
        .text(meta[name] ?? "", x + Constants.Margin, y - Constants.Margin);
    }
  }

  drawBubbles(type) {
    for (const [, blockData] of Object.entries(this.sheetProperties.inputs[type])) {
      const {page, bubbles, questions} = blockData;

      this.pdf
        .setPage(page)
        .setFillColor(type === "keys" ? "#00FF00" : "#0000FF");

      for (let question = 0; question < questions; ++question) {
        for (let bubble = 0; bubble < bubbles; ++bubble) {
          this.pdf.__Mark(blockData, question, bubble);
        }
      }
    }
  }

  generateKeys(answers) {
    const total = Math.max(...Object.keys(answers)) + 1;

    for (const [, blockData] of Object.entries(this.sheetProperties.inputs.keys)) {
      const {page, questions} = blockData;

      this.pdf
        .setPage(page)
        .setFillColor(0, 0, 0);

      const firstQuestion = Math.min(
        ...Object.entries(this.sheetProperties.inputs.answers)
          .filter(([, {page}]) => page === blockData.page)
          .map(([start]) => parseInt(start, 10) - 1)
      );
      let count = total - firstQuestion;

      if (count <= 0) continue;

      for (let question = questions - 1; question >= 0; --question) {
        this.pdf.__Mark(blockData, question, count % 10);
        count = Math.floor(count / 10);
      }
    }
  }

  generateAnswers(answers) {
    for (const [start, blockData] of Object.entries(this.sheetProperties.inputs.answers)) {
      const _start = parseInt(start, 10);
      const {page, questions} = blockData;

      this.pdf
        .setPage(page)
        .setFillColor(0, 0, 0);

      for (let question = 0; question < questions; ++question) {
        const bubble = answers[_start + question - 1];
        if (bubble == null) continue;

        this.pdf.__Mark(blockData, question, bubble);
      }
    }
  }

  export() {
    const content = `
      <iframe
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        src="${this.pdf.output("datauristring")}"></iframe>
    `;

    window.open().document.write(content);
  }
}

function generate() {
  const answerSheet = document.querySelector(".ans-sheet");
  const sheetProperties = AnswerSheets[answerSheet.value];

  if (!sheetProperties) {
    return;
  }

  populateMissingMetadata(sheetProperties);
}

function populateMissingMetadata(sheetProperties) {
  TestData.meta = {
    name: "Answer Key",
    date: new Date().toLocaleString("sv").slice(0, 10),
  };

  const data = document.querySelector(".data");
  data.replaceChildren();

  for (const [name] of Object.entries(sheetProperties.inputs.meta)) {
    const label = document.createElement("label");
    label.innerText = name.charAt(0).toUpperCase() + name.slice(1);
    label.htmlFor = name;
    data.appendChild(label);

    const input = document.createElement("input");
    input.id = name;
    input.value = TestData.meta[name] ?? "";
    input.onchange = () => TestData.meta[name] = input.value;
    data.appendChild(input);
  }

  const popup = document.querySelector(".popup");
  popup.classList.remove("hidden");

  const close = document.querySelector(".close");
  close.addEventListener("click", finish);
}

function finish() {
  const popup = document.querySelector(".popup");
  popup.classList.add("hidden");

  this.removeEventListener("click", finish);

  const answerSheet = document.querySelector(".ans-sheet");
  const sheetProperties = AnswerSheets[answerSheet.value];

  const generator = new Generator(sheetProperties);
  generator.generate(TestData);
  generator.export();
}
