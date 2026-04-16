export const COLOR_SETS = {
  summer: {
    recommended: [
      "#F66CA4",
      "#B25EBA",
      "#6E77D4",
      "#19A4D6",
      "#1294FA",

      "#F8B7C7",
      "#FBB8B2",
      "#FCF397",
      "#9CE1CF",
      "#BBBFEF",

      "#DBBCC1",
      "#E5C7C5",
      "#E3D9B5",
      "#B1D0D3",
      "#AAAFC5",
    ],
    makeup: ["#F7CFD7", "#F29EC2", "#EBBDE9", "#CF4670"],
    fortune: {
      career: [
        { name: "Blue", color: "#19A4D6" },
        { name: "Grey", color: "#DCDDE3" },
        { name: "Navy", color: "#102049" },
      ],
      love: [
        { name: "Pink", color: "#FBB8B2" },
        { name: "Purple", color: "#BBBFEF" },
      ],
      wealth: [
        { name: "Green", color: "#9CE1CF" },
        { name: "Grey", color: "#AAAFC5" },
      ],
    },
  },

  spring: {
    recommended: [
      "#F9CBBD",
      "#F9BF8E",
      "#F07054",
      "#EE6C7E",
      "#EC5263",

      "#F49710",
      "#F3EA32",
      "#66BD42",
      "#00B3A7",
      "#91D1D8",

      "#9799B9",
      "#0065A2",
      "#DDAC53",
      "#963B8A",
      "#924F13",
    ],
    makeup: ["#FCBFC4", "#EB5520", "#ED7A89", "#F07A62"],
    fortune: {
      career: [
        { name: "Navy", color: "#0065A2" },
        { name: "Beige", color: "#DDAC53" },
      ],
      love: [
        { name: "Pink", color: "#EE6C7E" },
        { name: "Cream", color: "#FDFBD4" },
        { name: "Peach", color: "#F07054" },
      ],
      wealth: [
        { name: "Green", color: "#66BD42" },
        { name: "Camel", color: "#DDAC53" },
      ],
    },
  },

  autumn: {
    recommended: [
      "#BF321E",
      "#602228",
      "#108446",
      "#044156",
      "#975F5E",

      "#D47512",
      "#60662A",
      "#92AC2C",
      "#8DB7C9",
      "#806249",

      "#DFC7BB",
      "#DDB109",
      "#0A4740",
      "#B5C1B5",
      "#9C2521",
    ],
    makeup: ["#CE5C5C", "#C8530D", "#E7969D", "#D56853"],
    fortune: {
      career: [
        { name: "Dark Teal", color: "#044156" },
        { name: "Espresso Brown", color: "#3F2420" },
      ],
      love: [
        { name: "Orange", color: "#C8530D" },
        { name: "Cocoa Brown", color: "#806249" },
        { name: "Burgundy", color: "#9C2521" },
      ],
      wealth: [
        { name: "Green", color: "#60662A" },
        { name: "Yellow", color: "#DDB109" },
      ],
    },
  },

  winter: {
    recommended: [
      "#FAF07E",
      "#1E7C64",
      "#063AA6",
      "#89345E",
      "#CB32C9",

      "#44147A",
      "#222956",
      "#050608",
      "#757374",
      "#3A69D1",

      "#26447A",
      "#6EBAF6",
      "#F452A3",
      "#FF73FE",
      "#782AD4",
    ],
    makeup: ["#B50C57", "#EE0E54", "#A6536D", "#EE5BA7"],
    fortune: {
      career: [
        { name: "Blue", color: "#063AA6" },
        { name: "Charcoal", color: "#4A4A4A" },
      ],
      love: [
        { name: "Ruby red", color: "#9B111E" },
        { name: "Fuchsia", color: "#FF73FE" },
      ],
      wealth: [
        { name: "Green", color: "#1E7C64" },
        { name: "Black", color: "#050608" },
        { name: "Silver", color: "#898B95" },
      ],
    },
  },
};

export function isColorSetKey(key: string): key is keyof typeof COLOR_SETS {
  return key in COLOR_SETS;
}
