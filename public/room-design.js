const designForm = document.querySelector("#designForm");
const resetButton = document.querySelector("#resetButton");
const emptyState = document.querySelector("#emptyState");
const results = document.querySelector("#results");

const designTitle = document.querySelector("#designTitle");
const styleDescription = document.querySelector("#styleDescription");
const colorPalette = document.querySelector("#colorPalette");
const furnitureList = document.querySelector("#furnitureList");
const decorIdeas = document.querySelector("#decorIdeas");
const layoutSuggestion = document.querySelector("#layoutSuggestion");
const shoppingChecklist = document.querySelector("#shoppingChecklist");

const stylePlans = {
  cozy: {
    titleWord: "Warm Retreat",
    description: "A soft, welcoming room with layered textures, warm lighting, and comfortable seating.",
    palette: [
      { name: "Warm Cream", color: "#F7E8D0" },
      { name: "Terracotta", color: "#C96B4A" },
      { name: "Soft Olive", color: "#8A8F67" }
    ],
    furniture: ["Deep sofa or lounge chair", "Wood coffee table", "Soft area rug", "Warm floor lamp"],
    decor: ["Chunky knit throw", "Woven baskets", "Framed personal photos", "Pillows in mixed textures"],
    layout: "Anchor the largest seating piece against the longest wall, then place the rug in the center to connect each zone."
  },
  modern: {
    titleWord: "Modern Flow",
    description: "A polished room with clean silhouettes, functional zones, and a confident mix of contrast and warmth.",
    palette: [
      { name: "Cloud White", color: "#F8F7F2" },
      { name: "Charcoal", color: "#2F3437" },
      { name: "Brushed Brass", color: "#B58B3B" }
    ],
    furniture: ["Low-profile sofa", "Slim media console", "Round accent table", "Sculptural task lamp"],
    decor: ["Large abstract print", "Ceramic vase", "Metal tray", "Simple linen curtains"],
    layout: "Create a central conversation area with clear walking paths along the sides of the room."
  },
  minimalist: {
    titleWord: "Calm Edit",
    description: "A peaceful, clutter-light room focused on useful pieces, open space, and a restrained palette.",
    palette: [
      { name: "Soft White", color: "#FAFAF7" },
      { name: "Stone Gray", color: "#B9B5AD" },
      { name: "Natural Oak", color: "#C9A66B" }
    ],
    furniture: ["Streamlined storage", "Simple seating", "Nesting side tables", "One practical floor lamp"],
    decor: ["Single oversized artwork", "Low-maintenance plant", "Neutral throw", "Hidden storage bins"],
    layout: "Keep the center of the room open and place storage close to the entry so clutter has an easy landing spot."
  },
  luxury: {
    titleWord: "Elevated Suite",
    description: "A refined room with rich materials, layered lighting, elegant accents, and a hotel-inspired finish.",
    palette: [
      { name: "Ivory", color: "#F4EDE1" },
      { name: "Emerald", color: "#0D5C50" },
      { name: "Champagne", color: "#D4B16A" }
    ],
    furniture: ["Statement seating", "Marble-look side table", "Velvet accent chair", "Tall bookcase or cabinet"],
    decor: ["Oversized mirror", "Velvet pillows", "Layered curtains", "Decorative bowl or tray"],
    layout: "Use symmetry where possible, with paired lamps or chairs to make the room feel intentional and balanced."
  },
  gaming: {
    titleWord: "Immersive Command Room",
    description: "A bold, comfortable setup with smart lighting, display space, cable control, and long-session comfort.",
    palette: [
      { name: "Deep Graphite", color: "#20242A" },
      { name: "Electric Cyan", color: "#18B7D9" },
      { name: "Signal Violet", color: "#7C3AED" }
    ],
    furniture: ["Ergonomic chair", "Wide desk or media unit", "Modular shelving", "Blackout curtains"],
    decor: ["LED light strips", "Acoustic wall panels", "Poster frames", "Cable management clips"],
    layout: "Place screens away from direct window glare, then build storage and display shelves around the main setup."
  }
};

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getBudgetTier(budget) {
  if (!budget || budget < 800) {
    return "starter";
  }

  if (budget < 2500) {
    return "balanced";
  }

  return "premium";
}

function buildChecklist(budgetTier, mustHaves) {
  const budgetIdeas = {
    starter: [
      "Shop secondhand for one hero furniture piece",
      "Refresh the room with paint, lighting, and textiles first",
      "Use peel-and-stick hooks, cable clips, and baskets for fast organization"
    ],
    balanced: [
      "Buy the main furniture piece new and save on accent tables",
      "Choose one quality rug or light fixture to upgrade the whole room",
      "Compare online bundles before buying decor individually"
    ],
    premium: [
      "Invest in custom-sized window treatments or a statement rug",
      "Choose durable materials for daily-use furniture",
      "Reserve part of the budget for delivery, assembly, and finishing touches"
    ]
  };

  const mustHaveItems = mustHaves.length
    ? mustHaves.slice(0, 3).map((item) => `Price-check must-have item: ${item}`)
    : ["Measure before buying large furniture", "Pick one flexible storage piece"];

  return [...mustHaveItems, ...budgetIdeas[budgetTier]];
}

function addListItems(container, items) {
  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

function showPalette(colors, favoriteColors) {
  colorPalette.innerHTML = "";

  const customColors = splitList(favoriteColors).slice(0, 2).map((name) => ({
    name,
    color: "#E7DDD0"
  }));

  [...customColors, ...colors].slice(0, 5).forEach((color) => {
    const paletteItem = document.createElement("div");
    paletteItem.className = "palette-item";

    const swatch = document.createElement("span");
    swatch.className = "palette-color";
    swatch.style.backgroundColor = color.color;

    const name = document.createElement("span");
    name.className = "palette-name";
    name.textContent = color.name;

    paletteItem.append(swatch, name);
    colorPalette.appendChild(paletteItem);
  });
}

function generateDesign(event) {
  event.preventDefault();

  const formData = new FormData(designForm);
  const roomType = formData.get("roomType").trim();
  const selectedStyle = formData.get("designStyle");
  const favoriteColors = formData.get("favoriteColors").trim();
  const budget = Number(formData.get("budget"));
  const dimensions = formData.get("dimensions").trim();
  const mustHaves = splitList(formData.get("mustHaves"));

  const plan = stylePlans[selectedStyle];
  const budgetTier = getBudgetTier(budget);
  const roomLabel = roomType || "Room";
  const dimensionText = dimensions ? ` For a ${dimensions} space,` : " For this room,";

  designTitle.textContent = `${plan.titleWord} ${roomLabel} Design`;
  styleDescription.textContent = `${plan.description}${dimensionText} focus on pieces that fit the footprint and keep daily movement easy.`;
  layoutSuggestion.textContent = `${plan.layout} Include ${mustHaves[0] || "your main must-have item"} as the first priority, then layer in flexible accents.`;

  showPalette(plan.palette, favoriteColors);
  addListItems(furnitureList, [...plan.furniture, ...mustHaves.slice(0, 2)]);
  addListItems(decorIdeas, plan.decor);
  addListItems(shoppingChecklist, buildChecklist(budgetTier, mustHaves));

  emptyState.classList.add("hidden");
  results.classList.remove("hidden");
}

function resetDesign() {
  results.classList.add("hidden");
  emptyState.classList.remove("hidden");

  designTitle.textContent = "";
  styleDescription.textContent = "";
  colorPalette.innerHTML = "";
  furnitureList.innerHTML = "";
  decorIdeas.innerHTML = "";
  layoutSuggestion.textContent = "";
  shoppingChecklist.innerHTML = "";
}

designForm.addEventListener("submit", generateDesign);
resetButton.addEventListener("click", resetDesign);
