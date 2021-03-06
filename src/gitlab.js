import {
  $,
  $$,
  CLASS_EXTENDER_ON,
  EXPAND_SVG,
  COMPRESS_SVG,
  linearBackoff,
} from "./board_extender.js";

window.onload = async () => {
  const anchorSelector = "h3.board-title";

  const gitlab = {
    expanderSelector: "button",
    insertExpander: (anchor, expander) => anchor.appendChild(expander),
    cardMinWidth: "374px",
  };

  let isReady = await linearBackoff(() => $$(anchorSelector).length);

  if (!isReady) {
    return;
  }

  let anchors = $$(anchorSelector);

  anchors.forEach((anchor) => {
    let canvas = document.createElement("div");

    canvas.innerHTML = `<button class="btn issue-count-badge-add-button no-drag btn-default btn-md btn-icon gl-button has-tooltip ml-1" type="button" style="padding: 8px!important;">
      <span style="width: 16px; height: 16px;">
        ${EXPAND_SVG}
      </span>
    </button>`;

    let expander = $(gitlab.expanderSelector, canvas);

    gitlab.insertExpander(anchor, expander);

    expander.onclick = function () {
      let board = this.parentNode.parentNode.parentNode.parentNode;
      let cardList = $("ul", board);
      let icon = $("span", this);

      if (icon.classList.contains(CLASS_EXTENDER_ON)) {
        // compress
        this.setAttribute("title", "Expand list");

        board.setAttribute("style", "");

        cardList.style.display = "block";

        Array.from(cardList.children).forEach((card) => {
          card.setAttribute("style", ``);
        });

        icon.innerHTML = EXPAND_SVG;
      } else {
        // expand
        this.setAttribute("title", "Compress list");
        board.setAttribute("style", `width: 100%;`);

        cardList.style.display = "grid";
        cardList.style[
          "grid-template-columns"
        ] = `repeat(auto-fill, minmax(${gitlab.cardMinWidth}, 1fr))`;
        cardList.style["grid-auto-rows"] = "min-content";
        cardList.style["grid-gap"] = "4px";

        Array.from(cardList.children).forEach((card) => {
          card.setAttribute("style", `margin: 0px!important;`);
        });

        setTimeout(() => {
          cardList.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "center",
          }),
            100;
        });

        icon.innerHTML = COMPRESS_SVG;
      }
      icon.classList.toggle(CLASS_EXTENDER_ON);
    };
  });
};
