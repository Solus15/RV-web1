/**
 * RV Electricals Industries - Main Interactive JavaScript
 * High Performance Animation & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initStickyNav();
  initElectricCanvas();
  initCounters();
  initScrollReveal();
  initTransformerCalculator();
  initProductFilter();
  initProcessStepper();
  initLightbox();
  initFaqAccordion();
  initMobileMenu();
  initForms();
});

/* ==========================================================================
   1. SCROLL PROGRESS & BACK TO TOP
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   2. STICKY NAVBAR BEHAVIOR
   ========================================================================== */
function initStickyNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. ELECTRIC ENERGY CANVAS BACKGROUND (HERO SECTION)
   ========================================================================== */
function initElectricCanvas() {
  const canvas = document.getElementById('electric-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class EnergyParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.2;
      this.color = Math.random() > 0.4 ? '#00d4ff' : '#0b5cff';
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }

      this.pulse += 0.04;
    }

    draw() {
      ctx.beginPath();
      const currentRadius = this.radius + Math.sin(this.pulse) * 0.5;
      ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 12000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new EnergyParticle());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.28})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   4. ANIMATED COUNTERS FOR STATS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseFloat(target.getAttribute('data-target'));
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * countTo);

          target.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = countTo.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   5. SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   6. INTERACTIVE TRANSFORMER CAPACITY & SIZING CALCULATOR
   ========================================================================== */
function initTransformerCalculator() {
  const capacityRange = document.getElementById('calc-capacity');
  const capacityDisplay = document.getElementById('calc-capacity-val');
  const voltageSelect = document.getElementById('calc-voltage');
  const coolingSelect = document.getElementById('calc-cooling');

  // Outputs
  const modelOutput = document.getElementById('out-model');
  const weightOutput = document.getElementById('out-weight');
  const oilOutput = document.getElementById('out-oil');
  const efficiencyOutput = document.getElementById('out-efficiency');
  const impedanceOutput = document.getElementById('out-impedance');
  const quoteBtn = document.getElementById('calc-quote-btn');

  if (!capacityRange || !capacityDisplay) return;

  function calculateSpecs() {
    const kva = parseInt(capacityRange.value, 10);
    const voltage = voltageSelect ? voltageSelect.value : '11kv';
    const cooling = coolingSelect ? coolingSelect.value : 'ONAN';

    // Format display string
    if (kva >= 1000) {
      capacityDisplay.textContent = (kva / 1000).toFixed(kva % 1000 === 0 ? 0 : 1) + ' MVA';
    } else {
      capacityDisplay.textContent = kva + ' kVA';
    }

    // Determine Model Series
    let modelName = 'RV-DT-' + kva;
    let weightKg = Math.round(kva * 4.2 + 250);
    let oilLiters = Math.round(kva * 1.35 + 85);
    let efficiency = '98.8% (BEE Level-2)';
    let impedance = '4.5%';

    if (cooling === 'AN') {
      modelName = 'RV-CRT-Dry-' + kva;
      oilLiters = 0; // Dry type
      weightKg = Math.round(kva * 3.8 + 200);
      efficiency = '98.5% (Class F/H)';
      impedance = '5.0%';
    } else if (kva >= 3150 || voltage.includes('33') || voltage.includes('132')) {
      modelName = 'RV-PT-Power-' + (kva >= 1000 ? (kva / 1000) + 'MVA' : kva + 'kVA');
      weightKg = Math.round(kva * 5.1 + 800);
      oilLiters = Math.round(kva * 1.6 + 350);
      efficiency = '99.4% (Heavy Duty)';
      impedance = '7.15%';
    }

    if (modelOutput) modelOutput.textContent = modelName;
    if (weightOutput) weightOutput.textContent = weightKg.toLocaleString() + ' kg';
    if (oilOutput) oilOutput.textContent = oilLiters === 0 ? 'N/A (Dry Cast Resin)' : oilLiters.toLocaleString() + ' Ltrs';
    if (efficiencyOutput) efficiencyOutput.textContent = efficiency;
    if (impedanceOutput) impedanceOutput.textContent = impedance;

    if (quoteBtn) {
      quoteBtn.href = `contact.html?kva=${kva}&voltage=${encodeURIComponent(voltage)}&cooling=${encodeURIComponent(cooling)}#quote-form`;
    }
  }

  capacityRange.addEventListener('input', calculateSpecs);
  if (voltageSelect) voltageSelect.addEventListener('change', calculateSpecs);
  if (coolingSelect) coolingSelect.addEventListener('change', calculateSpecs);

  calculateSpecs();
}

/* ==========================================================================
   7. PRODUCT CATEGORY FILTER
   ========================================================================== */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length === 0 || productCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   8. MANUFACTURING PROCESS STEPPER
   ========================================================================== */
const processData = {
  1: {
    title: "1. Computer-Aided Magnetic Simulation & Design",
    desc: "Every RV Electricals transformer starts with proprietary finite-element magnetic modeling to optimize flux distribution, minimize eddy current loss, and ensure short-circuit mechanical bracing.",
    points: [
      "Custom optimization for utility tender specifications (IS 2026 / IEC 60076)",
      "Low loss guarantee adhering to BEE Star standards",
      "Short-circuit dynamic forces analysis & thermal gradient mapping"
    ],
    image: "Images/Firefly_Gemini Flash_Just enhance and improve the lightings  620060.png"
  },
  2: {
    title: "2. Precision CNC Step-Lap Core Stacking",
    desc: "We utilize prime grade Cold Rolled Grain Oriented (CRGO) silicon steel (M3, M4, Hi-B grade) cut on automated 45-degree mitered lines with full step-lap stacking.",
    points: [
      "Step-lap joint technology dramatically reduces no-load losses and noise",
      "Rigid channel and tie-rod core clamping prevents vibrational movement",
      "Surface treated with anti-corrosive insulating varnish"
    ],
    image: "Images/Firefly_Gemini Flash_Enhance the lighting and enhance the overall dynamics of the photo 61702.png"
  },
  3: {
    title: "3. Cleanroom Copper Coil Winding",
    desc: "Windings are crafted using 99.9% electrolytic grade high-conductivity copper insulated with thermally upgraded Kraft paper or Nomex aramid paper.",
    points: [
      "Helical, cross-over, and continuous disc winding geometries",
      "Radial and axial oil cooling ducts maintain uniform temperature rise",
      "Pre-compressed and clamped to withstand severe grid fault surges"
    ],
    image: "Images/Firefly_Gemini Flash_Make the subject wear a workers helmat and make it look aesthatically pleasing and do 90507.png"
  },
  4: {
    title: "4. Vacuum Oven Baking & Tanking",
    desc: "Assembled core-coil assemblies undergo thorough drying in temperature-controlled vacuum chambers to reduce moisture content below 0.5% before tanking.",
    points: [
      "Deep vacuum cycle extracts all trapped air and humidity",
      "High-tensile steel tank with shot-blasted surface and epoxy primer",
      "Hermetic sealing with premium Neoprene gaskets"
    ],
    image: "Images/WhatsApp Image 2026-05-27 at 12.37.03 PM.jpeg"
  },
  5: {
    title: "5. Automated De-aerated Oil Impregnation",
    desc: "Mineral insulating oil complying with IS 335 / IEC 60296 is processed through multi-stage filtration, heated, and injected under deep continuous vacuum.",
    points: [
      "Breakdown Voltage (BDV) guaranteed > 65 kV before dispatch",
      "Moisture content maintained < 10 ppm for maximum dielectric strength",
      "Option for synthetic ester and fire-resistant fluids"
    ],
    image: "Images/Firefly_Gemini Flash_Just enhance and improve the lightings 439904.png"
  },
  6: {
    title: "6. 100% NABL Lab Routine & Type Testing",
    desc: "Every single unit undergoes rigorous testing in our computerized testing station before leaving the factory yard for grid commissioning.",
    points: [
      "Voltage Ratio, Phase Angle, Vector Group & Polarity",
      "No-Load Losses, Load Losses & Impedance Measurement",
      "Separate Source & Induced Overvoltage (DVDF) Dielectric Tests",
      "Insulation Resistance & Winding Resistance Verification"
    ],
    image: "Images/Firefly_Gemini Flash_Make it look more asthetically pleasing and remove the mens in the background  55410.png"
  }
};

function initProcessStepper() {
  const stepTabs = document.querySelectorAll('.step-tab');
  const stepTitle = document.getElementById('step-title');
  const stepDesc = document.getElementById('step-desc');
  const stepList = document.getElementById('step-checklist');
  const stepImg = document.getElementById('step-img');

  if (!stepTitle || stepTabs.length === 0) return;

  stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stepTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const stepNum = tab.getAttribute('data-step');
      const data = processData[stepNum];
      if (data) {
        stepTitle.textContent = data.title;
        stepDesc.textContent = data.desc;

        stepList.innerHTML = '';
        data.points.forEach(point => {
          const li = document.createElement('li');
          li.textContent = point;
          stepList.appendChild(li);
        });

        if (stepImg) {
          stepImg.src = data.image;
        }
      }
    });
  });
}

/* ==========================================================================
   9. LIGHTBOX GALLERY
   ========================================================================== */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || galleryItems.length === 0) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || (img ? img.alt : '');

      if (img && modalImg) {
        modalImg.src = img.src;
        if (modalCaption) modalCaption.textContent = caption;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. TECHNICAL SPECS MODAL
   ========================================================================== */
const specsDatabase = {
  power: {
    title: "RV Heavy-Duty Power Transformer (Up to 50 MVA, 132kV)",
    specs: [
      ["Capacity Range", "3,150 kVA to 50,000 kVA (50 MVA)"],
      ["Primary Voltage Class", "33 kV / 66 kV / 132 kV"],
      ["Secondary Voltage", "11 kV / 33 kV / 433 V"],
      ["Cooling Type", "ONAN / ONAF (Forced Air Cooling)"],
      ["Applicable Standard", "IS 2026, IEC 60076, CBIP Manual"],
      ["Core Material", "Hi-B Laser Scribed Prime CRGO Silicon Steel"],
      ["Winding Conductor", "99.9% Electrolytic Grade Copper"],
      ["Tapping Range", "Off-Circuit Tap Switch (±5%) or OLTC (±10% in 16 steps)"],
      ["Vector Group", "Dyn11, YNd11, YNyn0 or as per tender requirement"],
      ["Insulation Class", "Class A (Mineral Oil) or Class K (Ester Fluid)"]
    ]
  },
  distribution: {
    title: "RV Energy-Efficient Distribution Transformer (16 kVA - 2500 kVA)",
    specs: [
      ["Capacity Range", "16 kVA, 25 kVA, 63 kVA, 100 kVA, 250 kVA, 500 kVA to 2,500 kVA"],
      ["Voltage Class", "11 kV & 33 kV / 433 V"],
      ["Energy Efficiency", "BEE Star-1, Star-2 & Level-2 / Level-3 (IS 1180 Part 1)"],
      ["Cooling Type", "ONAN (Oil Natural Air Natural)"],
      ["Mounting", "Pole Mounted (up to 100 kVA) / Plinth Mounted (160 kVA+)"],
      ["Conservator", "Sealed / Conventional with silica gel breather"],
      ["Tank Structure", "Corrugated Fins or Pressed Steel Elliptical Radiators"],
      ["Bushing Type", "Porcelain Bushings or Elastimold Plug-In Bushings"]
    ]
  },
  drytype: {
    title: "RV Cast Resin Dry-Type Transformer (CRT / VPI Class F/H)",
    specs: [
      ["Capacity Range", "100 kVA to 3,150 kVA"],
      ["Voltage Class", "Up to 33 kV Primary, 433 V Secondary"],
      ["Cooling", "AN (Air Natural) or AF (Air Forced)"],
      ["Fire Safety", "Self-extinguishing, zero halogen, F1 fire rating"],
      ["Environmental Class", "E2 environmental, C2 climatic rated"],
      ["Enclosure Protection", "IP00, IP23, IP33 or IP54 indoor/outdoor enclosure"],
      ["Temperature Sensors", "PT100 RTD sensors embedded in each phase with digital scanner"],
      ["Ideal Applications", "Commercial Malls, Hospitals, Metro Rail, Underground Mines"]
    ]
  },
  solar: {
    title: "RV Solar & Wind Inverter Step-Up Duty Transformer",
    specs: [
      ["Capacity Range", "1,000 kVA to 12,500 kVA"],
      ["Voltage Class", "Up to 33 kV Step-Up"],
      ["Low Voltage Inputs", "Dual / Triple / Quad LV windings for multi-inverter inputs"],
      ["Harmonic Tolerance", "K-Factor rated up to K-13 for non-linear inverter currents"],
      ["Electrostatic Shield", "Shielded between HV and LV to protect against inverter switching surges"],
      ["Ambient Rating", "Designed for harsh solar park ambient up to 50°C continuous"]
    ]
  }
};

window.openSpecsModal = function(key) {
  const modal = document.getElementById('specs-modal');
  const titleEl = document.getElementById('specs-modal-title');
  const bodyEl = document.getElementById('specs-modal-body');

  if (!modal || !specsDatabase[key]) return;

  const data = specsDatabase[key];
  if (titleEl) titleEl.textContent = data.title;

  let html = '<table class="specs-table"><thead><tr><th>Technical Parameter</th><th>Specification & Standard</th></tr></thead><tbody>';
  data.specs.forEach(([param, val]) => {
    html += `<tr><td><strong>${param}</strong></td><td>${val}</td></tr>`;
  });
  html += '</tbody></table>';

  if (bodyEl) bodyEl.innerHTML = html;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeSpecsModal = function() {
  const modal = document.getElementById('specs-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   11. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

/* ==========================================================================
   12. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    toggleBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target) && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggleBtn.textContent = '☰';
    }
  });
}

/* ==========================================================================
   13. FORM SUBMISSION & TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function initForms() {
  // Check for pre-filled URL parameters (from Calculator)
  const urlParams = new URLSearchParams(window.location.search);
  const kvaParam = urlParams.get('kva');
  const voltageParam = urlParams.get('voltage');

  const capacityInput = document.getElementById('rfq-capacity');
  const voltageInput = document.getElementById('rfq-voltage');

  if (kvaParam && capacityInput) {
    capacityInput.value = kvaParam >= 1000 ? (kvaParam / 1000) + ' MVA' : kvaParam + ' kVA';
  }
  if (voltageParam && voltageInput) {
    voltageInput.value = voltageParam;
  }

  // Handle all contact and RFQ forms with live delivery to tushar.anand.155@gmail.com
  const forms = document.querySelectorAll('form.ajax-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⚡ Transmitting RFQ...</span>';
      }

      try {
        const formData = new FormData(form);
        const objectData = {};
        formData.forEach((value, key) => {
          objectData[key] = value;
        });

        const response = await fetch("https://formsubmit.co/ajax/tushar.anand.155@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(objectData)
        });

        if (response.ok) {
          showToast('✅ RFQ Sent! Delivered to tushar.anand.155@gmail.com.');
          form.reset();
        } else {
          // If first-time activation or network error, submit via standard form POST
          form.submit();
        }
      } catch (err) {
        console.error("Transmission error, falling back to standard submit:", err);
        form.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  });

  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to our Industrial Power Bulletins.');
      newsletterForm.reset();
    });
  }
}
