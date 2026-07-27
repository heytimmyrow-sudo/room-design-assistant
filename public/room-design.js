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
const saveButton = document.querySelector("#saveButton");
const savedRoomList = document.querySelector("#savedRoomList");
const saveStatus = document.querySelector("#saveStatus");

const STORAGE_KEY = "roomDesignAssistant.savedRooms";
let activeSaveId = "";
let currentSnapshot = null;

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

function splitLinks(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSavedRooms() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setSavedRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

function createSaveId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `room-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFormValues() {
  const formData = new FormData(designForm);

  return {
    roomType: formData.get("roomType").trim(),
    roomName: formData.get("roomName").trim(),
    designStyle: formData.get("designStyle"),
    favoriteColors: formData.get("favoriteColors").trim(),
    budget: formData.get("budget"),
    dimensions: formData.get("dimensions").trim(),
    modelView: formData.get("modelView"),
    mustHaves: formData.get("mustHaves").trim(),
    furnitureLinks: formData.get("furnitureLinks").trim()
  };
}

function setFormValues(values) {
  Object.entries(values).forEach(([key, value]) => {
    const field = designForm.elements.namedItem(key);

    if (field) {
      field.value = value || "";
    }
  });
}

function formatSavedDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function isImageUrl(url) {
  return /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url);
}

function getLinkHost(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "pasted furniture";
  }
}

function makeShoppingSearchLink(query) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
}

function titleFromLink(value, index) {
  try {
    const url = new URL(value);
    const asinMatch = url.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);

    if (asinMatch) {
      return `Amazon Furniture Item ${asinMatch[1].toUpperCase()}`;
    }

    const pathWords = url.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/\.[a-z0-9]+$/i, "")
      .split(/[-_+%20]+/)
      .filter((word) => word && !/^\d+$/.test(word))
      .slice(0, 4)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return pathWords || `Imported Furniture ${index + 1}`;
  } catch {
    return `Imported Furniture ${index + 1}`;
  }
}

function inferShapeFromLink(value, index) {
  const text = value.toLowerCase();

  if (/sofa|couch|chair|loveseat|sectional|bench/.test(text)) {
    return "seat";
  }

  if (/table|desk|stand|nightstand|console/.test(text)) {
    return "table";
  }

  if (/rug|mat|carpet/.test(text)) {
    return "rug";
  }

  if (/lamp|light|sconce/.test(text)) {
    return "light";
  }

  if (/shelf|cabinet|dresser|bookcase|storage|wardrobe/.test(text)) {
    return "storage";
  }

  return ["seat", "table", "storage", "rug", "light"][index % 5];
}

async function fetchProductPreview(link) {
  try {
    const response = await fetch(`/api/product-preview?url=${encodeURIComponent(link)}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
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

async function makeImportedProducts(furnitureLinks) {
  const colors = ["#8a6f52", "#415f65", "#936b5f", "#6f7558", "#3a4554"];
  const previews = await Promise.all(furnitureLinks.slice(0, 5).map(fetchProductPreview));

  return furnitureLinks.slice(0, 5).map((link, index) => {
    const preview = previews[index] || {};
    const store = preview.store || getLinkHost(link);
    const title = preview.title || titleFromLink(link, index);
    const price = preview.price ? String(preview.price) : "price unavailable";
    const imageUrl = preview.image || (isImageUrl(link) ? link : "");

    return {
      name: title.replace(/\s*\|\s*Amazon.*$/i, "").slice(0, 90),
      description: preview.blocked
        ? `Store object from ${store}. The store blocked exact preview details, so open the link to confirm.`
        : `Actual store item from ${store}. Use the linked page to confirm current availability.`,
      size: "measure on store page",
      price,
      color: colors[index % colors.length],
      shape: inferShapeFromLink(link, index),
      sourceUrl: link,
      imageUrl,
      imported: true,
      store,
      previewBlocked: Boolean(preview.blocked || !preview.price || !imageUrl)
    };
  });
}

async function makeProducts(plan, mustHaves, furnitureLinks) {
  const products = plan.products.map(([name, description, size, price, color, shape]) => ({
    name,
    description,
    size,
    price,
    color,
    shape,
    sourceUrl: makeShoppingSearchLink(name),
    imageUrl: "",
    imported: false,
    store: "Amazon search",
    searchLink: true
  }));

  const importedProducts = await makeImportedProducts(furnitureLinks);

  mustHaves.slice(0, 2).forEach((item) => {
    products.push({
      name: `Must-Have Pick: ${item}`,
      description: "Match this item to the chosen style, finish, and available walking space.",
      size: "verify exact fit",
      price: "price compare",
      color: "#8a8f67",
      shape: "storage",
      sourceUrl: makeShoppingSearchLink(`${item} furniture`),
      imageUrl: "",
      imported: false,
      store: "Amazon search",
      searchLink: true
    });
  });

  return [...importedProducts, ...products].slice(0, 8);
}

function addListItems(container, items) {
  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

function showFurnitureList(products) {
  furnitureList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");

    const mainText = document.createElement("span");
    mainText.textContent = `${product.name} - ${product.size} - ${product.price}`;
    li.appendChild(mainText);

    if (product.sourceUrl) {
      li.appendChild(document.createTextNode(" - "));
      const link = document.createElement("a");
      link.href = product.sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = product.searchLink
        ? `Shop similar on ${product.store}`
        : `View exact item at ${product.store || getLinkHost(product.sourceUrl)}`;
      li.appendChild(link);
    }

    furnitureList.appendChild(li);
  });
}

function renderSavedRooms() {
  const savedRooms = getSavedRooms();
  savedRoomList.innerHTML = "";

  if (!savedRooms.length) {
    const empty = document.createElement("p");
    empty.className = "saved-empty";
    empty.textContent = "No saved rooms yet.";
    savedRoomList.appendChild(empty);
    return;
  }

  savedRooms.forEach((room) => {
    const card = document.createElement("article");
    card.className = `saved-room-card${room.id === activeSaveId ? " is-active" : ""}`;

    const title = document.createElement("h4");
    title.textContent = room.name;

    const meta = document.createElement("p");
    meta.textContent = `${room.formValues.roomType || "Room"} - ${room.formValues.designStyle || "style"} - saved ${formatSavedDate(room.updatedAt)}`;

    const actions = document.createElement("div");
    actions.className = "saved-room-actions";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.className = "secondary-button";
    loadButton.textContent = "Load";
    loadButton.addEventListener("click", () => loadSavedRoom(room.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-room-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteSavedRoom(room.id));

    actions.append(loadButton, deleteButton);
    card.append(title, meta, actions);
    savedRoomList.appendChild(card);
  });
}

function buildSnapshot(formValues, products) {
  const plan = stylePlans[formValues.designStyle];
  const dimensions = parseDimensions(formValues.dimensions);
  const mustHaves = splitList(formValues.mustHaves);
  const roomLabel = formValues.roomType || "Room";
  const importedCount = products.filter((product) => product.imported).length;

  return {
    formValues,
    products,
    title: `${plan.titleWord} ${roomLabel} Design`,
    description: `${plan.description} For a ${dimensions.label} space, pick pieces that match the room footprint before buying.${importedCount ? ` ${importedCount} imported furniture object${importedCount === 1 ? "" : "s"} from your links are included in the plan and room model.` : ""}`,
    layout: `${plan.layout} Start with ${products[0].name}, then place ${mustHaves[0] || products[1].name} where it keeps walkways open.`,
    palette: plan.palette,
    decor: plan.decor,
    checklist: buildChecklist(getBudgetTier(Number(formValues.budget)), mustHaves, products),
    dimensions,
    modelView: formValues.modelView
  };
}

function ensureProductLinks(products) {
  return products.map((product) => {
    if (product.sourceUrl) {
      return product;
    }

    return {
      ...product,
      sourceUrl: makeShoppingSearchLink(product.name),
      store: "Amazon search",
      searchLink: true
    };
  });
}

function renderSnapshot(snapshot) {
  snapshot.products = ensureProductLinks(snapshot.products);
  currentSnapshot = snapshot;
  saveButton.disabled = false;

  designTitle.textContent = snapshot.title;
  styleDescription.textContent = snapshot.description;
  layoutSuggestion.textContent = snapshot.layout;

  showPalette(snapshot.palette, snapshot.formValues.favoriteColors);
  showProducts(snapshot.products);
  renderRoomPreview(snapshot.modelView, snapshot.dimensions, snapshot.products);
  showFurnitureList(snapshot.products);
  addListItems(decorIdeas, snapshot.decor);
  addListItems(shoppingChecklist, snapshot.checklist);

  emptyState.classList.add("hidden");
  results.classList.remove("hidden");
}

function saveCurrentRoom() {
  if (!currentSnapshot) {
    return;
  }

  const savedRooms = getSavedRooms();
  const formValues = getFormValues();
  currentSnapshot.formValues = formValues;
  const now = new Date().toISOString();
  const fallbackName = `${formValues.roomName || formValues.roomType || "Untitled room"} plan`;
  const savedRoom = {
    id: activeSaveId || createSaveId(),
    name: fallbackName,
    updatedAt: now,
    formValues,
    snapshot: currentSnapshot
  };
  const nextRooms = [
    savedRoom,
    ...savedRooms.filter((room) => room.id !== savedRoom.id)
  ];

  activeSaveId = savedRoom.id;
  setSavedRooms(nextRooms);
  renderSavedRooms();
  saveStatus.textContent = "Saved";
  setTimeout(() => {
    if (saveStatus.textContent === "Saved") {
      saveStatus.textContent = "";
    }
  }, 1800);
}

function loadSavedRoom(id) {
  const savedRoom = getSavedRooms().find((room) => room.id === id);

  if (!savedRoom) {
    return;
  }

  activeSaveId = id;
  setFormValues(savedRoom.formValues);
  renderSnapshot(savedRoom.snapshot);
  renderSavedRooms();
  saveStatus.textContent = "Loaded";
}

function deleteSavedRoom(id) {
  const nextRooms = getSavedRooms().filter((room) => room.id !== id);
  setSavedRooms(nextRooms);

  if (activeSaveId === id) {
    activeSaveId = "";
  }

  renderSavedRooms();
  saveStatus.textContent = "Deleted";
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

    const visual = document.createElement("div");
    visual.className = "product-visual";
    visual.setAttribute("aria-hidden", "true");

    if (product.imageUrl) {
      const image = document.createElement("img");
      image.className = "product-image";
      image.src = product.imageUrl;
      image.alt = "";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", () => {
        image.remove();
        const fallbackShape = document.createElement("div");
        fallbackShape.className = `product-shape ${product.shape}`;
        visual.appendChild(fallbackShape);
      });
      visual.appendChild(image);
    } else {
      const shape = document.createElement("div");
      shape.className = `product-shape ${product.shape}`;
      visual.appendChild(shape);
    }

    const body = document.createElement("div");
    body.className = "buy-card-body";

    const title = document.createElement("h4");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const meta = document.createElement("div");
    meta.className = "product-meta";

    [product.size, product.price].forEach((text) => {
      const badge = document.createElement("span");
      badge.textContent = text;
      meta.appendChild(badge);
    });

    if (product.imported) {
      const imported = document.createElement("span");
      imported.className = "imported-tag";
      imported.textContent = product.previewBlocked ? "Open link to verify" : "Store item";
      meta.appendChild(imported);
    }

    body.append(title, description, meta);

    if (product.sourceUrl) {
      const storeLink = document.createElement("a");
      storeLink.className = "store-link";
      storeLink.href = product.sourceUrl;
      storeLink.target = "_blank";
      storeLink.rel = "noopener noreferrer";
      storeLink.textContent = product.searchLink
        ? `Shop similar on ${product.store}`
        : `View exact item at ${product.store || getLinkHost(product.sourceUrl)}`;
      body.appendChild(storeLink);
    }

    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.className = "choose-button";
    chooseButton.setAttribute("aria-pressed", "false");
    chooseButton.textContent = "Choose this piece";

    card.append(visual, body, chooseButton);

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
  roomPreview.innerHTML = "";
  const plan = document.createElement("div");
  plan.className = "floor-plan";

  const widthLine = document.createElement("span");
  widthLine.className = "dimension-line width";
  widthLine.textContent = `${dimensions.width} ft`;

  const lengthLine = document.createElement("span");
  lengthLine.className = "dimension-line length";
  lengthLine.textContent = `${dimensions.length} ft`;

  plan.append(widthLine, lengthLine);

  const slots = [
    { left: "8%", bottom: "16%", width: "39%", height: "24%" },
    { left: "52%", bottom: "25%", width: "18%", height: "16%" },
    { right: "7%", top: "12%", width: "18%", height: "44%" },
    { left: "24%", top: "33%", width: "34%", height: "26%" },
    { left: "8%", top: "10%", width: "20%", height: "18%" },
    { right: "9%", bottom: "8%", width: "22%", height: "18%" }
  ];

  products.slice(0, slots.length).forEach((product, index) => {
    const item = document.createElement("div");
    item.className = `floor-item ${product.shape}${product.imported ? " imported-object" : ""}`;
    item.textContent = product.name;
    item.style.setProperty("--item-color", product.color);

    if (product.imageUrl) {
      item.style.backgroundImage = `url("${product.imageUrl}")`;
      item.style.setProperty("--image-dim", "0.35");
    }

    Object.entries(slots[index]).forEach(([property, value]) => {
      item.style[property] = value;
    });

    plan.appendChild(item);
  });

  roomPreview.appendChild(plan);
}

function addFurnitureObject(scene, product, item, THREE) {
  const group = new THREE.Group();
  group.position.set(item.pos[0], 0, item.pos[2]);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(product.color),
    roughness: 0.62,
    metalness: product.imported ? 0.08 : 0
  });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x49392e, roughness: 0.7 });

  if (product.shape === "seat") {
    const base = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.48, item.size[2]), material);
    const back = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.9, item.size[2] * 0.18), material);
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.08, item.size[1] * 0.72, item.size[2]), material);
    const rightArm = leftArm.clone();

    base.position.y = item.size[1] * 0.18;
    back.position.set(0, item.size[1] * 0.48, -item.size[2] * 0.42);
    leftArm.position.set(-item.size[0] * 0.46, item.size[1] * 0.34, 0);
    rightArm.position.set(item.size[0] * 0.46, item.size[1] * 0.34, 0);
    group.add(base, back, leftArm, rightArm);
  } else if (product.shape === "table") {
    const top = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.18, item.size[2]), material);
    top.position.y = item.size[1] * 0.76;
    group.add(top);

    [-0.38, 0.38].forEach((x) => {
      [-0.34, 0.34].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.08, item.size[1] * 0.7, item.size[2] * 0.08), darkMaterial);
        leg.position.set(item.size[0] * x, item.size[1] * 0.35, item.size[2] * z);
        group.add(leg);
      });
    });
  } else if (product.shape === "rug") {
    const rug = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1], item.size[2]), material);
    rug.position.y = item.size[1] * 0.5;
    group.add(rug);
  } else if (product.shape === "light") {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, item.size[1], 16), darkMaterial);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(item.size[0] * 0.24, item.size[0] * 0.32, item.size[1] * 0.22, 24), material);
    pole.position.y = item.size[1] * 0.5;
    shade.position.y = item.size[1] * 0.94;
    group.add(pole, shade);
  } else {
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(...item.size), material);
    const doorLine = new THREE.Mesh(new THREE.BoxGeometry(0.025, item.size[1] * 0.84, item.size[2] * 1.02), darkMaterial);
    cabinet.position.y = item.size[1] * 0.5;
    doorLine.position.y = item.size[1] * 0.5;
    group.add(cabinet, doorLine);
  }

  if (product.imported) {
    const tag = new THREE.Mesh(
      new THREE.BoxGeometry(item.size[0] * 0.42, 0.05, item.size[2] * 0.08),
      new THREE.MeshStandardMaterial({ color: 0xc8943f, roughness: 0.4 })
    );
    tag.position.y = item.size[1] + 0.08;
    group.add(tag);
  }

  scene.add(group);
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
    { size: [width * 0.38, 0.62, length * 0.18], pos: [-width * 0.18, 0.35, length * 0.26] },
    { size: [width * 0.16, 0.38, length * 0.14], pos: [width * 0.16, 0.24, length * 0.1] },
    { size: [width * 0.14, 1.35, length * 0.28], pos: [width * 0.32, 0.74, -length * 0.18] },
    { size: [width * 0.38, 0.08, length * 0.26], pos: [-width * 0.08, 0.05, length * 0.08] },
    { size: [width * 0.18, 0.5, length * 0.16], pos: [-width * 0.34, 0.28, -length * 0.22] },
    { size: [width * 0.2, 0.44, length * 0.16], pos: [width * 0.28, 0.27, length * 0.34] }
  ];

  products.slice(0, itemData.length).forEach((product, index) => {
    const item = itemData[index];
    addFurnitureObject(scene, product, item, THREE);
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

async function generateDesign(event) {
  event.preventDefault();
  const submitButton = designForm.querySelector(".primary-button");
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Loading store items...";

  try {
  const formValues = getFormValues();
  const plan = stylePlans[formValues.designStyle];
  const mustHaves = splitList(formValues.mustHaves);
  const furnitureLinks = splitLinks(formValues.furnitureLinks);
  const products = await makeProducts(plan, mustHaves, furnitureLinks);

  renderSnapshot(buildSnapshot(formValues, products));
  renderSavedRooms();
  } catch {
    alert("Some store items could not be loaded. Please try again or paste a direct product image link.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

function resetDesign() {
  results.classList.add("hidden");
  emptyState.classList.remove("hidden");
  activeSaveId = "";
  currentSnapshot = null;
  saveButton.disabled = true;
  saveStatus.textContent = "";

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
  renderSavedRooms();
}

designForm.addEventListener("submit", generateDesign);
resetButton.addEventListener("click", resetDesign);
saveButton.addEventListener("click", saveCurrentRoom);
renderSavedRooms();
