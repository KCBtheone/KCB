for (const thumbnail of document.querySelectorAll(".paper-thumbnail")) {
  const preview = document.getElementById(thumbnail.getAttribute("popovertarget"));
  let dismissTimer;

  thumbnail.addEventListener("pointerenter", (event) => {
    clearTimeout(dismissTimer);
    if (event.pointerType !== "mouse" || preview.matches(":popover-open")) return;

    const bounds = thumbnail.getBoundingClientRect();
    const margin = 12;
    const availableWidth = document.documentElement.clientWidth - bounds.right - margin;
    preview.style.setProperty("--preview-left", `${bounds.right}px`);
    preview.style.setProperty("--preview-width", `${Math.min(960, availableWidth)}px`);
    preview.classList.add("is-hovered");
    preview.showPopover({ source: thumbnail });

    const height = preview.offsetHeight;
    const centeredTop = bounds.top + (bounds.height - height) / 2;
    const top = Math.max(margin, Math.min(centeredTop, window.innerHeight - height - margin));
    preview.style.setProperty("--preview-top", `${top}px`);
  });

  function dismissAfterPointerExit(event) {
    if (event.pointerType !== "mouse" || !preview.classList.contains("is-hovered")) return;
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => preview.hidePopover(), 120);
  }

  thumbnail.addEventListener("pointerleave", dismissAfterPointerExit);
  preview.addEventListener("pointerleave", dismissAfterPointerExit);
  preview.addEventListener("pointerenter", () => clearTimeout(dismissTimer));

  thumbnail.addEventListener("click", (event) => {
    if (!preview.classList.contains("is-hovered")) return;
    event.preventDefault();
    clearTimeout(dismissTimer);
    preview.classList.remove("is-hovered");
  });

  preview.addEventListener("beforetoggle", (event) => {
    if (event.newState !== "closed") return;
    clearTimeout(dismissTimer);
    preview.classList.remove("is-hovered");
  });
}
