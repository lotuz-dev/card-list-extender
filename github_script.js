window.onload = () => {
  const EXPAND_SVG = `
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand-alt" class="svg-inline--fa fa-expand-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg>
    `;

  const COMPRESS_SVG = `
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="compress-alt" class="svg-inline--fa fa-compress-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M4.686 427.314L104 328l-32.922-31.029C55.958 281.851 66.666 256 88.048 256h112C213.303 256 224 266.745 224 280v112c0 21.382-25.803 32.09-40.922 16.971L152 376l-99.314 99.314c-6.248 6.248-16.379 6.248-22.627 0L4.686 449.941c-6.248-6.248-6.248-16.379 0-22.627zM443.314 84.686L344 184l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C234.697 256 224 245.255 224 232V120c0-21.382 25.803-32.09 40.922-16.971L296 136l99.314-99.314c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.248 6.248 6.248 16.379 0 22.627z"></path></svg>
    `;

  const strategies = {
    github: {
      name: "github",
      anchorSelector: "div.hide-sm.position-relative.p-sm-2",
      buttonInnerHtml: `
            <button type="button" class="float-right btn-octicon p-1 tooltipped-w hide-sm column-menu-item" style="width: 20px; height: auto; padding: 5px; border: none; background: none;">
              <span>
                ${EXPAND_SVG}
              </span>
            </button>
          `,
      expanderSelector: "button",
      insertExpander: (anchor, expander) => anchor.appendChild(expander),
      getBoard: (button) => button.parentNode.parentNode.parentNode,
      getCardList: (board) => $(".js-project-column-cards", board),
      getIcon: (button) => $("span", button),
      isCompressed: (icon) => icon.classList.contains("icon-toCompress"),
      compressClass: "icon-toCompress",
      cardMinWidth: "335px",
    },
  };

  function $(seletor, element = document) {
    return element.querySelector(seletor);
  }

  function $$(seletor, element = document) {
    return element.querySelectorAll(seletor);
  }

  let strategy = strategies.github;

  $(".project-columns-container").setAttribute(
    "style",
    ` overflow-x: unset!important;
    `
  );

  $(".js-project-columns-container").setAttribute(
    "style",
    `width: auto!important;`
  );

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
