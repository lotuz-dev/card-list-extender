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
  getBoardInner: (button) => button.parentNode.parentNode.parentNode,
  getBoard: (boardInner) => boardInner.parentNode,
  cardMinWidth: "374px",
};

strategies.github = {};
strategies.trello = {};

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
      let boardInner = strategy.getBoardInner(this);
      let board = strategy.getBoard(boardInner);
      let cardList = $("ul", boardInner);
      let icon = $("i", this);

      if (icon.classList.contains("fa-compress")) {
        // compress
        this.setAttribute("title", "Expand list");

        cardList.style.display = "block";
        board.style.width = "";
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

      icon.classList.toggle("fa-expand");
      icon.classList.toggle("fa-compress");
    };
  });
};
