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
const productPicks = document.querySelector("#productPicks");
const roomPreview = document.querySelector("#roomPreview");
const roomDimensionsBadge = document.querySelector("#roomDimensionsBadge");
const previewCaption = document.querySelector("#previewCaption");

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
    layout: "Anchor the largest seating piece against the longest wall, then place the rug in the center to connect each zone.",
    products: [
      ["Performance Boucle Sofa", "rounded arms, washable ivory fabric", "84 x 36 in", "$650-$1,100", "#b98365", "seat"],
      ["Round Oak Coffee Table", "warm wood, softened edge, lower shelf", "34 in wide", "$180-$360", "#a87747", "table"],
      ["Textured Wool-Blend Rug", "cream base with terracotta border", "8 x 10 ft", "$220-$480", "#c96b4a", "rug"]
    ]
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
    layout: "Create a central conversation area with clear walking paths along the sides of the room.",
    products: [
      ["Low Modular Sofa", "tight profile, charcoal performance weave", "90 x 38 in", "$900-$1,700", "#30343b", "seat"],
      ["Fluted Media Console", "walnut finish, hidden storage doors", "72 x 18 in", "$380-$750", "#76563d", "storage"],
      ["Arc Floor Lamp", "matte black stem with brass shade", "68 in tall", "$120-$260", "#b58b3b", "light"]
    ]
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
    layout: "Keep the center of the room open and place storage close to the entry so clutter has an easy landing spot.",
    products: [
      ["Slipcovered Track-Arm Sofa", "plain linen look with removable covers", "78 x 35 in", "$550-$950", "#d8d0c5", "seat"],
      ["Oak Storage Bench", "closed storage and clean plank front", "48 x 16 in", "$160-$320", "#c9a66b", "storage"],
      ["Nesting Side Tables", "thin metal frames with stone-look tops", "22 in wide", "$90-$180", "#a9a39a", "table"]
    ]
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
    layout: "Use symmetry where possible, with paired lamps or chairs to make the room feel intentional and balanced.",
    products: [
      ["Emerald Velvet Sofa", "channel tufting with slim brass legs", "86 x 37 in", "$1,100-$2,200", "#0d5c50", "seat"],
      ["Marble-Top Side Table", "stone-look top and champagne frame", "22 in wide", "$180-$420", "#d4b16a", "table"],
      ["Tall Glass Display Cabinet", "dark frame, glass doors, warm lighting", "32 x 72 in", "$500-$950", "#26312f", "storage"]
    ]
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
    layout: "Place screens away from direct window glare, then build storage and display shelves around the main setup.",
    products: [
      ["Sit-Stand Gaming Desk", "carbon top, cable tray, monitor shelf", "60 x 30 in", "$320-$680", "#20242a", "table"],
      ["Ergonomic Mesh Chair", "adjustable arms and head support", "28 x 28 in", "$220-$520", "#18b7d9", "seat"],
      ["Modular Display Shelf", "black cubes with LED-ready channels", "48 x 72 in", "$180-$420", "#7c3aed", "storage"]
    ]
  }
};

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDimensions(value) {
  const numbers = value.match(/\d+(\.\d+)?/g)?.map(Number) || [];

  if (numbers.length >= 2) {
    return { width: numbers[0], length: numbers[1], label: `${numbers[0]} x ${numbers[1]} ft` };
  }

  return { width: 12, length: 14, label: "12 x 14 ft estimate" };
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

function buildChecklist(budgetTier, mustHaves, products) {
  const budgetIdeas = {
    starter: [
      "Choose one hero item first and source the rest secondhand",
      "Compare flat-pack, open-box, and local marketplace options",
      "Save budget for paint, lighting, baskets, and cable control"
    ],
    balanced: [
      "Buy the main seating or desk new and save on accent pieces",
      "Choose one durable rug or storage piece that fits the room dimensions",
      "Compare delivery fees before choosing larger furniture"
    ],
    premium: [
      "Invest in custom-sized window treatments or a statement rug",
      "Choose durable materials for daily-use furniture",
      "Reserve part of the budget for delivery, assembly, and finishing touches"
    ]
  };

  const productChecks = products.map((product) => `Measure for: ${product.name} (${product.size})`);
  const mustHaveItems = mustHaves.length
    ? mustHaves.slice(0, 2).map((item) => `Confirm the must-have item: ${item}`)
    : ["Confirm the largest furniture piece before buying"];

  return [...productChecks, ...mustHaveItems, ...budgetIdeas[budgetTier]];
}

function makeProducts(plan, mustHaves) {
  const products = plan.products.map(([name, description, size, price, color, shape]) => ({
    name,
    description,
    size,
    price,
    color,
    shape
  }));

  mustHaves.slice(0, 2).forEach((item) => {
    products.push({
      name: `Must-Have Pick: ${item}`,
      description: "Match this item to the chosen style, finish, and available walking space.",
      size: "verify exact fit",
      price: "price compare",
      color: "#8a8f67",
      shape: "storage"
    });
  });

  return products.slice(0, 5);
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

function showProducts(products) {
  productPicks.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "buy-card";
    card.style.setProperty("--product-color", product.color);
    card.style.setProperty("--product-bg", `${product.color}22`);

    card.innerHTML = `
      <div class="product-visual" aria-hidden="true">
        <div class="product-shape ${product.shape}"></div>
      </div>
      <div class="buy-card-body">
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <div class="product-meta">
          <span>${product.size}</span>
          <span>${product.price}</span>
        </div>
      </div>
      <button type="button" class="choose-button" aria-pressed="false">Choose this piece</button>
    `;

    const chooseButton = card.querySelector(".choose-button");
    chooseButton.addEventListener("click", () => {
      chooseButton.classList.toggle("is-selected");
      const isSelected = chooseButton.classList.contains("is-selected");
      chooseButton.textContent = isSelected ? "Chosen" : "Choose this piece";
      chooseButton.setAttribute("aria-pressed", String(isSelected));
    });

    if (index === 0) {
      chooseButton.click();
    }

    productPicks.appendChild(card);
  });
}

function renderFloorPlan(dimensions, products) {
  roomPreview.innerHTML = `
    <div class="floor-plan">
      <span class="dimension-line width">${dimensions.width} ft</span>
      <span class="dimension-line length">${dimensions.length} ft</span>
      <div class="floor-item rug">${products[2]?.name || "Rug"}</div>
      <div class="floor-item seat">${products.find((product) => product.shape === "seat")?.name || "Seating"}</div>
      <div class="floor-item table">${products.find((product) => product.shape === "table")?.name || "Table"}</div>
      <div class="floor-item storage">${products.find((product) => product.shape === "storage")?.name || "Storage"}</div>
    </div>
  `;
}

function render3DModel(dimensions, products) {
  roomPreview.innerHTML = `<canvas class="model-canvas" aria-label="3D room model"></canvas>`;
  const canvas = roomPreview.querySelector("canvas");

  if (!window.THREE) {
    renderFloorPlan(dimensions, products);
    previewCaption.textContent = "The 3D library could not load, so a 2D dimensioned floor plan is shown instead.";
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefe3d2);

  const width = Math.max(dimensions.width, 8);
  const length = Math.max(dimensions.length, 8);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(width * 0.72, Math.max(width, length) * 0.82, length * 0.88);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(roomPreview.clientWidth, 330, false);

  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(4, 8, 6);
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.16, length),
    new THREE.MeshStandardMaterial({ color: 0xd8c3aa, roughness: 0.8 })
  );
  floor.position.y = -0.08;
  scene.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf7eee3, roughness: 0.9 });
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, 3, 0.15), wallMaterial);
  backWall.position.set(0, 1.5, -length / 2);
  scene.add(backWall);

  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, length), wallMaterial);
  sideWall.position.set(-width / 2, 1.5, 0);
  scene.add(sideWall);

  const itemData = [
    { shape: "rug", size: [width * 0.38, 0.08, length * 0.26], pos: [-width * 0.08, 0.05, length * 0.08] },
    { shape: "seat", size: [width * 0.38, 0.62, length * 0.18], pos: [-width * 0.18, 0.35, length * 0.26] },
    { shape: "table", size: [width * 0.16, 0.38, length * 0.14], pos: [width * 0.16, 0.24, length * 0.1] },
    { shape: "storage", size: [width * 0.14, 1.35, length * 0.28], pos: [width * 0.32, 0.74, -length * 0.18] }
  ];

  itemData.forEach((item) => {
    const product = products.find((candidate) => candidate.shape === item.shape) || products[0];
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(...item.size),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(product.color), roughness: 0.55 })
    );
    mesh.position.set(...item.pos);
    scene.add(mesh);
  });

  renderer.render(scene, camera);
}

function renderRoomPreview(modelView, dimensions, products) {
  roomDimensionsBadge.textContent = dimensions.label;

  if (modelView === "3d") {
    render3DModel(dimensions, products);
    previewCaption.textContent = `3D model scaled from a ${dimensions.label} room, with core furniture blocked in by footprint.`;
    return;
  }

  renderFloorPlan(dimensions, products);
  previewCaption.textContent = `2D floor plan scaled from a ${dimensions.label} room, with width and length called out for shopping fit checks.`;
}

function generateDesign(event) {
  event.preventDefault();

  const formData = new FormData(designForm);
  const roomType = formData.get("roomType").trim();
  const selectedStyle = formData.get("designStyle");
  const favoriteColors = formData.get("favoriteColors").trim();
  const budget = Number(formData.get("budget"));
  const dimensions = parseDimensions(formData.get("dimensions").trim());
  const modelView = formData.get("modelView");
  const mustHaves = splitList(formData.get("mustHaves"));

  const plan = stylePlans[selectedStyle];
  const budgetTier = getBudgetTier(budget);
  const products = makeProducts(plan, mustHaves);
  const roomLabel = roomType || "Room";

  designTitle.textContent = `${plan.titleWord} ${roomLabel} Design`;
  styleDescription.textContent = `${plan.description} For a ${dimensions.label} space, pick pieces that match the room footprint before buying.`;
  layoutSuggestion.textContent = `${plan.layout} Start with ${products[0].name}, then place ${mustHaves[0] || products[1].name} where it keeps walkways open.`;

  showPalette(plan.palette, favoriteColors);
  showProducts(products);
  renderRoomPreview(modelView, dimensions, products);
  addListItems(furnitureList, products.map((product) => `${product.name} - ${product.size} - ${product.price}`));
  addListItems(decorIdeas, plan.decor);
  addListItems(shoppingChecklist, buildChecklist(budgetTier, mustHaves, products));

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
  productPicks.innerHTML = "";
  roomPreview.innerHTML = "";
  roomDimensionsBadge.textContent = "";
  previewCaption.textContent = "";
}

designForm.addEventListener("submit", generateDesign);
resetButton.addEventListener("click", resetDesign);
