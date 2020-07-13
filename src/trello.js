import {
  $,
  $$,
  CLASS_EXTENDER_ON,
  EXPAND_SVG,
  COMPRESS_SVG,
  linearBackoff,
} from "./board_extender.js";

window.onload = async () => {
  const anchorSelector =
    ".js-card-templates-button.card-templates-button-container.dark-background-hover";

  const trello = {
    expanderSelector: ".expander-extension",
    insertExpander: (anchor, expander) =>
      anchor.parentNode.insertBefore(expander, anchor),
    getBoard: (button) => button.parentNode.parentNode.parentNode,
    getCardList: (board) => $(".list-cards", board),
    getIcon: (button) => $("span", button),
    cardMinWidth: "248px",
  };

  let isReady = await linearBackoff(() => $$(anchorSelector).length);

  if (!isReady) {
    return;
  }

  let anchors = $$(anchorSelector);

  anchors.forEach((anchor) => {
    let canvas = document.createElement("div");

    canvas.innerHTML = `
    <div style="padding: 5px 0 5px 0;" class="js-card-templates-button card-templates-button-container dark-background-hover expander-extension">
      <a class="_2arBFfwXVxA0AM" role="button" href="#">
        <span class="icon-sm icon-toExpand" style=" width: 10px;">
          ${EXPAND_SVG}
        </span>
      </a>
    </div>
  `;

    let expander = $(trello.expanderSelector, canvas);

    trello.insertExpander(anchor, expander);

    expander.onclick = function () {
      let board = trello.getBoard(this);
      let cardList = trello.getCardList(board);
      let icon = trello.getIcon(this);

      if (icon.classList.contains(CLASS_EXTENDER_ON)) {
        // compress
        this.setAttribute("title", "Expand list");

        board.setAttribute("style", "");

        board.style.display = "inline-block";
        cardList.style.display = "block";
        icon.innerHTML = EXPAND_SVG;
      } else {
        // expand
        this.setAttribute("title", "Compress list");

        board.setAttribute("style", `width: 98vw;`);

        setTimeout(() => {
          board.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "center",
          });
        }, 100);

        cardList.style.display = "grid";
        cardList.style[
          "grid-template-columns"
        ] = `repeat(auto-fill, minmax(${trello.cardMinWidth}, 1fr))`;
        cardList.style["grid-auto-rows"] = "min-content";
        cardList.style["grid-gap"] = "4px";

        icon.innerHTML = COMPRESS_SVG;
      }

      icon.classList.toggle(CLASS_EXTENDER_ON);
    };
  });
};
