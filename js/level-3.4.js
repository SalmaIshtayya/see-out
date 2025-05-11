let runButton = document.getElementById("run-button");
let container = document.getElementById("container");
let allBlocks = document.getElementById("all-blocks");
let blocks = document.querySelectorAll(".block");
let menu = document.getElementById("menu");

let offsetHeight, offsetWidth;
let offsetX, offsetY;
let selectedBlock = null;
let sortingInProgress = false;
let isChildSeperates = false;
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

  if (menu.children.length === 0) {
    count = 0;
    checkSorting(allBlocks);
  }
  else {
    wrongaudio.play();
    menu.children[0].animate([
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
  }
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
    if (selectedBlock.classList[1].slice(6) > 4 && selectedBlock.parentElement.classList.contains("boolean")) {

      selectedBlock.style.color = "transparent";
      selectedBlock.style.backgroundColor = "transparent";

      const lastChild = selectedBlock.parentElement.lastChild.previousSibling;
      if (lastChild.previousSibling) {
        lastChild.previousSibling.style.gridRow = "";
      }

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
    const result = checkBlockOverlap(selectedBlock, block);
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
    selectedBlock.style.width = "8.62em";
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
        if (elementUnderMouse === null || !elementUnderMouse.parentElement.classList.contains("boolean") && elementUnderMouse !== allBlocks && elementUnderMouse.parentElement !== allBlocks) {
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
            if (block.classList.contains("boolean")) {

              dropaudio.play();
              
              block.insertBefore(selectedBlock, block.lastChild.previousSibling);

              selectedBlock.style.margin = "0";

              block.firstChild.nextSibling.style.top = 5 + "px";
              block.firstChild.nextSibling.style.left = 5 + "px";

              for (let i = 0; i < block.children.length - 1; i++) {
                block.children[i].style.position = "static";
                block.children[i].style.display = "block";
                block.children[i].style.textAlign = "center";
              }

              selectedBlock.style.backgroundColor = "#574e82";
              selectedBlock.style.height = "1.5em";
              selectedBlock.style.width = "8.5em";

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

  if (parent.classList.contains("boolean")) {
    times = 10;
    children = children.slice(2, -1);
  } else {
    children = children.slice(count);
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
        if ((currentBlock.parentElement === allBlocks && (currentBlock.classList[1].slice(6) > 4 || currentBlock.children.length - 3 === 0)) || (currentBlock.parentElement !== allBlocks && parseInt(currentBlock.classList[1].slice(6)) !== (parent.classList[1].slice(6)) * times)) {
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
          sortingInProgress = false;
          runButton.disabled = false;
          blocks.forEach((block) => {
            block.style.cursor = "grab";
          });
          return;
        } else if (currentBlock.parentElement === allBlocks) {
          count++;
          parent = children[currentIndex];
          checkSorting(parent);
          return;
        } else {
          currentIndex++;
          if (currentIndex === children.length) {
            if (count === allBlocks.children.length) {
              winThisLevel(); //alert("The blocks are SORTED");
              sortingInProgress = false;
              runButton.disabled = false;
              blocks.forEach((block) => {
                block.style.cursor = "grab";
              });
              return;
            } else {
              checkSorting(allBlocks);
              return;
            }
          } else {
            animateAndCheck();
          }
        }
      };
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