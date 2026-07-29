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

            <label htmlFor="roomName">
              Room name
              <input
                type="text"
                id="roomName"
                name="roomName"
                placeholder="Guest bedroom, basement game room..."
              />
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

            <label htmlFor="favoriteColors">
              Favorite colors
              <input
                type="text"
                id="favoriteColors"
                name="favoriteColors"
                placeholder="Sage, cream, navy..."
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

            <label htmlFor="dimensions">
              Room dimensions
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                placeholder="12 x 14 ft"
              />
            </label>

            <section className="room-shape-section" aria-labelledby="roomShapeTitle">
              <div className="room-shape-header">
                <h3 id="roomShapeTitle">Room Shape</h3>
                <span>Optional</span>
              </div>
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
            </section>

            <label htmlFor="modelView">
              Room model
              <select id="modelView" name="modelView">
                <option value="2d">2D floor plan</option>
                <option value="3d">3D room model</option>
              </select>
            </label>

            <label htmlFor="mustHaves">
              Must-have items
              <textarea
                id="mustHaves"
                name="mustHaves"
                rows={4}
                placeholder="Sectional sofa, standing desk, reading chair..."
              ></textarea>
            </label>

            <label htmlFor="furnitureLinks">
              Furniture links
              <textarea
                id="furnitureLinks"
                name="furnitureLinks"
                rows={4}
                placeholder="Paste furniture product or image links, one per line..."
              ></textarea>
            </label>

            <section className="product-source" aria-labelledby="productSourceTitle">
              <div className="product-source-header">
                <h3 id="productSourceTitle">Product Source</h3>
                <span id="productSourceStatus" aria-live="polite">
                  Search links active
                </span>
              </div>
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
            </section>

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
              <button type="reset" className="secondary-button" id="resetButton">
                Reset
              </button>
            </div>

            <button type="button" className="save-button" id="saveButton" disabled>
              Save Room Plan
            </button>

            <section className="saved-rooms" aria-labelledby="savedRoomsTitle">
              <div className="saved-rooms-header">
                <h3 id="savedRoomsTitle">Saved Rooms</h3>
                <span id="saveStatus" aria-live="polite"></span>
              </div>
              <div className="saved-room-list" id="savedRoomList">
                <p className="saved-empty">No saved rooms yet.</p>
              </div>
            </section>
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
                </article>

                <article className="result-card">
                  <h3>Color Palette</h3>
                  <div className="palette" id="colorPalette"></div>
                </article>

                <article className="result-card product-card-wrap">
                  <h3>Pieces to Choose</h3>
                  <div className="product-grid" id="productPicks"></div>
                </article>

                <article className="result-card">
                  <h3>Furniture List</h3>
                  <ul id="furnitureList"></ul>
                </article>

                <article className="result-card">
                  <h3>Decor Ideas</h3>
                  <ul id="decorIdeas"></ul>
                </article>

                <article className="result-card">
                  <h3>Layout Suggestion</h3>
                  <p id="layoutSuggestion"></p>
                </article>

                <article className="result-card checklist-card">
                  <h3>Shopping Checklist</h3>
                  <ul id="shoppingChecklist"></ul>
                </article>
              </div>
            </div>
          </section>
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
