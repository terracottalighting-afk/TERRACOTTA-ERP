(() => {
  function readLines(form) {
    const hidden = form.querySelector("[data-order-lines]");
    if (!hidden) return [];
    try {
      return JSON.parse(hidden.value || "[]");
    } catch {
      return [];
    }
  }

  function renderSelectedLines(form, partIndex) {
    const container = form.querySelector("[data-native-order-lines]");
    if (!container) return;
    const lines = readLines(form);
    container.replaceChildren();
    if (lines.length === 0) {
      updateSubtotal(form, lines);
      return;
    }

    const heading = document.createElement("p");
    heading.className = "part-picker-label";
    heading.textContent = "Selected Order Items";
    container.append(heading);
    const list = document.createElement("div");
    list.className = "native-order-line-list";
    lines.forEach((line) => {
      const part = partIndex.get(line.productId);
      if (!part) return;
      const row = document.createElement("div");
      row.className = "native-order-line";
      const name = document.createElement("div");
      name.className = "native-order-line__name";
      name.textContent = `${part.sku} | ${part.name}`;
      const controls = document.createElement("div");
      controls.className = "native-order-line__controls";

      const makeNumberControl = (labelText, value, step, min, onChange) => {
        const label = document.createElement("label");
        label.textContent = labelText;
        const input = document.createElement("input");
        input.type = "number";
        input.min = String(min);
        input.step = step;
        input.value = String(value);
        const syncValue = () => onChange(input.value);
        input.addEventListener("input", syncValue);
        input.addEventListener("change", syncValue);
        label.append(input);
        return label;
      };

      controls.append(
        makeNumberControl("Qty", line.quantity, "1", 1, (value) => {
          line.quantity = Math.max(1, Math.round(Number(value) || 1));
          updateLines(form, lines, partIndex);
        }),
        makeNumberControl("Unit Price", line.unitPrice, "0.01", 0, (value) => {
          line.unitPrice = Math.max(0, Number(value) || 0);
          updateLines(form, lines, partIndex);
        }),
        makeNumberControl("Discount %", line.discountPercent, "0.01", 0, (value) => {
          line.discountPercent = Math.max(0, Number(value) || 0);
          updateLines(form, lines, partIndex);
        })
      );
      const remove = document.createElement("button");
      remove.className = "icon-text-action";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        const remaining = lines.filter((item) => item.productId !== line.productId);
        updateLines(form, remaining, partIndex);
      });
      controls.append(remove);
      row.append(name, controls);
      list.append(row);
    });
    container.append(list);
    updateSubtotal(form, lines);
  }

  function updateSubtotal(form, lines) {
    const target = form.querySelector("[data-native-order-subtotal]");
    if (!target) return;
    const subtotal = lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0) * (1 - Number(line.discountPercent || 0) / 100), 0);
    target.textContent = `$${subtotal.toFixed(2)}`;
  }

  function updateLines(form, lines, partIndex) {
    const hidden = form.querySelector("[data-order-lines]");
    if (!hidden) return;
    hidden.value = JSON.stringify(lines);
    renderSelectedLines(form, partIndex);
  }

  function addItemToOrder(form, part, partIndex) {
    const hidden = form.querySelector("[data-order-lines]");
    if (!hidden) return;
    const lines = readLines(form);
    const existing = lines.find((line) => line.productId === part.id);
    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
      lines.push({
        discountPercent: Number(form.dataset.defaultDiscount || 0),
        productId: part.id,
        quantity: 1,
        unitPrice: Number(part.defaultPrice || 0)
      });
    }
    updateLines(form, lines, partIndex);
  }

  function getItemIndex(form, items) {
    const index = form.__erpOrderItemIndex || new Map();
    items.forEach((item) => index.set(item.id, item));
    form.__erpOrderItemIndex = index;
    return index;
  }

  function initializeProductPicker(picker) {
    if (picker.dataset.orderPickerInitialized) return;
    picker.dataset.orderPickerInitialized = "true";
    const form = picker.closest("form");
    const searchInput = picker.querySelector('input[name="product_search"]');
    const results = picker.querySelector("[data-product-results]");
    const empty = picker.querySelector("[data-product-empty]");
    if (!form || !searchInput || !results || !empty) return;

    let products = [];
    let parts = [];
    try {
      products = JSON.parse(picker.dataset.products || "[]");
      parts = JSON.parse(picker.dataset.partOptions || "[]");
    } catch {
      return;
    }
    const itemIndex = getItemIndex(form, [...products, ...parts]);

    const showProducts = () => {
      results.replaceChildren();
      empty.textContent = "";
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;
      const matches = products.filter((product) => product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query)).slice(0, 8);
      if (matches.length === 0) {
        empty.textContent = "No active, sellable products match this search.";
        return;
      }
      matches.forEach((product) => {
        const button = document.createElement("button");
        button.type = "button";
        const title = document.createElement("span");
        const sku = document.createElement("strong");
        sku.textContent = product.sku;
        title.append(sku, ` ${product.name}`);
        const details = document.createElement("span");
        details.textContent = `${product.brandName} | ${product.inventory} available | $${Number(product.defaultPrice || 0).toFixed(2)}`;
        button.append(title, details);
        button.addEventListener("click", () => addItemToOrder(form, product, itemIndex));
        results.append(button);
      });
    };

    const addSelectedProduct = () => {
      const selectedValue = searchInput.value.trim().toLowerCase();
      const selectedProduct = products.find((product) => product.sku.toLowerCase() === selectedValue || product.name.toLowerCase() === selectedValue);
      if (!selectedProduct) {
        showProducts();
        return;
      }
      addItemToOrder(form, selectedProduct, itemIndex);
      searchInput.value = "";
      showProducts();
    };

    searchInput.addEventListener("input", showProducts);
    searchInput.addEventListener("change", addSelectedProduct);
    renderSelectedLines(form, itemIndex);
    showProducts();
  }

  function renderChildParts(form, panel, parts, partIndex) {
    panel.replaceChildren();

    const heading = document.createElement("span");
    heading.className = "part-picker-label";
    heading.textContent = "Child Parts";
    panel.append(heading);

    if (parts.length === 0) {
      const note = document.createElement("p");
      note.className = "fieldset-note";
      note.textContent = "Pick a parent product to display its child parts.";
      panel.append(note);
      return;
    }

    const list = document.createElement("div");
    list.className = "order-product-results";
    parts.forEach((part) => {
      const button = document.createElement("button");
      button.type = "button";
      const title = document.createElement("span");
      const sku = document.createElement("strong");
      sku.textContent = part.sku;
      title.append(sku, ` ${part.name}`);
      const details = document.createElement("span");
      details.textContent = `${part.parentRoles?.join(", ") || "Part"} | ${part.inventory} available | $${Number(part.defaultPrice || 0).toFixed(2)}`;
      button.append(title, details);
      button.addEventListener("click", () => addItemToOrder(form, part, partIndex));
      list.append(button);
    });
    panel.append(list);
  }

  function initializePartPicker(picker) {
    if (picker.dataset.orderPickerInitialized) return;
    picker.dataset.orderPickerInitialized = "true";
    const form = picker.closest("form");
    const parentInput = picker.querySelector('input[name="parent_part_search"]');
    const genericInput = form?.querySelector('input[name="generic_part_search"]');
    const genericResults = form?.querySelector("[data-generic-part-results]");
    const genericEmpty = form?.querySelector("[data-generic-part-empty]");
    const childPanel = picker.querySelector("[data-child-parts]");
    const partsToggle = form?.querySelector('input[name="search_parts"]');
    const genericToggle = form?.querySelector('input[name="search_generic_part"]');
    if (!form || !parentInput || !genericInput || !genericResults || !genericEmpty || !childPanel || !partsToggle || !genericToggle) return;

    let parents = [];
    let parts = [];
    try {
      parents = JSON.parse(picker.dataset.parentProducts || "[]");
      parts = JSON.parse(picker.dataset.partOptions || "[]");
    } catch {
      return;
    }
    const partIndex = getItemIndex(form, parts);

    const showMatchingParts = () => {
      if (!partsToggle.checked || genericToggle.checked) return;
      const query = parentInput.value.trim().toLowerCase();
      const parent = parents.find((item) => item.sku.toLowerCase() === query || item.name.toLowerCase() === query);
      renderChildParts(form, childPanel, parent ? parts.filter((part) => part.parentProductIds?.includes(parent.id)) : [], partIndex);
    };

    const showGenericParts = () => {
      genericResults.replaceChildren();
      genericEmpty.textContent = "";
      if (!partsToggle.checked || !genericToggle.checked) return;
      const query = genericInput.value.trim().toLowerCase();
      if (!query) return;
      const matches = parts.filter((part) => part.parentProductIds?.length === 0 && (part.sku.toLowerCase().includes(query) || part.name.toLowerCase().includes(query)));
      if (matches.length === 0) {
        genericEmpty.textContent = "No generic parts match this search.";
        return;
      }
      matches.slice(0, 8).forEach((part) => {
        const button = document.createElement("button");
        button.type = "button";
        const title = document.createElement("span");
        const sku = document.createElement("strong");
        sku.textContent = part.sku;
        title.append(sku, ` ${part.name}`);
        const details = document.createElement("span");
        details.textContent = `Generic | ${part.inventory} available | $${Number(part.defaultPrice || 0).toFixed(2)}`;
        button.append(title, details);
        button.addEventListener("click", () => addItemToOrder(form, part, partIndex));
        genericResults.append(button);
      });
    };

    parentInput.addEventListener("input", showMatchingParts);
    parentInput.addEventListener("change", showMatchingParts);
    parentInput.addEventListener("blur", showMatchingParts);
    partsToggle.addEventListener("change", showMatchingParts);
    genericToggle.addEventListener("change", showMatchingParts);
    genericToggle.addEventListener("change", showGenericParts);
    genericInput.addEventListener("input", showGenericParts);
    genericInput.addEventListener("change", showGenericParts);
    renderSelectedLines(form, partIndex);
    showMatchingParts();
    showGenericParts();
  }

  function initialize() {
    document.querySelectorAll("[data-order-product-picker]").forEach(initializeProductPicker);
    document.querySelectorAll("[data-order-part-picker]").forEach(initializePartPicker);
  }

  window.initializeOrderEntryParts = initialize;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
