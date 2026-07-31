import Script from "next/script";

export const metadata = {
  title: "Room Design Assistant",
  description:
    "A simple browser-based room planning tool that generates room design ideas from your style, colors, budget, dimensions, and must-have items.",
};

export default function Home() {
  return (
    <>
      <main className="app-shell" aria-labelledby="appTitle">
        <section className="hero" aria-labelledby="appTitle">
          <div>
            <p className="eyebrow">Interior planning tool</p>
            <h1 id="appTitle">Room Design Assistant</h1>
            <p className="hero-copy">
              Turn a few room details into a practical design concept,
              furniture plan, decor direction, and budget-friendly shopping
              checklist.
            </p>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <span className="paint-swatch coral"></span>
            <span className="paint-swatch teal"></span>
            <span className="paint-swatch ink"></span>
            <div className="mini-room">
              <div className="mini-window"></div>
              <div className="mini-sofa"></div>
              <div className="mini-table"></div>
              <div className="mini-rug"></div>
            </div>
          </div>
        </section>

        <section className="workspace" aria-label="Room design workspace">
          <form className="design-form" id="designForm" aria-labelledby="designFormTitle">
            <div className="form-header">
              <h2 id="designFormTitle">Design Details</h2>
              <p>Enter what matters most, then generate a room plan.</p>
            </div>

            <section className="form-section primary-fields" aria-label="Main room details">
              <label htmlFor="roomType">
                Room type
                <input
                  type="text"
                  id="roomType"
                  name="roomType"
                  placeholder="Living room, bedroom, office..."
                  required
                />
              </label>

              <label htmlFor="roomTemplate">
                Room template
                <select id="roomTemplate" name="roomTemplate">
                  <option value="">Custom room</option>
                  <option value="small-bedroom">Small bedroom</option>
                  <option value="gaming-setup">Gaming setup</option>
                  <option value="studio-apartment">Studio apartment</option>
                <option value="shared-kids-room">Shared kids room</option>
                <option value="home-office">Home office</option>
                <option value="rental-living-room">Rental living room</option>
                <option value="small-dining-room">Small dining room</option>
              </select>
            </label>

              <label htmlFor="designStyle">
                Design style
                <select id="designStyle" name="designStyle" required>
                  <option value="">Choose a style</option>
                  <option value="cozy">Cozy</option>
                  <option value="modern">Modern</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="luxury">Luxury</option>
                  <option value="gaming">Gaming</option>
                </select>
              </label>

              <label htmlFor="dimensions">
                Room dimensions
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  placeholder="12 x 14 ft"
                />
              </label>

              <label htmlFor="budget">
                Budget
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  min="0"
                  step="50"
                  inputMode="numeric"
                  placeholder="1200"
                />
              </label>

              <label htmlFor="roomName">
                Room name
                <input
                  type="text"
                  id="roomName"
                  name="roomName"
                  placeholder="Guest bedroom, basement game room..."
                />
              </label>

              <label htmlFor="modelView">
                Room model
                <select id="modelView" name="modelView">
                  <option value="2d">2D floor plan</option>
                  <option value="3d">3D room model</option>
                </select>
              </label>
            </section>

            <label htmlFor="favoriteColors">
              Favorite colors
              <input
                type="text"
                id="favoriteColors"
                name="favoriteColors"
                placeholder="Sage, cream, navy..."
              />
            </label>

            <label htmlFor="mustHaves">
              Must-have items
              <textarea
                id="mustHaves"
                name="mustHaves"
                rows={3}
                placeholder="Sectional sofa, standing desk, reading chair..."
              ></textarea>
            </label>

            <details className="room-shape-section form-panel">
              <summary>
                <span id="roomShapeTitle">Room Shape</span>
                <small>Door and extra spaces</small>
              </summary>
              <label htmlFor="doorLocation">
                Door location
                <select id="doorLocation" name="doorLocation">
                  <option value="front">Front wall</option>
                  <option value="back">Back wall</option>
                  <option value="left">Left wall</option>
                  <option value="right">Right wall</option>
                </select>
              </label>
              <label htmlFor="doorNote">
                Door note
                <input
                  type="text"
                  id="doorNote"
                  name="doorNote"
                  placeholder="Example: near left corner, swings inward"
                />
              </label>
              <label htmlFor="windowPlan">
                Windows
                <input
                  type="text"
                  id="windowPlan"
                  name="windowPlan"
                  placeholder="Example: back center, left wall"
                />
              </label>
              <label htmlFor="wallPlan">
                Custom wall notes
                <input
                  type="text"
                  id="wallPlan"
                  name="wallPlan"
                  placeholder="Example: angled wall near closet, bay window bump-out"
                />
              </label>
              <div className="extra-spaces" id="extraSpaces" aria-label="Extra room spaces">
                <div className="extra-space-row">
                  <label>
                    Extra space name
                    <input
                      type="text"
                      name="extraSpaceName"
                      placeholder="Nook, closet, alcove..."
                    />
                  </label>
                  <label>
                    Dimensions
                    <input
                      type="text"
                      name="extraSpaceDimensions"
                      placeholder="5 x 7 ft"
                    />
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
                  <button type="button" className="remove-space-button" aria-label="Remove this extra space">
                    Remove
                  </button>
                </div>
              </div>
              <button type="button" className="secondary-button add-space-button" id="addSpaceButton">
                Add another space
              </button>
            </details>

            <details className="electrical-section form-panel">
              <summary>
                <span id="electricalTitle">Electrical</span>
                <small>Outlets and ceiling lights</small>
              </summary>
              <div className="fixture-list" id="outletList" aria-label="Electrical outlets">
                <div className="fixture-row outlet-row">
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
                  <button type="button" className="remove-space-button" aria-label="Remove this outlet">
                    Remove
                  </button>
                </div>
              </div>
              <button type="button" className="secondary-button add-space-button" id="addOutletButton">
                Add outlet
              </button>

              <div className="fixture-list" id="ceilingLightList" aria-label="Ceiling lights">
                <div className="fixture-row light-row">
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
                  <button type="button" className="remove-space-button" aria-label="Remove this ceiling light">
                    Remove
                  </button>
                </div>
              </div>
              <button type="button" className="secondary-button add-space-button" id="addCeilingLightButton">
                Add ceiling light
              </button>
            </details>

            <details className="owned-furniture-section form-panel">
              <summary>
                <span id="ownedFurnitureTitle">Furniture You Already Have</span>
                <small>Existing pieces and sizes</small>
              </summary>
              <div className="fixture-list" id="ownedFurnitureList" aria-label="Furniture already owned">
                <div className="owned-furniture-row">
                  <label>
                    Item name
                    <input
                      type="text"
                      name="ownedFurnitureName"
                      placeholder="Blue sofa, white desk, TV stand..."
                    />
                  </label>
                  <label>
                    Dimensions
                    <input
                      type="text"
                      name="ownedFurnitureDimensions"
                      placeholder="width x depth x height, like 78 x 35 x 32 in"
                    />
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
                  <button type="button" className="remove-space-button" aria-label="Remove this owned furniture item">
                    Remove
                  </button>
                </div>
              </div>
              <button type="button" className="secondary-button add-space-button" id="addOwnedFurnitureButton">
                Add owned furniture
              </button>
            </details>

            <details className="product-source form-panel">
              <summary>
                <span id="productSourceTitle">Furniture Links</span>
                <small id="productSourceStatus" aria-live="polite">
                  Search links active
                </small>
              </summary>
              <label htmlFor="furnitureLinks">
                Furniture links
                <textarea
                  id="furnitureLinks"
                  name="furnitureLinks"
                  rows={3}
                  placeholder="Paste furniture product or image links, one per line..."
                ></textarea>
              </label>

              <label htmlFor="modelLinks">
                3D model links
                <textarea
                  id="modelLinks"
                  name="modelLinks"
                  rows={2}
                  placeholder="Paste .glb or .gltf model links, one per line..."
                ></textarea>
              </label>

              <label htmlFor="productSource">
                Exact product matching
                <select id="productSource" name="productSource">
                  <option value="search">Amazon search links</option>
                  <option value="bestbuy">Best Buy exact products</option>
                </select>
              </label>
              <label htmlFor="productApiKey">
                Product API key
                <input
                  type="password"
                  id="productApiKey"
                  name="productApiKey"
                  placeholder="Paste API key for exact products"
                />
              </label>
              <p className="source-note">
                Without a product API key, generated items use shopping search links.
              </p>
            </details>

            <label className="checkbox-row" htmlFor="addStoreLinks">
              <input
                type="checkbox"
                id="addStoreLinks"
                name="addStoreLinks"
                defaultChecked
              />
              Add store link?
            </label>

            <div className="button-row">
              <button type="submit" className="primary-button">
                Generate Design
              </button>
              <button type="button" className="demo-button" id="demoButton">
                Try Demo Room
              </button>
              <button type="reset" className="secondary-button" id="resetButton">
                Reset
              </button>
            </div>

            <button type="button" className="save-button" id="saveButton" disabled>
              Save Room Plan
            </button>

            <details className="saved-rooms form-panel" open>
              <summary>
                <span id="savedRoomsTitle">Saved Rooms</span>
                <span id="saveStatus" aria-live="polite"></span>
              </summary>
              <div className="saved-room-list" id="savedRoomList">
                <p className="saved-empty">No saved rooms yet.</p>
              </div>
            </details>
          </form>

          <section
            className="results-panel"
            id="resultsPanel"
            aria-label="Generated room design results"
            aria-live="polite"
          >
            <div className="empty-state" id="emptyState">
              <span className="empty-icon" aria-hidden="true">+</span>
              <h2 id="resultsTitle">Your design plan will appear here</h2>
              <p>
                Choose a style, add your room details, and generate a tailored
                plan.
              </p>
            </div>

            <div className="results hidden" id="results">
              <div className="result-card featured">
                <p className="eyebrow">Generated concept</p>
                <h2 id="designTitle"></h2>
                <p id="styleDescription"></p>
              </div>

              <div className="result-grid">
                <article className="result-card preview-card">
                  <div className="card-heading-row">
                    <h3>Room Model</h3>
                    <span id="roomDimensionsBadge" className="dimension-badge"></span>
                  </div>
                  <div className="room-preview" id="roomPreview"></div>
                  <p className="preview-caption" id="previewCaption"></p>
                  <div className="model-workbench" aria-label="Model tools and checks">
                    <div className="placement-tools" id="placementTools" aria-label="Furniture placement tools">
                      <label htmlFor="selectedFurniture">Selected piece
                        <select id="selectedFurniture"></select>
                      </label>
                      <div className="tool-button-row">
                        <button type="button" className="secondary-button" id="rotateLeftButton">Rotate Left</button>
                        <button type="button" className="secondary-button" id="rotateRightButton">Rotate Right</button>
                      </div>
                      <div className="tool-button-row">
                        <button type="button" className="secondary-button" id="shrinkButton">Shrink</button>
                        <button type="button" className="secondary-button" id="growButton">Grow</button>
                      </div>
                      <label className="snap-toggle" htmlFor="snapPlacement">
                        <input type="checkbox" id="snapPlacement" defaultChecked />
                        Snap placement
                      </label>
                      <label htmlFor="placementCommand">Place selected piece
                        <input
                          type="text"
                          id="placementCommand"
                          placeholder="back wall, center, left corner, x 2 z -3"
                        />
                      </label>
                      <button type="button" className="secondary-button full-tool-button" id="applyPlacementButton">Apply Placement</button>
                    </div>
                    <div className="model-support-grid">
                      <section className="model-support-card" aria-labelledby="budgetTrackerTitle">
                        <h4 id="budgetTrackerTitle">Budget Tracker</h4>
                        <div className="budget-tracker" id="budgetTracker"></div>
                      </section>
                      <section className="model-support-card" aria-labelledby="fitWarningsTitle">
                        <h4 id="fitWarningsTitle">Fit Warnings</h4>
                        <ul id="fitWarnings"></ul>
                      </section>
                      <section className="model-support-card" aria-labelledby="exportPlanTitle">
                        <h4 id="exportPlanTitle">Export Plan</h4>
                        <div className="export-actions">
                          <button type="button" className="secondary-button" id="downloadImageButton">Download Image</button>
                          <button type="button" className="secondary-button" id="downloadPdfButton">Download PDF</button>
                          <button type="button" className="secondary-button" id="downloadChecklistButton">Download List</button>
                        </div>
                      </section>
                    </div>
                  </div>
                </article>

                <details className="result-card result-toggle" open>
                  <summary>Color Palette</summary>
                  <div className="palette" id="colorPalette"></div>
                </details>

                <details className="result-card result-toggle product-card-wrap" open>
                  <summary>Pieces to Choose</summary>
                  <div className="product-grid" id="productPicks"></div>
                </details>

                <details className="result-card result-toggle product-card-wrap">
                  <summary>Suggested Add-Ons</summary>
                  <div className="suggestion-grid" id="suggestedAddOns"></div>
                </details>

                <details className="result-card result-toggle">
                  <summary>Furniture List</summary>
                  <ul id="furnitureList"></ul>
                </details>

                <details className="result-card result-toggle">
                  <summary>Decor Ideas</summary>
                  <ul id="decorIdeas"></ul>
                </details>

                <details className="result-card result-toggle">
                  <summary>Layout Suggestion</summary>
                  <p id="layoutSuggestion"></p>
                </details>

                <details className="result-card result-toggle">
                  <summary>Mood Board</summary>
                  <div className="mood-board" id="moodBoard"></div>
                </details>

                <details className="result-card result-toggle">
                  <summary>AI Style Notes</summary>
                  <ul id="styleNotes"></ul>
                </details>

                <details className="result-card result-toggle checklist-card">
                  <summary>Shopping Checklist</summary>
                  <ul id="shoppingChecklist"></ul>
                </details>
              </div>
            </div>
          </section>
        </section>
        <section className="site-info" aria-labelledby="siteInfoTitle">
          <div>
            <p className="eyebrow">Free public beta</p>
            <h2 id="siteInfoTitle">Plan rooms in your browser</h2>
            <p>
              Room Design Assistant stores saved rooms on this device, creates
              browser-only plans, and uses store search links unless you add
              your own product API details.
            </p>
          </div>
          <div className="info-grid">
            <article>
              <h3>About</h3>
              <p>
                A practical room planner for trying layouts, budgets, colors,
                existing furniture, and simple 2D or 3D room models before you
                shop.
              </p>
            </article>
            <article>
              <h3>Privacy</h3>
              <p>
                Saved rooms and API settings are stored in your browser's local
                storage. Clearing browser data can remove them.
              </p>
            </article>
            <article>
              <h3>Terms</h3>
              <p>
                Designs, prices, measurements, and shopping links are planning
                aids. Always confirm fit, cost, safety, and product details
                before buying.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Script
        src="https://unpkg.com/three@0.160.0/build/three.min.js"
        strategy="beforeInteractive"
      />
      <Script src="/room-design.js" strategy="afterInteractive" />
    </>
  );
}
