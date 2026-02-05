import "./style.css";

// Mobile menu toggle
document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
  document.getElementById("mobile-menu")?.classList.toggle("hidden");
});

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mobile-menu")?.classList.add("hidden");
  });
});

// Floating cards zoom interaction (FLIP animation)
(function () {
  const heroVisual = document.getElementById("hero-visual");
  const centerNode = document.getElementById("center-node");
  const connectingLines = document.getElementById("connecting-lines");
  const floatingCards = document.querySelectorAll(".floating-card");

  if (!heroVisual || !centerNode || !connectingLines) return;

  let expandedCard: HTMLElement | null = null;
  let savedPosition: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null = null;

  function expandCard(card: HTMLElement) {
    if (expandedCard) return;

    const containerRect = heroVisual!.getBoundingClientRect();
    const firstRect = card.getBoundingClientRect();

    const firstTop = firstRect.top - containerRect.top;
    const firstLeft = firstRect.left - containerRect.left;
    const firstWidth = firstRect.width;
    const firstHeight = firstRect.height;

    savedPosition = {
      top: firstTop,
      left: firstLeft,
      width: firstWidth,
      height: firstHeight,
    };

    const targetWidth = Math.min(containerRect.width * 0.85, 550);
    const targetHeight = Math.min(containerRect.height * 0.7, 380);
    const targetLeft = (containerRect.width - targetWidth) / 2;
    const targetTop = (containerRect.height - targetHeight) / 2;

    card.style.transition = "none";
    card.style.position = "absolute";
    card.style.top = firstTop + "px";
    card.style.left = firstLeft + "px";
    card.style.right = "auto";
    card.style.bottom = "auto";
    card.style.width = firstWidth + "px";
    card.style.height = firstHeight + "px";
    card.style.transform = "rotate(0deg)";

    // Force reflow
    card.offsetHeight;

    card.style.transition = "";

    floatingCards.forEach((c) => {
      if (c !== card) c.classList.add("hidden-card");
    });
    centerNode!.classList.add("hidden-for-expand");
    connectingLines!.style.opacity = "0";

    expandedCard = card;
    card.classList.add("expanding");

    requestAnimationFrame(() => {
      card.style.top = targetTop + "px";
      card.style.left = targetLeft + "px";
      card.style.width = targetWidth + "px";
      card.style.height = targetHeight + "px";

      const cardImage = card.querySelector(".card-image") as HTMLElement | null;
      if (cardImage) {
        cardImage.style.transition =
          "all 0.6s cubic-bezier(0.32, 0.72, 0, 1)";
        cardImage.style.height = "85%";
      }
    });
  }

  function collapseCard() {
    if (!expandedCard || !savedPosition) return;

    const card = expandedCard;

    card.style.top = savedPosition.top + "px";
    card.style.left = savedPosition.left + "px";
    card.style.width = savedPosition.width + "px";
    card.style.height = savedPosition.height + "px";

    const cardImage = card.querySelector(".card-image") as HTMLElement | null;
    if (cardImage) {
      cardImage.style.height = "";
    }

    floatingCards.forEach((c) => {
      if (c !== card) c.classList.remove("hidden-card");
    });
    centerNode!.classList.remove("hidden-for-expand");
    connectingLines!.style.opacity = "0.2";

    setTimeout(() => {
      card.classList.remove("expanding");
      card.style.transition = "none";
      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.right = "";
      card.style.bottom = "";
      card.style.width = "";
      card.style.height = "";
      card.style.transform = "";

      card.offsetHeight;
      card.style.transition = "";
    }, 600);

    expandedCard = null;
    savedPosition = null;
  }

  floatingCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      if (expandedCard === card) {
        collapseCard();
      } else if (expandedCard) {
        collapseCard();
      } else {
        expandCard(card as HTMLElement);
      }
    });
  });

  heroVisual.addEventListener("click", (e) => {
    if (expandedCard && !expandedCard.contains(e.target as Node)) {
      collapseCard();
    }
  });

  // Copy install command
  const copyBtn = document.getElementById("copy-btn");
  const installCommandCode = document.getElementById("install-command");

  if (copyBtn && installCommandCode) {
    copyBtn.addEventListener("click", () => {
      const command = installCommandCode.textContent || "";
      navigator.clipboard.writeText(command).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">check</span>
        Copied!
      `;
        copyBtn.classList.add("bg-green-600", "hover:bg-green-700");
        copyBtn.classList.remove("bg-[#171717]", "hover:bg-black");

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove("bg-green-600", "hover:bg-green-700");
          copyBtn.classList.add("bg-[#171717]", "hover:bg-black");
        }, 2000);
      });
    });
  }
})();
