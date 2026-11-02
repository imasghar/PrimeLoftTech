/**
 * PrimeLoft Tech - PrimeLoft Guide (Rule-Based Interactive Chatbot)
 * Features:
 * - Floating prompt teaser card ("Not sure which service you need?")
 * - Concentric ring launcher button with speech bubble icon
 * - Multi-step interactive diagnostic questionnaire
 * - Services match the current header and footer catalog, with an optional custom inquiry.
 * - Custom free-text entry when 'Other' is chosen
 * - Straightforward timeline selector
 * - Step-by-step contact input stepper (Name -> Email -> Notes/Consent)
 * - Animated typing indicator before bot messages
 * - Native AJAX submission to Formspree AI endpoint
 * - Direct WhatsApp and Close actions at completion (no suggestion cards)
 * - Responsive chat panel styled to match the PrimeLoft website
 * - Isolated scrolling: does not scroll parent website
 */

export class ChatbotService {
  static services = [
  {
    "label": "UX/UI",
    "question": "What kind of design help do you need?",
    "options": [
      "UX research or an audit",
      "Website or mobile app design",
      "Figma prototype or design system"
    ],
    "guidance": "We can scope research, user flows, wireframes, interactive prototypes and design systems."
  },
  {
    "label": "Custom Website",
    "question": "What would you like your website to do?",
    "options": [
      "Business website or landing page",
      "E-commerce or booking website",
      "Custom web application or portal"
    ],
    "guidance": "We can plan responsive pages, content structure, functionality and the development approach."
  },
  {
    "label": "Mobile Application",
    "question": "What do you need for your mobile application?",
    "options": [
      "New iOS and Android application",
      "Improve an existing mobile app",
      "Mobile MVP or prototype"
    ],
    "guidance": "We can review your core app journeys, target platforms and the features needed for your next release."
  },
  {
    "label": "SEO",
    "question": "Where do you need help with search visibility?",
    "options": [
      "Technical SEO audit",
      "On-page SEO and content structure",
      "Off-page SEO",
      "A complete SEO plan"
    ],
    "guidance": "We can review technical issues, page content and search priorities before proposing an SEO scope."
  },
  {
    "label": "Automation",
    "question": "What would you like to automate?",
    "options": [
      "Repetitive business workflows",
      "Connect apps, APIs or data",
      "AI-assisted tasks and processes"
    ],
    "guidance": "We can map the current process, integrations and approval steps to identify a practical automation approach."
  },
  {
    "label": "DevOps",
    "question": "Which part of your delivery setup needs attention?",
    "options": [
      "CI/CD and automated deployments",
      "Cloud infrastructure and environments",
      "Monitoring and deployment reliability"
    ],
    "guidance": "We can review your deployment workflow, infrastructure and monitoring needs to define the right DevOps scope."
  },
  {
    "label": "Testing & QA",
    "question": "What would you like us to test?",
    "options": [
      "Website or mobile app testing",
      "Automated regression tests",
      "Performance or usability testing"
    ],
    "guidance": "We can define test coverage, priority user journeys and a reporting approach for your product."
  },
  {
    "label": "Maintenance",
    "question": "What kind of ongoing support do you need?",
    "options": [
      "Bug fixes and troubleshooting",
      "Updates, backups and security maintenance",
      "Ongoing improvements and support"
    ],
    "guidance": "We can review your existing product and agree the support tasks, priorities and maintenance arrangement."
  },
  {
    "label": "WordPress",
    "question": "What do you need for your WordPress website?",
    "options": [
      "New WordPress website",
      "WooCommerce store",
      "Redesign, migration or maintenance"
    ],
    "guidance": "We can scope your WordPress pages, theme needs, integrations and ongoing management requirements."
  },
  {
    "label": "Squarespace",
    "question": "What do you need for your Squarespace website?",
    "options": [
      "New Squarespace website",
      "Redesign or custom styling",
      "Content migration or store setup"
    ],
    "guidance": "We can review your content, layout and Squarespace setup to plan a website that fits your requirements."
  }
];

  static escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  }


  static init() {
    if (document.getElementById('plChatWidget')) return;
    this.state = {
      isOpen: false,
      submitted: false,
      step: 1, // 1: service, 2: stage/custom, 3: timeline, 4: guidance, 5: contact, 6: done
      contactSubStep: 1, // 1: name, 2: email, 3: notes & consent
      totalSteps: 5,
      answers: {
        service: '',
        stage: '',
        timeline: '',
        name: '',
        email: '',
        notes: '',
        consent: true
      }
    };

    this.renderWidget();
    this.bindEvents();
    this.renderCurrentStep();
  }

  static renderWidget() {
    const guideIcon = `<svg class="pl-guide-mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 5H10a6 6 0 0 0-6 6v4a6 6 0 0 0 6 6h1l-1 4 6-4h2a6 6 0 0 0 6-6v-2"/><path d="m23 2 1.1 3.4L27 6.5l-2.9 1.1L23 11l-1.1-3.4L19 6.5l2.9-1.1L23 2Z"/><circle cx="10" cy="13" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r=".9" fill="currentColor" stroke="none"/></svg>`;
    const root = document.createElement('div');
    root.id = 'plChatWidget';
    root.className = 'pl-chat-widget';
    root.innerHTML = `
      <!-- Prompt Callout Card -->
      <div class="pl-chat-prompt-card" id="plChatPromptCard">
        <div class="pl-prompt-header">
          <div class="pl-prompt-bot-wrap">
            <div class="pl-prompt-bot" id="plPromptBot" aria-hidden="true">${guideIcon}</div>
            <span class="pl-prompt-pulse"></span>
          </div>
          <div class="pl-prompt-header-text">
            <span class="pl-prompt-kicker">PrimeLoft Guide</span>
            <h4 class="pl-prompt-title">Not sure which service you need?</h4>
          </div>
        </div>
        <p class="pl-prompt-desc">Answer a few quick questions and I'll point you to the right team.</p>
        <div class="pl-prompt-actions">
          <button class="pl-prompt-btn-go" id="plPromptGo" type="button">Let's go</button>
          <button class="pl-prompt-btn-dismiss" id="plPromptDismiss" type="button">Not now</button>
        </div>
      </div>

      <!-- Floating launcher with a static brand icon -->
      <button class="pl-chat-launcher" id="plChatLauncher" type="button" aria-label="Open PrimeLoft Project Guide" aria-controls="plChatWindow" aria-expanded="false">
        <span class="pl-chat-launcher-ring" aria-hidden="true">
          <span class="pl-chat-launcher-inner">
            <span class="pl-chat-launcher-icon open-icon" id="plChatLauncherBot" aria-hidden="true">${guideIcon}</span>
            <span class="pl-chat-launcher-icon close-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </span>
          </span>
        </span>
      </button>

      <!-- Self-contained, non-modal project guide panel -->
      <div class="pl-chat-window" id="plChatWindow" role="dialog" aria-modal="false" aria-labelledby="plChatTitle" data-lenis-prevent hidden>
        <!-- Project guide header -->
        <div class="pl-chat-header">
          <div class="pl-chat-header-info">
            <div class="pl-chat-header-avatar">
              <div class="pl-chat-header-bot" id="plChatHeaderBot" aria-hidden="true">${guideIcon}</div>

            </div>
            <div class="pl-chat-title-group">
              <h3 class="pl-chat-title" id="plChatTitle">PrimeLoft Guide</h3>
              <span class="pl-chat-subtitle">Project assistant</span>
            </div>
          </div>
          <div class="pl-chat-header-actions">
            <button class="pl-chat-btn-action" id="plChatClose" aria-label="Close chat window" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Stepper Progress Tracker -->
        <div class="pl-chat-stepper">
          <div class="pl-stepper-heading"><span class="pl-stepper-label" id="plStepperLabel">Step 1 of 5</span><span class="pl-stepper-stage" id="plStepperStage">Choose a service</span></div>
          <div class="pl-stepper-track" role="progressbar" aria-label="Project inquiry progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20">
            <div class="pl-stepper-fill" id="plStepperFill" style="width: 20%;"></div>
          </div>
        </div>

        <!-- Scrollable Conversation Area -->
        <div class="pl-chat-body" id="plChatBody" role="log" aria-live="polite" data-lenis-prevent>
          <!-- Dynamically populated -->
        </div>

        <!-- Footer Actions Bar -->
        <div class="pl-chat-footer">
          <span class="pl-footer-help">Prefer a person? <a href="contact.html" id="plFooterContactLink">Talk to the team</a></span>
          <button class="pl-footer-restart" id="plChatRestart" type="button">Restart</button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Check if prompt was previously dismissed in session
    if (sessionStorage.getItem('pl-guide-prompt-dismissed') === 'true') {
      const promptCard = document.getElementById('plChatPromptCard');
      if (promptCard) promptCard.style.display = 'none';
    }
  }

  static bindEvents() {
    const launcher = document.getElementById('plChatLauncher');
    const closeBtn = document.getElementById('plChatClose');
    const restartBtn = document.getElementById('plChatRestart');
    const promptGo = document.getElementById('plPromptGo');
    const promptDismiss = document.getElementById('plPromptDismiss');

    if (launcher) {
      launcher.addEventListener('click', () => {
        this.dismissPromptCard();
        this.toggleChat();
      });
    }

    if (promptGo) {
      promptGo.addEventListener('click', () => {
        this.dismissPromptCard();
        this.openChat();
      });
    }

    if (promptDismiss) {
      promptDismiss.addEventListener('click', () => {
        this.dismissPromptCard();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeChat());
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restart());
    }

    // Scroll Isolation: Prevent parent page / Lenis from scrolling when cursor is over chat window
    const win = document.getElementById('plChatWindow');
    if (win) {
      win.addEventListener('wheel', (e) => {
        const body = document.getElementById('plChatBody');
        if (!body) return;

        const isOverBody = e.target.closest('#plChatBody');
        if (!isOverBody) {
          body.scrollTop += e.deltaY;
          e.preventDefault();
        } else {
          const atTop = body.scrollTop <= 0 && e.deltaY < 0;
          const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1 && e.deltaY > 0;
          if (atTop || atBottom) {
            e.preventDefault();
          }
        }
        e.stopPropagation();
      }, { passive: false });
    }

    // Keyboard support: Escape closes the window
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isOpen) {
        this.closeChat();
      }
    });
  }

  static dismissPromptCard() {
    const card = document.getElementById('plChatPromptCard');
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px) scale(0.95)';
      card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
    try {
      sessionStorage.setItem('pl-guide-prompt-dismissed', 'true');
    } catch (_) {}
  }

  static toggleChat() {
    if (this.state.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  static openChat() {
    this.state.isOpen = true;
    this.dismissPromptCard();
    const win = document.getElementById('plChatWindow');
    const launcher = document.getElementById('plChatLauncher');
    if (win) {
      win.hidden = false;
      win.classList.add('is-open');
    }
    if (launcher) {
      launcher.classList.add('is-active');
      launcher.setAttribute('aria-expanded', 'true');
      launcher.setAttribute('aria-label', 'Close PrimeLoft Project Guide');
    }
    document.getElementById('plChatClose')?.focus({ preventScroll: true });
    this.scrollToBottom();
  }

  static closeChat() {
    this.state.isOpen = false;
    const win = document.getElementById('plChatWindow');
    const launcher = document.getElementById('plChatLauncher');
    if (win) {
      win.classList.remove('is-open');
      setTimeout(() => {
        if (!this.state.isOpen) win.hidden = true;
      }, 250);
    }
    if (launcher) {
      launcher.classList.remove('is-active');
      launcher.setAttribute('aria-expanded', 'false');
      launcher.setAttribute('aria-label', 'Open PrimeLoft Project Guide');
      launcher.focus({ preventScroll: true });
    }
  }

  static restart() {
    this.state.step = 1;
    this.state.submitted = false;
    this.state.contactSubStep = 1;
    this.state.answers = {
      service: '',
      stage: '',
      timeline: '',
      name: '',
      email: '',
      notes: '',
      consent: true
    };
    const body = document.getElementById('plChatBody');
    if (body) body.innerHTML = '';
    this.renderCurrentStep();
  }

  static updateStepper(stepText, percent) {
    const label = document.getElementById('plStepperLabel');
    const fill = document.getElementById('plStepperFill');
    if (label) label.textContent = stepText.replace(/^STEP (\d) OF (\d).*$/, 'Step $1 of $2').replace('DONE', 'Complete');
    const stages = ['Choose a service', 'Project details', 'Your timeline', 'Next steps', 'Contact details', 'Thank you'];
    const stage = document.getElementById('plStepperStage');
    if (stage) stage.textContent = stages[this.state.step - 1] || '';
    document.querySelector('.pl-stepper-track')?.setAttribute('aria-valuenow', String(percent));
    if (fill) fill.style.width = `${percent}%`;
  }

  static scrollToBottom() {
    const body = document.getElementById('plChatBody');
    if (body) {
      requestAnimationFrame(() => {
        body.scrollTop = body.scrollHeight;
      });
    }
  }

  /**
   * Typing Indicator Simulator
   * Shows animated dots bubble before delivering bot message
   */
  static showTyping(callback, delay = 450) {
    const body = document.getElementById('plChatBody');
    if (!body) {
      callback();
      return;
    }

    const existing = document.getElementById('plChatTyping');
    if (existing) existing.remove();

    const typingBubble = document.createElement('div');
    typingBubble.id = 'plChatTyping';
    typingBubble.className = 'pl-bubble pl-bubble-bot pl-typing-bubble';
    typingBubble.setAttribute('aria-label', 'PrimeLoft Guide is typing');
    typingBubble.innerHTML = `
      <span class="pl-typing-dot"></span>
      <span class="pl-typing-dot"></span>
      <span class="pl-typing-dot"></span>
    `;

    body.appendChild(typingBubble);
    this.scrollToBottom();

    setTimeout(() => {
      typingBubble.remove();
      callback();
    }, delay);
  }

  static appendBotBubble(htmlText) {
    const body = document.getElementById('plChatBody');
    if (!body) return;
    const bubble = document.createElement('div');
    bubble.className = 'pl-bubble pl-bubble-bot';
    bubble.innerHTML = htmlText;
    body.appendChild(bubble);
    this.scrollToBottom();
  }

  static appendUserBubble(text) {
    const body = document.getElementById('plChatBody');
    if (!body) return;
    const bubble = document.createElement('div');
    bubble.className = 'pl-bubble pl-bubble-user';
    bubble.textContent = text;
    body.appendChild(bubble);
    this.scrollToBottom();
  }

  static renderCurrentStep() {
    const body = document.getElementById('plChatBody');
    if (!body) return;

    // STEP 1: Select Service
    if (this.state.step === 1) {
      this.updateStepper('STEP 1 OF 5', 20);
      this.showTyping(() => {
        this.appendBotBubble('Which service are you looking for?');

        const choices = this.services.map(service => ({ label: service.label, val: service.label }));
        choices.push({ label: 'Other / Not sure yet', val: 'Other' });
        this.renderChoiceButtons(choices, (val) => {
          this.state.answers.service = val;
          this.state.step = 2;
          this.renderCurrentStep();
        });
      }, 400);
      return;
    }

    // STEP 2: Follow-up question tailored to the selected service
    if (this.state.step === 2) {
      this.updateStepper('STEP 2 OF 5', 40);
      const service = this.state.answers.service;

      // If 'Other' service was selected, allow typing custom description
      if (service === 'Other') {
        this.showTyping(() => {
          this.appendBotBubble("No problem! Please describe what you need in your own words:");

          const card = document.createElement('div');
          card.className = 'pl-input-step-card';
          card.id = 'plCardStepOther';
          card.innerHTML = `
            <form class="pl-input-step-form" id="plFormStepOther" novalidate>
              <div class="pl-form-group">
                <textarea class="pl-input-step-field pl-input-step-textarea" id="plInputStepOther" aria-label="Project requirements" rows="3" placeholder="Tell us about the project, technology, or service you need..." required></textarea>
              </div>
              <span class="pl-form-error" id="plErrorStepOther" aria-live="polite"></span>
              <button class="pl-btn-step-next" id="plBtnOtherNext" type="submit" style="align-self: flex-end; margin-top: 4px;">
                <span>Next</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </form>
          `;

          body.appendChild(card);
          this.scrollToBottom();

          const form = card.querySelector('#plFormStepOther');
          const input = card.querySelector('#plInputStepOther');
          const err = card.querySelector('#plErrorStepOther');

          setTimeout(() => input.focus(), 150);

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              form.requestSubmit();
            }
          });

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            err.textContent = '';
            const val = input.value.trim();
            if (!val || val.length < 3) {
              err.textContent = 'Please provide a brief description (at least 3 characters).';
              input.focus();
              return;
            }

            this.state.answers.stage = val;
            card.remove();
            this.appendUserBubble(val);
            this.state.step = 3;
            this.renderCurrentStep();
          });
        }, 450);
        return;
      }

      const selectedService = this.services.find(item => item.label === service);
      const question = selectedService?.question || 'What would you like help with?';
      const choices = (selectedService?.options || ['New project', 'Improve an existing product', 'Advice on the right approach'])
        .map(option => ({ label: option, val: option }));

      this.showTyping(() => {
        this.appendBotBubble(question);
        this.renderChoiceButtons(choices, (val) => {
          this.state.answers.stage = val;
          this.state.step = 3;
          this.renderCurrentStep();
        });
      }, 450);
      return;
    }

    // STEP 3: Timeline question
    if (this.state.step === 3) {
      this.updateStepper('STEP 3 OF 5', 60);
      this.showTyping(() => {
        this.appendBotBubble('When would you like to start?');

        const choices = [
          { label: 'As soon as possible', val: 'As soon as possible' },
          { label: 'In 1-3 months', val: 'In 1-3 months' },
          { label: 'Just exploring / Budgeting', val: 'Just exploring / Budgeting' }
        ];
        this.renderChoiceButtons(choices, (val) => {
          this.state.answers.timeline = val;
          this.state.step = 4;
          this.renderCurrentStep();
        });
      }, 450);
      return;
    }

    // STEP 4: Rule-based guidance & confirmation
    if (this.state.step === 4) {
      this.updateStepper('STEP 4 OF 5', 80);
      const selectedService = this.services.find(item => item.label === this.state.answers.service);
      const serviceDisplay = this.escapeHtml(selectedService?.label || 'your project');
      const stageDisplay = this.escapeHtml(this.state.answers.stage);
      const timelineDisplay = this.escapeHtml(this.state.answers.timeline.toLowerCase());
      const scope = selectedService?.guidance || 'We can review your requirements and help identify the right service.';
      const guidance = `You are looking for <strong>${serviceDisplay}</strong>: ${stageDisplay}, starting <em>${timelineDisplay}</em>.<br><br>${scope}<br><br>Share your details so we can review the scope, timing and next steps.`;

      this.showTyping(() => {
        this.appendBotBubble(guidance);

        const choices = [
          { label: 'Share project details', val: 'proceed_contact' },
          { label: 'Chat on WhatsApp', val: 'skip_to_done' }
        ];
        this.renderChoiceButtons(choices, (val) => {
          if (val === 'proceed_contact') {
            this.state.step = 5;
            this.state.contactSubStep = 1;
            this.renderCurrentStep();
          } else {
            this.state.step = 6;
            this.renderCurrentStep();
          }
        });
      }, 500);
      return;
    }

    // STEP 5: Contact input flow (one field at a time with Enter & Next)
    if (this.state.step === 5) {
      this.renderStep5Input();
      return;
    }

    // STEP 6: DONE
    if (this.state.step === 6) {
      this.updateStepper('DONE', 100);
      this.showTyping(() => {
        const firstName = this.state.answers.name ? this.escapeHtml(this.state.answers.name.split(' ')[0]) : '';
        const greeting = firstName ? `Thank you, ${firstName}!` : 'Thank you!';
        this.appendBotBubble(this.state.submitted
          ? `${greeting} Your project details have been sent. Our team will review your requirements and reply using the contact details you provided.`
          : 'Continue on WhatsApp to share your project with the PrimeLoft team. Your answers will be included in the message.');
        this.renderDoneRecommendations();
      }, 500);
      return;
    }
  }

  static renderChoiceButtons(choices, callback) {
    const body = document.getElementById('plChatBody');
    if (!body) return;

    const container = document.createElement('div');
    container.className = this.state.step === 1 ? 'pl-choices-list pl-choices-list--services' : 'pl-choices-list';

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'pl-choice-btn';
      btn.type = 'button';
      btn.innerHTML = `
        <span class="pl-choice-text">${this.escapeHtml(ch.label)}</span>
        <span class="pl-choice-arrow" aria-hidden="true">&rsaquo;</span>
      `;
      btn.addEventListener('click', () => {
        // Smoothly hide unselected options and convert user choice into chat message
        container.querySelectorAll('.pl-choice-btn').forEach(b => {
          b.disabled = true;
          b.style.pointerEvents = 'none';
          if (b !== btn) {
            b.classList.add('is-hidden');
            b.style.opacity = '0';
            b.style.transform = 'scale(0.96)';
            b.style.transition = 'opacity 0.16s ease, transform 0.16s ease';
          }
        });
        btn.classList.add('is-selected');

        setTimeout(() => {
          container.remove();
          this.appendUserBubble(ch.label);
          callback(ch.val);
        }, 160);
      });
      container.appendChild(btn);
    });

    body.appendChild(container);
    this.scrollToBottom();
  }

  /**
   * STEP 5: Stepper Contact Inputs (One at a time)
   * Sub-step 1: Name -> Next / Enter
   * Sub-step 2: Email -> Next / Enter
   * Sub-step 3: Notes & Privacy Consent -> Submit inquiry -> Formspree
   */
  static renderStep5Input() {
    const body = document.getElementById('plChatBody');
    if (!body) return;

    // Sub-step 1: Name
    if (this.state.contactSubStep === 1) {
      this.updateStepper('STEP 5 OF 5 â€¢ NAME', 85);
      this.showTyping(() => {
        this.appendBotBubble("Where should we send your plan? First, what is your full name?");

        const card = document.createElement('div');
        card.className = 'pl-input-step-card';
        card.id = 'plCardStepName';
        card.innerHTML = `
          <form class="pl-input-step-form" id="plFormStepName" novalidate>
            <div class="pl-input-step-row">
              <input class="pl-input-step-field" id="plInputStepName" aria-label="Your name" type="text" placeholder="Your name" autocomplete="name" required>
              <button class="pl-btn-step-next" id="plBtnNameNext" type="submit">
                <span>Next</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            <span class="pl-form-error" id="plErrorStepName" aria-live="polite"></span>
          </form>
        `;

        body.appendChild(card);
        this.scrollToBottom();

        const form = card.querySelector('#plFormStepName');
        const input = card.querySelector('#plInputStepName');
        const err = card.querySelector('#plErrorStepName');

        setTimeout(() => input.focus(), 150);

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          err.textContent = '';
          const val = input.value.trim();
          if (!val || val.length < 2) {
            err.textContent = 'Please enter your name (at least 2 characters).';
            input.focus();
            return;
          }

          this.state.answers.name = val;
          card.remove();
          this.appendUserBubble(val);
          this.state.contactSubStep = 2;
          this.renderStep5Input();
        });
      }, 450);
      return;
    }

    // Sub-step 2: Work Email
    if (this.state.contactSubStep === 2) {
      this.updateStepper('STEP 5 OF 5 â€¢ EMAIL', 92);
      this.showTyping(() => {
        const firstName = this.escapeHtml(this.state.answers.name.split(' ')[0] || this.state.answers.name);
        this.appendBotBubble(`Great to meet you, ${firstName}! What is your work email?`);

        const card = document.createElement('div');
        card.className = 'pl-input-step-card';
        card.id = 'plCardStepEmail';
        card.innerHTML = `
          <form class="pl-input-step-form" id="plFormStepEmail" novalidate>
            <div class="pl-input-step-row">
              <input class="pl-input-step-field" id="plInputStepEmail" aria-label="Email address" type="email" placeholder="you@company.com" autocomplete="email" required>
              <button class="pl-btn-step-next" id="plBtnEmailNext" type="submit">
                <span>Next</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            <span class="pl-form-error" id="plErrorStepEmail" aria-live="polite"></span>
          </form>
        `;

        body.appendChild(card);
        this.scrollToBottom();

        const form = card.querySelector('#plFormStepEmail');
        const input = card.querySelector('#plInputStepEmail');
        const err = card.querySelector('#plErrorStepEmail');

        setTimeout(() => input.focus(), 150);

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          err.textContent = '';
          const val = input.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!val || !emailRegex.test(val)) {
            err.textContent = 'Please enter a valid work email address.';
            input.focus();
            return;
          }

          this.state.answers.email = val;
          card.remove();
          this.appendUserBubble(val);
          this.state.contactSubStep = 3;
          this.renderStep5Input();
        });
      }, 450);
      return;
    }

    // Sub-step 3: Notes (optional) + Privacy Consent + Submit Button
    if (this.state.contactSubStep === 3) {
      this.updateStepper('STEP 5 OF 5 â€¢ DETAILS', 96);
      this.showTyping(() => {
        this.appendBotBubble("Almost done! Anything else we should know about your project?");

        const card = document.createElement('div');
        card.className = 'pl-input-step-card pl-input-step-card-final';
        card.id = 'plCardStepDetails';
        card.innerHTML = `
          <form class="pl-input-step-form" id="plFormStepDetails" novalidate>
            <div class="pl-form-group">
              <textarea class="pl-input-step-field pl-input-step-textarea" id="plInputStepNotes" aria-label="Project notes" rows="2" placeholder="Tell us a little about your project (optional)"></textarea>
            </div>

            <div class="pl-form-checkbox-row">
              <label class="pl-checkbox-label">
                <input type="checkbox" id="plInputStepConsent" class="pl-checkbox-input" checked required>
                <span class="pl-checkbox-text">
                  I agree to PrimeLoft contacting me about this enquiry. <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
                </span>
              </label>
              <span class="pl-form-error" id="plErrorStepConsent" aria-live="polite"></span>
            </div>

            <div class="pl-form-status" id="plStepFormStatus" style="display:none;" aria-live="polite"></div>

            <button type="submit" class="pl-btn-submit" id="plBtnFinalSubmit">
              <span class="pl-btn-text">Submit project inquiry &rarr;</span>
              <span class="pl-btn-spinner" aria-hidden="true"></span>
            </button>
          </form>
        `;

        body.appendChild(card);
        this.scrollToBottom();

        const form = card.querySelector('#plFormStepDetails');
        const notesInput = card.querySelector('#plInputStepNotes');
        const consentInput = card.querySelector('#plInputStepConsent');
        const errConsent = card.querySelector('#plErrorStepConsent');
        const statusMsg = card.querySelector('#plStepFormStatus');
        const btnSubmit = card.querySelector('#plBtnFinalSubmit');

        setTimeout(() => notesInput.focus(), 150);

        notesInput.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            form.requestSubmit();
          }
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          errConsent.textContent = '';
          statusMsg.style.display = 'none';

          if (!consentInput.checked) {
            errConsent.textContent = 'Please accept the privacy policy to proceed.';
            return;
          }

          const notesVal = notesInput.value.trim();
          this.state.answers.notes = notesVal;
          this.state.answers.consent = consentInput.checked;

          btnSubmit.disabled = true;
          btnSubmit.classList.add('is-loading');

          try {
            const formData = new FormData();
            formData.append('name', this.state.answers.name);
            formData.append('email', this.state.answers.email);
            formData.append('service', this.state.answers.service);
            formData.append('stage', this.state.answers.stage);
            formData.append('timeline', this.state.answers.timeline);
            formData.append('_subject', `New Project Inquiry: ${this.state.answers.service} | ${this.state.answers.name}`);
            formData.append('message', `[PrimeLoft Project Guide Submission]
Service: ${this.state.answers.service}
Details: ${this.state.answers.stage}
Timeline: ${this.state.answers.timeline}
Client Name: ${this.state.answers.name}
Client Email: ${this.state.answers.email}
Client Notes: ${notesVal || 'None provided'}`);

            const endpoint = 'https://formspree.io/f/xeajqqoy';
            const response = await fetch(endpoint, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json'
              }
            });

            if (response.ok) {
              this.state.submitted = true;
              card.remove();
              if (notesVal) {
                this.appendUserBubble(notesVal);
              } else {
                this.appendUserBubble('Request submitted');
              }
              this.state.step = 6;
              this.renderCurrentStep();
            } else {
              const result = await response.json().catch(() => ({}));
              throw new Error(result.error || 'Submission failed. Please try again or email contact@primeloft.tech');
            }
          } catch (err) {
            console.warn('Chatbot Formspree submission error:', err);
            statusMsg.style.display = 'block';
            statusMsg.className = 'pl-form-status pl-status-error';
            statusMsg.textContent = err.message || 'Could not send details right now. You can also reach us directly at contact@primeloft.tech.';
            btnSubmit.disabled = false;
            btnSubmit.classList.remove('is-loading');
          }
        });
      }, 450);
      return;
    }
  }

  static renderDoneRecommendations() {
    const body = document.getElementById('plChatBody');
    if (!body) return;

    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'pl-done-actions-wrapper';

    const serviceText = this.state.answers.service === 'Other' ? ' a custom project' : (this.state.answers.service ? ` regarding ${this.state.answers.service}` : '');
    const waText = encodeURIComponent(`Hi PrimeLoft team! I would like to discuss a project${serviceText}.\nDetails: ${this.state.answers.stage}\nPreferred start: ${this.state.answers.timeline}`);
    const waUrl = `https://wa.me/923359873132?text=${waText}`;

    cardsWrapper.innerHTML = `
      <div class="pl-done-actions">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="pl-btn-cta-whatsapp">
          <svg class="pl-wa-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>Chat on WhatsApp</span>
        </a>
        <button type="button" class="pl-btn-cta-close" id="plBtnDoneClose">
          Close
        </button>
      </div>
    `;

    body.appendChild(cardsWrapper);
    this.scrollToBottom();

    const closeBtn = cardsWrapper.querySelector('#plBtnDoneClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeChat();
      });
    }
  }
}
