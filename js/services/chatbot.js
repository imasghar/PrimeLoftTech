/**
 * PrimeLoft Tech - PrimeLoft Guide (Rule-Based Interactive Chatbot)
 * Features:
 * - Floating prompt teaser card ("Not sure which service you need?")
 * - Concentric ring launcher button with speech bubble icon
 * - Multi-step interactive diagnostic questionnaire
 * - Services: UI/UX, Software Dev, Mobile, Custom Websites, SEO (On-page/Off-page), WordPress, Squarespace, Other
 * - Custom free-text entry when 'Other' is chosen
 * - Straightforward timeline selector
 * - Step-by-step contact input stepper (Name -> Email -> Notes/Consent)
 * - Animated typing indicator before bot messages
 * - Native AJAX submission to Formspree AI endpoint
 * - Direct WhatsApp and Close actions at completion (no suggestion cards)
 * - Crisp cornered UI with zero border radius
 * - Isolated scrolling: does not scroll parent website
 */

export class ChatbotService {
  static init() {
    if (document.getElementById('plChatWidget')) return;
    this.state = {
      isOpen: false,
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
    const root = document.createElement('div');
    root.id = 'plChatWidget';
    root.className = 'pl-chat-widget';
    root.innerHTML = `
      <!-- Prompt Callout Card -->
      <div class="pl-chat-prompt-card" id="plChatPromptCard">
        <h4 class="pl-prompt-title">Not sure which service you need?</h4>
        <p class="pl-prompt-desc">Answer a few quick questions and I'll point you to the right team.</p>
        <div class="pl-prompt-actions">
          <button class="pl-prompt-btn-go" id="plPromptGo" type="button">Let's go</button>
          <button class="pl-prompt-btn-dismiss" id="plPromptDismiss" type="button">Not now</button>
        </div>
      </div>

      <!-- Floating Launcher Button with Concentric Outer Ring -->
      <button class="pl-chat-launcher" id="plChatLauncher" aria-label="Open PrimeLoft Project Guide">
        <span class="pl-chat-launcher-ring" aria-hidden="true">
          <span class="pl-chat-launcher-inner">
            <span class="pl-chat-launcher-icon open-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </span>
            <span class="pl-chat-launcher-icon close-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </span>
          </span>
        </span>
      </button>

      <!-- Chat Modal Window (Properly Cornered, Zero Border Radius) -->
      <div class="pl-chat-window" id="plChatWindow" role="dialog" aria-modal="true" aria-labelledby="plChatTitle" data-lenis-prevent hidden>
        <!-- Header (Compact height, PrimeLoft Favicon, no subtitle line, no minimize button) -->
        <header class="pl-chat-header">
          <div class="pl-chat-header-info">
            <img src="images/favicon-32x32.png" alt="PrimeLoft" class="pl-chat-favicon" width="22" height="22">
            <div class="pl-chat-title-group">
              <h3 class="pl-chat-title" id="plChatTitle">PrimeLoft Guide</h3>
            </div>
          </div>
          <div class="pl-chat-header-actions">
            <button class="pl-chat-btn-action" id="plChatClose" aria-label="Close chat window" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </header>

        <!-- Stepper Progress Tracker -->
        <div class="pl-chat-stepper">
          <div class="pl-stepper-label" id="plStepperLabel">STEP 1 OF 5</div>
          <div class="pl-stepper-track">
            <div class="pl-stepper-fill" id="plStepperFill" style="width: 20%;"></div>
          </div>
        </div>

        <!-- Scrollable Conversation Area -->
        <div class="pl-chat-body" id="plChatBody" role="log" aria-live="polite" data-lenis-prevent>
          <!-- Dynamically populated -->
        </div>

        <!-- Footer Actions Bar -->
        <footer class="pl-chat-footer">
          <span class="pl-footer-help">Prefer a person? <a href="contact.html" id="plFooterContactLink">Talk to the team</a></span>
          <button class="pl-footer-restart" id="plChatRestart" type="button">Restart</button>
        </footer>
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
    }
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
    }
  }

  static restart() {
    this.state.step = 1;
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
    if (label) label.textContent = stepText;
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

        const choices = [
          { label: 'UI/UX', val: 'UI/UX' },
          { label: 'Software Development', val: 'Software Development' },
          { label: 'Mobile Applications', val: 'Mobile Applications' },
          { label: 'Custom Websites', val: 'Custom Websites' },
          { label: 'SEO', val: 'SEO' },
          { label: 'WordPress Sites', val: 'WordPress Sites' },
          { label: 'Squarespace', val: 'Squarespace' },
          { label: 'Other', val: 'Other' }
        ];
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
                <textarea class="pl-input-step-field pl-input-step-textarea" id="plInputStepOther" rows="3" placeholder="Tell us about the project, technology, or service you need..." required></textarea>
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

      let question = 'What are you looking to build or achieve?';
      let choices = [
        { label: 'New project from scratch', val: 'New project from scratch' },
        { label: 'Redesign or improve existing', val: 'Redesign or improve existing' },
        { label: 'Consultation & expert audit', val: 'Consultation & expert audit' }
      ];

      if (service === 'UI/UX') {
        question = 'What kind of UI/UX design project is this?';
        choices = [
          { label: 'New mobile or web app design', val: 'New mobile or web app design' },
          { label: 'Redesign of existing website / app', val: 'Redesign of existing website / app' },
          { label: 'Design system & interactive prototype', val: 'Design system & interactive prototype' }
        ];
      } else if (service === 'Software Development') {
        question = 'What type of software do you need built?';
        choices = [
          { label: 'Custom SaaS / Web platform', val: 'Custom SaaS / Web platform' },
          { label: 'Internal business portal or tool', val: 'Internal business portal or tool' },
          { label: 'API integration & backend system', val: 'API integration & backend system' }
        ];
      } else if (service === 'Mobile Applications') {
        question = 'Which platforms are you targeting?';
        choices = [
          { label: 'iOS & Android (Cross-platform)', val: 'iOS & Android (Cross-platform)' },
          { label: 'Native iOS or Android app', val: 'Native iOS or Android app' },
          { label: 'MVP prototype for launch', val: 'MVP prototype for launch' }
        ];
      } else if (service === 'Custom Websites') {
        question = 'What type of custom website do you need?';
        choices = [
          { label: 'High-performance brand / marketing site', val: 'High-performance brand / marketing site' },
          { label: 'Custom web portal or client app', val: 'Custom web portal or client app' },
          { label: 'E-commerce or booking platform', val: 'E-commerce or booking platform' }
        ];
      } else if (service === 'SEO') {
        question = 'What is your primary SEO focus?';
        choices = [
          { label: 'On-page SEO optimization', val: 'On-page SEO optimization' },
          { label: 'Off-page SEO & link building', val: 'Off-page SEO & link building' },
          { label: 'Technical SEO audit & speed', val: 'Technical SEO audit & speed' },
          { label: 'Complete SEO (On-page + Off-page)', val: 'Complete SEO (On-page + Off-page)' }
        ];
      } else if (service === 'WordPress Sites') {
        question = 'What do you need for WordPress?';
        choices = [
          { label: 'Custom WordPress website from scratch', val: 'Custom WordPress website from scratch' },
          { label: 'WooCommerce online store setup', val: 'WooCommerce online store setup' },
          { label: 'WordPress redesign, speed & security', val: 'WordPress redesign, speed & security' }
        ];
      } else if (service === 'Squarespace') {
        question = 'What do you need for Squarespace?';
        choices = [
          { label: 'Brand new Squarespace website', val: 'Brand new Squarespace website' },
          { label: 'Custom CSS & template code styling', val: 'Custom CSS & template code styling' },
          { label: 'Squarespace redesign & content migration', val: 'Squarespace redesign & content migration' }
        ];
      }

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
          { label: 'In 1–3 months', val: 'In 1–3 months' },
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
      const serviceDisplay = this.state.answers.service === 'Other' ? 'custom project' : this.state.answers.service;
      const stageDisplay = this.state.answers.service === 'Other' ? `"${this.state.answers.stage}"` : this.state.answers.stage;
      const guidance = `Got it! For <strong>${serviceDisplay}</strong> (${stageDisplay}) starting <em>${this.state.answers.timeline.toLowerCase()}</em>, our team will prepare a tailored proposal.`;
      
      this.showTyping(() => {
        this.appendBotBubble(guidance);

        const choices = [
          { label: 'Send me a project proposal plan →', val: 'proceed_contact' },
          { label: 'Chat directly on WhatsApp →', val: 'skip_to_done' }
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
        const firstName = this.state.answers.name ? this.state.answers.name.split(' ')[0] : '';
        const greeting = firstName ? `Thank you, ${firstName}!` : 'Thank you!';
        this.appendBotBubble(`${greeting} Your details have been received. Our senior team will review your project and get back to you within 1 business day.`);
        this.renderDoneRecommendations();
      }, 500);
      return;
    }
  }

  static renderChoiceButtons(choices, callback) {
    const body = document.getElementById('plChatBody');
    if (!body) return;

    const container = document.createElement('div');
    container.className = 'pl-choices-list';

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'pl-choice-btn';
      btn.type = 'button';
      btn.innerHTML = `
        <span class="pl-choice-text">${ch.label}</span>
        <span class="pl-choice-arrow" aria-hidden="true">&rsaquo;</span>
      `;
      btn.addEventListener('click', () => {
        container.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          b.style.pointerEvents = 'none';
        });
        btn.classList.add('is-selected');
        this.appendUserBubble(ch.label);
        callback(ch.val);
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
      this.updateStepper('STEP 5 OF 5 • NAME', 85);
      this.showTyping(() => {
        this.appendBotBubble("Where should we send your plan? First, what is your full name?");
        
        const card = document.createElement('div');
        card.className = 'pl-input-step-card';
        card.id = 'plCardStepName';
        card.innerHTML = `
          <form class="pl-input-step-form" id="plFormStepName" novalidate>
            <div class="pl-input-step-row">
              <input class="pl-input-step-field" id="plInputStepName" type="text" placeholder="Your name" autocomplete="name" required>
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
      this.updateStepper('STEP 5 OF 5 • EMAIL', 92);
      this.showTyping(() => {
        const firstName = this.state.answers.name.split(' ')[0] || this.state.answers.name;
        this.appendBotBubble(`Great to meet you, ${firstName}! What is your work email?`);

        const card = document.createElement('div');
        card.className = 'pl-input-step-card';
        card.id = 'plCardStepEmail';
        card.innerHTML = `
          <form class="pl-input-step-form" id="plFormStepEmail" novalidate>
            <div class="pl-input-step-row">
              <input class="pl-input-step-field" id="plInputStepEmail" type="email" placeholder="you@company.com" autocomplete="email" required>
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
      this.updateStepper('STEP 5 OF 5 • DETAILS', 96);
      this.showTyping(() => {
        this.appendBotBubble("Almost done! Anything else we should know about your project?");

        const card = document.createElement('div');
        card.className = 'pl-input-step-card pl-input-step-card-final';
        card.id = 'plCardStepDetails';
        card.innerHTML = `
          <form class="pl-input-step-form" id="plFormStepDetails" novalidate>
            <div class="pl-form-group">
              <textarea class="pl-input-step-field pl-input-step-textarea" id="plInputStepNotes" rows="2" placeholder="Tell us a little about your project (optional)"></textarea>
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
    const waText = encodeURIComponent(`Hi PrimeLoft team! I just completed the project questionnaire on your website${serviceText}. Can we discuss scope?`);
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
