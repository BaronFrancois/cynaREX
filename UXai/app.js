const devices = [
  {
    id: "desktop",
    name: "Desktop 1440",
    frameClass: "",
    surface: "web-page",
    width: 1440,
    height: 900,
    safe: "none"
  },
  {
    id: "iphone",
    name: "iPhone Dynamic Island",
    frameClass: "phone",
    surface: "mobile-screen",
    width: 393,
    height: 852,
    safe: "dynamic-island"
  },
  {
    id: "galaxy",
    name: "Samsung Galaxy",
    frameClass: "phone",
    surface: "mobile-screen",
    width: 412,
    height: 915,
    safe: "punch-hole"
  },
  {
    id: "pixel",
    name: "Google Pixel",
    frameClass: "phone",
    surface: "mobile-screen",
    width: 412,
    height: 915,
    safe: "punch-hole"
  },
  {
    id: "ipad",
    name: "iPad",
    frameClass: "tablet",
    surface: "tablet-screen",
    width: 820,
    height: 1180,
    safe: "tablet"
  },
  {
    id: "quest",
    name: "Meta Quest - 2D panel",
    frameClass: "quest",
    surface: "spatial-2d-panel",
    width: 1280,
    height: 720,
    safe: "spatial-comfort"
  }
];

const editorModes = [
  { id: "design", label: "Design", description: "UI, calques, composants et styles." },
  { id: "prototype", label: "Prototype", description: "Liens, transitions et parcours." },
  { id: "build", label: "Build", description: "Routes, donnees, etats et logique attendue." },
  { id: "inspect", label: "Inspect", description: "Contrat LLM, props et fichiers cibles." }
];

const frames = [
  { id: "landing", name: "Landing page", route: "/", surface: "web-page", status: "active" },
  { id: "dashboard", name: "Dashboard app", route: "/dashboard", surface: "desktop-app", status: "planned" },
  { id: "auth", name: "Auth flow", route: "/login", surface: "mobile-screen", status: "planned" },
  { id: "questPanel", name: "Meta Quest panel", route: "unity/world-space", surface: "spatial-2d-panel", status: "lab" }
];

const designAssets = [
  { id: "button", name: "Button", kind: "component", variants: ["primary", "secondary", "danger"] },
  { id: "input", name: "Input", kind: "component", variants: ["default", "focus", "error", "disabled"] },
  { id: "card", name: "Card", kind: "component", variants: ["default", "selected", "loading"] },
  { id: "nav", name: "Navigation", kind: "component", variants: ["desktop", "mobile drawer"] },
  { id: "tokens", name: "Design tokens", kind: "theme", variants: ["colors", "radius", "shadow", "spacing"] }
];

const figmaUxaiFeatures = [
  {
    id: "frames",
    name: "Pages, frames et surfaces",
    figma: "Pages et frames",
    uxai: "Chaque frame porte route, device, role produit et contraintes LLM.",
    status: "prototype"
  },
  {
    id: "components",
    name: "Composants reutilisables",
    figma: "Components et instances",
    uxai: "Composants avec props, slots, variantes, etats et points de branchement logique.",
    status: "next"
  },
  {
    id: "variants",
    name: "Variants et etats UI",
    figma: "Variants",
    uxai: "Etat default, hover, loading, error, empty et permissions exportes pour le LLM.",
    status: "next"
  },
  {
    id: "autolayout",
    name: "Auto layout web",
    figma: "Auto layout",
    uxai: "Flex/grid, hug/fill/fixed, constraints responsive et drag/drop structurel.",
    status: "prototype"
  },
  {
    id: "tokens",
    name: "Styles et tokens",
    figma: "Styles",
    uxai: "Tokens exportables en CSS variables, Tailwind theme et documentation LLM.",
    status: "prototype"
  },
  {
    id: "prototypeLinks",
    name: "Liens prototype",
    figma: "Prototype links",
    uxai: "Go to page, open modal, submit form, toggle drawer traduits en handlers.",
    status: "planned"
  },
  {
    id: "comments",
    name: "Commentaires et annotations",
    figma: "Comments",
    uxai: "Notes produit, risques, questions LLM et decisions de design exportees.",
    status: "planned"
  },
  {
    id: "inspect",
    name: "Inspect / dev mode",
    figma: "Dev mode",
    uxai: "Props, routes, schemas, fichiers cibles et garde-fous de modification.",
    status: "prototype"
  }
];

const appBuilderModules = [
  {
    id: "routes",
    name: "Routes",
    description: "Declarer les pages, chemins, guards et redirections.",
    items: ["/", "/dashboard", "/login", "/settings"]
  },
  {
    id: "forms",
    name: "Formulaires",
    description: "Champs, validations, erreurs, succes, loading et submit.",
    items: ["signup", "login", "contact", "settings"]
  },
  {
    id: "data",
    name: "Donnees",
    description: "Schemas, listes, empty states, mock data et contrats API.",
    items: ["User", "Project", "Plan", "AuditReport"]
  },
  {
    id: "permissions",
    name: "Permissions",
    description: "Roles, actions visibles, pages protegees et RBAC.",
    items: ["guest", "user", "admin", "owner"]
  }
];

const state = {
  selectedId: "page",
  activeMode: "design",
  currentDeviceId: "desktop",
  safeAreasVisible: true,
  activeTool: "move",
  zoom: 1,
  draggedNodeId: null,
  expandedNodeIds: new Set(["page", "header", "nav", "hero"]),
  collapsedPropertyGroups: new Set(["Shadow CSS", "Border et blur", "Contrat LLM"]),
  contextToolbarMinimized: false,
  contextToolbarFloating: false,
  contextToolbarPosition: null,
  activeExport: "project",
  project: createProject()
};

function createProject() {
  return {
    meta: {
      name: "UXai handoff demo",
      targetPlatform: {
        type: "web",
        framework: "react-tailwind",
        lockFront: true
      }
    },
    rootId: "page",
    nodes: {
      page: {
        id: "page",
        name: "Landing page",
        type: "page",
        role: "page",
        children: ["header", "hero", "features", "footer"],
        style: {}
      },
      header: {
        id: "header",
        name: "Header principal",
        type: "section",
        role: "header",
        children: ["brand", "nav", "headerCta"],
        style: {
          background: "rgba(255,255,255,0.75)",
          radius: 0,
          shadow: "none",
          blur: true,
          animation: "sticky fade"
        }
      },
      brand: {
        id: "brand",
        name: "Logo UXai",
        type: "component",
        role: "brand",
        children: [],
        text: "UXai",
        style: {}
      },
      nav: {
        id: "nav",
        name: "Navigation",
        type: "component",
        role: "nav",
        children: ["navProduct", "navHandoff", "navAudits", "navPricing"],
        style: {}
      },
      navProduct: {
        id: "navProduct",
        name: "Lien Produit",
        type: "component",
        role: "nav-link",
        children: [],
        text: "Produit",
        style: {}
      },
      navHandoff: {
        id: "navHandoff",
        name: "Lien Handoff LLM",
        type: "component",
        role: "nav-link",
        children: [],
        text: "Handoff LLM",
        style: {}
      },
      navAudits: {
        id: "navAudits",
        name: "Lien Audits",
        type: "component",
        role: "nav-link",
        children: [],
        text: "Audits",
        style: {}
      },
      navPricing: {
        id: "navPricing",
        name: "Lien Tarifs",
        type: "component",
        role: "nav-link",
        children: [],
        text: "Tarifs",
        style: {}
      },
      headerCta: {
        id: "headerCta",
        name: "CTA header",
        type: "component",
        role: "button",
        children: [],
        text: "Exporter le front",
        style: {}
      },
      hero: {
        id: "hero",
        name: "Hero",
        type: "section",
        role: "hero",
        children: ["heroCopy", "heroPreview"],
        style: {
          background: "transparent",
          radius: 0,
          shadow: "none",
          blur: false,
          animation: "fade-up"
        }
      },
      heroCopy: {
        id: "heroCopy",
        name: "Texte hero",
        type: "component",
        role: "copy",
        children: ["heroPrimary", "heroSecondary"],
        title: "Concevez un front stable avant de le donner a un LLM.",
        body: "UXai transforme une intention produit en UI editable, documentee et prete pour l'implementation logique.",
        style: {}
      },
      heroPrimary: {
        id: "heroPrimary",
        name: "Bouton hero principal",
        type: "component",
        role: "button",
        children: [],
        text: "Commencer le design",
        variant: "primary",
        style: {}
      },
      heroSecondary: {
        id: "heroSecondary",
        name: "Bouton hero secondaire",
        type: "component",
        role: "button",
        children: [],
        text: "Voir le contrat LLM",
        variant: "secondary",
        style: {}
      },
      heroPreview: {
        id: "heroPreview",
        name: "Preview projet",
        type: "component",
        role: "preview",
        children: [],
        style: {}
      },
      features: {
        id: "features",
        name: "Cartes features",
        type: "section",
        role: "features",
        children: ["feature1", "feature2", "feature3"],
        style: {
          background: "transparent",
          radius: 0,
          shadow: "none",
          blur: false,
          animation: "stagger"
        }
      },
      feature1: {
        id: "feature1",
        name: "Prompt local",
        type: "component",
        role: "card",
        children: [],
        title: "Prompt local",
        body: "Selectionnez un header, une nav ou une card puis demandez une iteration ciblee.",
        style: {
          radius: 26,
          shadow: "soft"
        }
      },
      feature2: {
        id: "feature2",
        name: "Front verrouille",
        type: "component",
        role: "card",
        children: [],
        title: "Front verrouille",
        body: "Exportez un contrat pour empecher le LLM final de redesigner l'interface.",
        style: {
          radius: 26,
          shadow: "soft"
        }
      },
      feature3: {
        id: "feature3",
        name: "Audits integres",
        type: "component",
        role: "card",
        children: [],
        title: "Audits integres",
        body: "Accessibilite, performance et securite sont documentees avant le code logique.",
        style: {
          radius: 26,
          shadow: "soft"
        }
      },
      footer: {
        id: "footer",
        name: "Footer",
        type: "section",
        role: "footer",
        children: [],
        style: {
          background: "rgba(236,241,248,0.86)",
          radius: 0,
          shadow: "none"
        }
      }
    }
  };
}

const els = {
  canvas: document.getElementById("canvas"),
  layersTree: document.getElementById("layersTree"),
  framesPanel: document.getElementById("framesPanel"),
  assetsPanel: document.getElementById("assetsPanel"),
  modeTabs: document.getElementById("modeTabs"),
  propertiesPanel: document.getElementById("propertiesPanel"),
  figmaFeaturesPanel: document.getElementById("figmaFeaturesPanel"),
  appBuilderPanel: document.getElementById("appBuilderPanel"),
  auditPanel: document.getElementById("auditPanel"),
  selectedPill: document.getElementById("selectedPill"),
  surfacePill: document.getElementById("surfacePill"),
  nodeTypeBadge: document.getElementById("nodeTypeBadge"),
  deviceFrame: document.getElementById("deviceFrame"),
  deviceSelect: document.getElementById("deviceSelect"),
  currentDeviceTitle: document.getElementById("currentDeviceTitle"),
  safeAreaToggle: document.getElementById("safeAreaToggle"),
  safeAreaTop: document.getElementById("safeAreaTop"),
  safeAreaBottom: document.getElementById("safeAreaBottom"),
  globalPrompt: document.getElementById("globalPrompt"),
  localPrompt: document.getElementById("localPrompt"),
  generateBtn: document.getElementById("generateBtn"),
  localPromptBtn: document.getElementById("localPromptBtn"),
  collapseAllBtn: document.getElementById("collapseAllBtn"),
  contextToolbar: document.getElementById("contextToolbar"),
  moveToolBtn: document.getElementById("moveToolBtn"),
  zoomOutBtn: document.getElementById("zoomOutBtn"),
  zoomValue: document.getElementById("zoomValue"),
  zoomInBtn: document.getElementById("zoomInBtn"),
  recenterBtn: document.getElementById("recenterBtn"),
  resizeToolBtn: document.getElementById("resizeToolBtn"),
  frameToolBtn: document.getElementById("frameToolBtn"),
  componentToolBtn: document.getElementById("componentToolBtn"),
  commentToolBtn: document.getElementById("commentToolBtn"),
  prototypeToolBtn: document.getElementById("prototypeToolBtn"),
  inspectToolBtn: document.getElementById("inspectToolBtn"),
  exportBtn: document.getElementById("exportBtn"),
  exportDrawer: document.getElementById("exportDrawer"),
  closeExportBtn: document.getElementById("closeExportBtn"),
  exportTabs: document.getElementById("exportTabs"),
  exportContent: document.getElementById("exportContent")
};

function init() {
  devices.forEach((device) => {
    const option = document.createElement("option");
    option.value = device.id;
    option.textContent = `${device.name} - ${device.width}x${device.height}`;
    els.deviceSelect.appendChild(option);
  });

  bindEvents();
  render();
}

function bindEvents() {
  els.generateBtn.addEventListener("click", () => {
    regenerateProjectFromPrompt(els.globalPrompt.value);
    render();
  });

  els.localPromptBtn.addEventListener("click", () => {
    applyLocalPrompt(state.selectedId, els.localPrompt.value);
    render();
  });

  els.deviceSelect.addEventListener("change", (event) => {
    state.currentDeviceId = event.target.value;
    render();
  });

  els.safeAreaToggle.addEventListener("change", (event) => {
    state.safeAreasVisible = event.target.checked;
    render();
  });

  els.collapseAllBtn.addEventListener("click", () => {
    Object.keys(state.project.nodes).forEach((id) => state.expandedNodeIds.add(id));
    render();
  });

  els.exportBtn.addEventListener("click", () => {
    els.exportDrawer.classList.remove("hidden");
    renderExports();
  });

  els.closeExportBtn.addEventListener("click", () => {
    els.exportDrawer.classList.add("hidden");
  });

  els.moveToolBtn.addEventListener("click", () => {
    state.activeTool = "move";
    render();
  });

  els.resizeToolBtn.addEventListener("click", () => {
    state.activeTool = state.activeTool === "resize" ? "move" : "resize";
    render();
  });

  els.frameToolBtn.addEventListener("click", () => activateToolMode("frame", "design", "Cree une nouvelle frame autour de la selection, avec route et contraintes responsive."));
  els.componentToolBtn.addEventListener("click", () => activateToolMode("component", "design", "Convertis la selection en composant reutilisable avec props, variants et slots."));
  els.commentToolBtn.addEventListener("click", () => activateToolMode("comment", "prototype", "Ajoute une annotation produit sur la selection pour guider le LLM final."));
  els.prototypeToolBtn.addEventListener("click", () => activateToolMode("prototype", "prototype", "Declare une interaction prototype depuis la selection : route, modal, toggle ou submit."));
  els.inspectToolBtn.addEventListener("click", () => activateToolMode("inspect", "inspect", "Inspecte la selection : props, tokens, etats, fichiers cibles et contraintes LLM."));

  els.zoomOutBtn.addEventListener("click", () => {
    state.zoom = Math.max(0.55, Number((state.zoom - 0.1).toFixed(2)));
    render();
  });

  els.zoomInBtn.addEventListener("click", () => {
    state.zoom = Math.min(1.35, Number((state.zoom + 0.1).toFixed(2)));
    render();
  });

  els.recenterBtn.addEventListener("click", () => {
    els.canvas.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.querySelector(".device-stage").scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "m") {
      state.activeTool = "move";
      render();
    }
  });
}

function activateToolMode(tool, mode, prompt) {
  state.activeTool = tool;
  state.activeMode = mode;
  els.localPrompt.value = prompt;
  render();
}

function render() {
  const device = getCurrentDevice();
  els.deviceSelect.value = state.currentDeviceId;
  els.currentDeviceTitle.textContent = device.name;
  els.surfacePill.textContent = `Surface : ${device.surface}`;

  els.deviceFrame.className = `device-frame ${device.frameClass}`.trim();
  els.safeAreaTop.classList.toggle("hidden", !state.safeAreasVisible || device.safe === "none");
  els.safeAreaBottom.classList.toggle("hidden", !state.safeAreasVisible || device.safe === "none");
  els.deviceFrame.classList.toggle("resize-mode", state.activeTool === "resize");
  els.deviceFrame.style.transform = `scale(${state.zoom})`;
  els.zoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  els.moveToolBtn.classList.toggle("active", state.activeTool === "move");
  els.resizeToolBtn.classList.toggle("active", state.activeTool === "resize");
  els.frameToolBtn.classList.toggle("active", state.activeTool === "frame");
  els.componentToolBtn.classList.toggle("active", state.activeTool === "component");
  els.commentToolBtn.classList.toggle("active", state.activeTool === "comment");
  els.prototypeToolBtn.classList.toggle("active", state.activeTool === "prototype");
  els.inspectToolBtn.classList.toggle("active", state.activeTool === "inspect");

  renderModeTabs();
  renderCanvas();
  renderLayers();
  renderFramesPanel();
  renderAssetsPanel();
  renderProperties();
  renderFigmaFeaturesPanel();
  renderAppBuilderPanel();
  renderAudits();
  renderExports();
}

function renderModeTabs() {
  els.modeTabs.innerHTML = "";

  editorModes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-tab ${state.activeMode === mode.id ? "active" : ""}`;
    button.innerHTML = `<strong>${escapeHtml(mode.label)}</strong><span>${escapeHtml(mode.description)}</span>`;
    button.addEventListener("click", () => {
      state.activeMode = mode.id;
      render();
    });
    els.modeTabs.appendChild(button);
  });
}

function renderFramesPanel() {
  els.framesPanel.innerHTML = "";

  frames.forEach((frame) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `mini-row ${frame.status === "active" ? "active" : ""}`;
    row.innerHTML = `
      <span>
        <strong>${escapeHtml(frame.name)}</strong>
        <small>${escapeHtml(frame.route)} · ${escapeHtml(frame.surface)}</small>
      </span>
      <em>${escapeHtml(frame.status)}</em>
    `;
    row.addEventListener("click", () => {
      if (frame.id === "questPanel") {
        state.currentDeviceId = "quest";
      }
      if (frame.id === "auth") {
        state.currentDeviceId = "iphone";
      }
      state.activeMode = frame.id === "dashboard" ? "build" : "design";
      render();
    });
    els.framesPanel.appendChild(row);
  });
}

function renderAssetsPanel() {
  els.assetsPanel.innerHTML = "";

  designAssets.forEach((asset) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "mini-row";
    row.innerHTML = `
      <span>
        <strong>${escapeHtml(asset.name)}</strong>
        <small>${escapeHtml(asset.kind)} · ${escapeHtml(asset.variants.join(", "))}</small>
      </span>
      <em>asset</em>
    `;
    row.addEventListener("click", () => {
      state.activeMode = "inspect";
      render();
    });
    els.assetsPanel.appendChild(row);
  });
}

function renderFigmaFeaturesPanel() {
  els.figmaFeaturesPanel.innerHTML = "";

  const modeFeatureMap = {
    design: ["frames", "components", "autolayout", "tokens"],
    prototype: ["prototypeLinks", "comments", "variants"],
    build: ["components", "variants", "inspect"],
    inspect: ["tokens", "inspect", "comments"]
  };
  const visibleIds = modeFeatureMap[state.activeMode] || modeFeatureMap.design;

  figmaUxaiFeatures
    .filter((feature) => visibleIds.includes(feature.id))
    .forEach((feature) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "feature-card-button";
      card.innerHTML = `
        <span class="feature-status ${escapeHtml(feature.status)}">${escapeHtml(feature.status)}</span>
        <strong>${escapeHtml(feature.name)}</strong>
        <small>Figma : ${escapeHtml(feature.figma)}</small>
        <p>${escapeHtml(feature.uxai)}</p>
      `;
      card.addEventListener("click", () => {
        els.localPrompt.value = `Ameliore ${feature.name} sur l'element selectionne, en respectant le front lock et le handoff LLM.`;
        applyLocalPrompt(state.selectedId, els.localPrompt.value);
        render();
      });
      els.figmaFeaturesPanel.appendChild(card);
    });
}

function renderAppBuilderPanel() {
  els.appBuilderPanel.innerHTML = "";

  appBuilderModules.forEach((module) => {
    const card = document.createElement("div");
    card.className = "builder-card";

    const chips = module.items
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");

    card.innerHTML = `
      <strong>${escapeHtml(module.name)}</strong>
      <p>${escapeHtml(module.description)}</p>
      <div class="builder-chips">${chips}</div>
    `;

    const action = document.createElement("button");
    action.type = "button";
    action.className = "tiny-button";
    action.textContent = state.activeMode === "build" ? "Configurer" : "Voir";
    action.addEventListener("click", () => {
      state.activeMode = "build";
      els.localPrompt.value = `Configure le module ${module.name} pour l'application, sans modifier la structure visuelle.`;
      render();
    });

    card.appendChild(action);
    els.appBuilderPanel.appendChild(card);
  });
}

function renderCanvas() {
  const root = state.project.nodes[state.project.rootId];
  els.canvas.innerHTML = "";
  els.canvas.appendChild(renderNode(root));
  renderContextToolbar();
}

function renderContextToolbar() {
  const node = getSelectedNode();

  if (node.id === "page") {
    els.contextToolbar.classList.add("hidden");
    els.contextToolbar.innerHTML = "";
    return;
  }

  els.contextToolbar.classList.remove("hidden");
  els.contextToolbar.classList.toggle("minimized", state.contextToolbarMinimized);
  els.contextToolbar.classList.toggle("floating", state.contextToolbarFloating);
  els.contextToolbar.innerHTML = "";

  if (state.contextToolbarMinimized) {
    const restore = document.createElement("button");
    restore.className = "context-button primary";
    restore.textContent = `Prompt : ${node.name}`;
    restore.addEventListener("click", () => {
      state.contextToolbarMinimized = false;
      state.contextToolbarFloating = false;
      state.contextToolbarPosition = null;
      render();
    });
    els.contextToolbar.appendChild(restore);
    requestAnimationFrame(() => positionContextToolbar(node));
    return;
  }

  const handle = document.createElement("span");
  handle.className = "context-handle";
  handle.textContent = state.contextToolbarFloating ? "Deplacer" : "Sous selection";
  handle.addEventListener("pointerdown", startToolbarDrag);

  const textValue = getPrimaryText(node);
  const textInput = document.createElement("input");
  textInput.className = "context-input";
  textInput.value = textValue;
  textInput.placeholder = "Texte de l'element";
  textInput.addEventListener("change", (event) => {
    setPrimaryText(node, event.target.value);
    render();
  });

  const promptButton = document.createElement("button");
  promptButton.className = "context-button primary";
  promptButton.textContent = "Prompt sur l'element";
  promptButton.addEventListener("click", () => {
    applyLocalPrompt(node.id, els.localPrompt.value);
    render();
  });

  const parentButton = document.createElement("button");
  parentButton.className = "context-button";
  parentButton.textContent = "Selection parent";
  parentButton.addEventListener("click", () => {
    state.selectedId = findParentId(node.id) || "page";
    render();
  });

  const floatButton = document.createElement("button");
  floatButton.className = "context-button";
  floatButton.textContent = state.contextToolbarFloating ? "Ancrer" : "Deplacer";
  floatButton.addEventListener("click", () => {
    state.contextToolbarFloating = !state.contextToolbarFloating;
    state.contextToolbarPosition = state.contextToolbarFloating ? getToolbarCurrentPosition() : null;
    render();
  });

  const minimizeButton = document.createElement("button");
  minimizeButton.className = "context-button";
  minimizeButton.textContent = "Reduire";
  minimizeButton.addEventListener("click", () => {
    state.contextToolbarMinimized = true;
    render();
  });

  els.contextToolbar.append(handle, textInput, promptButton, parentButton, floatButton, minimizeButton);
  requestAnimationFrame(() => positionContextToolbar(node));
}

function positionContextToolbar(node) {
  if (!els.contextToolbar || els.contextToolbar.classList.contains("hidden")) {
    return;
  }

  if (state.contextToolbarFloating && state.contextToolbarPosition) {
    els.contextToolbar.style.left = `${state.contextToolbarPosition.x}px`;
    els.contextToolbar.style.top = `${state.contextToolbarPosition.y}px`;
    return;
  }

  if (state.contextToolbarMinimized) {
    els.contextToolbar.style.top = "14px";
    els.contextToolbar.style.left = "";
    return;
  }

  const selectedEl = els.canvas.querySelector(`[data-node-id="${node.id}"]`);
  if (!selectedEl) {
    els.contextToolbar.style.left = "14px";
    els.contextToolbar.style.top = "14px";
    return;
  }

  const frameRect = els.deviceFrame.getBoundingClientRect();
  const nodeRect = selectedEl.getBoundingClientRect();
  const toolbarRect = els.contextToolbar.getBoundingClientRect();
  const maxLeft = Math.max(14, frameRect.width - toolbarRect.width - 14);
  const maxTop = Math.max(14, frameRect.height - toolbarRect.height - 14);
  const x = clamp(nodeRect.left - frameRect.left + nodeRect.width / 2 - toolbarRect.width / 2, 14, maxLeft);
  const y = clamp(nodeRect.bottom - frameRect.top + 10, 14, maxTop);

  els.contextToolbar.style.left = `${x}px`;
  els.contextToolbar.style.top = `${y}px`;
}

function startToolbarDrag(event) {
  if (!state.contextToolbarFloating) {
    state.contextToolbarFloating = true;
  }

  const start = getToolbarCurrentPosition();
  const pointerStart = { x: event.clientX, y: event.clientY };
  els.contextToolbar.setPointerCapture(event.pointerId);
  els.contextToolbar.classList.add("dragging");

  const onMove = (moveEvent) => {
    const frameRect = els.deviceFrame.getBoundingClientRect();
    const toolbarRect = els.contextToolbar.getBoundingClientRect();
    state.contextToolbarPosition = {
      x: clamp(start.x + moveEvent.clientX - pointerStart.x, 14, frameRect.width - toolbarRect.width - 14),
      y: clamp(start.y + moveEvent.clientY - pointerStart.y, 14, frameRect.height - toolbarRect.height - 14)
    };
    els.contextToolbar.style.left = `${state.contextToolbarPosition.x}px`;
    els.contextToolbar.style.top = `${state.contextToolbarPosition.y}px`;
  };

  const onUp = () => {
    els.contextToolbar.classList.remove("dragging");
    els.contextToolbar.removeEventListener("pointermove", onMove);
    els.contextToolbar.removeEventListener("pointerup", onUp);
  };

  els.contextToolbar.addEventListener("pointermove", onMove);
  els.contextToolbar.addEventListener("pointerup", onUp);
}

function getToolbarCurrentPosition() {
  const rect = els.contextToolbar.getBoundingClientRect();
  const frameRect = els.deviceFrame.getBoundingClientRect();
  return {
    x: rect.left - frameRect.left,
    y: rect.top - frameRect.top
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderNode(node) {
  switch (node.role) {
    case "page":
      return nodeWrapper(node, "div", "mock-page", node.children.map((id) => renderNode(getNode(id))));
    case "header":
      return renderHeader(node);
    case "hero":
      return nodeWrapper(node, "section", "mock-hero", node.children.map((id) => renderNode(getNode(id))));
    case "features":
      return nodeWrapper(node, "section", "mock-features", node.children.map((id) => renderNode(getNode(id))));
    case "footer":
      return nodeWrapper(node, "footer", "mock-footer", [
        textNode("span", "UXai prototype"),
        textNode("span", "Front locked. Logic later.")
      ]);
    case "copy":
      return renderHeroCopy(node);
    case "preview":
      return renderPreview(node);
    case "card":
      return renderCard(node);
    case "brand":
      return nodeWrapper(node, "div", "brand", [
        textNode("span", "U", "brand-mark"),
        textNode("span", node.text)
      ]);
    case "nav":
      return nodeWrapper(node, "nav", "mock-nav", node.children.map((id) => renderNode(getNode(id))));
    case "nav-link":
      return nodeWrapper(node, "a", "nav-link-node", [document.createTextNode(node.text)]);
    case "button":
      return renderButton(node);
    default:
      return nodeWrapper(node, "div", "", [textNode("span", node.name)]);
  }
}

function renderHeader(node) {
  return nodeWrapper(node, "header", "mock-header", node.children.map((id) => renderNode(getNode(id))));
}

function renderHeroCopy(node) {
  const wrap = nodeWrapper(node, "div", "hero-copy", []);
  const title = document.createElement("h2");
  title.textContent = node.title;
  const body = document.createElement("p");
  body.textContent = node.body;
  const actions = document.createElement("div");
  actions.className = "hero-actions";
  node.children.forEach((id) => actions.appendChild(renderNode(getNode(id))));
  wrap.append(title, body, actions);
  return wrap;
}

function renderPreview(node) {
  const cards = [
    ["uxai.project.json", "Source de verite structuree"],
    ["UI_LOCK_CONTRACT.md", "Regles pour figer le front"],
    ["SECURITY_NOTES.md", "Risques et validations attendues"]
  ];

  const windowNode = document.createElement("div");
  windowNode.className = "mini-window";

  const dots = document.createElement("div");
  dots.className = "mini-dots";
  dots.append(textNode("span", ""), textNode("span", ""), textNode("span", ""));
  windowNode.appendChild(dots);

  cards.forEach(([title, body]) => {
    const card = document.createElement("div");
    card.className = "mini-card";
    card.append(textNode("strong", title), textNode("span", body));
    windowNode.appendChild(card);
  });

  return nodeWrapper(node, "div", "mock-preview", [windowNode]);
}

function renderCard(node) {
  const card = nodeWrapper(node, "article", "feature-card", []);
  const title = document.createElement("h3");
  title.textContent = node.title;
  const body = document.createElement("p");
  body.textContent = node.body;
  card.append(title, body);
  return card;
}

function renderButton(node) {
  const classes = node.variant === "secondary" ? "mock-button secondary" : "mock-button";
  return nodeWrapper(node, "button", classes, [document.createTextNode(node.text)]);
}

function nodeWrapper(node, tag, className, children) {
  const el = document.createElement(tag);
  el.className = `ui-node ${className || ""}`.trim();
  el.dataset.nodeId = node.id;
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", `Selectionner ${node.name}`);
  applyNodeStyle(el, node);

  if (node.id === state.selectedId) {
    el.classList.add("selected");
  }

  el.addEventListener("click", (event) => {
    event.stopPropagation();
    state.selectedId = node.id;
    render();
  });

  el.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    const firstChild = node.children && node.children[0];
    state.selectedId = firstChild || node.id;
    render();
  });

  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      state.selectedId = node.id;
      render();
    }
  });

  children.forEach((child) => el.appendChild(child));
  return el;
}

function applyNodeStyle(el, node) {
  const style = node.style || {};

  if (style.background) {
    el.style.background = style.background;
  }

  if (Number.isFinite(style.radius) && style.radius > 0) {
    el.style.borderRadius = `${style.radius}px`;
  }

  if (Number.isFinite(style.borderWidth) && style.borderWidth > 0) {
    el.style.borderWidth = `${style.borderWidth}px`;
    el.style.borderStyle = style.borderStyle || "solid";
    el.style.borderColor = style.borderColor || "rgba(28,40,64,0.16)";
  }

  const shadow = buildShadow(style);
  if (shadow) {
    el.style.boxShadow = shadow;
  }

  if (style.blur) {
    const blurAmount = Number.isFinite(style.backdropBlur) ? style.backdropBlur : 18;
    el.style.backdropFilter = `blur(${blurAmount}px)`;
  }

  if (style.animation && style.animation !== "none") {
    el.style.animation = "fadeIn 260ms ease both";
  }

  if (Number.isFinite(style.width) && style.width > 0) {
    el.style.width = `${style.width}px`;
  }

  if (Number.isFinite(style.height) && style.height > 0) {
    el.style.minHeight = `${style.height}px`;
  }
}

function buildShadow(style) {
  if (style.shadow === "none" || style.shadow === undefined) {
    return "";
  }

  if (style.shadow === "soft" && style.shadowX === undefined) {
    return "0 16px 38px rgba(22,31,50,0.08)";
  }

  if (style.shadow === "strong" && style.shadowX === undefined) {
    return "0 26px 70px rgba(22,31,50,0.18)";
  }

  const inset = style.shadowMode === "inset" ? "inset " : "";
  const x = Number(style.shadowX || 0);
  const y = Number(style.shadowY || 18);
  const blur = Number(style.shadowBlur || 42);
  const spread = Number(style.shadowSpread || 0);
  const color = style.shadowColor || "rgba(22,31,50,0.16)";
  return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

function textNode(tag, text, className) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) {
    el.className = className;
  }
  return el;
}

function buttonNode(text, className) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = text;
  return button;
}

function renderLayers() {
  els.layersTree.innerHTML = "";
  const root = getNode(state.project.rootId);
  els.layersTree.appendChild(renderLayerRow(root, 0));
  renderLayerChildren(root, 1, els.layersTree);
}

function renderLayerChildren(node, depth, parent) {
  if (!state.expandedNodeIds.has(node.id)) {
    return;
  }

  node.children.forEach((id) => {
    const child = getNode(id);
    parent.appendChild(renderLayerRow(child, depth));
    if (child.children.length && state.expandedNodeIds.has(child.id)) {
      renderLayerChildren(child, depth + 1, parent);
    }
  });
}

function renderLayerRow(node, depth) {
  const row = document.createElement("div");
  row.className = `layer-row ${node.id === state.selectedId ? "selected" : ""}`;
  row.draggable = node.id !== state.project.rootId;
  row.dataset.nodeId = node.id;
  row.style.paddingLeft = `${9 + depth * 18}px`;
  row.addEventListener("click", () => {
    state.selectedId = node.id;
    render();
  });
  row.addEventListener("dblclick", () => {
    toggleExpanded(node.id);
    render();
  });
  row.addEventListener("dragstart", (event) => {
    state.draggedNodeId = node.id;
    event.dataTransfer.setData("text/plain", node.id);
    event.dataTransfer.effectAllowed = "move";
  });
  row.addEventListener("dragover", (event) => {
    event.preventDefault();
    row.classList.add("drag-over");
  });
  row.addEventListener("dragleave", () => {
    row.classList.remove("drag-over");
  });
  row.addEventListener("drop", (event) => {
    event.preventDefault();
    row.classList.remove("drag-over");
    const draggedId = event.dataTransfer.getData("text/plain") || state.draggedNodeId;
    moveNode(draggedId, node.id);
    state.draggedNodeId = null;
    render();
  });

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = `layer-toggle ${node.children.length ? "" : "empty"}`;
  toggle.textContent = node.children.length ? (state.expandedNodeIds.has(node.id) ? "v" : ">") : "-";
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleExpanded(node.id);
    render();
  });

  const icon = document.createElement("span");
  icon.className = "layer-icon";
  icon.textContent = node.role.slice(0, 1).toUpperCase();

  const label = document.createElement("span");
  label.textContent = node.name;

  row.append(toggle, icon, label);
  return row;
}

function toggleExpanded(id) {
  if (!getNode(id)?.children.length) {
    return;
  }

  if (state.expandedNodeIds.has(id)) {
    state.expandedNodeIds.delete(id);
  } else {
    state.expandedNodeIds.add(id);
  }
}

function moveNode(draggedId, targetId) {
  if (!draggedId || draggedId === targetId || draggedId === state.project.rootId) {
    return;
  }

  if (isDescendant(targetId, draggedId)) {
    return;
  }

  const draggedParentId = findParentId(draggedId);
  const targetParentId = findParentId(targetId);

  if (!draggedParentId) {
    return;
  }

  const draggedParent = getNode(draggedParentId);
  draggedParent.children = draggedParent.children.filter((id) => id !== draggedId);

  const target = getNode(targetId);
  const acceptsChildren = ["page", "section", "header", "hero", "features", "nav", "copy"].includes(target.role);

  if (acceptsChildren) {
    target.children.push(draggedId);
  } else if (targetParentId) {
    const targetParent = getNode(targetParentId);
    const index = targetParent.children.indexOf(targetId);
    targetParent.children.splice(index + 1, 0, draggedId);
  } else {
    getNode(state.project.rootId).children.push(draggedId);
  }

  state.selectedId = draggedId;
}

function renderProperties() {
  const node = getSelectedNode();
  els.selectedPill.textContent = `Selection : ${node.name}`;
  els.nodeTypeBadge.textContent = node.role;
  els.propertiesPanel.innerHTML = "";

  const identity = group("Identite", [
    input("Nom", node.name, (value) => {
      node.name = value;
      render();
    }),
    input("Role", node.role, (value) => {
      node.role = value || node.role;
      render();
    })
  ]);

  const textControls = group("Texte rapide", [
    input("Texte principal", getPrimaryText(node), (value) => {
      setPrimaryText(node, value);
      render();
    })
  ]);

  const visual = group("Style general", [
    input("Background", node.style.background || "", (value) => {
      node.style.background = value;
      render();
    }),
    input("Radius", node.style.radius || 0, (value) => {
      node.style.radius = Number(value) || 0;
      render();
    }, "number"),
    select("Shadow", node.style.shadow || "none", ["none", "soft", "strong", "custom"], (value) => {
      node.style.shadow = value;
      render();
    }),
    input("Width px", node.style.width || 0, (value) => {
      node.style.width = Number(value) || 0;
      render();
    }, "number"),
    input("Height px", node.style.height || 0, (value) => {
      node.style.height = Number(value) || 0;
      render();
    }, "number"),
    select("Animation", node.style.animation || "none", ["none", "fade-up", "stagger", "sticky fade"], (value) => {
      node.style.animation = value;
      render();
    }),
    checkbox("Backdrop blur", Boolean(node.style.blur), (value) => {
      node.style.blur = value;
      render();
    })
  ]);

  const shadow = group("Shadow CSS", [
    select("Mode", node.style.shadowMode || "outset", ["outset", "inset"], (value) => {
      node.style.shadow = "custom";
      node.style.shadowMode = value;
      render();
    }),
    input("X", node.style.shadowX || 0, (value) => {
      node.style.shadow = "custom";
      node.style.shadowX = Number(value) || 0;
      render();
    }, "number"),
    input("Y", node.style.shadowY || 18, (value) => {
      node.style.shadow = "custom";
      node.style.shadowY = Number(value) || 0;
      render();
    }, "number"),
    input("Blur", node.style.shadowBlur || 42, (value) => {
      node.style.shadow = "custom";
      node.style.shadowBlur = Number(value) || 0;
      render();
    }, "number"),
    input("Spread", node.style.shadowSpread || 0, (value) => {
      node.style.shadow = "custom";
      node.style.shadowSpread = Number(value) || 0;
      render();
    }, "number"),
    input("Couleur", node.style.shadowColor || "rgba(22,31,50,0.16)", (value) => {
      node.style.shadow = "custom";
      node.style.shadowColor = value;
      render();
    })
  ]);

  const border = group("Border et blur", [
    input("Border width", node.style.borderWidth || 0, (value) => {
      node.style.borderWidth = Number(value) || 0;
      render();
    }, "number"),
    select("Border style", node.style.borderStyle || "solid", ["solid", "dashed", "dotted", "double"], (value) => {
      node.style.borderStyle = value;
      render();
    }),
    input("Border color", node.style.borderColor || "rgba(28,40,64,0.16)", (value) => {
      node.style.borderColor = value;
      render();
    }),
    input("Backdrop blur px", node.style.backdropBlur || 18, (value) => {
      node.style.blur = true;
      node.style.backdropBlur = Number(value) || 0;
      render();
    }, "number")
  ]);

  const technical = group("Contrat LLM", [
    readonly("Component", toComponentName(node.name)),
    readonly("Editable by final LLM", "No, visual layer locked"),
    readonly("Logic entry", `${toComponentName(node.name)}Logic`)
  ]);

  els.propertiesPanel.append(identity, textControls, visual, shadow, border, technical);
}

function group(title, children) {
  const wrap = document.createElement("div");
  wrap.className = "property-group";
  wrap.classList.toggle("collapsed", state.collapsedPropertyGroups.has(title));

  const heading = document.createElement("button");
  heading.type = "button";
  heading.className = "property-title";
  heading.innerHTML = `<span>${escapeHtml(title)}</span><span>${state.collapsedPropertyGroups.has(title) ? "+" : "-"}</span>`;
  heading.addEventListener("click", () => {
    if (state.collapsedPropertyGroups.has(title)) {
      state.collapsedPropertyGroups.delete(title);
    } else {
      state.collapsedPropertyGroups.add(title);
    }
    render();
  });

  const body = document.createElement("div");
  body.className = "property-body";
  children.forEach((child) => body.appendChild(child));
  wrap.append(heading, body);
  return wrap;
}

function input(label, value, onChange, type = "text") {
  const wrap = document.createElement("div");
  wrap.className = "property-group";
  const inputLabel = document.createElement("label");
  inputLabel.textContent = label;
  const field = document.createElement("input");
  field.className = "field";
  field.type = type;
  field.value = value;
  field.addEventListener("change", (event) => onChange(event.target.value));
  wrap.append(inputLabel, field);
  return wrap;
}

function select(label, value, options, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "property-group";
  const inputLabel = document.createElement("label");
  inputLabel.textContent = label;
  const field = document.createElement("select");
  field.className = "field";
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    field.appendChild(option);
  });
  field.value = value;
  field.addEventListener("change", (event) => onChange(event.target.value));
  wrap.append(inputLabel, field);
  return wrap;
}

function checkbox(label, checked, onChange) {
  const wrap = document.createElement("label");
  wrap.className = "check-row";
  const field = document.createElement("input");
  field.type = "checkbox";
  field.checked = checked;
  field.addEventListener("change", (event) => onChange(event.target.checked));
  wrap.append(field, document.createTextNode(label));
  return wrap;
}

function readonly(label, value) {
  const wrap = document.createElement("div");
  wrap.className = "audit-item";
  wrap.innerHTML = `<strong>${escapeHtml(label)}</strong><p>${escapeHtml(value)}</p>`;
  return wrap;
}

function renderAudits() {
  const node = getSelectedNode();
  const device = getCurrentDevice();
  const audits = buildAudits(node, device);

  els.auditPanel.innerHTML = "";
  audits.forEach((audit) => {
    const item = document.createElement("div");
    item.className = "audit-item";
    item.innerHTML = `<strong>${escapeHtml(audit.title)}<span class="status ${audit.level}">${escapeHtml(audit.level)}</span></strong><p>${escapeHtml(audit.body)}</p>`;
    els.auditPanel.appendChild(item);
  });
}

function buildAudits(node, device) {
  const base = [
    {
      level: device.frameClass === "phone" ? "warn" : "good",
      title: "Accessibilite",
      body: device.frameClass === "phone"
        ? "Verifier les touch targets, le contraste et les safe areas avant export."
        : "Contraste, focus visible et structure semantique prevus dans le handoff."
    },
    {
      level: "warn",
      title: "Performance",
      body: "Prevoir lazy loading images, limitation des animations et split par page."
    },
    {
      level: node.role === "button" || node.role === "nav" ? "warn" : "good",
      title: "Securite",
      body: node.role === "button" || node.role === "nav"
        ? "Cette interaction devra declarer routing, permissions, rate limiting ou validation selon la feature."
        : "Aucun risque direct detecte sur ce bloc visuel, mais les donnees restent a specifier."
    }
  ];

  if (device.surface === "spatial-2d-panel") {
    base.push({
      level: "warn",
      title: "Meta Quest 2D",
      body: "Augmenter taille des textes, focus states et distances de lecture pour Unity World Space Canvas."
    });
  }

  return base;
}

function regenerateProjectFromPrompt(prompt) {
  const copy = getNode("heroCopy");
  const lowered = prompt.toLowerCase();

  if (lowered.includes("dashboard")) {
    copy.title = "Structurez un dashboard avant de brancher les donnees.";
    copy.body = "UXai documente les cards, etats, permissions et exports pour un LLM developpeur.";
  } else if (lowered.includes("quest") || lowered.includes("vr")) {
    copy.title = "Preparez une UI 2D lisible pour Meta Quest.";
    copy.body = "Le modele cible les panels spatiaux, les grands textes et les interactions controller ou hand tracking.";
    state.currentDeviceId = "quest";
  } else {
    copy.title = "Concevez un front stable avant de le donner a un LLM.";
    copy.body = "UXai transforme une intention produit en UI editable, documentee et prete pour l'implementation logique.";
  }

  getNode("header").style.shadow = "soft";
  getNode("header").style.blur = true;
  getNode("feature1").style.shadow = "strong";
}

function applyLocalPrompt(id, prompt) {
  const node = getNode(id);
  const lowered = prompt.toLowerCase();

  if (node.role === "nav") {
    const labels = lowered.includes("simple")
      ? ["Produit", "Tarifs", "Docs"]
      : ["Produit", "Templates", "Audits", "Handoff", "Roadmap"];
    replaceNavLinks(labels);
    return;
  }

  if (node.role === "nav-link") {
    node.text = lowered.includes("court") ? "Docs" : "Lien optimise";
    Object.assign(node.style, {
      background: "rgba(111,92,255,0.12)",
      radius: 999,
      shadow: "custom",
      shadowMode: "inset",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 1,
      shadowColor: "rgba(111,92,255,0.2)"
    });
    return;
  }

  if (node.role === "header") {
    Object.assign(node.style, {
      background: "rgba(255,255,255,0.86)",
      shadow: "strong",
      blur: true,
      animation: "sticky fade"
    });
    getNode("headerCta").text = "Verrouiller l'UI";
    return;
  }

  if (node.role === "hero" || node.role === "copy") {
    const copy = node.role === "copy" ? node : getNode("heroCopy");
    copy.title = "Un front verrouille, une logique branchee ensuite.";
    copy.body = "Selectionnez, re-promptez, ajustez et exportez un contrat que le LLM final doit respecter.";
    return;
  }

  if (node.role === "card") {
    Object.assign(node.style, {
      radius: 34,
      shadow: "strong",
      background: "rgba(255,255,255,0.84)",
      blur: true,
      animation: "fade-up"
    });
    node.body = "Bloc enrichi par prompt local : style premium, role documente, logique separee.";
    return;
  }

  Object.assign(node.style, {
    shadow: "strong",
    blur: true,
    animation: "fade-up"
  });
}

function renderExports() {
  if (!els.exportDrawer || els.exportDrawer.classList.contains("hidden")) {
    return;
  }

  const exports = buildExports();
  els.exportTabs.innerHTML = "";

  Object.keys(exports).forEach((key) => {
    const tab = document.createElement("button");
    tab.className = `export-tab ${state.activeExport === key ? "active" : ""}`;
    tab.textContent = exports[key].name;
    tab.addEventListener("click", () => {
      state.activeExport = key;
      renderExports();
    });
    els.exportTabs.appendChild(tab);
  });

  els.exportContent.textContent = exports[state.activeExport].content;
}

function buildExports() {
  const projectJson = {
    ...state.project,
    cdc: {
      file: "CDC.md",
      purpose: "Cahier des charges fonctionnel Figma x UXai"
    },
    editorModel: {
      modes: editorModes,
      frames,
      designAssets,
      figmaUxaiFeatures,
      appBuilderModules
    },
    selectedDevice: getCurrentDevice(),
    handoff: {
      frontLocked: true,
      finalLlmAllowedWork: [
        "state management",
        "routing",
        "api calls",
        "validation",
        "auth",
        "permissions",
        "business logic"
      ],
      finalLlmForbiddenWork: [
        "redesign layout",
        "change spacing",
        "change colors",
        "rename visual components without reason",
        "remove accessibility attributes"
      ]
    }
  };

  return {
    project: {
      name: "uxai.project.json",
      content: JSON.stringify(projectJson, null, 2)
    },
    cdc: {
      name: "CDC.md",
      content: `# CDC summary

UXai reprend les forces de Figma pour les adapter a un outil de conception LLM-ready.

Modules prioritaires:
- pages, frames et surfaces
- calques et hierarchie
- composants reutilisables
- variants et etats UI
- auto layout web
- styles et design tokens
- prototype links
- commentaires
- inspect / dev mode
- application builder

Difference UXai:
- le front devient un contrat visuel
- les routes, donnees, etats et permissions sont configures avant le LLM final
- les audits accessibilite, performance et securite sont exportes
- le LLM final recoit des garde-fous explicites`
    },
    lock: {
      name: "UI_LOCK_CONTRACT.md",
      content: `# UI Lock Contract

The visual UI is locked.

Do not change:
- layout
- spacing
- colors
- typography
- hierarchy
- animations
- accessibility attributes

Allowed work:
- add state management
- add routing
- add API calls
- add validation
- add auth and permissions
- connect existing UI slots to real data

If a UI change is required, explain why first and propose the smallest possible change.`
    },
    implementation: {
      name: "IMPLEMENTATION_GUIDE.md",
      content: `# Implementation Guide

Target: ${state.project.meta.targetPlatform.framework}
Surface: ${getCurrentDevice().surface}

Suggested architecture:
- components/view: visual components generated by UXai
- components/logic: hooks and handlers added by the final LLM
- routes: page routing
- schemas: validation and data contracts
- docs: product, accessibility, performance and security notes

Configured UXai modules:
- editor mode: ${state.activeMode}
- frames: ${frames.map((frame) => `${frame.name} (${frame.route})`).join(", ")}
- app modules: ${appBuilderModules.map((module) => module.name).join(", ")}
- design assets: ${designAssets.map((asset) => asset.name).join(", ")}

Current selected node:
- name: ${getSelectedNode().name}
- role: ${getSelectedNode().role}
- component: ${toComponentName(getSelectedNode().name)}

Implementation order:
1. Wire routes.
2. Add state management.
3. Connect forms and buttons.
4. Add validation schemas.
5. Connect APIs.
6. Add security checks.
7. Run accessibility and performance checks.`
    },
    security: {
      name: "SECURITY_NOTES.md",
      content: `# Security Notes

Detected concerns to keep in the implementation prompt:

- Never expose API keys in client code.
- Validate every form server-side.
- Escape user-generated content.
- Add auth checks before protected routes.
- Add RBAC for admin actions.
- Avoid storing sensitive tokens in localStorage.
- Add rate limiting on auth and submission endpoints.
- Document personal data fields for GDPR review.

Selected interaction risk:
- Node: ${getSelectedNode().name}
- Role: ${getSelectedNode().role}
- Risk: ${getSelectedNode().role === "button" || getSelectedNode().role === "nav" ? "requires explicit action contract" : "visual only for now"}`
    }
  };
}

function getNode(id) {
  return state.project.nodes[id];
}

function replaceNavLinks(labels) {
  const nav = getNode("nav");
  nav.children.forEach((id) => {
    delete state.project.nodes[id];
  });

  nav.children = labels.map((label, index) => {
    const id = `navLink${Date.now()}${index}`;
    state.project.nodes[id] = {
      id,
      name: `Lien ${label}`,
      type: "component",
      role: "nav-link",
      children: [],
      text: label,
      style: {}
    };
    return id;
  });
}

function getSelectedNode() {
  return getNode(state.selectedId) || getNode(state.project.rootId);
}

function findParentId(childId) {
  return Object.values(state.project.nodes).find((node) => node.children.includes(childId))?.id || null;
}

function isDescendant(candidateId, parentId) {
  const parent = getNode(parentId);
  if (!parent) {
    return false;
  }

  if (parent.children.includes(candidateId)) {
    return true;
  }

  return parent.children.some((childId) => isDescendant(candidateId, childId));
}

function getPrimaryText(node) {
  if (typeof node.text === "string") {
    return node.text;
  }

  if (typeof node.title === "string") {
    return node.title;
  }

  if (typeof node.body === "string") {
    return node.body;
  }

  return node.name;
}

function setPrimaryText(node, value) {
  if (typeof node.text === "string") {
    node.text = value;
    return;
  }

  if (typeof node.title === "string") {
    node.title = value;
    return;
  }

  if (typeof node.body === "string") {
    node.body = value;
    return;
  }

  node.name = value;
}

function getCurrentDevice() {
  return devices.find((device) => device.id === state.currentDeviceId) || devices[0];
}

function toComponentName(name) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0.82; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

init();
