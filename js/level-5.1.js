let runButton = document.getElementById("run-button");
let blocks = document.querySelectorAll("#all-blocks .block");
let container = document.getElementById("container");
let menu = document.getElementById("menu");
let allBlocks = document.getElementById("all-blocks");

let offsetHeight, offsetWidth;
let offsetX, offsetY;
let selectedBlock = null;
let sortingInProgress = false;
let isChildSeperates = false;
let firstSorted = false;
let count = 0;

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

  count = 0;
  checkSorting(allBlocks);
});

// Drag a block from the menu
menu.addEventListener("dragstart", function (e) {
  if (sortingInProgress) return;
  if (e.target.classList.contains("block") && e.target.parentNode.id === "menu") {

    dragaudio.play();

    selectedBlock = e.target;

    // Calculate the offset position of a mouse click relative to the top left corner of the selectedBlock before cloneNode
    offsetX = e.clientX - selectedBlock.getBoundingClientRect().left;
    offsetY = e.clientY - selectedBlock.getBoundingClientRect().top + 1;

    // Set the width and height of selectedBlock before cloneNode
    offsetWidth = selectedBlock.offsetWidth;
    offsetHeight = selectedBlock.offsetHeight;

    selectedBlock = e.target.cloneNode(true);

    selectedBlock.style.zIndex = 1000;
    selectedBlock.style.cursor = "grabbing";
  }
  menu.addEventListener("drop", function () {
    selectedBlock = null;
    blocks = document.querySelectorAll("#all-blocks .block");
  });
});

// Drag a block from the area
allBlocks.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
  if (sortingInProgress) return;
  if (e.target.classList.contains("block")) {
    // console.log(1)

    dragaudio.play();

    selectedBlock = e.target;
    selectedBlock.setAttribute('draggable', false);

    selectedBlock.style.zIndex = 1000;
    selectedBlock.style.cursor = "grabbing";

    // Calculate the offset position of a mouse click relative to the top left corner of the selectedBlock
    offsetX = e.clientX - selectedBlock.getBoundingClientRect().left;
    offsetY = e.clientY - selectedBlock.getBoundingClientRect().top;

    isChildSeperates = false;
    if (selectedBlock.classList[1].slice(6) > 4 && selectedBlock.parentElement.classList.contains("type")) {

      selectedBlock.parentElement.style.height = selectedBlock.parentElement.offsetHeight - selectedBlock.offsetHeight * 2 / 3 + "px";

      selectedBlock.style.color = "transparent";

      const lastChild = selectedBlock.parentElement.lastChild.previousSibling;
      if (lastChild.previousSibling) {
        lastChild.previousSibling.style.gridRow = "";
      }

      selectedBlock.parentElement.removeChild(selectedBlock);
      allBlocks.appendChild(selectedBlock);

      isChildSeperates = true;
    }

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener("mouseup", handleDrop);
  }
}

function mouseMove(e) {
  if (sortingInProgress) return;

  selectedBlock.style.position = "absolute";

  const { x, y } = calculatePosition(e, allBlocks, offsetX, offsetY);

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
    selectedBlock.style.height = "3em";
    selectedBlock.style.width = "11em";
    selectedBlock.style.padding = "0";
    selectedBlock.style.display = "flex";
  }
}


// Combined drop and mouseup event listeners
allBlocks.addEventListener("drop", handleDrop);

function handleDrop(e) {
  if (sortingInProgress) return;
  if (selectedBlock) {

    dropaudio.play();

    selectedBlock.style.zIndex = 1;
    selectedBlock.style.cursor = "grab";

    selectedBlock.style.animationPlayState = "paused, paused";

    const { x, y } = calculatePosition(e, allBlocks, offsetX, offsetY);
    const { x: constrainedX, y: constrainedY } = constrainToBounds(allBlocks.getBoundingClientRect(), x, y, offsetWidth, offsetHeight);
    setPositionAndAppend(selectedBlock, allBlocks, constrainedX, constrainedY);

    if (selectedBlock.parentNode !== null) {
      // Set the width and height of selectedBlock when the selectedBlock comes from area
      offsetWidth = selectedBlock.offsetWidth;
      offsetHeight = selectedBlock.offsetHeight;
    }

    blocks.forEach((block) => {
      if (block !== selectedBlock) {
        const result = checkBlockOverlap(selectedBlock, block);
        if (result.isOverlapping) {
          if (selectedBlock.classList[1].slice(6) > 4) {
            if (block.classList.contains("type")) {

              dropaudio.play();

              block.insertBefore(selectedBlock, block.lastChild.previousSibling);

              block.style.height = block.offsetHeight + selectedBlock.offsetHeight / 3 + "px";
              selectedBlock.style.margin = "0";

              block.firstChild.nextSibling.style.top = 5 + "px";
              block.firstChild.nextSibling.style.left = 5 + "px";

              block.lastChild.previousSibling.style.bottom = 5 + "px";
              block.lastChild.previousSibling.style.left = 5 + "px";
              selectedBlock.style.padding = "3.6px";


              for (let i = 1; i < block.children.length - 1; i++) {
                block.children[i].style.position = "static";
                block.children[i].style.display = "block";
              }

              selectedBlock.style.backgroundColor = "transparent";
              selectedBlock.style.height = "1.5em";

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

    const elementUnderMouse = document.elementFromPoint(e.clientX - offsetX / 2, e.clientY - offsetY);
    if (selectedBlock) {
      if (selectedBlock.parentElement === allBlocks && selectedBlock.classList[1].slice(6) > 4) {
        if (elementUnderMouse !== allBlocks && elementUnderMouse.parentElement !== allBlocks && elementUnderMouse.parentElement.parentElement !== allBlocks) {
          selectedBlock.remove();
          selectedBlock = null;
          blocks = document.querySelectorAll("#all-blocks .block");
          dropaudio.play();
        }
      }
    }

    if (isChildSeperates) {
      selectedBlock.style.color = "black";
      dropaudio.play();
    }

    selectedBlock = null;
    blocks = document.querySelectorAll("#all-blocks .block");
  }

  sortChildren(allBlocks);

  document.removeEventListener('mousemove', mouseMove);
  document.removeEventListener("mouseup", handleDrop);
}


menu.addEventListener("dragover", function (e) {
  e.preventDefault();
});

allBlocks.addEventListener("dragover", function (e) {
  e.preventDefault();
});



function checkSorting(parent) {
  let children = Array.from(parent.children);
  let currentIndex = 0;
  let times = 1;

  if (parent.classList.contains("type")) {
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
        if (parseInt(currentBlock.classList[1].slice(6)) !== (currentIndex + 1) * times && !((currentBlock.classList[1].slice(6) * 2) / times === children.length)) {
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
      } else if (parent.classList.contains("type") && children.length === 4) {
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

function getOffsetPosition(selectedBlock, e) {
  const rect = selectedBlock.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top + 1;
  return { offsetX, offsetY };
}

function calculatePosition(e, allBlocks, offsetX, offsetY) {
  const allBlocksRect = allBlocks.getBoundingClientRect();
  const x = e.clientX - allBlocksRect.left - offsetX;
  const y = e.clientY - allBlocksRect.top - offsetY;
  return { x, y };
}

function constrainToBounds(allBlocksRect, x, y, offsetWidth, offsetHeight) {
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + offsetWidth > allBlocksRect.width) x = allBlocksRect.width - offsetWidth;
  if (y + offsetHeight > allBlocksRect.height) y = allBlocksRect.height - offsetHeight;
  return { x, y };
}

function setPositionAndAppend(selectedBlock, allBlocks, x, y) {
  selectedBlock.style.margin = "0";
  selectedBlock.style.position = "absolute";
  selectedBlock.style.left = x + "px";
  selectedBlock.style.top = y + "px";
  allBlocks.appendChild(selectedBlock);
}

function sortChildren(allBlocks) {
  const children = Array.from(allBlocks.children);
  children.sort((a, b) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    return aRect.top - bRect.top;
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