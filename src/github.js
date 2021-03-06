import {
  $,
  $$,
  CLASS_EXTENDER_ON,
  EXPAND_SVG,
  COMPRESS_SVG,
  linearBackoff,
} from "./board_extender.js";

window.onload = async () => {
  const anchorSelector = "div.hide-sm.position-relative.p-sm-2";

  const github = {
    expanderSelector: "button",
    insertExpander: (anchor, expander) => anchor.appendChild(expander),
    cardMinWidth: "335px",
  };

  $(".project-columns-container").setAttribute(
    "style",
    ` overflow-x: unset!important;
    `
  );

  $(".js-project-columns-container").setAttribute(
    "style",
    `width: auto!important;`
  );

  let isReady = await linearBackoff(() => $$(anchorSelector).length);

  if (!isReady) {
    return;
  }

  let anchors = $$(anchorSelector);

  anchors.forEach((anchor) => {
    let canvas = document.createElement("div");

    canvas.innerHTML = `
    <button type="button" class="float-right p-1 tooltipped-w hide-sm column-menu-item" style="width: 18px; height: auto; padding:4px 3px 3px 3px !important; border: none; background: none; color:#586069;">
      <span>
        ${EXPAND_SVG}
      </span>
    </button>`;

    let expander = $(github.expanderSelector, canvas);

    github.insertExpander(anchor, expander);

    expander.onclick = function () {
      let board = this.parentNode.parentNode.parentNode;
      let cardList = $(".js-project-column-cards", board);
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
        board.setAttribute(
          "style",
          `
              width: 100vw;
              max-width: unset;
              flex: 1 1 100%!important;
            `
        );

        cardList.style.display = "grid";
        cardList.style[
          "grid-template-columns"
        ] = `repeat(auto-fill, minmax(${github.cardMinWidth}, 1fr))`;
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
          });
        });
        icon.innerHTML = COMPRESS_SVG;
      }
      icon.classList.toggle(CLASS_EXTENDER_ON);
    };
  });
};
