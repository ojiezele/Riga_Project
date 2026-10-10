class RichTextControl {
    constructor(label, value, callback) {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.label = label;
        this.value = value || '';
        this.callback = callback;
        this.domNode = document.createElement('div');
        this.render();
    }

    render() {
        var aiButton = '';
        if (typeof builder !== 'undefined' && builder.aiHandler) {
            aiButton = `
                <div class="dropdown d-inline-block">
                    <button class="btn btn-sm ai-btn dropdown-toggle d-flex align-items-center gap-1 border-0 shadow-none px-2 py-1 text-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="AI Text Assistant" style="background: rgba(79, 70, 229, 0.08); border-radius: 6px;">
                        <span class="smenu-item-icon ai-icon rounded-2 p-0 d-inline-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 256 256">
                                <defs>
                                <linearGradient id="ai-gradient-${this.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#4f46e5" />
                                    <stop offset="100%" stop-color="#a855f7" />
                                </linearGradient>
                                </defs>
                                <path fill="url(#ai-gradient-${this.id})" d="M208 144a15.78 15.78 0 0 1-10.42 14.94L146 178l-19 51.62a15.92 15.92 0 0 1-29.88 0L78 178l-51.62-19a15.92 15.92 0 0 1 0-29.88L78 110l19-51.62a15.92 15.92 0 0 1 29.88 0L146 110l51.62 19A15.78 15.78 0 0 1 208 144m-56-96h16v16a8 8 0 0 0 16 0V48h16a8 8 0 0 0 0-16h-16V16a8 8 0 0 0-16 0v16h-16a8 8 0 0 0 0 16m88 32h-8v-8a8 8 0 0 0-16 0v8h-8a8 8 0 0 0 0 16h8v8a8 8 0 0 0 16 0v-8h8a8 8 0 0 0 0-16"/>
                            </svg>
                        </span>
                        <span class="small fw-semibold" style="font-size: 11px;">AI</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 py-1" style="min-width: 170px; font-size: 13px;">
                        <li><a data-control="ai" data-text="Optimize content" class="dropdown-item py-1 px-3 d-flex align-items-center gap-2" href="#"><span class="material-symbols-outlined fs-6 text-primary">auto_fix_high</span> Optimize content</a></li>
                        <li><a data-control="ai" data-text="Rewrite formally" class="dropdown-item py-1 px-3 d-flex align-items-center gap-2" href="#"><span class="material-symbols-outlined fs-6 text-info">history_edu</span> Rewrite formally</a></li>
                        <li><a data-control="ai" data-text="Rewrite more casually" class="dropdown-item py-1 px-3 d-flex align-items-center gap-2" href="#"><span class="material-symbols-outlined fs-6 text-success">sentiment_satisfied</span> Rewrite casually</a></li>
                    </ul>
                </div>
            `;
        }

        this.domNode.innerHTML = `
            <div class="py-2 px-3 position-relative custom-rich-text-wrapper">
                <div data-control="ai-effects"></div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <label class="form-label fw-semibold mb-0" style="font-size: 13px; color: #334155;">${this.label}</label>
                    ${aiButton}
                </div>

                <!-- Custom Native WYSIWYG Editor (License-free, No TinyMCE) -->
                <div class="custom-wysiwyg-container rounded border" style="background: #ffffff; border-color: #e2e8f0; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                    <!-- Toolbar -->
                    <div class="custom-wysiwyg-toolbar d-flex flex-wrap align-items-center gap-1 p-1 border-bottom" style="background: #f8fafc; border-color: #e2e8f0;">
                        <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-cmd="bold" title="Bold" style="width: 26px; height: 26px;">
                            <span class="fw-bold" style="font-size: 12px; font-family: serif;">B</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-cmd="italic" title="Italic" style="width: 26px; height: 26px;">
                            <span class="fst-italic" style="font-size: 12px; font-family: serif;">I</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-cmd="underline" title="Underline" style="width: 26px; height: 26px;">
                            <span class="text-decoration-underline" style="font-size: 12px; font-family: serif;">U</span>
                        </button>

                        <div class="vr mx-1 my-auto" style="height: 16px; opacity: 0.2;"></div>

                        <!-- Font Size Selector -->
                        <select class="form-select form-select-sm py-0 px-1 border-0" data-control="fontsize" title="Font size" style="width: 68px; height: 26px; font-size: 11px; background-color: transparent;">
                            <option value="">Size</option>
                            <option value="12px">12px</option>
                            <option value="14px">14px</option>
                            <option value="16px">16px</option>
                            <option value="18px">18px</option>
                            <option value="20px">20px</option>
                            <option value="24px">24px</option>
                            <option value="28px">28px</option>
                            <option value="32px">32px</option>
                            <option value="36px">36px</option>
                        </select>

                        <div class="vr mx-1 my-auto" style="height: 16px; opacity: 0.2;"></div>

                        <!-- Text Color -->
                        <div class="position-relative d-inline-flex align-items-center" title="Text Color">
                            <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-control="color-btn" style="width: 26px; height: 26px;">
                                <span class="material-symbols-outlined" style="font-size: 15px; color: #475569;">format_color_text</span>
                            </button>
                            <input type="color" data-control="forecolor" value="#000000" style="position: absolute; opacity: 0; width: 26px; height: 26px; cursor: pointer; left: 0; top: 0;">
                        </div>

                        <!-- Background / Highlight Color -->
                        <div class="position-relative d-inline-flex align-items-center" title="Highlight Color">
                            <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-control="bg-color-btn" style="width: 26px; height: 26px;">
                                <span class="material-symbols-outlined" style="font-size: 15px; color: #ca8a04;">format_color_fill</span>
                            </button>
                            <input type="color" data-control="hilitecolor" value="#ffff00" style="position: absolute; opacity: 0; width: 26px; height: 26px; cursor: pointer; left: 0; top: 0;">
                        </div>

                        <div class="vr mx-1 my-auto" style="height: 16px; opacity: 0.2;"></div>

                        <!-- Lists -->
                        <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-cmd="insertUnorderedList" title="Bullet List" style="width: 26px; height: 26px;">
                            <span class="material-symbols-outlined" style="font-size: 15px; color: #475569;">format_list_bulleted</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center" data-cmd="insertOrderedList" title="Numbered List" style="width: 26px; height: 26px;">
                            <span class="material-symbols-outlined" style="font-size: 15px; color: #475569;">format_list_numbered</span>
                        </button>

                        <!-- Clear Formatting -->
                        <button type="button" class="btn btn-sm btn-light p-1 rounded d-flex align-items-center justify-content-center ms-auto" data-cmd="removeFormat" title="Clear Formatting" style="width: 26px; height: 26px;">
                            <span class="material-symbols-outlined" style="font-size: 15px; color: #94a3b8;">format_clear</span>
                        </button>
                    </div>

                    <!-- Editable Content Area -->
                    <div id="${this.id}-editor"
                         class="custom-wysiwyg-content p-2"
                         contenteditable="true"
                         style="min-height: 130px; max-height: 280px; overflow-y: auto; outline: none; font-size: 14px; line-height: 1.6; color: #1e293b;">
                    </div>
                </div>

                <!-- Hidden sync textarea for compatibility with getTextInput() -->
                <textarea name="text" id="${this.id}" class="d-none"></textarea>
            </div>
        `;

        this.editorEl = this.domNode.querySelector(`#${this.id}-editor`);
        this.textareaEl = this.domNode.querySelector(`[name="text"]`);

        // Set initial value
        this.setContent(this.value, false);

        // Bind editor events
        this.bindEvents();
    }

    bindEvents() {
        if (!this.editorEl) return;

        // Sync on input / keyup / paste
        const syncContent = () => {
            const html = this.editorEl.innerHTML;
            this.textareaEl.value = html;
            if (this.callback && typeof this.callback.setText === 'function') {
                this.callback.setText(html);
            }
        };

        this.editorEl.addEventListener('input', syncContent);
        this.editorEl.addEventListener('keyup', syncContent);
        this.editorEl.addEventListener('blur', syncContent);

        // Toolbar formatting commands
        this.domNode.querySelectorAll('[data-cmd]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cmd = btn.getAttribute('data-cmd');
                this.editorEl.focus();
                document.execCommand(cmd, false, null);
                syncContent();
            });
        });

        // Font size selector
        const sizeSelect = this.domNode.querySelector('[data-control="fontsize"]');
        if (sizeSelect) {
            sizeSelect.addEventListener('change', () => {
                const size = sizeSelect.value;
                if (!size) return;
                this.editorEl.focus();
                const selection = window.getSelection();
                if (selection.rangeCount > 0 && !selection.isCollapsed) {
                    const span = document.createElement('span');
                    span.style.fontSize = size;
                    const range = selection.getRangeAt(0);
                    span.appendChild(range.extractContents());
                    range.insertNode(span);
                    selection.removeAllRanges();
                } else {
                    document.execCommand('fontSize', false, '3');
                }
                syncContent();
                sizeSelect.value = '';
            });
        }

        // Color pickers
        const foreColorInput = this.domNode.querySelector('[data-control="forecolor"]');
        if (foreColorInput) {
            foreColorInput.addEventListener('input', () => {
                this.editorEl.focus();
                document.execCommand('foreColor', false, foreColorInput.value);
                syncContent();
            });
        }

        const hiliteColorInput = this.domNode.querySelector('[data-control="hilitecolor"]');
        if (hiliteColorInput) {
            hiliteColorInput.addEventListener('input', () => {
                this.editorEl.focus();
                document.execCommand('hiliteColor', false, hiliteColorInput.value);
                syncContent();
            });
        }

        // AI Assistant buttons
        if (typeof builder !== 'undefined' && builder.aiHandler) {
            this.domNode.querySelectorAll('[data-control="ai"]').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const requestText = item.getAttribute('data-text');
                    const originalText = this.getText();

                    const aiButton = this.domNode.querySelector('.ai-btn');
                    const oButtonHtml = aiButton.innerHTML;

                    this.domNode.querySelector('[data-control="ai-effects"]').innerHTML = `
                        <span class="ai-sparkles">
                            <span class="star star-lg"></span>
                            <span class="star star-sm delay-1"></span>
                            <span class="star star-md delay-2"></span>
                        </span>`;
                    aiButton.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" style="width: 12px; height: 12px;"></span><span style="font-size: 11px;">Thinking...</span>`;
                    aiButton.classList.add('loading');

                    this.askAI(originalText, requestText).then(rewrittenText => {
                        this.setContent(rewrittenText, true);

                        aiButton.innerHTML = oButtonHtml;
                        aiButton.classList.remove('loading');
                        this.domNode.querySelector('[data-control="ai-effects"]').innerHTML = '';

                        const container = this.domNode.querySelector('.custom-wysiwyg-container');
                        if (container) {
                            container.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
                            container.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.35)';
                            container.style.borderColor = '#a855f7';
                            setTimeout(() => {
                                container.style.boxShadow = '';
                                container.style.borderColor = '#e2e8f0';
                            }, 1200);
                        }
                    });
                });
            });
        }
    }

    setContent(content, triggerCallback = true) {
        const cleanContent = content || '';
        if (this.editorEl) {
            this.editorEl.innerHTML = cleanContent;
        }
        if (this.textareaEl) {
            this.textareaEl.value = cleanContent;
        }
        if (triggerCallback && this.callback && typeof this.callback.setText === 'function') {
            this.callback.setText(cleanContent);
        }
    }

    askAI(originalText, request = 'Rewrite formally') {
        const handlerUrl = (typeof builder !== 'undefined' && builder.aiHandler) ? builder.aiHandler : '/ai-handler.php';
        return fetch(handlerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: originalText,
                request: request
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                if (window.SAlert) window.SAlert.show(data.error.message || 'AI request error');
                return originalText;
            }
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                return data.choices[0].message.content.trim();
            }
            return originalText;
        })
        .catch(() => {
            if (window.SNotify) {
                window.SNotify.show('Failed to connect to AI service.', 'error');
            } else {
                alert('Failed to connect to AI service. Please try again later.');
            }
            return originalText;
        });
    }

    afterRender() {
        // Native WYSIWYG editor is already fully operational without external scripts!
    }

    getTextInput() {
        return this.domNode.querySelector('[name="text"]');
    }

    getText() {
        if (this.editorEl) {
            return this.editorEl.innerHTML;
        }
        return this.getTextInput() ? this.getTextInput().value : '';
    }
}

export default RichTextControl;