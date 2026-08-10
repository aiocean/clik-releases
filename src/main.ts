import "./style.css";

// ── MOBILE MENU TOGGLE ─────────────────────────────────────────────────────
document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
  document.getElementById("mobile-menu")?.classList.toggle("hidden");
});

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mobile-menu")?.classList.add("hidden");
  });
});

// ── WORKFLOW DEMO ─────────────────────────────────────────────────────────
// Loops through 5 scenes — capture, select, flash, annotate, ship to ai.
(function () {
  const stepLabel = document.getElementById("step-label");
  const stepDots = document.querySelectorAll<HTMLElement>(".step-dot");
  const scenes = document.querySelectorAll<HTMLElement>(".scene");

  if (!stepLabel || stepDots.length === 0 || scenes.length === 0) return;

  // Voice-aligned step labels — terminal log style.
  const steps = [
    { label: "// hit ⌘⇧S", scene: 0 },
    { label: "// region", scene: 1 },
    { label: "// captured ✓", scene: 2 },
    { label: "// markers ▰", scene: 3 },
    { label: "// → ai", scene: 4 },
  ];

  let currentStep = -1;

  // NULLSECT lime + dim — replaces orange/white from previous palette.
  const ACCENT_ON = "#caff33";
  const DOT_OFF = "rgba(202,255,51,0.20)";

  const setStyle = (el: Element | null, styles: Record<string, string>) => {
    if (el instanceof HTMLElement) Object.assign(el.style, styles);
  };

  function showStep(stepIndex: number) {
    currentStep = stepIndex;
    const step = steps[stepIndex];

    if (stepLabel) stepLabel.textContent = step.label;

    stepDots.forEach((dot, i) => {
      setStyle(dot, {
        background: i === stepIndex ? ACCENT_ON : DOT_OFF,
        boxShadow: i === stepIndex ? `0 0 0 2px ${ACCENT_ON}` : "none",
      });
    });

    scenes.forEach((scene, i) => {
      setStyle(scene, { opacity: i === step.scene ? "1" : "0" });
    });

    setTimeout(() => animateScene(step.scene), 150);
  }

  function animateScene(sceneIndex: number) {
    const scene = scenes[sceneIndex];
    if (!scene) return;

    switch (sceneIndex) {
      case 0: {
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
        const crosshair = scene.querySelector(".crosshair") as HTMLElement;
        const selectionBox = scene.querySelector(".selection-box") as HTMLElement;
        const container = scene.querySelector(".skeleton-box") as HTMLElement;
        const rect = container?.getBoundingClientRect();

        const selW = rect ? rect.width * 0.8 : 320;
        const selH = rect ? rect.height * 0.65 : 180;

        if (crosshair && selectionBox) {
          crosshair.style.opacity = "1";
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
        const flash = scene.querySelector(".capture-flash") as HTMLElement;
        const result = scene.querySelector(".capture-result") as HTMLElement;
        if (flash) {
          flash.style.transition = "opacity 0.15s ease-out";
          flash.style.opacity = "0.85";
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
        const uploadBar = scene.querySelector(".upload-bar") as HTMLElement;
        const uploadSuccess = scene.querySelector(".upload-success") as HTMLElement;
        const uploadLabel = scene.querySelector(".upload-label") as HTMLElement;
        const messages = scene.querySelectorAll(".ai-message") as NodeListOf<HTMLElement>;
        const aiSuccess = scene.querySelector(".ai-success") as HTMLElement;

        if (uploadBar) setTimeout(() => (uploadBar.style.width = "100%"), 100);

        if (uploadSuccess) {
          setTimeout(() => {
            uploadSuccess.style.opacity = "1";
            uploadSuccess.style.transform = "scale(1)";
          }, 900);
        }

        if (uploadLabel) setTimeout(() => (uploadLabel.style.opacity = "1"), 1000);

        messages.forEach((msg, i) => {
          setTimeout(() => {
            msg.style.opacity = "1";
            msg.style.transform = "translateY(0)";
          }, 600 + i * 450);
        });

        if (aiSuccess) setTimeout(() => (aiSuccess.style.opacity = "1"), 1800);
        break;
      }
    }
  }

  function resetScene(sceneIndex: number) {
    const scene = scenes[sceneIndex];
    if (!scene) return;

    const hotkey = scene.querySelector(".hotkey-hint") as HTMLElement;
    if (hotkey) {
      hotkey.style.opacity = "0";
      hotkey.style.transform = "scale(0.9)";
    }

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

    const flash = scene.querySelector(".capture-flash") as HTMLElement;
    const result = scene.querySelector(".capture-result") as HTMLElement;
    if (flash) flash.style.opacity = "0";
    if (result) {
      result.style.opacity = "0";
      result.style.transform = "scale(0.95)";
    }

    scene.querySelectorAll(".tool-icon").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0)";
    });
    scene.querySelectorAll(".annotation-marker").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0)";
    });

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

  const stepDurations = [2500, 2500, 2200, 2800, 4500];

  function scheduleNextStep() {
    const duration = stepDurations[currentStep] || 2500;
    setTimeout(() => {
      if (currentStep >= 0) resetScene(steps[currentStep].scene);
      const nextIndex = (currentStep + 1) % steps.length;
      showStep(nextIndex);
      scheduleNextStep();
    }, duration);
  }

  scenes.forEach((_, i) => resetScene(i));
  showStep(0);
  scheduleNextStep();
})();

// ── COPY INSTALL COMMAND ──────────────────────────────────────────────────
(function () {
  const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement | null;
  const installCommand = document.getElementById("install-command");
  const copyIcon = document.getElementById("copy-icon");
  const copyText = document.getElementById("copy-text");

  if (!copyBtn || !installCommand) return;

  copyBtn.addEventListener("click", () => {
    const command = (installCommand.textContent || "").trim();
    navigator.clipboard.writeText(command).then(() => {
      if (copyIcon) copyIcon.textContent = "✓";
      if (copyText) copyText.textContent = "[ack] copied";

      setTimeout(() => {
        if (copyIcon) copyIcon.textContent = "⎘";
        if (copyText) copyText.textContent = "copy";
      }, 2000);
    });
  });
})();
