window.onload = () => {
  setTimeout(() => {

    let isFullScreen = false;
    let countBadges = document.getElementsByClassName("board-list");

    countBadges.each((i, badge) => {
      
      let expander = $(`
<button aria-label="Expand list" data-placement="bottom" title="" type="button" class="border-0 p-0 board-delete board-expand has-tooltip float-right" data-original-title="Expand list">
<i aria-hidden="true" data-hidden="true" class="fa fa-expand"></i>
</button>
`);

      expander.insertBefore(badge);

      expander.click(function () {
        
        let board = boardInner.parent();
        let ul = document.getElementsByTagName("ul", boardInner);

        if (isFullScreen) {
          // document.exitFullscreen()
          ul.css("display", "block");
          board.css("width", "");
        } else {
          // board[0].requestFullscreen()
          board.css("width", "100%");
          ul.css("display", "grid");
          ul.css("grid-template-columns", "1fr 1fr 1fr 1fr 1fr");
          ul.css("grid-auto-rows", "25%");

          ul[0].scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "center",
          });
        }

        $("i", this).toggleClass("fa-expand fa-compress");

        isFullScreen = !isFullScreen;
      });
    });
  }, 1000);
};
