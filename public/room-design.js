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
const productSourceStatus = document.querySelector("#productSourceStatus");
const extraSpaces = document.querySelector("#extraSpaces");
const addSpaceButton = document.querySelector("#addSpaceButton");
const outletList = document.querySelector("#outletList");
const addOutletButton = document.querySelector("#addOutletButton");
const ceilingLightList = document.querySelector("#ceilingLightList");
const addCeilingLightButton = document.querySelector("#addCeilingLightButton");

const STORAGE_KEY = "roomDesignAssistant.savedRooms";
const PRODUCT_SETTINGS_KEY = "roomDesignAssistant.productSettings";
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

function getFormValues() {
  const formData = new FormData(designForm);

  return {
    roomType: formData.get("roomType").trim(),
    roomName: formData.get("roomName").trim(),
    designStyle: formData.get("designStyle"),
    favoriteColors: formData.get("favoriteColors").trim(),
    budget: formData.get("budget"),
    dimensions: formData.get("dimensions").trim(),
    doorLocation: formData.get("doorLocation") || "front",
    doorNote: formData.get("doorNote").trim(),
    extraSpaces: getExtraSpaceValues(formData),
    outlets: getOutletValues(formData),
    ceilingLights: getCeilingLightValues(formData),
    modelView: formData.get("modelView"),
    mustHaves: formData.get("mustHaves").trim(),
    furnitureLinks: formData.get("furnitureLinks").trim(),
    productSource: formData.get("productSource"),
    productApiKey: formData.get("productApiKey").trim(),
    addStoreLinks: formData.get("addStoreLinks") === "on"
  };
}

function setFormValues(values) {
  resetExtraSpaceRows(values.extraSpaces || [{}]);
  resetOutletRows(values.outlets || [{}]);
  resetCeilingLightRows(values.ceilingLights || [{}]);

  Object.entries(values).forEach(([key, value]) => {
    if (key === "extraSpaces" || key === "outlets" || key === "ceilingLights") {
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

function getRoomShape(formValues, dimensions) {
  const spaces = parseExtraSpaces(formValues.extraSpaces || []);
  const doorLocation = formValues.doorLocation || "front";
  const doorLabel = doorLocation.charAt(0).toUpperCase() + doorLocation.slice(1);
  const doorNote = formValues.doorNote ? `, ${formValues.doorNote}` : "";
  const extraLabel = spaces.length
    ? ` plus ${spaces.map((space) => `${space.name} (${space.label}, ${space.side} side)`).join("; ")}`
    : "";

  return {
    main: dimensions,
    spaces,
    doorLocation,
    doorLabel,
    doorNote: formValues.doorNote || "",
    label: `${dimensions.label}${extraLabel}`,
    summary: `${doorLabel} wall door${doorNote}${extraLabel ? `; extra spaces: ${spaces.map((space) => `${space.name} on the ${space.side}`).join(", ")}` : ""}`
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

async function makeProducts(plan, mustHaves, furnitureLinks, productSettings) {
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
    shape: "storage"
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

  return [...normalizedImportedProducts, ...products].slice(0, 8);
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
  const roomShape = getRoomShape(formValues, dimensions);
  const electricalPlan = getElectricalPlan(formValues);

  return {
    formValues,
    products,
    title: `${plan.titleWord} ${roomLabel} Design`,
    description: `${plan.description} For a ${roomShape.label} room, pick pieces that match each zone before buying. Door placement: ${roomShape.summary}. Electrical plan: ${electricalPlan.summary}.${importedCount ? ` ${importedCount} imported furniture object${importedCount === 1 ? "" : "s"} from your links are included in the plan and room model.` : ""}`,
    layout: `${plan.layout} Keep the ${roomShape.doorLabel.toLowerCase()} wall door path open${roomShape.spaces.length ? `, then use ${roomShape.spaces[0].name} as a separate zone when possible` : ""}. Keep desks, lamps, media consoles, and gaming gear near marked outlets. Start with ${products[0].name}, then place ${mustHaves[0] || products[1].name} where it keeps walkways open.`,
    palette: plan.palette,
    decor: plan.decor,
    checklist: buildChecklist(getBudgetTier(Number(formValues.budget)), mustHaves, products),
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

function renderSnapshot(snapshot) {
  snapshot.products = ensureProductLinks(snapshot.products, snapshot.formValues);
  currentSnapshot = snapshot;
  saveButton.disabled = false;

  designTitle.textContent = snapshot.title;
  styleDescription.textContent = snapshot.description;
  layoutSuggestion.textContent = snapshot.layout;

  showPalette(snapshot.palette, snapshot.formValues.favoriteColors);
  showProducts(snapshot.products);
  renderRoomPreview(
    snapshot.modelView,
    snapshot.dimensions,
    snapshot.products,
    snapshot.roomShape || getRoomShape(snapshot.formValues, snapshot.dimensions),
    snapshot.electricalPlan || getElectricalPlan(snapshot.formValues)
  );
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

    if (product.exactGenerated) {
      const exact = document.createElement("span");
      exact.className = "exact-tag";
      exact.textContent = product.previewBlocked ? "Exact link" : "Exact product";
      meta.appendChild(exact);
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
    const cushionMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(product.color).offsetHSL(0, 0, 0.12), roughness: 0.74 });
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(item.size[0] * 0.82, item.size[1] * 0.16, item.size[2] * 0.72), cushionMaterial);

    base.position.y = item.size[1] * 0.18;
    back.position.set(0, item.size[1] * 0.48, -item.size[2] * 0.42);
    leftArm.position.set(-item.size[0] * 0.46, item.size[1] * 0.34, 0);
    rightArm.position.set(item.size[0] * 0.46, item.size[1] * 0.34, 0);
    cushion.position.y = item.size[1] * 0.48;
    group.add(base, back, leftArm, rightArm, cushion);
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

function render3DModel(dimensions, products, roomShape = getRoomShape({}, dimensions), electricalPlan = getElectricalPlan({})) {
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

  scene.add(new THREE.AmbientLight(0xffffff, 0.58));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(4, 8, 6);
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.16, length),
    new THREE.MeshStandardMaterial({ color: 0xd8c3aa, roughness: 0.8 })
  );
  floor.position.y = -0.08;
  scene.add(floor);

  roomShape.spaces.slice(0, 4).forEach((space, index) => {
    const spaceWidth = Math.min(Math.max(space.width, 3), width * 0.85);
    const spaceLength = Math.min(Math.max(space.length, 3), length * 0.85);
    const extraFloor = new THREE.Mesh(
      new THREE.BoxGeometry(spaceWidth, 0.14, spaceLength),
      new THREE.MeshStandardMaterial({ color: 0xcfe1d6, roughness: 0.82 })
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

    scene.add(extraFloor);
  });

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf7eee3, roughness: 0.9 });
  const openWallMaterial = new THREE.MeshStandardMaterial({ color: 0xf7eee3, roughness: 0.9, transparent: true, opacity: 0.72 });
  const wallSpecs = [
    { name: "back", size: [width, 3, 0.15], pos: [0, 1.5, -length / 2], material: wallMaterial },
    { name: "front", size: [width, 3, 0.15], pos: [0, 1.5, length / 2], material: openWallMaterial },
    { name: "left", size: [0.15, 3, length], pos: [-width / 2, 1.5, 0], material: wallMaterial },
    { name: "right", size: [0.15, 3, length], pos: [width / 2, 1.5, 0], material: openWallMaterial }
  ];
  wallSpecs.forEach((wall) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...wall.size), wall.material);
    mesh.position.set(...wall.pos);
    scene.add(mesh);
  });

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.08, length),
    new THREE.MeshStandardMaterial({ color: 0xfff8ed, roughness: 0.88, transparent: true, opacity: 0.58 })
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

  electricalPlan.outlets.slice(0, 8).forEach((outlet) => {
    addOutletObject(scene, outlet, width, length, THREE);
  });

  electricalPlan.ceilingLights.slice(0, 6).forEach((ceilingLight) => {
    addCeilingLightObject(scene, ceilingLight, width, length, THREE);
  });

  renderer.render(scene, camera);
}

function renderRoomPreview(modelView, dimensions, products, roomShape = getRoomShape({}, dimensions), electricalPlan = getElectricalPlan({})) {
  roomDimensionsBadge.textContent = roomShape.label;

  if (modelView === "3d") {
    render3DModel(dimensions, products, roomShape, electricalPlan);
    previewCaption.textContent = `3D model scaled from a ${roomShape.label} room, with the ${roomShape.doorLabel.toLowerCase()} door, outlets, ceiling lights, and extra spaces blocked in by footprint.`;
    return;
  }

  renderFloorPlan(dimensions, products, roomShape, electricalPlan);
  previewCaption.textContent = `2D floor plan scaled from a ${roomShape.label} room, with door location, outlets, ceiling lights, and separate spaces called out for fit checks.`;
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
  const products = await makeProducts(plan, mustHaves, furnitureLinks, productSettings);

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
  resetExtraSpaceRows();
  resetOutletRows();
  resetCeilingLightRows();
  renderSavedRooms();
}

designForm.addEventListener("submit", generateDesign);
resetButton.addEventListener("click", resetDesign);
saveButton.addEventListener("click", saveCurrentRoom);
addSpaceButton.addEventListener("click", () => {
  extraSpaces.appendChild(createExtraSpaceRow());
});
addOutletButton.addEventListener("click", () => {
  outletList.appendChild(createOutletRow());
});
addCeilingLightButton.addEventListener("click", () => {
  ceilingLightList.appendChild(createCeilingLightRow());
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
restoreProductSettings();
renderSavedRooms();
