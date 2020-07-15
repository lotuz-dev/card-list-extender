export const CLASS_EXTENDER_ON = "board_extender_on";

// All credits of the following SVG goes to Fontawesome 5, this is the "fas fa-expand-alt" icon
// LICENCE LINK: https://fontawesome.com/license
export const EXPAND_SVG = `
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand-alt" class="svg-inline--fa fa-expand-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg>
  `;

// All credits of the following SVG goes to Fontawesome 5, this is the "fas fa-compress-alt" icon
// LICENCE LINK: https://fontawesome.com/license
export const COMPRESS_SVG = `
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="compress-alt" class="svg-inline--fa fa-compress-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M4.686 427.314L104 328l-32.922-31.029C55.958 281.851 66.666 256 88.048 256h112C213.303 256 224 266.745 224 280v112c0 21.382-25.803 32.09-40.922 16.971L152 376l-99.314 99.314c-6.248 6.248-16.379 6.248-22.627 0L4.686 449.941c-6.248-6.248-6.248-16.379 0-22.627zM443.314 84.686L344 184l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C234.697 256 224 245.255 224 232V120c0-21.382 25.803-32.09 40.922-16.971L296 136l99.314-99.314c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.248 6.248 6.248 16.379 0 22.627z"></path></svg>
  `;

export function $(seletor, element = document) {
  return element.querySelector(seletor);
}

export function $$(seletor, element = document) {
  return element.querySelectorAll(seletor);
}

export function linearBackoff(condition, max = 6, delay = 1000, i = 1) {
  return new Promise((resolve, reject) => {
    if (condition()) {
      resolve(true);
    } else {
      if (i < max) {
        setTimeout(function () {
          resolve(linearBackoff(condition, max, delay, i + 1));
        }, delay * i);
      } else {
        resolve(false);
      }
    }
  });
}
