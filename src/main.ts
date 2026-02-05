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

// Floating cards zoom interaction
(function () {
  const heroVisual = document.getElementById("hero-visual");
  const centerNode = document.getElementById("center-node");
  const connectingLines = document.getElementById("connecting-lines");
  const floatingCards = document.querySelectorAll<HTMLElement>(".floating-card");

  if (!heroVisual || !centerNode || !connectingLines) return;

  let expandedCard: HTMLElement | null = null;
  let currentAnimation: Animation | null = null;

  function expandCard(card: HTMLElement) {
    if (expandedCard || currentAnimation) return;

    const containerRect = heroVisual.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Target: centered, larger
    const targetW = Math.min(containerRect.width * 0.85, 550);
    const targetH = Math.min(containerRect.height * 0.7, 380);
    const targetCenterX = containerRect.left + containerRect.width / 2;
    const targetCenterY = containerRect.top + containerRect.height / 2;

    // Current card center
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    // Translation needed
    const dx = targetCenterX - cardCenterX;
    const dy = targetCenterY - cardCenterY;
    const scale = Math.min(targetW / cardRect.width, targetH / cardRect.height);

    expandedCard = card;
    card.classList.add("expanded");
    card.style.transition = "none";

    // Hide others immediately with CSS
    floatingCards.forEach((c) => {
      if (c !== card) {
        c.style.transition = "opacity 0.3s, transform 0.3s";
        c.style.opacity = "0";
        c.style.transform = "scale(0.8)";
        c.style.pointerEvents = "none";
      }
    });

    centerNode.style.transition = "opacity 0.3s, transform 0.3s";
    centerNode.style.opacity = "0";
    centerNode.style.transform = "scale(0.5)";

    connectingLines.style.transition = "opacity 0.3s";
    connectingLines.style.opacity = "0";

    // Animate card
    currentAnimation = card.animate(
      [
        { transform: "rotate(0deg) translate(0, 0) scale(1)" },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(0deg)` },
      ],
      { duration: 500, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" }
    );

    currentAnimation.onfinish = () => {
      currentAnimation = null;
      const cardImage = card.querySelector(".card-image") as HTMLElement;
      if (cardImage) cardImage.style.height = "85%";
    };
  }

  function collapseCard() {
    if (!expandedCard) return;

    const card = expandedCard;
    expandedCard = null;

    const cardImage = card.querySelector(".card-image") as HTMLElement;
    if (cardImage) cardImage.style.height = "";

    // Get current transform
    const style = getComputedStyle(card);
    const currentTransform = style.transform;

    // Cancel any running animation
    card.getAnimations().forEach((a) => a.cancel());

    // Animate back
    currentAnimation = card.animate(
      [{ transform: currentTransform }, { transform: "rotate(0deg) translate(0, 0) scale(1)" }],
      { duration: 500, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" }
    );

    currentAnimation.onfinish = () => {
      currentAnimation = null;
      card.classList.remove("expanded");
      card.style.transition = "";
      card.style.transform = "";
      card.getAnimations().forEach((a) => a.cancel());
    };

    // Show others
    setTimeout(() => {
      floatingCards.forEach((c) => {
        if (c !== card) {
          c.style.opacity = "";
          c.style.transform = "";
          c.style.pointerEvents = "";
          setTimeout(() => (c.style.transition = ""), 400);
        }
      });

      centerNode.style.opacity = "";
      centerNode.style.transform = "";
      setTimeout(() => (centerNode.style.transition = ""), 400);

      connectingLines.style.opacity = "";
      setTimeout(() => (connectingLines.style.transition = ""), 400);
    }, 200);
  }

  floatingCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      if (expandedCard === card) {
        collapseCard();
      } else if (!expandedCard) {
        expandCard(card);
      }
    });
  });

  heroVisual.addEventListener("click", (e) => {
    if (expandedCard && !expandedCard.contains(e.target as Node)) {
      collapseCard();
    }
  });
})();

// Workflow demo animation
(function () {
  const stepLabel = document.getElementById("step-label");
  const stepDots = document.querySelectorAll<HTMLElement>(".step-dot");
  const scenes = document.querySelectorAll<HTMLElement>(".scene");

  if (!stepLabel || stepDots.length === 0 || scenes.length === 0) return;

  const steps = [
    { label: "Press ⌘⇧4", scene: 0 },
    { label: "Select region", scene: 1 },
    { label: "Captured!", scene: 2 },
    { label: "Add markers", scene: 3 },
    { label: "Send to AI", scene: 4 },
  ];

  let currentStep = -1;

  // Helper to set styles
  const setStyle = (el: Element | null, styles: Record<string, string>) => {
    if (el instanceof HTMLElement) Object.assign(el.style, styles);
  };

  function showStep(stepIndex: number) {
    currentStep = stepIndex;
    const step = steps[stepIndex];

    if (stepLabel) stepLabel.textContent = step.label;

    // Update dots
    stepDots.forEach((dot, i) => {
      setStyle(dot, {
        background: i === stepIndex ? "#f97316" : "rgba(255,255,255,0.3)",
        transform: i === stepIndex ? "scale(1.4)" : "scale(1)",
      });
    });

    // Show/hide scenes
    scenes.forEach((scene, i) => {
      setStyle(scene, { opacity: i === step.scene ? "1" : "0" });
    });

    // Scene animations
    setTimeout(() => animateScene(step.scene), 150);
  }

  function animateScene(sceneIndex: number) {
    const scene = scenes[sceneIndex];
    if (!scene) return;

    switch (sceneIndex) {
      case 0: {
        // Hotkey hint pops in
        const hotkey = scene.querySelector(".hotkey-hint") as HTMLElement;
        if (hotkey) {
          setTimeout(() => {
            hotkey.style.opacity = "1";
            hotkey.style.transform = "scale(1)";
          }, 400);
        }
        break;
      }

      case 1: {
        // Crosshair and selection box animate together - crosshair at bottom-right corner of selection
        const crosshair = scene.querySelector(".crosshair") as HTMLElement;
        const selectionBox = scene.querySelector(".selection-box") as HTMLElement;
        const container = scene.querySelector(".skeleton-box") as HTMLElement;
        const rect = container?.getBoundingClientRect();

        // Selection will be 80% wide, 65% tall
        const selW = rect ? rect.width * 0.8 : 320;
        const selH = rect ? rect.height * 0.65 : 180;

        if (crosshair && selectionBox) {
          crosshair.style.opacity = "1";

          // Animate both together with same timing
          setTimeout(() => {
            crosshair.style.transition = "transform 1s ease-out";
            crosshair.style.transform = `translate(${selW}px, ${selH}px)`;

            selectionBox.style.transition = "width 1s ease-out, height 1s ease-out";
            selectionBox.style.width = `${selW}px`;
            selectionBox.style.height = `${selH}px`;
          }, 200);
        }
        break;
      }

      case 2: {
        // Flash then show captured result
        const flash = scene.querySelector(".capture-flash") as HTMLElement;
        const result = scene.querySelector(".capture-result") as HTMLElement;
        if (flash) {
          flash.style.transition = "opacity 0.15s ease-out";
          flash.style.opacity = "0.9";
          setTimeout(() => (flash.style.opacity = "0"), 150);
        }
        if (result) {
          setTimeout(() => {
            result.style.opacity = "1";
            result.style.transform = "scale(1)";
          }, 300);
        }
        break;
      }

      case 3: {
        // Toolbar icons pop in, then markers appear
        const tools = scene.querySelectorAll(".tool-icon") as NodeListOf<HTMLElement>;
        const markers = scene.querySelectorAll(".annotation-marker") as NodeListOf<HTMLElement>;

        tools.forEach((tool, i) => {
          setTimeout(() => {
            tool.style.opacity = "1";
            tool.style.transform = "scale(1)";
          }, i * 80);
        });

        markers.forEach((marker, i) => {
          setTimeout(() => {
            marker.style.opacity = "1";
            marker.style.transform = "scale(1)";
          }, 350 + i * 180);
        });
        break;
      }

      case 4: {
        // Upload bar fills, success indicators, then messages appear
        const uploadBar = scene.querySelector(".upload-bar") as HTMLElement;
        const uploadSuccess = scene.querySelector(".upload-success") as HTMLElement;
        const uploadLabel = scene.querySelector(".upload-label") as HTMLElement;
        const messages = scene.querySelectorAll(".ai-message") as NodeListOf<HTMLElement>;
        const aiSuccess = scene.querySelector(".ai-success") as HTMLElement;

        // Upload bar fills
        if (uploadBar) {
          setTimeout(() => (uploadBar.style.width = "100%"), 100);
        }

        // Upload success checkmark
        if (uploadSuccess) {
          setTimeout(() => {
            uploadSuccess.style.opacity = "1";
            uploadSuccess.style.transform = "scale(1)";
          }, 900);
        }

        // Upload label
        if (uploadLabel) {
          setTimeout(() => (uploadLabel.style.opacity = "1"), 1000);
        }

        // Messages appear with stagger
        messages.forEach((msg, i) => {
          setTimeout(() => {
            msg.style.opacity = "1";
            msg.style.transform = "translateY(0)";
          }, 600 + i * 450);
        });

        // AI success indicator at the end
        if (aiSuccess) {
          setTimeout(() => (aiSuccess.style.opacity = "1"), 1800);
        }
        break;
      }
    }
  }

  function resetScene(sceneIndex: number) {
    const scene = scenes[sceneIndex];
    if (!scene) return;

    // Reset hotkey
    const hotkey = scene.querySelector(".hotkey-hint") as HTMLElement;
    if (hotkey) {
      hotkey.style.opacity = "0";
      hotkey.style.transform = "scale(0.9)";
    }

    // Reset crosshair & selection
    const crosshair = scene.querySelector(".crosshair") as HTMLElement;
    const selectionBox = scene.querySelector(".selection-box") as HTMLElement;
    if (crosshair) {
      crosshair.style.transition = "none";
      crosshair.style.opacity = "0";
      crosshair.style.transform = "translate(0, 0)";
    }
    if (selectionBox) {
      selectionBox.style.transition = "none";
      selectionBox.style.width = "0";
      selectionBox.style.height = "0";
    }

    // Reset capture
    const flash = scene.querySelector(".capture-flash") as HTMLElement;
    const result = scene.querySelector(".capture-result") as HTMLElement;
    if (flash) flash.style.opacity = "0";
    if (result) {
      result.style.opacity = "0";
      result.style.transform = "scale(0.95)";
    }

    // Reset tools & markers
    scene.querySelectorAll(".tool-icon").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0)";
    });
    scene.querySelectorAll(".annotation-marker").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0)";
    });

    // Reset upload & messages
    const uploadBar = scene.querySelector(".upload-bar") as HTMLElement;
    const uploadSuccess = scene.querySelector(".upload-success") as HTMLElement;
    const uploadLabel = scene.querySelector(".upload-label") as HTMLElement;
    const aiSuccess = scene.querySelector(".ai-success") as HTMLElement;

    if (uploadBar) uploadBar.style.width = "0";
    if (uploadSuccess) {
      uploadSuccess.style.opacity = "0";
      uploadSuccess.style.transform = "scale(0)";
    }
    if (uploadLabel) uploadLabel.style.opacity = "0";
    if (aiSuccess) aiSuccess.style.opacity = "0";

    scene.querySelectorAll(".ai-message").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(10px)";
    });
  }

  // Variable timing per step - last step gets more time
  const stepDurations = [
    2500, // Step 0: Press hotkey
    2500, // Step 1: Select region
    2200, // Step 2: Captured
    2800, // Step 3: Add markers
    4500, // Step 4: Send to AI - LONGER to show full interaction
  ];

  function scheduleNextStep() {
    const duration = stepDurations[currentStep] || 2500;
    setTimeout(() => {
      if (currentStep >= 0) {
        resetScene(steps[currentStep].scene);
      }
      const nextIndex = (currentStep + 1) % steps.length;
      showStep(nextIndex);
      scheduleNextStep();
    }, duration);
  }

  // Initialize - reset all scenes first
  scenes.forEach((_, i) => resetScene(i));

  // Start
  showStep(0);
  scheduleNextStep();
})();

// Copy install command
(function () {
  const copyBtn = document.getElementById("copy-btn");
  const installCommandCode = document.getElementById("install-command");

  if (!copyBtn || !installCommandCode) return;

  copyBtn.addEventListener("click", () => {
    const command = installCommandCode.textContent || "";
    navigator.clipboard.writeText(command).then(() => {
      const icon = copyBtn.querySelector(".material-symbols-outlined");
      const text = copyBtn.childNodes[copyBtn.childNodes.length - 1];

      if (icon) icon.textContent = "check";
      if (text && text.nodeType === Node.TEXT_NODE) text.textContent = " Copied!";

      copyBtn.classList.add("bg-green-600", "hover:bg-green-700");
      copyBtn.classList.remove("bg-[#171717]", "hover:bg-black");

      setTimeout(() => {
        if (icon) icon.textContent = "content_copy";
        if (text && text.nodeType === Node.TEXT_NODE) text.textContent = " Copy";
        copyBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        copyBtn.classList.add("bg-[#171717]", "hover:bg-black");
      }, 2000);
    });
  });
})();
