window.onload = async () => {
  const $ = queryOne;
  const $$ = queryAll;

  const strategies = {
    gitlab: {
      name: "gitlab",
      anchorSelector: "h3.board-title",
      buttonInnerHtml: `
                <button 
                  class="btn issue-count-badge-add-button no-drag btn-default btn-md btn-icon gl-button has-tooltip ml-1" 
                  type="button" 
                >
                  <span style="width: 16px; height: 16px;">
                    ${EXPAND_SVG}
                  </span>
                </button>
          `,
      expanderSelector: "button",
      insertExpander: (anchor, expander) => anchor.appendChild(expander),
      getBoard: (button) => button.parentNode.parentNode.parentNode.parentNode,
      getCardList: (board) => $("ul", board),
      getIcon: (button) => $("span", button),
      isCompressed: (icon) => icon.classList.contains("icon-toCompress"),
      compressClass: "icon-toCompress",
      cardMinWidth: "374px",
    },
  };

  let strategy = strategies.gitlab;

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
        ] = `repeat(auto-fill, minmax(${strategy.cardMinWidth}, 1fr))`;
        cardList.style["grid-auto-rows"] = "min-content";
        cardList.style["grid-gap"] = "4px";

        Array.from(cardList.children).forEach((card) => {
          card.setAttribute("style", `margin: 0px!important;`);
        });

        cardList.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
        icon.innerHTML = COMPRESS_SVG;
      } 

      icon.classList.toggle(strategy.expandClass);
      icon.classList.toggle(strategy.compressClass);
    };
  });
};
