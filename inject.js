const strategies = {};

strategies.gitlab = {
  anchorSelector: "h3.board-title",
  buttonInnerHtml: `
      <button 
        title="Expand list" 
        class="btn issue-count-badge-add-button no-drag btn-default btn-md btn-icon gl-button has-tooltip ml-1" 
        type="button" 
        data-placement="bottom" 
      >
        <i aria-hidden="true" data-hidden="true" class="fa fa-expand" style="width: 16px; height: 16px;"></i>
      </button>
`,
  expanderSelector: "button",
  insertExpander: (anchor, expander) => anchor.appendChild(expander),
  getBoard: (button) => button.parentNode.parentNode.parentNode.parentNode,
  getCardList: (board) => $("ul", board),
  getIcon: (button) => $("i", button),
  isCompressed: (icon) => icon.classList.contains("fa-compress"),
  cardMinWidth: "374px",
  expandClass: "fa-expand",
  compressClass: "fa-compress",
};

strategies.github = {
  anchorSelector: "div.hide-sm.position-relative.p-sm-2",
  buttonInnerHtml: `
  <button type="button">
    <svg class="octicon octicon-plus" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
      <path fill-rule="evenodd" d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"></path>
    </svg>
  </button>
`,
  expanderSelector: "button",
  insertExpander: (anchor, expander) => anchor.appendChild(expander),
  getBoard: (button) => button.parentNode.parentNode.parentNode,
  getCardList: (board) => $("div", board),
  getIcon: (button) => $("svg", button),
  isCompressed: (icon) => icon.classList.contains("octicon-plus"),
  cardMinWidth: "335px",
  expandClass: "octicon-plus",
  compressClass: "octicon-minus",
};

strategies.trello = {
  anchorSelector: ".js-card-templates-button.card-templates-button-container.dark-background-hover",
  buttonInnerHtml: `
  <button 
    title="Expand list" 
    class="btn issue-count-badge-add-button no-drag btn-default btn-md btn-icon gl-button has-tooltip ml-1" 
    type="button" 
    data-placement="bottom">
      <i aria-hidden="true" data-hidden="true" class="fa fa-expand" style="width: 16px; height: 16px;"></i>
  </button>
  
`,
  expanderSelector: ".expander-extension",
  insertExpander: (anchor, expander) => anchor.parentNode.insertBefore(expander, anchor),
  getBoard: (button) => button.parentNode.parentNode.parentNode.parentNode,
  getCardList: (board) => $(".list-cards", board),
  getIcon: (button) => $("span", button),
  isCompressed: (icon) => icon.classList.contains("icon-remove"),
  cardMinWidth: "248px",
  expandClass: "icon-add",
  compressClass: "icon-remove",
};

let strategy;
switch (location.host) {
  case "gitlab.com":
    strategy = strategies.gitlab;
    break;
  case "github.com":
    strategy = strategies.github;
    break;
  case "trello.com":
    strategy = strategies.trello;
    break;
  default:
    strategy = false;
}

function $(seletor, element = document) {
  return element.querySelector(seletor);
}

function $$(seletor, element = document) {
  return element.querySelectorAll(seletor);
}

window.onload = () => {
  if (!strategy) {
    return;
  }

  let anchors = $$(strategy.anchorSelector);

  anchors.forEach((anchor, i) => {
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

        board.style.width = "";

        cardList.style.display = "block";
      } else {
        // expand
        this.setAttribute("title", "Compress list");

        board.style.width = "100%";
        cardList.style.display = "grid";
        cardList.style[
          "grid-template-columns"
        ] = `repeat(auto-fill, minmax(${strategy.cardMinWidth}, 1fr))`;
        cardList.style["grid-auto-rows"] = "min-content";
        cardList.style["grid-gap"] = "4px";

        cardList.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "center",
        });
      }

      icon.classList.toggle(strategy.expandClass);
      icon.classList.toggle(strategy.compressClass);
    };
  });
};
