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
const suggestedAddOns = document.querySelector("#suggestedAddOns");
const roomPreview = document.querySelector("#roomPreview");
const roomDimensionsBadge = document.querySelector("#roomDimensionsBadge");
const previewCaption = document.querySelector("#previewCaption");
const selectedFurniture = document.querySelector("#selectedFurniture");
const rotateLeftButton = document.querySelector("#rotateLeftButton");
const rotateRightButton = document.querySelector("#rotateRightButton");
const shrinkButton = document.querySelector("#shrinkButton");
const growButton = document.querySelector("#growButton");
const budgetTracker = document.querySelector("#budgetTracker");
const fitWarnings = document.querySelector("#fitWarnings");
const moodBoard = document.querySelector("#moodBoard");
const styleNotes = document.querySelector("#styleNotes");
const downloadImageButton = document.querySelector("#downloadImageButton");
const downloadPdfButton = document.querySelector("#downloadPdfButton");
const saveButton = document.querySelector("#saveButton");
const savedRoomList = document.querySelector("#savedRoomList");
const saveStatus = document.querySelector("#saveStatus");
const productSourceStatus = document.querySelector("#productSourceStatus");
const extraSpaces = document.querySelector("#extraSpaces");
const addSpaceButton = document.querySelector("#addSpaceButton");
const outletList = document.querySelector("#outletList");
const addOutletButton = document.querySelector("#addOutletButton");
const ceilingLightList = document.querySelector("#ceilingLightList");
const addCeilingLightButton = document.querySelector("#addCeilingLightButton");
const ownedFurnitureList = document.querySelector("#ownedFurnitureList");
const addOwnedFurnitureButton = document.querySelector("#addOwnedFurnitureButton");

const STORAGE_KEY = "roomDesignAssistant.savedRooms";
const PRODUCT_SETTINGS_KEY = "roomDesignAssistant.productSettings";
let activeSaveId = "";
let currentSnapshot = null;
let gltfLoaderPromise = null;
const MAX_MODEL_PRODUCTS = 8;

const roomTemplates = {
  "small-bedroom": {
    roomType: "bedroom",
    designStyle: "minimalist",
    dimensions: "10 x 11 ft",
    mustHaves: "full bed, nightstand, dresser",
    windowPlan: "back center",
    wallPlan: "closet wall along the right side"
  },
  "gaming-setup": {
    roomType: "gaming room",
    designStyle: "gaming",
    dimensions: "11 x 13 ft",
    mustHaves: "gaming desk, ergonomic chair, display shelves",
    windowPlan: "left wall",
    wallPlan: "screen wall should avoid window glare"
  },
  "studio-apartment": {
    roomType: "studio apartment",
    designStyle: "modern",
    dimensions: "14 x 18 ft",
    mustHaves: "sofa bed, media console, dining table",
    windowPlan: "back wall, right wall",
    wallPlan: "open sleeping zone and living zone"
  },
  "shared-kids-room": {
    roomType: "kids bedroom",
    designStyle: "cozy",
    dimensions: "12 x 12 ft",
    mustHaves: "two beds, toy storage, reading lamp",
    windowPlan: "back left",
    wallPlan: "leave center play space open"
  },
  "home-office": {
    roomType: "home office",
    designStyle: "modern",
    dimensions: "10 x 12 ft",
    mustHaves: "standing desk, task chair, storage cabinet",
    windowPlan: "right wall",
    wallPlan: "desk should face away from window glare"
  }
};

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

const suggestedFurnitureByStyle = {
  cozy: [
    ["Reading Floor Lamp", "warm linen shade for a quiet evening corner", "18 x 18 x 62 in", "$70-$160", "#c8943f", "light"],
    ["Woven Storage Basket", "soft storage for blankets, toys, or everyday clutter", "20 x 16 x 16 in", "$35-$85", "#9c7a55", "storage"],
    ["Compact Accent Chair", "extra seat with rounded arms and textured fabric", "30 x 32 x 34 in", "$180-$420", "#8a8f67", "chair"]
  ],
  modern: [
    ["Slim Console Table", "narrow landing zone with a clean metal frame", "44 x 12 x 30 in", "$120-$280", "#2f3437", "table"],
    ["Low Planter Stand", "structured greenery without taking much floor space", "16 x 16 x 24 in", "$45-$120", "#0f766e", "storage"],
    ["Swivel Accent Chair", "compact seating with a polished modern profile", "31 x 31 x 32 in", "$240-$620", "#b58b3b", "chair"]
  ],
  minimalist: [
    ["Wall-Mounted Shelf", "simple display and storage that keeps the floor open", "36 x 10 x 8 in", "$55-$140", "#c9a66b", "storage"],
    ["Paper Shade Floor Lamp", "soft light with a quiet sculptural shape", "15 x 15 x 58 in", "$45-$130", "#fafaf7", "light"],
    ["Small Round Stool", "flexible seat or side table with a small footprint", "16 x 16 x 18 in", "$50-$120", "#b9b5ad", "chair"]
  ],
  luxury: [
    ["Velvet Storage Ottoman", "rich texture plus hidden storage for blankets", "42 x 22 x 18 in", "$180-$480", "#0d5c50", "seat"],
    ["Brass Picture Light", "focused accent lighting for art or shelving", "20 x 6 x 8 in", "$90-$220", "#d4b16a", "light"],
    ["Marble-Look Drink Table", "small polished perch for seating zones", "14 x 14 x 24 in", "$120-$280", "#f4ede1", "table"]
  ],
  gaming: [
    ["Cable Management Rack", "keeps power strips and cords off the floor", "24 x 8 x 6 in", "$25-$70", "#20242a", "storage"],
    ["LED Corner Lamp", "vertical color light for ambient game lighting", "10 x 10 x 58 in", "$45-$140", "#18b7d9", "light"],
    ["Controller Display Shelf", "small wall-style display for gear and collectibles", "32 x 8 x 24 in", "$50-$150", "#7c3aed", "storage"]
  ]
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

function getProductSettings() {
  try {
    return JSON.parse(localStorage.getItem(PRODUCT_SETTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

function setProductSettings(settings) {
  localStorage.setItem(PRODUCT_SETTINGS_KEY, JSON.stringify(settings));
}

function updateProductSourceStatus() {
  const source = designForm.elements.namedItem("productSource")?.value;
  const apiKey = designForm.elements.namedItem("productApiKey")?.value.trim();
  const addStoreLinks = designForm.elements.namedItem("addStoreLinks")?.checked !== false;

  productSourceStatus.textContent = !addStoreLinks
    ? "Store links off"
    : source === "bestbuy" && apiKey
    ? "Exact products active"
    : "Search links active";
}

function restoreProductSettings() {
  const settings = getProductSettings();

  if (settings.productSource) {
    designForm.elements.namedItem("productSource").value = settings.productSource;
  }

  if (settings.productApiKey) {
    designForm.elements.namedItem("productApiKey").value = settings.productApiKey;
  }

  updateProductSourceStatus();
}

function createSaveId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `room-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createExtraSpaceRow(space = {}) {
  const row = document.createElement("div");
  row.className = "extra-space-row";

  row.innerHTML = `
    <label>
      Extra space name
      <input type="text" name="extraSpaceName" placeholder="Nook, closet, alcove...">
    </label>
    <label>
      Dimensions
      <input type="text" name="extraSpaceDimensions" placeholder="5 x 7 ft">
    </label>
    <label>
      Connects to
      <select name="extraSpaceSide">
        <option value="right">Right side</option>
        <option value="left">Left side</option>
        <option value="back">Back wall</option>
        <option value="front">Front wall</option>
      </select>
    </label>
    <button type="button" class="remove-space-button" aria-label="Remove this extra space">Remove</button>
  `;

  row.querySelector('[name="extraSpaceName"]').value = space.name || "";
  row.querySelector('[name="extraSpaceDimensions"]').value = space.dimensions || "";
  row.querySelector('[name="extraSpaceSide"]').value = space.side || "right";
  row.querySelector(".remove-space-button").addEventListener("click", () => {
    if (extraSpaces.children.length > 1) {
      row.remove();
      return;
    }

    row.querySelector('[name="extraSpaceName"]').value = "";
    row.querySelector('[name="extraSpaceDimensions"]').value = "";
    row.querySelector('[name="extraSpaceSide"]').value = "right";
  });

  return row;
}

function resetExtraSpaceRows(spaces = [{}]) {
  extraSpaces.innerHTML = "";
  const rows = spaces.length ? spaces : [{}];
  rows.forEach((space) => extraSpaces.appendChild(createExtraSpaceRow(space)));
}

function createOutletRow(outlet = {}) {
  const row = document.createElement("div");
  row.className = "fixture-row outlet-row";
  row.innerHTML = `
    <label>
      Outlet wall
      <select name="outletWall">
        <option value="front">Front wall</option>
        <option value="back">Back wall</option>
        <option value="left">Left wall</option>
        <option value="right">Right wall</option>
      </select>
    </label>
    <label>
      Position
      <select name="outletPosition">
        <option value="center">Center</option>
        <option value="left">Left side</option>
        <option value="right">Right side</option>
      </select>
    </label>
    <button type="button" class="remove-space-button" aria-label="Remove this outlet">Remove</button>
  `;

  row.querySelector('[name="outletWall"]').value = outlet.wall || "front";
  row.querySelector('[name="outletPosition"]').value = outlet.position || "center";
  row.querySelector(".remove-space-button").addEventListener("click", () => {
    if (outletList.children.length > 1) {
      row.remove();
      return;
    }

    row.querySelector('[name="outletWall"]').value = "front";
    row.querySelector('[name="outletPosition"]').value = "center";
  });

  return row;
}

function createCeilingLightRow(light = {}) {
  const row = document.createElement("div");
  row.className = "fixture-row light-row";
  row.innerHTML = `
    <label>
      Ceiling light type
      <select name="ceilingLightType">
        <option value="flush">Flush mount</option>
        <option value="recessed">Recessed light</option>
        <option value="pendant">Pendant light</option>
        <option value="track">Track light</option>
      </select>
    </label>
    <label>
      Position
      <select name="ceilingLightPosition">
        <option value="center">Center</option>
        <option value="front">Front zone</option>
        <option value="back">Back zone</option>
        <option value="left">Left zone</option>
        <option value="right">Right zone</option>
      </select>
    </label>
    <button type="button" class="remove-space-button" aria-label="Remove this ceiling light">Remove</button>
  `;

  row.querySelector('[name="ceilingLightType"]').value = light.type || "flush";
  row.querySelector('[name="ceilingLightPosition"]').value = light.position || "center";
  row.querySelector(".remove-space-button").addEventListener("click", () => {
    if (ceilingLightList.children.length > 1) {
      row.remove();
      return;
    }

    row.querySelector('[name="ceilingLightType"]').value = "flush";
    row.querySelector('[name="ceilingLightPosition"]').value = "center";
  });

  return row;
}

function resetOutletRows(outlets = [{}]) {
  outletList.innerHTML = "";
  const rows = outlets.length ? outlets : [{}];
  rows.forEach((outlet) => outletList.appendChild(createOutletRow(outlet)));
}

function resetCeilingLightRows(lights = [{}]) {
  ceilingLightList.innerHTML = "";
  const rows = lights.length ? lights : [{}];
  rows.forEach((light) => ceilingLightList.appendChild(createCeilingLightRow(light)));
}

function createOwnedFurnitureRow(item = {}) {
  const row = document.createElement("div");
  row.className = "owned-furniture-row";
  row.innerHTML = `
    <label>
      Item name
      <input type="text" name="ownedFurnitureName" placeholder="Blue sofa, white desk, TV stand...">
    </label>
    <label>
      Dimensions
      <input type="text" name="ownedFurnitureDimensions" placeholder="width x depth x height, like 78 x 35 x 32 in">
    </label>
    <label>
      Type
      <select name="ownedFurnitureType">
        <option value="auto">Auto-detect</option>
        <option value="seat">Sofa / bench</option>
        <option value="chair">Chair</option>
        <option value="desk">Desk</option>
        <option value="table">Table</option>
        <option value="bed">Bed</option>
        <option value="storage">Storage</option>
        <option value="electronics">TV / computer</option>
        <option value="rug">Rug</option>
        <option value="light">Lamp</option>
      </select>
    </label>
    <button type="button" class="remove-space-button" aria-label="Remove this owned furniture item">Remove</button>
  `;

  row.querySelector('[name="ownedFurnitureName"]').value = item.name || "";
  row.querySelector('[name="ownedFurnitureDimensions"]').value = item.dimensions || "";
  row.querySelector('[name="ownedFurnitureType"]').value = item.type || "auto";
  row.querySelector(".remove-space-button").addEventListener("click", () => {
    if (ownedFurnitureList.children.length > 1) {
      row.remove();
      return;
    }

    row.querySelector('[name="ownedFurnitureName"]').value = "";
    row.querySelector('[name="ownedFurnitureDimensions"]').value = "";
    row.querySelector('[name="ownedFurnitureType"]').value = "auto";
  });

  return row;
}

function resetOwnedFurnitureRows(items = [{}]) {
  ownedFurnitureList.innerHTML = "";
  const rows = items.length ? items : [{}];
  rows.forEach((item) => ownedFurnitureList.appendChild(createOwnedFurnitureRow(item)));
}

function getExtraSpaceValues(formData) {
  const names = formData.getAll("extraSpaceName");
  const dimensions = formData.getAll("extraSpaceDimensions");
  const sides = formData.getAll("extraSpaceSide");

  return names
    .map((name, index) => ({
      name: String(name || "").trim(),
      dimensions: String(dimensions[index] || "").trim(),
      side: String(sides[index] || "right")
    }))
    .filter((space) => space.name || space.dimensions);
}

function getOutletValues(formData) {
  const walls = formData.getAll("outletWall");
  const positions = formData.getAll("outletPosition");

  return walls.map((wall, index) => ({
    wall: String(wall || "front"),
    position: String(positions[index] || "center")
  }));
}

function getCeilingLightValues(formData) {
  const types = formData.getAll("ceilingLightType");
  const positions = formData.getAll("ceilingLightPosition");

  return types.map((type, index) => ({
    type: String(type || "flush"),
    position: String(positions[index] || "center")
  }));
}

function getOwnedFurnitureValues(formData) {
  const names = formData.getAll("ownedFurnitureName");
  const dimensions = formData.getAll("ownedFurnitureDimensions");
  const types = formData.getAll("ownedFurnitureType");

  return names
    .map((name, index) => ({
      name: String(name || "").trim(),
      dimensions: String(dimensions[index] || "").trim(),
      type: String(types[index] || "auto")
    }))
    .filter((item) => item.name || item.dimensions);
}

function getFormValues() {
  const formData = new FormData(designForm);

  return {
    roomTemplate: formData.get("roomTemplate") || "",
    roomType: formData.get("roomType").trim(),
    roomName: formData.get("roomName").trim(),
    designStyle: formData.get("designStyle"),
    favoriteColors: formData.get("favoriteColors").trim(),
    budget: formData.get("budget"),
    dimensions: formData.get("dimensions").trim(),
    doorLocation: formData.get("doorLocation") || "front",
    doorNote: formData.get("doorNote").trim(),
    windowPlan: formData.get("windowPlan")?.trim() || "",
    wallPlan: formData.get("wallPlan")?.trim() || "",
    extraSpaces: getExtraSpaceValues(formData),
    outlets: getOutletValues(formData),
    ceilingLights: getCeilingLightValues(formData),
    ownedFurniture: getOwnedFurnitureValues(formData),
    modelView: formData.get("modelView"),
    mustHaves: formData.get("mustHaves").trim(),
    furnitureLinks: formData.get("furnitureLinks").trim(),
    modelLinks: formData.get("modelLinks").trim(),
    productSource: formData.get("productSource"),
    productApiKey: formData.get("productApiKey").trim(),
    addStoreLinks: formData.get("addStoreLinks") === "on"
  };
}

function setFormValues(values) {
  resetExtraSpaceRows(values.extraSpaces || [{}]);
  resetOutletRows(values.outlets || [{}]);
  resetCeilingLightRows(values.ceilingLights || [{}]);
  resetOwnedFurnitureRows(values.ownedFurniture || [{}]);

  Object.entries(values).forEach(([key, value]) => {
    if (key === "extraSpaces" || key === "outlets" || key === "ceilingLights" || key === "ownedFurniture") {
      return;
    }

    const field = designForm.elements.namedItem(key);

    if (field) {
      if (field.type === "checkbox") {
        field.checked = value !== false;
      } else {
        field.value = value || "";
      }
    }
  });
}

function applyRoomTemplate(templateKey) {
  const template = roomTemplates[templateKey];

  if (!template) {
    return;
  }

  Object.entries(template).forEach(([key, value]) => {
    const field = designForm.elements.namedItem(key);

    if (field) {
      field.value = value;
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

function isModelUrl(url) {
  return /\.(glb|gltf)(\?.*)?$/i.test(url);
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

  if (/monitor|computer|pc|screen|tv|display|console|speaker|keyboard/.test(text)) {
    return "electronics";
  }

  if (/desk|workstation|writing table|gaming table/.test(text)) {
    return "desk";
  }

  if (/bed|mattress|daybed|bunk/.test(text)) {
    return "bed";
  }

  if (/chair|stool|recliner|ottoman/.test(text)) {
    return "chair";
  }

  if (/sofa|couch|loveseat|sectional|bench/.test(text)) {
    return "seat";
  }

  if (/table|stand|nightstand|coffee table|side table/.test(text)) {
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

  return ["seat", "desk", "storage", "rug", "chair"][index % 5];
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

async function fetchExactProduct(query, productSettings) {
  if (productSettings.productSource !== "bestbuy" || !productSettings.productApiKey) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: query,
      apiKey: productSettings.productApiKey
    });
    const response = await fetch(`/api/product-search?${params.toString()}`);

    if (!response.ok) {
      return null;
    }

    const product = await response.json();
    return product.exact ? product : null;
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

function parseExtraSpaces(spaces) {
  return spaces
    .map((space, index) => {
      const parsed = parseDimensions(space.dimensions || "");

      if (!space.name && !space.dimensions) {
        return null;
      }

      return {
        name: space.name || `Extra space ${index + 1}`,
        width: parsed.width,
        length: parsed.length,
        label: parsed.label,
        side: space.side || "right"
      };
    })
    .filter(Boolean);
}

function parseWindowPlan(value) {
  return splitList(value || "")
    .slice(0, 6)
    .map((item) => {
      const text = item.toLowerCase();
      const wall = /left/.test(text)
        ? "left"
        : /right/.test(text)
        ? "right"
        : /back|rear/.test(text)
        ? "back"
        : "front";
      const position = /left/.test(text)
        ? "left"
        : /right/.test(text)
        ? "right"
        : "center";

      return {
        label: item,
        wall,
        position
      };
    });
}

function getRoomShape(formValues, dimensions) {
  const spaces = parseExtraSpaces(formValues.extraSpaces || []);
  const windows = parseWindowPlan(formValues.windowPlan || "");
  const doorLocation = formValues.doorLocation || "front";
  const doorLabel = doorLocation.charAt(0).toUpperCase() + doorLocation.slice(1);
  const doorNote = formValues.doorNote ? `, ${formValues.doorNote}` : "";
  const extraLabel = spaces.length
    ? ` plus ${spaces.map((space) => `${space.name} (${space.label}, ${space.side} side)`).join("; ")}`
    : "";

  return {
    main: dimensions,
    spaces,
    windows,
    doorLocation,
    doorLabel,
    doorNote: formValues.doorNote || "",
    wallPlan: formValues.wallPlan || "",
    label: `${dimensions.label}${extraLabel}`,
    summary: `${doorLabel} wall door${doorNote}${windows.length ? `; windows: ${windows.map((windowItem) => windowItem.label).join(", ")}` : ""}${formValues.wallPlan ? `; walls: ${formValues.wallPlan}` : ""}${extraLabel ? `; extra spaces: ${spaces.map((space) => `${space.name} on the ${space.side}`).join(", ")}` : ""}`
  };
}

function getElectricalPlan(formValues) {
  const outlets = (formValues.outlets || []).filter(Boolean);
  const ceilingLights = (formValues.ceilingLights || []).filter(Boolean);
  const outletSummary = outlets.length
    ? `${outlets.length} outlet${outlets.length === 1 ? "" : "s"} (${outlets.map((outlet) => `${outlet.wall} wall, ${outlet.position}`).join("; ")})`
    : "no outlets marked";
  const lightSummary = ceilingLights.length
    ? `${ceilingLights.length} ceiling light${ceilingLights.length === 1 ? "" : "s"} (${ceilingLights.map((light) => `${light.type} at ${light.position}`).join("; ")})`
    : "no ceiling lights marked";

  return {
    outlets,
    ceilingLights,
    summary: `${outletSummary}; ${lightSummary}`
  };
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

  const productChecks = products.map((product) => product.owned
    ? `Place owned item: ${product.name} (${product.size})`
    : `Measure for: ${product.name} (${product.size})`);
  const mustHaveItems = mustHaves.length
    ? mustHaves.slice(0, 2).map((item) => `Confirm the must-have item: ${item}`)
    : ["Confirm the largest furniture piece before buying"];

  return [...productChecks, ...mustHaveItems, ...budgetIdeas[budgetTier]];
}

function estimateProductCost(product) {
  if (product.owned) {
    return 0;
  }

  const numbers = String(product.price || "").match(/\d[\d,]*/g)?.map((value) => Number(value.replace(/,/g, ""))) || [];

  if (!numbers.length) {
    return 120;
  }

  return Math.round(numbers.reduce((total, value) => total + value, 0) / numbers.length);
}

function buildBudgetSummary(products, budget) {
  const plannedTotal = products.reduce((total, product) => total + estimateProductCost(product), 0);
  const targetBudget = Number(budget) || plannedTotal || 0;
  const remaining = targetBudget - plannedTotal;

  return {
    plannedTotal,
    targetBudget,
    remaining,
    status: !targetBudget
      ? "Add a budget to compare costs."
      : remaining >= 0
      ? `$${remaining.toLocaleString()} under budget`
      : `$${Math.abs(remaining).toLocaleString()} over budget`
  };
}

function getProductFootprint(product, fallbackItem) {
  const size = getOwnedFurnitureSize(product, getFallbackSizeForProduct(product, fallbackItem.size));
  const scale = product.scale || 1;
  const rotated = Math.abs((product.rotation || 0) % 180) === 90;
  const width = size[0] * scale;
  const depth = size[2] * scale;

  return {
    width: rotated ? depth : width,
    depth: rotated ? width : depth,
    height: size[1] * scale
  };
}

function buildFitWarnings(products, dimensions, roomShape) {
  const warnings = [];
  const itemData = getDefaultItemData(dimensions.width, dimensions.length);

  products.slice(0, itemData.length).forEach((product, index) => {
    const footprint = getProductFootprint(product, itemData[index]);
    const placement = getProductPlacement(product, itemData[index], dimensions.width, dimensions.length);

    if (footprint.width > dimensions.width * 0.55 || footprint.depth > dimensions.length * 0.55) {
      warnings.push(`${product.name} is a large piece for this room. Check walking space before buying.`);
    }

    if (roomShape.doorLocation === "front" && placement.z > dimensions.length * 0.28) {
      warnings.push(`${product.name} may crowd the front door path.`);
    }

    products.slice(index + 1, itemData.length).forEach((otherProduct, otherIndexOffset) => {
      const otherIndex = index + otherIndexOffset + 1;
      const otherFootprint = getProductFootprint(otherProduct, itemData[otherIndex]);
      const otherPlacement = getProductPlacement(otherProduct, itemData[otherIndex], dimensions.width, dimensions.length);
      const overlapsX = Math.abs(placement.x - otherPlacement.x) < (footprint.width + otherFootprint.width) * 0.36;
      const overlapsZ = Math.abs(placement.z - otherPlacement.z) < (footprint.depth + otherFootprint.depth) * 0.36;

      if (overlapsX && overlapsZ) {
        warnings.push(`${product.name} and ${otherProduct.name} may overlap. Drag one into another zone.`);
      }
    });
  });

  if (roomShape.windows.length) {
    warnings.push("Keep tall storage and screens away from marked windows when possible.");
  }

  if (roomShape.wallPlan) {
    warnings.push("Custom wall notes are included as planning guidance. Confirm unusual wall angles with a tape measure.");
  }

  return [...new Set(warnings)].slice(0, 7);
}

function buildStyleNotes(snapshot) {
  const colorNames = [
    ...splitList(snapshot.formValues.favoriteColors),
    ...snapshot.palette.map((color) => color.name)
  ].slice(0, 4);

  return [
    `Use ${colorNames.join(", ")} as the main visual direction.`,
    `Place the largest piece first, then rotate smaller furniture until door paths stay open.`,
    `For a ${snapshot.dimensions.label} room, keep at least one clear center walkway.`,
    snapshot.roomShape.windows.length
      ? "Use window walls for daylight, but avoid screen glare and tall blocked views."
      : "Add window placement when you want more exact lighting advice.",
    `Choose add-ons only after the main pieces fit inside the model.`
  ];
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

function makeSearchProduct(name, description, size, price, color, shape, searchQuery = name) {
  return {
    name,
    description,
    size,
    price,
    color,
    shape,
    sourceUrl: makeShoppingSearchLink(searchQuery),
    imageUrl: "",
    imported: false,
    store: "Amazon search",
    searchLink: true,
    exactGenerated: false
  };
}

function makeSuggestedProduct(item, productSettings) {
  const [name, description, size, price, color, shape] = item;
  const searchProduct = makeSearchProduct(name, description, size, price, color, shape);

  if (productSettings?.addStoreLinks === false) {
    return {
      ...searchProduct,
      sourceUrl: "",
      searchLink: false,
      suggested: true
    };
  }

  return {
    ...searchProduct,
    suggested: true
  };
}

function makeExactGeneratedProduct(match, fallback, color, shape) {
  return {
    name: match.title || fallback.name,
    description: match.description || "Exact product match from the selected product source.",
    size: "measure on product page",
    price: match.price || "price unavailable",
    color,
    shape,
    sourceUrl: match.url || makeShoppingSearchLink(fallback.name),
    imageUrl: match.image || "",
    imported: false,
    store: match.store || "Product source",
    searchLink: false,
    exactGenerated: true,
    previewBlocked: !match.price || !match.image
  };
}

function makeOwnedProducts(ownedFurniture) {
  const colors = ["#64748b", "#52796f", "#8a6f52", "#76563d", "#6f7558"];

  return ownedFurniture.slice(0, 5).map((item, index) => {
    const shape = item.type && item.type !== "auto"
      ? item.type
      : inferShapeFromLink(item.name, index);

    return {
      name: item.name || `Owned furniture ${index + 1}`,
      description: "Furniture you already have. Keep it in the plan and check placement before buying anything new.",
      size: item.dimensions || "measure existing piece",
      price: "already owned",
      color: colors[index % colors.length],
      shape,
      sourceUrl: "",
      imageUrl: "",
      imported: false,
      owned: true,
      searchLink: false,
      exactGenerated: false
    };
  });
}

function attachModelLinks(products, modelLinks) {
  const validModelLinks = modelLinks.filter(isModelUrl);

  return products.map((product, index) => ({
    ...product,
    modelUrl: validModelLinks[index] || product.modelUrl || ""
  }));
}

function withProductIds(products) {
  return products.map((product, index) => ({
    ...product,
    id: product.id || `${Date.now().toString(36)}-${index}-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`
  }));
}

async function makeProducts(plan, mustHaves, furnitureLinks, productSettings, modelLinks = [], ownedFurniture = []) {
  const shouldAddLinks = productSettings.addStoreLinks !== false;
  const generatedBases = plan.products.map(([name, description, size, price, color, shape]) => ({
    name,
    description,
    size,
    price,
    color,
    shape
  }));
  const exactMatches = await Promise.all(
    generatedBases.map((product) => shouldAddLinks ? fetchExactProduct(product.name, productSettings) : null)
  );
  const products = generatedBases.map((product, index) => {
    const exactMatch = exactMatches[index];

    if (exactMatch) {
      return makeExactGeneratedProduct(exactMatch, product, product.color, product.shape);
    }

    const searchProduct = makeSearchProduct(
      product.name,
      product.description,
      product.size,
      product.price,
      product.color,
      product.shape
    );
    return shouldAddLinks ? searchProduct : { ...searchProduct, sourceUrl: "", searchLink: false };
  });

  const importedProducts = await makeImportedProducts(furnitureLinks);
  const normalizedImportedProducts = importedProducts.map((product) => shouldAddLinks
    ? product
    : { ...product, sourceUrl: "", searchLink: false });

  const mustHaveBases = mustHaves.slice(0, 2).map((item) => ({
    name: `Must-Have Pick: ${item}`,
    query: `${item} furniture`,
    description: "Match this item to the chosen style, finish, and available walking space.",
    size: "verify exact fit",
    price: "price compare",
    color: "#8a8f67",
    shape: inferShapeFromLink(item, 0)
  }));
  const mustHaveMatches = await Promise.all(
    mustHaveBases.map((product) => shouldAddLinks ? fetchExactProduct(product.query, productSettings) : null)
  );

  mustHaveBases.forEach((product, index) => {
    const exactMatch = mustHaveMatches[index];

    if (exactMatch) {
      products.push(makeExactGeneratedProduct(exactMatch, product, product.color, product.shape));
      return;
    }

    const searchProduct = makeSearchProduct(
      product.name,
      product.description,
      product.size,
      product.price,
      product.color,
      product.shape,
      product.query
    );
    products.push(shouldAddLinks ? searchProduct : { ...searchProduct, sourceUrl: "", searchLink: false });
  });

  const ownedProducts = makeOwnedProducts(ownedFurniture);

  return withProductIds(attachModelLinks([...ownedProducts, ...normalizedImportedProducts, ...products].slice(0, MAX_MODEL_PRODUCTS), modelLinks));
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
      link.textContent = product.exactGenerated
        ? `View exact product at ${product.store}`
        : product.searchLink
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
    card.setAttribute("aria-label", `${room.name} saved room`);

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
    loadButton.setAttribute("aria-label", `Load ${room.name}`);
    loadButton.addEventListener("click", () => loadSavedRoom(room.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-room-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${room.name}`);
    deleteButton.addEventListener("click", () => deleteSavedRoom(room.id));

    const duplicateButton = document.createElement("button");
    duplicateButton.type = "button";
    duplicateButton.className = "secondary-button";
    duplicateButton.textContent = "Duplicate";
    duplicateButton.setAttribute("aria-label", `Duplicate ${room.name}`);
    duplicateButton.addEventListener("click", () => duplicateSavedRoom(room.id));

    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.className = "secondary-button";
    renameButton.textContent = "Rename";
    renameButton.setAttribute("aria-label", `Rename ${room.name}`);
    renameButton.addEventListener("click", () => renameSavedRoom(room.id));

    actions.append(loadButton, duplicateButton, renameButton, deleteButton);
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
  const ownedCount = products.filter((product) => product.owned).length;
  const roomShape = getRoomShape(formValues, dimensions);
  const electricalPlan = getElectricalPlan(formValues);
  const budgetSummary = buildBudgetSummary(products, formValues.budget);
  const warnings = buildFitWarnings(products, dimensions, roomShape);

  return {
    formValues,
    products,
    title: `${plan.titleWord} ${roomLabel} Design`,
    description: `${plan.description} For a ${roomShape.label} room, pick pieces that match each zone before buying. Door placement: ${roomShape.summary}. Electrical plan: ${electricalPlan.summary}.${ownedCount ? ` ${ownedCount} item${ownedCount === 1 ? "" : "s"} you already have are included first, with their dimensions.` : ""}${importedCount ? ` ${importedCount} imported furniture object${importedCount === 1 ? "" : "s"} from your links are included in the plan and room model.` : ""}`,
    layout: `${plan.layout} Keep the ${roomShape.doorLabel.toLowerCase()} wall door path open${roomShape.spaces.length ? `, then use ${roomShape.spaces[0].name} as a separate zone when possible` : ""}. Keep desks, lamps, media consoles, and gaming gear near marked outlets. Place owned furniture first, then buy only the pieces that fill the gaps. Start with ${products[0].name}, then place ${mustHaves[0] || products[1].name} where it keeps walkways open.`,
    palette: plan.palette,
    decor: plan.decor,
    checklist: buildChecklist(getBudgetTier(Number(formValues.budget)), mustHaves, products),
    budgetSummary,
    warnings,
    dimensions,
    roomShape,
    electricalPlan,
    modelView: formValues.modelView
  };
}

function ensureProductLinks(products, formValues) {
  const shouldAddLinks = formValues?.addStoreLinks !== false;

  return products.map((product) => {
    if (!shouldAddLinks) {
      return {
        ...product,
        sourceUrl: "",
        searchLink: false
      };
    }

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

function getSuggestedFurniture(formValues) {
  const style = formValues?.designStyle || "cozy";
  const suggestions = suggestedFurnitureByStyle[style] || suggestedFurnitureByStyle.cozy;
  const existingNames = new Set((currentSnapshot?.products || []).map((product) => product.name.toLowerCase()));

  return suggestions.filter((item) => !existingNames.has(item[0].toLowerCase()));
}

function renderSnapshot(snapshot) {
  snapshot.products = ensureProductLinks(snapshot.products, snapshot.formValues);
  snapshot.products = withProductIds(snapshot.products);
  currentSnapshot = snapshot;
  saveButton.disabled = false;

  designTitle.textContent = snapshot.title;
  styleDescription.textContent = snapshot.description;
  layoutSuggestion.textContent = snapshot.layout;

  showPalette(snapshot.palette, snapshot.formValues.favoriteColors);
  showProducts(snapshot.products);
  showSuggestedAddOns(snapshot);
  renderPlacementTools(snapshot);
  renderBudgetTracker(snapshot.budgetSummary || buildBudgetSummary(snapshot.products, snapshot.formValues.budget));
  addListItems(fitWarnings, snapshot.warnings || buildFitWarnings(snapshot.products, snapshot.dimensions, snapshot.roomShape || getRoomShape(snapshot.formValues, snapshot.dimensions)));
  renderMoodBoard(snapshot);
  renderRoomPreview(
    snapshot.modelView,
    snapshot.dimensions,
    snapshot.products,
    snapshot.roomShape || getRoomShape(snapshot.formValues, snapshot.dimensions),
    snapshot.electricalPlan || getElectricalPlan(snapshot.formValues)
  );
  showFurnitureList(snapshot.products);
  addListItems(decorIdeas, snapshot.decor);
  addListItems(styleNotes, buildStyleNotes(snapshot));
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
  if (savedRoom.formValues.addStoreLinks === undefined) {
    designForm.elements.namedItem("addStoreLinks").checked = true;
  }
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

function duplicateSavedRoom(id) {
  const savedRooms = getSavedRooms();
  const room = savedRooms.find((item) => item.id === id);

  if (!room) {
    return;
  }

  const copy = {
    ...JSON.parse(JSON.stringify(room)),
    id: createSaveId(),
    name: `${room.name} copy`,
    updatedAt: new Date().toISOString()
  };

  setSavedRooms([copy, ...savedRooms]);
  renderSavedRooms();
  saveStatus.textContent = "Duplicated";
}

function renameSavedRoom(id) {
  const savedRooms = getSavedRooms();
  const room = savedRooms.find((item) => item.id === id);

  if (!room) {
    return;
  }

  const nextName = window.prompt("Room name", room.name);

  if (!nextName?.trim()) {
    return;
  }

  setSavedRooms(savedRooms.map((item) => item.id === id
    ? { ...item, name: nextName.trim(), updatedAt: new Date().toISOString() }
    : item));
  renderSavedRooms();
  saveStatus.textContent = "Renamed";
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

function renderBudgetTracker(summary) {
  if (!budgetTracker) {
    return;
  }

  const percent = summary.targetBudget
    ? Math.min(100, Math.round((summary.plannedTotal / summary.targetBudget) * 100))
    : 0;

  budgetTracker.innerHTML = `
    <div class="budget-row"><span>Estimated total</span><strong>$${summary.plannedTotal.toLocaleString()}</strong></div>
    <div class="budget-row"><span>Budget</span><strong>${summary.targetBudget ? `$${summary.targetBudget.toLocaleString()}` : "Not set"}</strong></div>
    <div class="budget-meter" aria-hidden="true"><span style="width: ${percent}%"></span></div>
    <p>${summary.status}</p>
  `;
}

function renderMoodBoard(snapshot) {
  if (!moodBoard) {
    return;
  }

  moodBoard.innerHTML = "";
  const swatches = [
    ...splitList(snapshot.formValues.favoriteColors).map((name) => ({ name, color: "#e7ddd0" })),
    ...snapshot.palette
  ].slice(0, 5);

  swatches.forEach((item) => {
    const tile = document.createElement("div");
    tile.className = "mood-tile";
    tile.style.setProperty("--mood-color", item.color);
    tile.textContent = item.name;
    moodBoard.appendChild(tile);
  });

  snapshot.products.slice(0, 4).forEach((product) => {
    const tile = document.createElement("div");
    tile.className = "mood-tile product-mood";
    tile.style.setProperty("--mood-color", product.color);
    tile.textContent = product.name;
    moodBoard.appendChild(tile);
  });
}

function renderPlacementTools(snapshot) {
  if (!selectedFurniture) {
    return;
  }

  const previousValue = selectedFurniture.value;
  selectedFurniture.innerHTML = "";
  snapshot.products.slice(0, MAX_MODEL_PRODUCTS).forEach((product, index) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${index + 1}. ${product.name}`;
    selectedFurniture.appendChild(option);
  });

  if (previousValue && snapshot.products.some((product) => product.id === previousValue)) {
    selectedFurniture.value = previousValue;
  }
}

function getSelectedProduct() {
  if (!currentSnapshot || !selectedFurniture) {
    return null;
  }

  return currentSnapshot.products.find((product) => product.id === selectedFurniture.value) || currentSnapshot.products[0] || null;
}

function updateSelectedProductPlacement(updater) {
  const product = getSelectedProduct();

  if (!product || !currentSnapshot) {
    return;
  }

  updater(product);
  currentSnapshot.budgetSummary = buildBudgetSummary(currentSnapshot.products, currentSnapshot.formValues.budget);
  currentSnapshot.warnings = buildFitWarnings(currentSnapshot.products, currentSnapshot.dimensions, currentSnapshot.roomShape);
  renderSnapshot(currentSnapshot);
}

function downloadTextFile(filename, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function exportRoomImage() {
  if (!currentSnapshot) {
    return;
  }

  const plan = roomPreview.querySelector(".floor-plan");
  const canvas = roomPreview.querySelector("canvas");

  if (canvas) {
    try {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "room-design-model.png";
      link.click();
      return;
    } catch {
      exportRoomPdf();
      return;
    }
  }

  if (plan) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="960" height="620">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">${plan.outerHTML}</div>
        </foreignObject>
      </svg>`;
    downloadTextFile("room-design-plan.svg", svg, "image/svg+xml");
  }
}

function exportRoomPdf() {
  if (!currentSnapshot) {
    return;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(currentSnapshot.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #222; line-height: 1.5; }
          h1 { margin-bottom: 8px; }
          h2 { margin-top: 24px; }
          li { margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(currentSnapshot.title)}</h1>
        <p>${escapeHtml(currentSnapshot.description)}</p>
        <h2>Furniture</h2>
        <ul>${currentSnapshot.products.map((product) => `<li>${escapeHtml(product.name)}: ${escapeHtml(product.size)}, ${escapeHtml(product.price)}</li>`).join("")}</ul>
        <h2>Budget</h2>
        <p>Estimated total: $${(currentSnapshot.budgetSummary?.plannedTotal || 0).toLocaleString()} - ${escapeHtml(currentSnapshot.budgetSummary?.status || "")}</p>
        <h2>Fit Warnings</h2>
        <ul>${(currentSnapshot.warnings || []).map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>
        <h2>Layout</h2>
        <p>${escapeHtml(currentSnapshot.layout)}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function showProducts(products) {
  productPicks.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("article");
    card.className = "buy-card";
    card.setAttribute("aria-label", `${product.name}, ${product.size}, ${product.price}`);
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

    if (product.owned) {
      const owned = document.createElement("span");
      owned.className = "owned-tag";
      owned.textContent = "Already owned";
      meta.appendChild(owned);
    }

    if (product.exactGenerated) {
      const exact = document.createElement("span");
      exact.className = "exact-tag";
      exact.textContent = product.previewBlocked ? "Exact link" : "Exact product";
      meta.appendChild(exact);
    }

    if (product.modelUrl) {
      const modelTag = document.createElement("span");
      modelTag.className = "exact-tag";
      modelTag.textContent = "3D model";
      meta.appendChild(modelTag);
    }

    body.append(title, description, meta);

    if (product.sourceUrl) {
      const storeLink = document.createElement("a");
      storeLink.className = "store-link";
      storeLink.href = product.sourceUrl;
      storeLink.target = "_blank";
      storeLink.rel = "noopener noreferrer";
      storeLink.textContent = product.exactGenerated
        ? `View exact product at ${product.store}`
        : product.searchLink
        ? `Shop similar on ${product.store}`
        : `View exact item at ${product.store || getLinkHost(product.sourceUrl)}`;
      storeLink.setAttribute("aria-label", `${storeLink.textContent} for ${product.name}`);
      body.appendChild(storeLink);
    }

    if (!product.owned) {
      const compare = document.createElement("div");
      compare.className = "compare-links";
      [
        ["Amazon", makeShoppingSearchLink(product.name)],
        ["Walmart", `https://www.walmart.com/search?q=${encodeURIComponent(product.name)}`],
        ["Target", `https://www.target.com/s?searchTerm=${encodeURIComponent(product.name)}`]
      ].forEach(([label, href]) => {
        const compareLink = document.createElement("a");
        compareLink.href = href;
        compareLink.target = "_blank";
        compareLink.rel = "noopener noreferrer";
        compareLink.textContent = label;
        compare.appendChild(compareLink);
      });
      body.appendChild(compare);
    }

    const chooseButton = document.createElement("button");
    chooseButton.type = "button";
    chooseButton.className = "choose-button";
    chooseButton.setAttribute("aria-pressed", "false");
    chooseButton.setAttribute("aria-label", `Choose ${product.name}`);
    chooseButton.textContent = "Choose this piece";

    card.append(visual, body, chooseButton);

    chooseButton.addEventListener("click", () => {
      chooseButton.classList.toggle("is-selected");
      const isSelected = chooseButton.classList.contains("is-selected");
      chooseButton.textContent = isSelected ? "Chosen" : "Choose this piece";
      chooseButton.setAttribute("aria-pressed", String(isSelected));
      chooseButton.setAttribute("aria-label", `${isSelected ? "Remove" : "Choose"} ${product.name}`);
    });

    if (index === 0) {
      chooseButton.click();
    }

    productPicks.appendChild(card);
  });
}

function showSuggestedAddOns(snapshot) {
  if (!suggestedAddOns) {
    return;
  }

  suggestedAddOns.innerHTML = "";
  const suggestions = getSuggestedFurniture(snapshot.formValues).slice(0, 3);

  if (!suggestions.length) {
    const empty = document.createElement("p");
    empty.className = "suggestion-empty";
    empty.textContent = "All suggested add-ons are already in this plan.";
    suggestedAddOns.appendChild(empty);
    return;
  }

  suggestions.forEach((item) => {
    const product = makeSuggestedProduct(item, {
      addStoreLinks: snapshot.formValues.addStoreLinks
    });
    const card = document.createElement("article");
    card.className = "suggestion-card";
    card.style.setProperty("--product-color", product.color);

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

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-suggestion-button";
    addButton.textContent = snapshot.products.length >= MAX_MODEL_PRODUCTS ? "Plan is full" : "Add to plan";
    addButton.disabled = snapshot.products.length >= MAX_MODEL_PRODUCTS;
    addButton.setAttribute("aria-label", `Add ${product.name} to the room plan`);
    addButton.addEventListener("click", () => {
      if (!currentSnapshot || currentSnapshot.products.length >= MAX_MODEL_PRODUCTS) {
        return;
      }

      currentSnapshot.products = withProductIds([...currentSnapshot.products, product]);
      currentSnapshot.checklist = buildChecklist(
        getBudgetTier(Number(currentSnapshot.formValues.budget)),
        splitList(currentSnapshot.formValues.mustHaves || ""),
        currentSnapshot.products
      );
      currentSnapshot.budgetSummary = buildBudgetSummary(currentSnapshot.products, currentSnapshot.formValues.budget);
      currentSnapshot.warnings = buildFitWarnings(currentSnapshot.products, currentSnapshot.dimensions, currentSnapshot.roomShape);
      currentSnapshot.layout = `${currentSnapshot.layout} Added ${product.name} as an optional piece; drag it into an open zone before shopping.`;
      renderSnapshot(currentSnapshot);
    });

    card.append(title, description, meta, addButton);
    suggestedAddOns.appendChild(card);
  });
}

function getDefaultItemData(width, length) {
  return [
    { size: [width * 0.38, 2.6, length * 0.18], pos: [-width * 0.18, 1.3, length * 0.26] },
    { size: [width * 0.16, 2.7, length * 0.14], pos: [width * 0.16, 1.35, length * 0.1] },
    { size: [width * 0.14, 5.4, length * 0.28], pos: [width * 0.32, 2.7, -length * 0.18] },
    { size: [width * 0.38, 0.08, length * 0.26], pos: [-width * 0.08, 0.05, length * 0.08] },
    { size: [width * 0.18, 2.4, length * 0.16], pos: [-width * 0.34, 1.2, -length * 0.22] },
    { size: [width * 0.2, 2.2, length * 0.16], pos: [width * 0.28, 1.1, length * 0.34] },
    { size: [width * 0.16, 4.8, length * 0.14], pos: [width * 0.34, 2.4, -length * 0.36] },
    { size: [width * 0.14, 5.2, length * 0.14], pos: [-width * 0.36, 2.6, length * 0.36] }
  ];
}

function getDefaultHeightForShape(shape) {
  const heights = {
    seat: 2.7,
    chair: 3,
    desk: 2.5,
    bed: 2.9,
    electronics: 3.2,
    table: 1.9,
    rug: 0.08,
    light: 5.5,
    storage: 4.6
  };

  return heights[shape] || heights.storage;
}

function getFallbackSizeForProduct(product, fallbackSize) {
  const height = getDefaultHeightForShape(product.shape);
  return [fallbackSize[0], height, fallbackSize[2]];
}

function getProductPlacement(product, fallbackItem, width, length) {
  const placement = product.placement || {};
  const x = Number.isFinite(placement.x) ? placement.x : fallbackItem.pos[0];
  const z = Number.isFinite(placement.z) ? placement.z : fallbackItem.pos[2];
  return {
    x: Math.max(-width / 2 + 0.6, Math.min(width / 2 - 0.6, x)),
    z: Math.max(-length / 2 + 0.6, Math.min(length / 2 - 0.6, z))
  };
}

function setProductPlacement(product, x, z, width, length) {
  product.placement = getProductPlacement({ placement: { x, z } }, { pos: [x, 0, z] }, width, length);
}

function safelyCapturePointer(element, pointerId) {
  if (pointerId == null || typeof element.setPointerCapture !== "function") {
    return;
  }

  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Some embedded browsers expose pointer events without capture support.
  }
}

function safelyReleasePointer(element, pointerId) {
  if (pointerId == null || typeof element.releasePointerCapture !== "function") {
    return;
  }

  try {
    if (typeof element.hasPointerCapture !== "function" || element.hasPointerCapture(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  } catch {
    // Ignore stale pointer captures after cancelled drags.
  }
}

function safelyHasPointer(element, pointerId) {
  if (pointerId == null || typeof element.hasPointerCapture !== "function") {
    return true;
  }

  try {
    return element.hasPointerCapture(pointerId);
  } catch {
    return false;
  }
}

function getWallPositionClass(position) {
  return position === "left" ? "left-pos" : position === "right" ? "right-pos" : "center-pos";
}

function renderFloorPlan(dimensions, products, roomShape = getRoomShape({}, dimensions), electricalPlan = getElectricalPlan({})) {
  roomPreview.innerHTML = "";
  const plan = document.createElement("div");
  plan.className = "floor-plan";
  plan.setAttribute("role", "img");
  plan.setAttribute("aria-label", `2D floor plan for a ${dimensions.width} by ${dimensions.length} foot room with ${products.length} furniture pieces. ${roomShape.summary}. ${electricalPlan.summary}`);

  const widthLine = document.createElement("span");
  widthLine.className = "dimension-line width";
  widthLine.textContent = `${dimensions.width} ft`;

  const lengthLine = document.createElement("span");
  lengthLine.className = "dimension-line length";
  lengthLine.textContent = `${dimensions.length} ft`;

  plan.append(widthLine, lengthLine);

  const door = document.createElement("span");
  door.className = `floor-door ${roomShape.doorLocation}`;
  door.textContent = "Door";
  door.setAttribute("aria-hidden", "true");
  plan.appendChild(door);

  roomShape.windows.slice(0, 6).forEach((windowItem) => {
    const marker = document.createElement("span");
    marker.className = `floor-window ${windowItem.wall} ${getWallPositionClass(windowItem.position)}`;
    marker.textContent = "Window";
    marker.setAttribute("aria-hidden", "true");
    plan.appendChild(marker);
  });

  if (roomShape.wallPlan) {
    const wallNote = document.createElement("span");
    wallNote.className = "floor-wall-note";
    wallNote.textContent = "Custom wall";
    wallNote.title = roomShape.wallPlan;
    plan.appendChild(wallNote);
  }

  roomShape.spaces.slice(0, 4).forEach((space, index) => {
    const extra = document.createElement("div");
    const side = space.side || "right";
    const widthPercent = Math.max(18, Math.min(46, (space.width / dimensions.width) * 42));
    const heightPercent = Math.max(16, Math.min(48, (space.length / dimensions.length) * 42));
    extra.className = `floor-extra-space ${side}`;
    extra.textContent = `${space.name} ${space.label}`;
    extra.style.width = `${widthPercent}%`;
    extra.style.height = `${heightPercent}%`;

    if (side === "back" || side === "front") {
      extra.style.left = `${18 + index * 16}%`;
    } else {
      extra.style.top = `${18 + index * 16}%`;
    }

    plan.appendChild(extra);
  });

  electricalPlan.outlets.slice(0, 8).forEach((outlet) => {
    const marker = document.createElement("span");
    marker.className = `floor-outlet ${outlet.wall} ${getWallPositionClass(outlet.position)}`;
    marker.setAttribute("aria-hidden", "true");
    plan.appendChild(marker);
  });

  electricalPlan.ceilingLights.slice(0, 6).forEach((light) => {
    const marker = document.createElement("span");
    marker.className = `floor-ceiling-light ${light.position}`;
    marker.title = light.type;
    marker.setAttribute("aria-hidden", "true");
    plan.appendChild(marker);
  });

  const itemData = getDefaultItemData(dimensions.width, dimensions.length);

  products.slice(0, itemData.length).forEach((product, index) => {
    const fallbackItem = itemData[index];
    const productSize = getProductFootprint(product, fallbackItem);
    const placement = getProductPlacement(product, fallbackItem, dimensions.width, dimensions.length);
    const itemWidthPercent = Math.max(12, Math.min(44, (productSize.width / dimensions.width) * 82));
    const itemHeightPercent = Math.max(10, Math.min(42, (productSize.depth / dimensions.length) * 82));
    const leftPercent = ((placement.x + dimensions.width / 2) / dimensions.width) * 100;
    const topPercent = ((placement.z + dimensions.length / 2) / dimensions.length) * 100;
    const item = document.createElement("div");
    item.className = `floor-item ${product.shape}${product.imported ? " imported-object" : ""}`;
    item.textContent = product.name;
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Drag ${product.name} to place it in the room`);
    item.dataset.productId = product.id;
    item.style.setProperty("--item-color", product.color);
    item.style.width = `${itemWidthPercent}%`;
    item.style.height = `${itemHeightPercent}%`;
    item.style.left = `${leftPercent}%`;
    item.style.top = `${topPercent}%`;
    item.style.transform = `translate(-50%, -50%) rotate(${product.rotation || 0}deg)`;

    if (product.imageUrl) {
      item.style.backgroundImage = `url("${product.imageUrl}")`;
      item.style.setProperty("--image-dim", "0.35");
    }

    const resizeHandle = document.createElement("span");
    resizeHandle.className = "resize-handle";
    resizeHandle.setAttribute("aria-hidden", "true");
    const measure = document.createElement("span");
    measure.className = "measure-label";
    measure.textContent = product.size;
    item.appendChild(resizeHandle);
    item.appendChild(measure);

    attachFloorItemDrag(item, product, plan, dimensions);
    attachFloorItemResize(resizeHandle, item, product);

    plan.appendChild(item);
  });

  roomPreview.appendChild(plan);
}

function attachFloorItemDrag(item, product, plan, dimensions) {
  let isDragging = false;

  const moveItem = (event) => {
    const rect = plan.getBoundingClientRect();
    const leftRatio = Math.max(0.04, Math.min(0.96, (event.clientX - rect.left) / rect.width));
    const topRatio = Math.max(0.04, Math.min(0.96, (event.clientY - rect.top) / rect.height));
    const x = leftRatio * dimensions.width - dimensions.width / 2;
    const z = topRatio * dimensions.length - dimensions.length / 2;
    setProductPlacement(product, x, z, dimensions.width, dimensions.length);
    item.style.left = `${leftRatio * 100}%`;
    item.style.top = `${topRatio * 100}%`;
    item.classList.add("is-dragging");
  };

  item.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (selectedFurniture) {
      selectedFurniture.value = product.id;
    }
    isDragging = true;
    safelyCapturePointer(item, event.pointerId);
    moveItem(event);
  });

  item.addEventListener("pointermove", (event) => {
    if (isDragging) {
      moveItem(event);
    }
  });

  item.addEventListener("pointerup", (event) => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    safelyReleasePointer(item, event.pointerId);
    item.classList.remove("is-dragging");
  });

  item.addEventListener("pointercancel", () => {
    isDragging = false;
    item.classList.remove("is-dragging");
  });
}

function attachFloorItemResize(handle, item, product) {
  let startX = 0;
  let startScale = 1;
  let startWidth = 0;
  let startHeight = 0;

  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    startX = event.clientX;
    startScale = product.scale || 1;
    startWidth = parseFloat(item.style.width);
    startHeight = parseFloat(item.style.height);
    safelyCapturePointer(handle, event.pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!safelyHasPointer(handle, event.pointerId)) {
      return;
    }

    const delta = (event.clientX - startX) / 160;
    product.scale = Math.max(0.65, Math.min(1.6, startScale + delta));
    item.style.width = `${startWidth * (product.scale / startScale)}%`;
    item.style.height = `${startHeight * (product.scale / startScale)}%`;
  });

  handle.addEventListener("pointerup", (event) => {
    safelyReleasePointer(handle, event.pointerId);

    if (currentSnapshot) {
      currentSnapshot.warnings = buildFitWarnings(currentSnapshot.products, currentSnapshot.dimensions, currentSnapshot.roomShape);
      renderSnapshot(currentSnapshot);
    }
  });
}

function addFurnitureObject(scene, product, item, THREE) {
  const group = new THREE.Group();
  group.position.set(item.pos[0], 0, item.pos[2]);
  group.rotation.y = ((product.rotation || 0) * Math.PI) / 180;
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(product.color),
    roughness: 0.62,
    metalness: product.imported ? 0.08 : 0
  });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x49392e, roughness: 0.7 });
  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x2f3437, roughness: 0.5, metalness: 0.18 });
  const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x1d2933, emissive: 0x12364a, emissiveIntensity: 0.18, roughness: 0.35 });

  if (product.shape === "seat") {
    const base = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.48, item.size[2]), material);
    const back = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.9, item.size[2] * 0.18), material);
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.08, item.size[1] * 0.72, item.size[2]), material);
    const rightArm = leftArm.clone();
    const cushionMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(product.color).offsetHSL(0, 0, 0.12), roughness: 0.74 });
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.82, item.size[1] * 0.16, item.size[2] * 0.72), cushionMaterial);

    base.position.y = item.size[1] * 0.18;
    back.position.set(0, item.size[1] * 0.48, -item.size[2] * 0.42);
    leftArm.position.set(-item.size[0] * 0.46, item.size[1] * 0.34, 0);
    rightArm.position.set(item.size[0] * 0.46, item.size[1] * 0.34, 0);
    cushion.position.y = item.size[1] * 0.48;
    group.add(base, back, leftArm, rightArm, cushion);
  } else if (product.shape === "chair") {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.55, item.size[1] * 0.18, item.size[2] * 0.55), material);
    const back = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.55, item.size[1] * 0.72, item.size[2] * 0.08), material);
    seat.position.y = item.size[1] * 0.42;
    back.position.set(0, item.size[1] * 0.72, -item.size[2] * 0.28);
    group.add(seat, back);

    [-0.2, 0.2].forEach((x) => {
      [-0.2, 0.2].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, item.size[1] * 0.42, 12), darkMaterial);
        leg.position.set(item.size[0] * x, item.size[1] * 0.2, item.size[2] * z);
        group.add(leg);
      });
    });
  } else if (product.shape === "desk") {
    const top = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.14, item.size[2]), material);
    const modesty = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.75, item.size[1] * 0.28, item.size[2] * 0.05), darkMaterial);
    top.position.y = item.size[1] * 0.78;
    modesty.position.set(0, item.size[1] * 0.52, -item.size[2] * 0.35);
    group.add(top, modesty);

    [-0.42, 0.42].forEach((x) => {
      [-0.35, 0.35].forEach((z) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.055, item.size[1] * 0.72, item.size[2] * 0.055), metalMaterial);
        leg.position.set(item.size[0] * x, item.size[1] * 0.36, item.size[2] * z);
        group.add(leg);
      });
    });
  } else if (product.shape === "bed") {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.25, item.size[2]), darkMaterial);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.9, item.size[1] * 0.18, item.size[2] * 0.86), material);
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(item.size[0], item.size[1] * 0.8, item.size[2] * 0.08), darkMaterial);
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.36, item.size[1] * 0.12, item.size[2] * 0.18), new THREE.MeshStandardMaterial({ color: 0xf8f7f2, roughness: 0.8 }));
    frame.position.y = item.size[1] * 0.18;
    mattress.position.y = item.size[1] * 0.4;
    headboard.position.set(0, item.size[1] * 0.52, -item.size[2] * 0.48);
    pillow.position.set(-item.size[0] * 0.22, item.size[1] * 0.56, -item.size[2] * 0.28);
    group.add(frame, mattress, headboard, pillow);
  } else if (product.shape === "electronics") {
    const screen = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.72, item.size[1] * 0.55, item.size[2] * 0.08), screenMaterial);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.84, item.size[1] * 0.65, item.size[2] * 0.05), darkMaterial);
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, item.size[1] * 0.28, 12), metalMaterial);
    const base = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.36, item.size[1] * 0.06, item.size[2] * 0.34), metalMaterial);
    bezel.position.y = item.size[1] * 0.64;
    screen.position.y = item.size[1] * 0.64;
    screen.position.z = item.size[2] * 0.04;
    stand.position.y = item.size[1] * 0.28;
    base.position.y = item.size[1] * 0.08;
    group.add(bezel, screen, stand, base);
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
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, item.size[1] * 0.16, 0.08), darkMaterial);
    cabinet.position.y = item.size[1] * 0.5;
    doorLine.position.y = item.size[1] * 0.5;
    handle.position.set(item.size[0] * 0.18, item.size[1] * 0.55, item.size[2] * 0.52);
    group.add(cabinet, doorLine, handle);
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
  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      addEdgeLines(child, THREE, 0x3f352d);
    }
  });
  return group;
}

function addEdgeLines(object, THREE, color = 0x5d5147) {
  if (!object.geometry) {
    return;
  }

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(object.geometry),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 })
  );
  edges.position.copy(object.position);
  edges.rotation.copy(object.rotation);
  edges.scale.copy(object.scale);
  object.parent?.add(edges);
}

function addRoomBox(scene, mesh, THREE, edgeColor = 0x8f7f70) {
  mesh.receiveShadow = true;
  scene.add(mesh);
  addEdgeLines(mesh, THREE, edgeColor);
}

function getOwnedFurnitureSize(product, fallbackSize) {
  if (!product.owned) {
    return fallbackSize;
  }

  const numbers = product.size.match(/\d+(\.\d+)?/g)?.map(Number) || [];

  if (numbers.length < 2) {
    return fallbackSize;
  }

  const isInches = /in|inch/i.test(product.size);
  const first = isInches ? numbers[0] / 12 : numbers[0];
  const second = isInches ? numbers[1] / 12 : numbers[1];
  const third = numbers[2] ? (isInches ? numbers[2] / 12 : numbers[2]) : fallbackSize[1];
  const width = Math.max(1.1, Math.min(fallbackSize[0] * 1.25, first));
  const depth = Math.max(0.8, Math.min(fallbackSize[2] * 1.25, second));
  const height = Math.max(0.12, Math.min(3, third));

  return [width, height, depth];
}

function getWallOffset(position, size) {
  if (position === "left") {
    return -size * 0.26;
  }

  if (position === "right") {
    return size * 0.26;
  }

  return 0;
}

function getFixtureCoordinates(wall, position, width, length) {
  const xOffset = getWallOffset(position, width);
  const zOffset = getWallOffset(position, length);

  if (wall === "back") {
    return { x: xOffset, z: -length / 2 - 0.08, rotation: 0 };
  }

  if (wall === "left") {
    return { x: -width / 2 - 0.08, z: zOffset, rotation: Math.PI / 2 };
  }

  if (wall === "right") {
    return { x: width / 2 + 0.08, z: zOffset, rotation: Math.PI / 2 };
  }

  return { x: xOffset, z: length / 2 + 0.08, rotation: 0 };
}

function getCeilingLightCoordinates(position, width, length) {
  const positions = {
    front: [0, length * 0.24],
    back: [0, -length * 0.24],
    left: [-width * 0.24, 0],
    right: [width * 0.24, 0],
    center: [0, 0]
  };

  const [x, z] = positions[position] || positions.center;
  return { x, z };
}

function addOutletObject(scene, outlet, width, length, THREE) {
  const coords = getFixtureCoordinates(outlet.wall, outlet.position, width, length);
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.26, 0.035),
    new THREE.MeshStandardMaterial({ color: 0xfdfaf2, roughness: 0.45 })
  );
  const slotMaterial = new THREE.MeshStandardMaterial({ color: 0x232a34, roughness: 0.5 });
  const slotA = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.04), slotMaterial);
  const slotB = slotA.clone();

  plate.position.set(coords.x, 0.62, coords.z);
  plate.rotation.y = coords.rotation;
  slotA.position.set(coords.x - (outlet.wall === "left" || outlet.wall === "right" ? 0 : 0.055), 0.62, coords.z);
  slotB.position.set(coords.x + (outlet.wall === "left" || outlet.wall === "right" ? 0 : 0.055), 0.62, coords.z);
  slotA.rotation.y = coords.rotation;
  slotB.rotation.y = coords.rotation;
  scene.add(plate, slotA, slotB);
}

function addWindowObject(scene, windowItem, width, length, THREE) {
  const coords = getFixtureCoordinates(windowItem.wall, windowItem.position, width, length);
  const pane = new THREE.Mesh(
    new THREE.BoxGeometry(windowItem.wall === "left" || windowItem.wall === "right" ? 0.05 : 1.4, 0.85, windowItem.wall === "left" || windowItem.wall === "right" ? 1.4 : 0.05),
    new THREE.MeshStandardMaterial({ color: 0xbfe3ee, roughness: 0.2, transparent: true, opacity: 0.72 })
  );
  pane.position.set(coords.x, 1.55, coords.z);
  scene.add(pane);

  const daylight = new THREE.PointLight(0xdff8ff, 0.22, Math.max(width, length) * 0.45);
  daylight.position.set(coords.x * 0.88, 1.8, coords.z * 0.88);
  scene.add(daylight);
}

function addCustomWallObject(scene, roomShape, width, length, THREE) {
  if (!roomShape.wallPlan) {
    return;
  }

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.38, 2.35, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xf4e7d7, roughness: 0.82, transparent: true, opacity: 0.82 })
  );
  wall.position.set(-width * 0.18, 1.16, -length * 0.18);
  wall.rotation.y = Math.PI * 0.16;
  scene.add(wall);
  addEdgeLines(wall, THREE, 0x8f7f70);
}

function addCeilingLightObject(scene, light, width, length, THREE) {
  const coords = getCeilingLightCoordinates(light.position, width, length);
  const fixtureMaterial = new THREE.MeshStandardMaterial({
    color: light.type === "recessed" ? 0xf8f2de : 0xd4b16a,
    emissive: 0xffe49a,
    emissiveIntensity: 0.18,
    roughness: 0.35
  });
  const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 32), fixtureMaterial);
  fixture.position.set(coords.x, 2.88, coords.z);
  fixture.rotation.x = Math.PI / 2;
  scene.add(fixture);

  if (light.type === "pendant") {
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.65, 12),
      new THREE.MeshStandardMaterial({ color: 0x3e342d, roughness: 0.5 })
    );
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.48, 0.28, 28), fixtureMaterial);
    cord.position.set(coords.x, 2.48, coords.z);
    shade.position.set(coords.x, 2.08, coords.z);
    scene.add(cord, shade);
  }

  if (light.type === "track") {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x232a34, roughness: 0.42 })
    );
    rail.position.set(coords.x, 2.82, coords.z);
    scene.add(rail);
  }

  const point = new THREE.PointLight(0xffedc0, 0.45, Math.max(width, length) * 0.9);
  point.position.set(coords.x, 2.3, coords.z);
  scene.add(point);
}

async function getGLTFLoader(THREE) {
  if (!gltfLoaderPromise) {
    gltfLoaderPromise = import("https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?deps=three@0.160.0")
      .then((module) => new module.GLTFLoader())
      .catch(() => null);
  }

  return gltfLoaderPromise;
}

function normalizeModelToFootprint(object, item, THREE) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  if (!size.x || !size.y || !size.z) {
    return;
  }

  const scale = Math.min(
    item.size[0] / size.x,
    Math.max(item.size[1], 0.35) / size.y,
    item.size[2] / size.z
  );
  object.scale.multiplyScalar(scale);

  const scaledBox = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  object.position.sub(center);
  object.position.y -= scaledBox.min.y - center.y;
}

async function addRealModelObject(scene, product, item, THREE, renderer, camera) {
  if (!product.modelUrl || !isModelUrl(product.modelUrl)) {
    return false;
  }

  const loader = await getGLTFLoader(THREE);

  if (!loader) {
    return false;
  }

  return new Promise((resolve) => {
    loader.load(
      product.modelUrl,
      (gltf) => {
        const object = gltf.scene;
        normalizeModelToFootprint(object, item, THREE);
        object.rotation.y = ((product.rotation || 0) * Math.PI) / 180;
        object.position.x += item.pos[0];
        object.position.z += item.pos[2];
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(object);
        renderer.render(scene, camera);
        resolve(object);
      },
      undefined,
      () => resolve(null)
    );
  });
}

function setup3DInteraction(canvas, renderer, scene, camera, products, draggableObjects, width, length, THREE) {
  const target = new THREE.Vector3(0, 0.35, 0);
  const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const floorPoint = new THREE.Vector3();
  let mode = "";
  let active = null;
  let lastX = 0;
  let lastY = 0;

  canvas.style.cursor = "grab";

  const render = () => {
    camera.position.setFromSpherical(spherical).add(target);
    camera.lookAt(target);
    renderer.render(scene, camera);
  };

  const setPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const findDraggedObject = (event) => {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(draggableObjects.map((item) => item.object), true);

    if (!hits.length) {
      return null;
    }

    return draggableObjects.find((item) => {
      let object = hits[0].object;
      while (object) {
        if (object === item.object) {
          return true;
        }
        object = object.parent;
      }
      return false;
    }) || null;
  };

  const dragObject = (event) => {
    if (!active) {
      return;
    }

    setPointer(event);
    raycaster.setFromCamera(pointer, camera);

    if (!raycaster.ray.intersectPlane(floorPlane, floorPoint)) {
      return;
    }

    const x = Math.max(-width / 2 + 0.6, Math.min(width / 2 - 0.6, floorPoint.x));
    const z = Math.max(-length / 2 + 0.6, Math.min(length / 2 - 0.6, floorPoint.z));
    active.object.position.x = x;
    active.object.position.z = z;
    setProductPlacement(active.product, x, z, width, length);
    render();
  };

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    lastX = event.clientX;
    lastY = event.clientY;
    active = findDraggedObject(event);
    mode = active ? "move" : "orbit";
    safelyCapturePointer(canvas, event.pointerId);
    canvas.style.cursor = mode === "move" ? "grabbing" : "move";

    if (mode === "move") {
      dragObject(event);
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!mode) {
      return;
    }

    if (mode === "move") {
      dragObject(event);
      return;
    }

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    spherical.theta -= deltaX * 0.008;
    spherical.phi = Math.max(0.38, Math.min(1.34, spherical.phi - deltaY * 0.006));
    render();
  });

  const stopInteraction = (event) => {
    safelyReleasePointer(canvas, event?.pointerId);
    active = null;
    mode = "";
    canvas.style.cursor = "grab";
  };

  canvas.addEventListener("pointerup", stopInteraction);
  canvas.addEventListener("pointercancel", stopInteraction);
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    spherical.radius = Math.max(5, Math.min(Math.max(width, length) * 2.2, spherical.radius + event.deltaY * 0.015));
    render();
  }, { passive: false });

  return render;
}

function render3DModel(dimensions, products, roomShape = getRoomShape({}, dimensions), electricalPlan = getElectricalPlan({}), baseCaption = "") {
  roomPreview.innerHTML = `<canvas class="model-canvas" aria-label="3D room model"></canvas>`;
  const canvas = roomPreview.querySelector("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", `3D room model for a ${dimensions.width} by ${dimensions.length} foot room with ${products.length} furniture pieces. ${roomShape.summary}. ${electricalPlan.summary}`);

  if (!window.THREE) {
    renderFloorPlan(dimensions, products, roomShape, electricalPlan);
    previewCaption.textContent = "The 3D library could not load, so a 2D dimensioned floor plan is shown instead.";
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xefe3d2);

  const width = Math.max(dimensions.width, 8);
  const length = Math.max(dimensions.length, 8);
  const previewBox = roomPreview.getBoundingClientRect();
  const renderWidth = Math.max(Math.round(previewBox.width || roomPreview.clientWidth || roomPreview.offsetWidth || 640), 320);
  const renderHeight = 330;
  const camera = new THREE.PerspectiveCamera(45, renderWidth / renderHeight, 0.1, 1000);
  camera.position.set(width * 0.72, Math.max(width, length) * 0.82, length * 0.88);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(renderWidth, renderHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.AmbientLight(0xffffff, 0.78));
  const light = new THREE.DirectionalLight(0xffffff, 1.35);
  light.position.set(5, 9, 7);
  light.castShadow = true;
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.16, length),
    new THREE.MeshStandardMaterial({ color: 0xe3cdae, roughness: 0.74 })
  );
  floor.position.y = -0.08;
  addRoomBox(scene, floor, THREE, 0x9b8369);

  const grid = new THREE.GridHelper(Math.max(width, length), Math.max(width, length), 0x9b8369, 0xcab8a1);
  grid.position.y = 0.012;
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  scene.add(grid);

  roomShape.spaces.slice(0, 4).forEach((space, index) => {
    const spaceWidth = Math.min(Math.max(space.width, 3), width * 0.85);
    const spaceLength = Math.min(Math.max(space.length, 3), length * 0.85);
    const extraFloor = new THREE.Mesh(
      new THREE.BoxGeometry(spaceWidth, 0.14, spaceLength),
      new THREE.MeshStandardMaterial({ color: 0xb8d6c5, roughness: 0.76 })
    );
    const offset = (index - 1.5) * 0.9;

    if (space.side === "left") {
      extraFloor.position.set(-width / 2 - spaceWidth / 2, -0.07, offset);
    } else if (space.side === "back") {
      extraFloor.position.set(offset, -0.07, -length / 2 - spaceLength / 2);
    } else if (space.side === "front") {
      extraFloor.position.set(offset, -0.07, length / 2 + spaceLength / 2);
    } else {
      extraFloor.position.set(width / 2 + spaceWidth / 2, -0.07, offset);
    }

    addRoomBox(scene, extraFloor, THREE, 0x5f8b75);
  });

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xfff7eb, roughness: 0.86 });
  const openWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff7eb,
    roughness: 0.86,
    transparent: true,
    opacity: 0.06,
    depthWrite: false
  });
  const wallSpecs = [
    { name: "back", size: [width, 3, 0.15], pos: [0, 1.5, -length / 2], material: wallMaterial },
    { name: "front", size: [width, 3, 0.15], pos: [0, 1.5, length / 2], material: openWallMaterial },
    { name: "left", size: [0.15, 3, length], pos: [-width / 2, 1.5, 0], material: wallMaterial },
    { name: "right", size: [0.15, 3, length], pos: [width / 2, 1.5, 0], material: openWallMaterial }
  ];
  wallSpecs.forEach((wall) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...wall.size), wall.material);
    mesh.position.set(...wall.pos);
    addRoomBox(scene, mesh, THREE, wall.name === "front" || wall.name === "right" ? 0xd9cabb : 0xa79888);
  });

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.08, length),
    new THREE.MeshStandardMaterial({ color: 0xfff8ed, roughness: 0.88, transparent: true, opacity: 0.08, depthWrite: false })
  );
  ceiling.position.y = 3;
  scene.add(ceiling);

  const doorCoords = getFixtureCoordinates(roomShape.doorLocation, "center", width, length);
  const doorMarker = new THREE.Mesh(
    new THREE.BoxGeometry(roomShape.doorLocation === "left" || roomShape.doorLocation === "right" ? 0.08 : 1.05, 2.05, roomShape.doorLocation === "left" || roomShape.doorLocation === "right" ? 1.05 : 0.08),
    new THREE.MeshStandardMaterial({ color: 0x9b7655, roughness: 0.7 })
  );
  doorMarker.position.set(doorCoords.x, 1.02, doorCoords.z);
  scene.add(doorMarker);

  roomShape.windows.slice(0, 6).forEach((windowItem) => {
    addWindowObject(scene, windowItem, width, length, THREE);
  });
  addCustomWallObject(scene, roomShape, width, length, THREE);

  const itemData = getDefaultItemData(width, length);
  const draggableObjects = [];

  let loadedModelCount = 0;
  let failedModelCount = 0;
  const updateModelCaption = () => {
    if (!baseCaption) {
      return;
    }

    const modelNote = loadedModelCount
      ? ` ${loadedModelCount} real 3D model${loadedModelCount === 1 ? "" : "s"} loaded.`
      : failedModelCount
      ? " Model link could not be loaded, so the fallback furniture shape is shown."
      : "";
    previewCaption.textContent = `${baseCaption}${modelNote}`;
  };

  products.slice(0, itemData.length).forEach((product, index) => {
    const placement = getProductPlacement(product, itemData[index], width, length);
    const item = {
      ...itemData[index],
      pos: [placement.x, itemData[index].pos[1], placement.z],
      size: getOwnedFurnitureSize(product, getFallbackSizeForProduct(product, itemData[index].size)).map((value) => value * (product.scale || 1))
    };
    if (product.modelUrl) {
      addRealModelObject(scene, product, item, THREE, renderer, camera).then((object) => {
        if (object) {
          loadedModelCount += 1;
          draggableObjects.push({ product, object });
        } else {
          failedModelCount += 1;
          const fallbackObject = addFurnitureObject(scene, product, item, THREE);
          draggableObjects.push({ product, object: fallbackObject });
          renderer.render(scene, camera);
        }
        updateModelCaption();
      });
      return;
    }

    const object = addFurnitureObject(scene, product, item, THREE);
    draggableObjects.push({ product, object });
  });

  electricalPlan.outlets.slice(0, 8).forEach((outlet) => {
    addOutletObject(scene, outlet, width, length, THREE);
  });

  electricalPlan.ceilingLights.slice(0, 6).forEach((ceilingLight) => {
    addCeilingLightObject(scene, ceilingLight, width, length, THREE);
  });

  const renderInteractiveModel = setup3DInteraction(canvas, renderer, scene, camera, products, draggableObjects, width, length, THREE);
  renderInteractiveModel();
}

function renderRoomPreview(modelView, dimensions, products, roomShape = getRoomShape({}, dimensions), electricalPlan = getElectricalPlan({})) {
  roomDimensionsBadge.textContent = roomShape.label;

  if (modelView === "3d") {
    const captionText = `Interactive 3D model scaled from a ${roomShape.label} room, with the ${roomShape.doorLabel.toLowerCase()} door, outlets, ceiling lights, and extra spaces blocked in by footprint. Drag the room to change angles, or drag a furniture piece to place it.`;
    previewCaption.textContent = captionText;
    render3DModel(dimensions, products, roomShape, electricalPlan, captionText);
    return;
  }

  renderFloorPlan(dimensions, products, roomShape, electricalPlan);
  previewCaption.textContent = `2D floor plan scaled from a ${roomShape.label} room, with door location, outlets, ceiling lights, and separate spaces called out for fit checks. Drag furniture pieces to place them.`;
}

async function generateDesign(event) {
  event.preventDefault();
  const submitButton = designForm.querySelector(".primary-button");
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Loading store items...";

  try {
  const formValues = getFormValues();
  const productSettings = {
    productSource: formValues.productSource,
    productApiKey: formValues.productApiKey,
    addStoreLinks: formValues.addStoreLinks
  };
  setProductSettings(productSettings);
  updateProductSourceStatus();
  const plan = stylePlans[formValues.designStyle];
  const mustHaves = splitList(formValues.mustHaves);
  const furnitureLinks = splitLinks(formValues.furnitureLinks);
  const modelLinks = splitLinks(formValues.modelLinks).filter(isModelUrl);
  const products = await makeProducts(plan, mustHaves, furnitureLinks, productSettings, modelLinks, formValues.ownedFurniture);

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
  suggestedAddOns.innerHTML = "";
  selectedFurniture.innerHTML = "";
  budgetTracker.innerHTML = "";
  fitWarnings.innerHTML = "";
  moodBoard.innerHTML = "";
  styleNotes.innerHTML = "";
  roomPreview.innerHTML = "";
  roomDimensionsBadge.textContent = "";
  previewCaption.textContent = "";
  resetExtraSpaceRows();
  resetOutletRows();
  resetCeilingLightRows();
  resetOwnedFurnitureRows();
  renderSavedRooms();
}

designForm.addEventListener("submit", generateDesign);
resetButton.addEventListener("click", resetDesign);
saveButton.addEventListener("click", saveCurrentRoom);
designForm.elements.namedItem("roomTemplate").addEventListener("change", (event) => {
  applyRoomTemplate(event.target.value);
});
rotateLeftButton?.addEventListener("click", () => {
  updateSelectedProductPlacement((product) => {
    product.rotation = ((product.rotation || 0) - 90 + 360) % 360;
  });
});
rotateRightButton?.addEventListener("click", () => {
  updateSelectedProductPlacement((product) => {
    product.rotation = ((product.rotation || 0) + 90) % 360;
  });
});
shrinkButton?.addEventListener("click", () => {
  updateSelectedProductPlacement((product) => {
    product.scale = Math.max(0.65, (product.scale || 1) - 0.1);
  });
});
growButton?.addEventListener("click", () => {
  updateSelectedProductPlacement((product) => {
    product.scale = Math.min(1.6, (product.scale || 1) + 0.1);
  });
});
downloadImageButton?.addEventListener("click", exportRoomImage);
downloadPdfButton?.addEventListener("click", exportRoomPdf);
addSpaceButton.addEventListener("click", () => {
  extraSpaces.appendChild(createExtraSpaceRow());
});
addOutletButton.addEventListener("click", () => {
  outletList.appendChild(createOutletRow());
});
addCeilingLightButton.addEventListener("click", () => {
  ceilingLightList.appendChild(createCeilingLightRow());
});
addOwnedFurnitureButton.addEventListener("click", () => {
  ownedFurnitureList.appendChild(createOwnedFurnitureRow());
});
designForm.elements.namedItem("productSource").addEventListener("change", () => {
  setProductSettings({
    productSource: designForm.elements.namedItem("productSource").value,
    productApiKey: designForm.elements.namedItem("productApiKey").value.trim()
  });
  updateProductSourceStatus();
});
designForm.elements.namedItem("productApiKey").addEventListener("input", () => {
  setProductSettings({
    productSource: designForm.elements.namedItem("productSource").value,
    productApiKey: designForm.elements.namedItem("productApiKey").value.trim()
  });
  updateProductSourceStatus();
});
designForm.elements.namedItem("addStoreLinks").addEventListener("change", updateProductSourceStatus);
resetExtraSpaceRows();
resetOutletRows();
resetCeilingLightRows();
resetOwnedFurnitureRows();
restoreProductSettings();
renderSavedRooms();
