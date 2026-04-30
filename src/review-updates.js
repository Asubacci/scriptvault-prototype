function text(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function html(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = value;
  }
}

function insertAfter(selector, id, markup) {
  const anchor = document.querySelector(selector);
  if (!anchor || document.querySelector(`#${id}`)) {
    return;
  }

  anchor.insertAdjacentHTML("afterend", markup);
}

function insertBefore(selector, id, markup) {
  const anchor = document.querySelector(selector);
  if (!anchor || document.querySelector(`#${id}`)) {
    return;
  }

  anchor.insertAdjacentHTML("beforebegin", markup);
}

function injectStyles() {
  if (document.querySelector("#reviewUpdateStyles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "reviewUpdateStyles";
  style.textContent = `
    .african-focus,
    .reader-credibility {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: 22px;
      align-items: start;
      padding: 28px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(216, 154, 37, 0.14), transparent 46%),
        rgba(255, 255, 255, 0.88);
      box-shadow: 0 12px 34px rgba(22, 20, 15, 0.08);
    }

    .african-focus h2 {
      margin-bottom: 0;
    }

    .reader-credibility {
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 24px;
    }

    .reader-credibility article {
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fffdfa;
    }

    .reader-credibility strong {
      display: block;
      margin-bottom: 8px;
      color: var(--forest);
      font-size: 18px;
    }

    .free-package {
      border-color: var(--forest);
      background: #eef6f2;
    }

    @media (max-width: 900px) {
      .african-focus,
      .reader-credibility {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.append(style);
}

function updatePublicPositioning() {
  html(
    ".clean-hero-copy > p:not(.eyebrow)",
    "Built for African screen stories: get credible coverage, improve your script, and connect with producers looking for production-ready material."
  );
  text(
    ".clean-hero-copy small",
    "Script validation, producer discovery, and screenplay development in one workflow."
  );
  text(".path-card:nth-child(2) > p", "Discover vetted African screenplays with clear production details");
  text("#marketplace .eyebrow", "African marketplace + coverage + screenplay generation");
  text("#marketplace-title", "Production-ready African stories, validated before they sell.");
  text("#producers-title", "Find coverage-vetted African screenplays before the market gets crowded.");
  text(".demand-card span", "Producer Access");
  text(".demand-card strong", "Curated");
  text(
    ".demand-card p",
    "Receive matched scripts, coverage summaries, and rights options as inventory opens."
  );
  text("#about-title", "The screenplay infrastructure layer for African film and television.");
}

function addAfricanFocusSection() {
  insertAfter(
    ".path-section",
    "african-focus-title",
    `<section class="home-section african-focus" aria-labelledby="african-focus-title">
      <div>
        <p class="eyebrow">African screen industry infrastructure</p>
        <h2 id="african-focus-title">Built for Nollywood, African studios, and independent writers.</h2>
      </div>
      <p>
        ScriptVault is designed for the real production market around us: Lagos-set thrillers,
        faith-and-family dramas, low-location stories, streaming-ready series, and producers who need
        faster ways to find scripts they can actually make.
      </p>
    </section>`
  );
}

function updatePricingAndProducerProof() {
  const coverageCard = document.querySelector(".pricing-strip article:first-child");
  if (coverageCard) {
    html(
      ".pricing-strip article:first-child",
      `<span>Coverage</span>
       <strong>Free check - &#8358;50,000+</strong>
       <p>Start with a light script health check, then upgrade for full notes.</p>`
    );
  }

  const marketplaceCard = document.querySelector(".pricing-strip article:nth-child(3) p");
  if (marketplaceCard) {
    marketplaceCard.textContent = "Sellers keep 80% after platform commission when scripts are licensed.";
  }

  text(".producer-panel h3", "What Early Producers Receive");
  html(
    ".producer-panel .check-list",
    `<li>Curated screenplay alerts by genre, budget, and production timeline</li>
     <li>Coverage-score previews before deeper review</li>
     <li>Rights options clearly separated from simple download access</li>
     <li>Early partnership conversations for studios, producers, and investors</li>`
  );
  html(
    ".launch-metrics",
    `<span><strong>Curated</strong> script discovery</span>
     <span><strong>Verified</strong> coverage signals</span>
     <span><strong>Clear</strong> rights conversations</span>
     <span><strong>African</strong> story focus</span>`
  );
}

function updateCoverageTrust() {
  insertBefore(
    ".coverage-packages",
    "coverage-reader-credibility",
    `<div class="reader-credibility" id="coverage-reader-credibility" aria-label="Coverage credibility">
      <article>
        <strong>Who reviews the script?</strong>
        <p>
          Coverage is designed as a hybrid workflow: trained story readers and editors review the final
          report, while AI can assist with first-pass structure checks, summaries, and consistency flags.
        </p>
      </article>
      <article>
        <strong>What makes it credible?</strong>
        <p>
          Each report is judged against story structure, character, dialogue, market viability, budget
          realism, locations, cast size, and whether the script is ready for African production needs.
        </p>
      </article>
      <article>
        <strong>Typical turnaround</strong>
        <p>
          Free checks can return a quick readiness signal. Paid coverage is queued for a detailed PDF
          report and marketplace eligibility review.
        </p>
      </article>
    </div>`
  );

  const packageGrid = document.querySelector(".coverage-packages");
  if (packageGrid && !packageGrid.querySelector(".free-package")) {
    packageGrid.insertAdjacentHTML(
      "afterbegin",
      `<article class="package-card free-package">
        <span>Free Script Health Check</span>
        <strong>&#8358;0</strong>
        <small>Limited readiness signal</small>
        <p>Basic fit check to reduce friction before writers pay for deeper coverage.</p>
      </article>`
    );
  }

  const fileInput = document.querySelector("#coverageForm input[type='file']");
  if (fileInput) {
    fileInput.required = false;
    const label = fileInput.closest("label");
    if (label && !label.querySelector("small")) {
      label.insertAdjacentHTML("afterbegin", "Script file <small>Optional in this demo</small>");
    }
  }
}

function addDemoActionTargets() {
  const buyButton =
    document.querySelector("#buyScreenplayButton") ||
    [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Buy Screenplay");
  if (buyButton) {
    buyButton.id = "buyScreenplayButton";
    if (!document.querySelector("#purchaseSuccess")) {
      buyButton.insertAdjacentHTML(
        "afterend",
        '<p class="success-message" id="purchaseSuccess" role="status"></p>'
      );
    }
  }

  const generateButton =
    document.querySelector("#generateOutlineButton") ||
    [...document.querySelectorAll("button")].find((button) =>
      button.textContent.includes("Generate Beat Outline")
    );
  if (generateButton) {
    generateButton.id = "generateOutlineButton";
    if (!document.querySelector("#generationSuccess")) {
      generateButton.insertAdjacentHTML(
        "afterend",
        '<p class="success-message" id="generationSuccess" role="status"></p>'
      );
    }
  }
}

function updateAboutCopy() {
  html(
    ".about-cards article:nth-child(1) p",
    "Help African writers, producers, and studios move scripts from idea to coverage, production readiness, rights conversations, and monetization."
  );
  html(
    ".about-cards article:nth-child(2) p",
    "Become the trusted discovery and quality-control layer for Nollywood, African streaming originals, independent producers, and global buyers seeking African stories."
  );
  html(
    ".difference-grid article:nth-child(2) p",
    "Scripts can start with a free health check, but marketplace listing requires transparent coverage scoring and quality review."
  );
}

export function applyReviewUpdates() {
  injectStyles();
  updatePublicPositioning();
  addAfricanFocusSection();
  updatePricingAndProducerProof();
  updateCoverageTrust();
  addDemoActionTargets();
  updateAboutCopy();
}
