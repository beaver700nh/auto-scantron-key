const Constants = {
  Margin: 1/32,
};

const AnswerSheets = {
  "Scantron 19641 Answer Sheet B": {
    dimensions: {
      w: 5 + 1/2,
      h: 11,
    },
    images: {
      1: "https://cdn11.bigcommerce.com/s-30cdzu3o6a/images/stencil/1280x1280/products/126/434/19641-6-1__47970.1674581161.jpg?c=1",
      2: "https://cdn11.bigcommerce.com/s-30cdzu3o6a/images/stencil/1280x1280/products/126/435/19641-6-2__48206.1674581161.jpg?c=1",
    },
    bubble: {
      type: "circle",
      r: 1/16,
    },
    inputs: {
      meta: {
        name: {
          page: 1,
          x: 3 + 3/16,
          y: 9 + 9/16,
          w: 2 + 1/16,
          h: 0 + 5/16,
        },
        subject: {
          page: 1,
          x: 3 + 3/8,
          y: 9 + 7/8,
          w: 1 + 7/8,
          h: 0 + 5/16,
        },
        period: {
          page: 1,
          x: 3 + 9/32,
          y: 10 + 3/16,
          w: 0 + 13/32,
          h: 0 + 5/16,
        },
        date: {
          page: 1,
          x: 4 + 1/8,
          y: 10 + 3/16,
          w: 1 + 1/8,
          h: 0 + 5/16,
        },
      },
      keys: {
        1: {
          page: 1,
          x: 3 + 15/128,
          y: 2 + 171/512,
          dBubble: {
            x: 0,
            y: 683/4096,
          },
          dQuestion: {
            x: 85/512,
            y: 0,
          },
          bubbles: 10,
          questions: 3,
        },
        4: {
          page: 2,
          x: 2 + 111/512,
          y: 8 + 2045/4096,
          dBubble: {
            x: 0,
            y: -683/4096,
          },
          dQuestion: {
            x: -85/512,
            y: 0,
          },
          bubbles: 10,
          questions: 2,
        },
      },
      answers: {
        1: {
          page: 1,
          x: 0 + 201/256,
          y: 0 + 53/64,
          dBubble: {
            x: 85/512,
            y: 0,
          },
          dQuestion: {
            x: 0,
            y: 683/2048,
          },
          bubbles: 5,
          questions: 25,
        },
        26: {
          page: 1,
          x: 1 + 243/256,
          y: 1,
          dBubble: {
            x: 85/512,
            y: 0,
          },
          dQuestion: {
            x: 0,
            y: 683/2048,
          },
          bubbles: 5,
          questions: 25,
        },
        51: {
          page: 2,
          x: 4 + 183/256,
          y: 10,
          dBubble: {
            x: -85/512,
            y: 0,
          },
          dQuestion: {
            x: 0,
            y: -683/2048,
          },
          bubbles: 5,
          questions: 25,
        },
        76: {
          page: 2,
          x: 3 + 141/256,
          y: 9 + 3413/4096,
          dBubble: {
            x: -85/512,
            y: 0,
          },
          dQuestion: {
            x: 0,
            y: -683/2048,
          },
          bubbles: 5,
          questions: 25,
        },
      },
    },
  },
};
