window.onload = () => {
  const $ = queryOne;
  const $$ = queryAll;

  const strategies = {
    trello: {
      name: "trello",
      anchorSelector:
        ".js-card-templates-button.card-templates-button-container.dark-background-hover",
      buttonInnerHtml: `
    <div class="js-card-templates-button card-templates-button-container dark-background-hover expander-extension">
      <a class="_2arBFfwXVxA0AM" role="button" href="#">
        <span class="icon-sm icon-toExpand dark-background-hover" style=" width: 10px;padding: 5px 0 5px 0;">
          ${EXPAND_SVG}
        </span>
      </a>
    </div>
  `,
      expanderSelector: ".expander-extension",
      insertExpander: (anchor, expander) =>
        anchor.parentNode.insertBefore(expander, anchor),
      getBoard: (button) => button.parentNode.parentNode.parentNode,
      getCardList: (board) => $(".list-cards", board),
      getIcon: (button) => $("span", button),
      isCompressed: (icon) => icon.classList.contains("icon-toCompress"),
      compressClass: "icon-toCompress",
      expandClass: "icon-toExpand",
      cardMinWidth: "248px",
    },
  };

  let strategy = strategies.trello;

  let isReady = await linearBackoff(() => $$(strategy.anchorSelector).length);

  if (!isReady) {
    return;
  }

  let anchors = $$(strategy.anchorSelector);

  anchors.forEach((anchor) => {
    let canvas = document.createElement("div");
    canvas.innerHTML = strategy.buttonInnerHtml;
    let expander = $(strategy.expanderSelector, canvas);

    strategy.insertExpander(anchor, expander);

    expander.onclick = function () {
      let board = strategy.getBoard(this);
      let cardList = strategy.getCardList(board);
      let icon = strategy.getIcon(this);

      if (strategy.isCompressed(icon)) {
        // compress
        this.setAttribute("title", "Expand list");

        board.setAttribute("style", "");

        board.style.display = "inline-block";
        cardList.style.display = "block";
        icon.innerHTML = EXPAND_SVG;
      } else {
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
        ] = `repeat(auto-fill, minmax(${strategy.cardMinWidth}, 1fr))`;

        cardList.style["grid-auto-rows"] = "min-content";

        cardList.style["grid-gap"] = "4px";

        icon.innerHTML = COMPRESS_SVG;
      }

      icon.classList.toggle(strategy.expandClass);
      icon.classList.toggle(strategy.compressClass);
    };
  });
};
