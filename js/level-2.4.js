let runButton = document.getElementById("run-button");
let container = document.getElementById("container");
let allBlocks = document.getElementById("all-blocks");
let blocks = document.querySelectorAll(".block");
let menu = document.getElementById("menu");

let beforeTop = 21;
document.documentElement.style.setProperty('--before-top', beforeTop + '%');

let offsetHeight, offsetWidth;
let offsetX, offsetY;
let selectedBlock = null;
let sortingInProgress = false;
let isChildSeperates = false;
let firstSorted = false;

let dragaudio = document.getElementById('drag');
let dropaudio = document.getElementById('drop');
let wrongaudio = document.getElementById('wrong');
// dragaudio.play();
// dropaudio.play();
// wrongaudio.play();


runButton.addEventListener("click", function () {
  if (sortingInProgress) return;
  sortingInProgress = true;
  runButton.disabled = true;
  blocks.forEach((block) => {
    block.style.cursor = "auto";
  });
  firstSorted = false;
  checkSorting(allBlocks);
});

container.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
  if (sortingInProgress) return;
  if (e.target.classList.contains("block")) {

    dragaudio.play();

    selectedBlock = e.target;

    selectedBlock.style.zIndex = 1000;
    selectedBlock.style.cursor = "grabbing";

    // Calculate the offset position of a mouse click relative to the top left corner of the selectedBlock
    offsetX = e.clientX - (selectedBlock.getBoundingClientRect().left - parseInt(window.getComputedStyle(selectedBlock).getPropertyValue('margin-left')));
    offsetY = e.clientY - (selectedBlock.getBoundingClientRect().top - parseInt(window.getComputedStyle(selectedBlock).getPropertyValue('margin-top')));

    isChildSeperates = false;
    if (selectedBlock.classList[1].slice(6) > 4 && selectedBlock.parentElement.classList.contains("block-4")) {

      selectedBlock.parentElement.style.height = selectedBlock.parentElement.offsetHeight - selectedBlock.offsetHeight / 3 + "px";

      selectedBlock.style.color = "transparent";

      const lastChild = selectedBlock.parentElement.lastChild.previousSibling;
      if (lastChild.previousSibling) {
        lastChild.previousSibling.style.gridRow = "";
      }

      beforeTop = 77.7 * 18 / selectedBlock.parentElement.offsetHeight;
      document.documentElement.style.setProperty('--before-top', beforeTop + '%');

      selectedBlock.parentElement.removeChild(selectedBlock);
      allBlocks.appendChild(selectedBlock);

      isChildSeperates = true;
    }

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener("mouseup", mouseUp);
  }
}

function mouseMove(e) {
  if (sortingInProgress) return;

  selectedBlock.style.position = "absolute";

  const { x, y } = calculatePosition(e, container, offsetX, offsetY);

  selectedBlock.style.left = x + 'px';
  selectedBlock.style.top = y + 'px';

  blocks.forEach((block) => {
    selectedBlock.style.animationPlayState = "running, paused";
    const result = checkBlockOverlap(selectedBlock, block, "x");
    if (block !== selectedBlock && result.isOverlapping && block.classList[1].slice(6) <= 4) {
      block.style.animationPlayState = "paused, running";
    }
    else {
      block.style.animationPlayState = "paused, paused";
    }
  });

  if (isChildSeperates) {
    selectedBlock.style.color = "black";
    selectedBlock.style.backgroundColor = "#7874AD";
    selectedBlock.style.display = "flex";
  }
}

function mouseUp(e) {
  if (sortingInProgress) return;
  if (selectedBlock) {

    dropaudio.play();

    selectedBlock.style.zIndex = 1;
    selectedBlock.style.cursor = "grab";

    selectedBlock.style.animationPlayState = "paused, paused";

    offsetWidth = selectedBlock.offsetWidth;
    offsetHeight = selectedBlock.offsetHeight;

    const { x, y } = calculatePosition(e, container, offsetX, offsetY);
    const { x: constrainedX, y: constrainedY } = constrainToBounds(container.getBoundingClientRect(), x, y, offsetWidth, offsetHeight);
    setPosition(selectedBlock, constrainedX, constrainedY);

    const elementUnderMouse = document.elementFromPoint(e.clientX - offsetX / 2, e.clientY - offsetY);

    if (selectedBlock.classList[1].slice(6) > 4) {
      if (selectedBlock.parentElement === menu) {
        if (elementUnderMouse === null || !elementUnderMouse.parentElement.classList.contains("block-4") && elementUnderMouse !== allBlocks && elementUnderMouse.parentElement !== allBlocks) {
          blocks.forEach((block) => {
            if (block && block.parentElement === menu) {
              selectedBlock.style.position = "static";
              block.style.left = x + "px";
              block.style.top = y + "px";
            }
          });
        } else {
          selectedBlock.style.position = "absolute";
          menu.removeChild(selectedBlock);
          allBlocks.appendChild(selectedBlock);
          dropaudio.play();
        }
      }
      else if (selectedBlock.parentElement === allBlocks) {
        if (elementUnderMouse !== allBlocks && elementUnderMouse.parentElement !== allBlocks && elementUnderMouse.parentElement.parentElement !== allBlocks) {
          selectedBlock.style.position = "static";
          selectedBlock.style.margin = "20px 0 0 13px";
          allBlocks.removeChild(selectedBlock);
          menu.appendChild(selectedBlock);
          dropaudio.play();
        }
      }
    }

    blocks.forEach((block) => {
      if (block !== selectedBlock) {
        const result = checkBlockOverlap(selectedBlock, block);
        if (result.isOverlapping) {
          if (selectedBlock.classList[1].slice(6) > 4) {
            if (block.classList.contains("block-4")) {

              dropaudio.play();

              block.insertBefore(selectedBlock, block.lastChild.previousSibling);

              block.style.height = block.offsetHeight + selectedBlock.offsetHeight / 3 + "px";
              selectedBlock.style.margin = "0";

              beforeTop = 77.7 * 18 / block.offsetHeight;
              document.documentElement.style.setProperty('--before-top', beforeTop + '%');

              block.firstChild.nextSibling.style.top = 5 + "px";
              block.firstChild.nextSibling.style.left = 5 + "px";

              block.lastChild.previousSibling.style.bottom = 5 + "px";
              block.lastChild.previousSibling.style.left = 5 + "px";

              for (let i = 1; i < block.children.length - 1; i++) {
                block.children[i].style.position = "static";
                block.children[i].style.display = "block";
              }

              selectedBlock.style.backgroundColor = "transparent";

              for (let i = 0; i < block.children.length - 1; i++) {
                block.children[i].style.gridColumn = "1"; // place each child in the same column
                block.children[i].style.gridRow = `${i + 1}`; // place each child in a separate row
              }
            } else {
              selectedBlock.style.zIndex = 100;
            }
          } else {
            if (result.overlapType === 'fromLeft') {
              block.style.left = constrainedX + offsetWidth + 1 + "px";
              block.style.top = constrainedY + "px";
            } else if (result.overlapType === 'fromRight') {
              block.style.left = constrainedX - offsetWidth - 1 + "px";
              block.style.top = constrainedY + "px";
            }
          }
        }
        block.style.animationPlayState = "paused, paused";
      }
    });

    if (isChildSeperates) {
      selectedBlock.style.color = "black";
      dropaudio.play();
    }

    sortChildren(allBlocks);

    selectedBlock = null;
    blocks = document.querySelectorAll(".block");
  }
  document.removeEventListener('mousemove', mouseMove);
}


function checkSorting(parent) {
  let children = Array.from(parent.children);
  let currentIndex = 0;
  let times = 1;

  if (parent.classList.contains("block-4")) {
    times = 10;
    children = children.slice(2, -1);
    if (children.length === 0) {
      wrongaudio.play();
      parent.animate([
        { transform: 'translateY(-10px) rotate(25deg)' },
        { transform: 'translateY(-10px) rotate(0deg)' },
        { transform: 'translateY(-10px) rotate(25deg)' },
        { transform: 'translateY(-10px) rotate(0deg)' }
      ],
        {
          duration: 300,
          easing: 'ease-in-out'
        }
      );
      sortingInProgress = false;
      runButton.disabled = false;
      blocks.forEach((block) => {
        block.style.cursor = "grab";
      });
      return;
    }
  }

  function animateAndCheck() {
    const currentBlock = children[currentIndex];

    if (currentBlock) {
      currentBlock.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-10px)', opacity: 0.5 },
        { transform: 'translateY(0)', opacity: 1 }
      ], {
        duration: 500,
        easing: 'ease-in-out'
      }).onfinish = () => {
        if (parseInt(currentBlock.classList[1].slice(6)) !== (currentIndex + 1) * times) {
          if (currentBlock.animate) {
            wrongaudio.play();
            currentBlock.animate([
              { transform: 'translateY(-10px) rotate(25deg)' },
              { transform: 'translateY(-10px) rotate(0deg)' },
              { transform: 'translateY(-10px) rotate(25deg)' },
              { transform: 'translateY(-10px) rotate(0deg)' }
            ],
              {
                duration: 300,
                easing: 'ease-in-out'
              }
            );
          }
          sortingInProgress = false;
          runButton.disabled = false;
          blocks.forEach((block) => {
            block.style.cursor = "grab";
          });
        } else {
          currentIndex++;
          animateAndCheck();
        }
      };
    } else if (currentIndex === children.length) {
      if (parent === allBlocks) {
        firstSorted = true;
        parent = children[currentIndex - 1];
        checkSorting(parent);
        return;
      } else if (parent.classList.contains("block-4") && children.length === 5) {
        winThisLevel(); //alert("The blocks are SORTED");
        sortingInProgress = false;
        runButton.disabled = false;
        blocks.forEach((block) => {
          block.style.cursor = "grab";
        });
      } else {
        wrongaudio.play();
        parent.animate([
          { transform: 'translateY(-10px) rotate(25deg)' },
          { transform: 'translateY(-10px) rotate(0deg)' },
          { transform: 'translateY(-10px) rotate(25deg)' },
          { transform: 'translateY(-10px) rotate(0deg)' }
        ],
          {
            duration: 300,
            easing: 'ease-in-out'
          }
        );
        sortingInProgress = false;
        runButton.disabled = false;
        blocks.forEach((block) => {
          block.style.cursor = "grab";
        });
        return;
      }
    }
  }
  animateAndCheck();
}

function calculatePosition(e, container, offsetX, offsetY) {
  const containerRect = container.getBoundingClientRect();
  const x = e.clientX - containerRect.left - offsetX;
  const y = e.clientY - containerRect.top - offsetY;
  return { x, y };
}

function constrainToBounds(containerRect, x, y, offsetWidth, offsetHeight) {
  if (x < containerRect.width * 0.25) x = containerRect.width * 0.25;
  if (y < 0) y = 0;
  if (x + offsetWidth > containerRect.width) x = containerRect.width - offsetWidth;
  if (y + offsetHeight > containerRect.height) y = containerRect.height - offsetHeight;
  return { x, y };
}

function setPosition(selectedBlock, x, y) {
  selectedBlock.style.position = "absolute";
  selectedBlock.style.left = x + "px";
  selectedBlock.style.top = y + "px";
}

function sortChildren(allBlocks) {
  const children = Array.from(allBlocks.children);
  children.sort((a, b) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return (aRect.top + aRect.left / 2) - (bRect.top + bRect.left / 2);
  });
  children.forEach((child) => allBlocks.appendChild(child));
}

function checkBlockOverlap(block1, block2) {
  const rect1 = block1.getBoundingClientRect();
  const rect2 = block2.getBoundingClientRect();

  let isOverlapping =
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top;

  let overlapType = null;

  if (isOverlapping) {
    if (rect1.right > rect2.left && rect1.right < rect2.right) {
      overlapType = 'fromLeft';
    } else if (rect1.left < rect2.right && rect1.left > rect2.left) {
      overlapType = 'fromRight';
    }
  }

  return {
    isOverlapping,
    overlapType,
  };
}