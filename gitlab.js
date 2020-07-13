window.onload = async () => {
  const $ = queryOne;
  const $$ = queryAll;

  const anchorSelector = "h3.board-title";

  const gitlab = {
    expanderSelector: "button",
    insertExpander: (anchor, expander) => anchor.appendChild(expander),
    getBoard: (button) => button.parentNode.parentNode.parentNode.parentNode,
    getCardList: (board) => $("ul", board),
    getIcon: (button) => $("span", button),
    cardMinWidth: "374px",
  };

  let isReady = await linearBackoff(() => $$(anchorSelector).length);

  if (!isReady) {
    return;
  }

  let anchors = $$(anchorSelector);

  anchors.forEach((anchor) => {
    let canvas = document.createElement("div");

    canvas.innerHTML = `<button class="btn issue-count-badge-add-button no-drag btn-default btn-md btn-icon gl-button has-tooltip ml-1" type="button">
      <span style="width: 16px; height: 16px;">
        ${EXPAND_SVG}
      </span>
    </button>`;

    let expander = $(gitlab.expanderSelector, canvas);

    gitlab.insertExpander(anchor, expander);

    expander.onclick = function () {
      let board = gitlab.getBoard(this);
      let cardList = gitlab.getCardList(board);
      let icon = gitlab.getIcon(this);

      if (gitlab.isCompressed(icon)) {
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

      icon.classList.toggle(gitlab.expandClass);
      icon.classList.toggle(gitlab.compressClass);
    };
  });
};
