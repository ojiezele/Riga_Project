class BaseElement {
    constructor() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.formats = {
            background_color: null,
            background_image: null,
            background_position: 'center',
            background_size: '100%',
            background_repeat: 'no-repeat',
            padding_top: 0,
            padding_right: 0,
            padding_bottom: 0,
            padding_left: 0,
            // size settings
            width: '560',
            height: '315',
        }
    }

    getClassName() {
        return this.constructor.name;
    }

    isDroppable() {
        return false;
    }
    
    canDropInside() {
        return false;
    }

    canDropBefore() {
        return false;
    }

    canDropAfter() {
        return false;
    }

    getControls() {
        return [
            // CheckboxControl
            new CheckboxControl(
                // label
                'Optimized for mobile',
                // descriptoin,
                'Allow the element to display correctly on mobile devices',
                // value
                true,
                // callback
                {
                    // set text
                    setValue: (value) => {
                        alert(value);
                    }
                }
            ),

            // CheckboxControl
            new CheckboxControl(
                // label
                'Compatibility mode for legacy browser',
                // descriptoin,
                'Render compatible HTML for older browser like IE, Opera notice that in certain cases, it might generate JS and make sure your browser supports JS',
                // value
                true,
                // callback
                {
                    // set text
                    setValue: (value) => {
                        alert(value);
                    }
                }
            ),
        ];
    }

    renderTemplate(template, options={}) {
        return builder.renderTemplate(template, options);
    }

    duplicate() {
        var cloned = ElementFactory.createElement(this.getData());
        this.container.insertElementAfter(this, cloned);

        // @todo: dependency
        builder.selectElement(cloned);
    }

    fadeOut(duration = 300, callback) {
        const element = this.domNode;

        // Get computed height to allow transition from fixed height to 0
        const computedStyle = getComputedStyle(element);
        const height = element.offsetHeight;
        element.style.height = height + 'px';
        element.style.overflow = 'hidden'; // Prevent content overflow during height transition

        // Set up the transition
        element.style.transition = `opacity ${duration}ms, transform ${duration}ms, height ${duration}ms`;
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';

        const handleTransitionEnd = (event) => {
            // Wait for all transitions to complete
            if (event.propertyName !== 'height') return;

            element.removeEventListener('transitionend', handleTransitionEnd);
            element.style.display = 'none';

            if (typeof callback === 'function') {
                callback();
            }
        };

        element.addEventListener('transitionend', handleTransitionEnd);

        // Trigger animation
        requestAnimationFrame(() => {
            void element.offsetWidth; // Force reflow
            element.style.opacity = '0';
            element.style.transform = 'translateX(100px)';
            element.style.height = '0px';
        });
    }

    fadeIn(duration = 300, callback) {
        const element = this.domNode;

        // Remove any lingering transitionend listeners
        element.removeEventListener('transitionend', element._fadeInTransitionEnd);

        // Reset display and initial state
        element.style.display = '';
        element.style.overflow = 'hidden';
        element.style.opacity = '0';
        element.style.transform = 'translateX(100px)';
        element.style.height = '0px';

        // Force reflow to apply initial styles
        void element.offsetWidth;

        // Measure full height to transition to
        const targetHeight = element.scrollHeight;

        // Apply transition styles
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease, height ${duration}ms ease`;

        // Define the transition end handler
        const handleTransitionEnd = (event) => {
            if (event.propertyName !== 'height') return;

            element.removeEventListener('transitionend', handleTransitionEnd);
            element.style.overflow = ''; // Reset overflow
            element.style.height = '';   // Let height be auto after transition

            if (typeof callback === 'function') {
                callback();
            }
        };

        // Attach and store the handler (to avoid duplicates)
        element._fadeInTransitionEnd = handleTransitionEnd;
        element.addEventListener('transitionend', handleTransitionEnd);

        // Animate to visible state
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
            element.style.height = targetHeight + 'px';
        });
    }

    remove() {
        if (builder.getSelectedElement() === this) {
            builder.unselect();
        }

        // remove all effects
        this.removeHoverHightlight();
        this.removeSelectedHighlight();
        this.removeDropHighlight();
        this.removeContainerHightlight();
        this.removeContainerDropHightlight();

        this.fadeOut(300, () => {
            this.container.removeElement(this);

            // remove alement from all
            builder.uiManager.removeDraggableItem(this);
            builder.uiManager.removeElement(this);
            builder.uiManager.dragOveringElements = [];
            builder.uiManager.hoveringElements = [];
        });
    }

    getFullUrl(url)
    {
        return builder.getFullUrl(url);
    }

    /* Matching Position & Size of domNode and the box */
    matchingDomNode(box, setPosSize=null)
    {
        //
        if (!box) {
            return;
        }

        if (!setPosSize) {
            setPosSize = () => {
                if (!box || !box.isConnected || !box.style) return;
                if (!this.domNode || !this.domNode.ownerDocument) return;

                const iframe = this.domNode.ownerDocument.defaultView?.frameElement;
                if (!iframe) return;

                // Get the bounding rect of the domNode inside the iframe
                const domRect = this.domNode.getBoundingClientRect();
                const iframeRect = iframe.getBoundingClientRect();

                // Calculate absolute position of domNode relative to main window
                const absoluteTop = iframeRect.top + domRect.top;
                const absoluteLeft = iframeRect.left + domRect.left;

                // Set the hoveringBox's position and size
                Object.assign(box.style, {
                    position: 'fixed',
                    top: `${absoluteTop}px`,
                    left: `${absoluteLeft}px`,
                    width: `${domRect.width}px`,
                    height: `${domRect.height}px`,
                });
            };
        }

        try {
            setPosSize();
        } catch (e) {
            // Ignore layout measurement during unmount or transition
        }

        //
        if (!box.events) {
            // === IFRAME SCROLL & RESIZE ===
            const iframeWindow = this.domNode?.ownerDocument?.defaultView;
            const iframeDocument = this.domNode?.ownerDocument;
            if (!iframeWindow || !iframeDocument) return;

            let mutationObserver = null;
            const safeUpdate = () => {
                // If box was removed from the DOM or has no style, unobserve and return
                if (!box || !box.isConnected || !box.style) {
                    if (mutationObserver) {
                        try {
                            mutationObserver.disconnect();
                        } catch (err) {}
                        mutationObserver = null;
                    }
                    return;
                }
                try {
                    setPosSize();
                } catch (err) {
                    // Suppress any transient error while dragging / re-rendering
                }
            };

            iframeWindow.addEventListener('scroll', safeUpdate, true);
            iframeWindow.addEventListener('resize', safeUpdate);

            // Optional: also watch for DOM mutations (e.g., added/removed elements)
            if (iframeDocument.body && iframeWindow.MutationObserver) {
                mutationObserver = new iframeWindow.MutationObserver(() => {
                    safeUpdate();
                });
                mutationObserver.observe(iframeDocument.body, { childList: true, subtree: true, attributes: true });
            }

            box.events = true;

            // Outer Document
            window.document.addEventListener('scroll', safeUpdate, true);
            window.document.addEventListener('resize', safeUpdate);
        }
    }

    setFormat(format, value) {
        this.formats[format] = value;
    }

    getFormat(format, dValue=null) {
        return this.formats[format] ?? dValue;
    }




    /* HOVERING EFFECTS */
    addHoverHightlight() {
        if (!this.hoveringBox) {
            this.hoveringBox = document.createElement('div');
            this.hoveringBox.classList.add('hovering-box');

            //
            this.hoveringBox.innerHTML = `
                <div class="hovering-label">`+this.getClassName()+`</div>
            `;

            // Append it to the body
            document.body.appendChild(this.hoveringBox);
        }

        this.matchingDomNode(this.hoveringBox);
    }

    removeHoverHightlight() {
        if (this.hoveringBox) {
            this.hoveringBox.remove();
        }

        this.hoveringBox = null;
    }



    /* SELECTED EFFECTS */
    addSelectedHighlight() {
        // render selected outbound
        if (!this.selectedBox) {
            this.selectedBox = document.createElement('div');
            this.selectedBox.classList.add('selected-box');

            // Append it to the body
            document.body.appendChild(this.selectedBox);

            //
            this.matchingDomNode(this.selectedBox);
        }

        // Render actions
        if (!this.actionsBox) {
            this.actionsBox = document.createElement('div');
            this.actionsBox.classList.add('actions-box');
            document.body.appendChild(this.actionsBox);

            this.matchingDomNode(this.actionsBox, () => {
                if (!this.actionsBox || !this.actionsBox.isConnected || !this.actionsBox.style || !this.domNode || !this.domNode.ownerDocument) {
                    return;
                }

                const domRect = this.domNode.getBoundingClientRect();
                const iframe = this.domNode.ownerDocument.defaultView?.frameElement;
                if (!iframe) return;

                const iframeRect = iframe.getBoundingClientRect();
                const absoluteTop = iframeRect.top + domRect.top;
                const absoluteLeft = iframeRect.left + domRect.left;

                // Position compactly at the top-right of the element, clamped inside viewport
                const targetLeft = Math.min(
                    iframeRect.right - 260,
                    Math.max(iframeRect.left + 16, absoluteLeft + domRect.width - 240)
                );
                const targetTop = Math.max(iframeRect.top + 8, absoluteTop - 40);

                Object.assign(this.actionsBox.style, {
                    position: 'fixed',
                    top: `${targetTop}px`,
                    left: `${targetLeft}px`,
                    width: 'auto',
                    height: '36px',
                    zIndex: '1002',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                });
            });

            // Compact element class label
            this.actionsBoxLabel = document.createElement('span');
            this.actionsBoxLabel.className = 'actions-box-label';
            this.actionsBoxLabel.innerText = this.getClassName().replace('Element', '');
            this.actionsBox.appendChild(this.actionsBoxLabel);

            this.actionsBoxInner = document.createElement('div');
            this.actionsBoxInner.className = 'actions-box-inner flex items-center gap-1';
            this.actionsBox.appendChild(this.actionsBoxInner);

            const svgMap = {
                content_copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
                delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`,
                arrow_circle_up: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
                remove_selection: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
            };

            this.getActions().forEach(action => {
                const actionButton = document.createElement('button');
                actionButton.setAttribute('type', 'button');
                actionButton.className = 'element-action-item';
                actionButton.setAttribute('title', action.label);
                actionButton.innerHTML = svgMap[action.icon] || `<span style="font-size:11px;">${action.label}</span>`;

                actionButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    action.run();
                });

                this.actionsBoxInner.appendChild(actionButton);
            });
        }

        
    }

    removeSelectedHighlight() {
        // remove selected outbound
        if (this.selectedBox) {
            this.selectedBox.remove();
        }
        this.selectedBox = null;

        // remove selected actions
        if (this.actionsBox) {
            this.actionsBox.remove();
        }
        this.actionsBox = null;
    }



    getActions() {
        var actions = [
            {
                icon: 'content_copy',
                label: 'Copy',
                run: () => {
                    this.duplicate();
                }
            },

            {
                icon: 'delete',
                label: 'Remove',
                run: () => {
                    this.remove(); // @todo dependency
                }
            },

        ];

        if (this.container) {
            actions.unshift({
                icon: 'arrow_circle_up',
                label: 'Select Parent',
                run: () => {
                    builder.selectElement(this.container); // @todo dependency
                }
            });
        }

        actions.push({
            icon: 'remove_selection',
            label: 'Unselect',
            run: () => {
                builder.unselect();
            }
        });

        return actions;
    }

    /* DROP INDICATORS (NON-BLOCKING WITH POINTER-EVENTS: NONE) */
    addDropBeforeHighlight() {
        this.removeDropHighlight();

        if (!this.dropBeforeBox) {
            this.dropBeforeBox = document.createElement('div');
            this.dropBeforeBox.classList.add('drop-before-box');
            this.dropBeforeBox.style.pointerEvents = 'none';
            document.body.appendChild(this.dropBeforeBox);
        }

        this.matchingDomNode(this.dropBeforeBox, () => {
            if (!this.dropBeforeBox || !this.dropBeforeBox.isConnected || !this.dropBeforeBox.style || !this.domNode || !this.domNode.ownerDocument) return;
            const domRect = this.domNode.getBoundingClientRect();
            const iframe = this.domNode.ownerDocument.defaultView?.frameElement;
            if (!iframe) return;

            const iframeRect = iframe.getBoundingClientRect();
            const absoluteTop = iframeRect.top + domRect.top;
            const absoluteLeft = iframeRect.left + domRect.left;

            Object.assign(this.dropBeforeBox.style, {
                position: 'fixed',
                top: `${Math.max(0, absoluteTop - 3)}px`,
                left: `${absoluteLeft}px`,
                width: `${domRect.width}px`,
                height: '6px',
                pointerEvents: 'none',
                zIndex: '999999',
            });
        });
    }

    addDropAfterHighlight() {
        this.removeDropHighlight();

        if (!this.dropAfterBox) {
            this.dropAfterBox = document.createElement('div');
            this.dropAfterBox.classList.add('drop-after-box');
            this.dropAfterBox.style.pointerEvents = 'none';
            document.body.appendChild(this.dropAfterBox);
        }

        this.matchingDomNode(this.dropAfterBox, () => {
            if (!this.dropAfterBox || !this.dropAfterBox.isConnected || !this.dropAfterBox.style || !this.domNode || !this.domNode.ownerDocument) return;
            const domRect = this.domNode.getBoundingClientRect();
            const iframe = this.domNode.ownerDocument.defaultView?.frameElement;
            if (!iframe) return;

            const iframeRect = iframe.getBoundingClientRect();
            const absoluteTop = iframeRect.top + domRect.top;
            const absoluteLeft = iframeRect.left + domRect.left;

            Object.assign(this.dropAfterBox.style, {
                position: 'fixed',
                top: `${absoluteTop + domRect.height - 3}px`,
                left: `${absoluteLeft}px`,
                width: `${domRect.width}px`,
                height: '6px',
                pointerEvents: 'none',
                zIndex: '999999',
            });
        });
    }

    addDropInsideHighlight() {
        this.removeDropHighlight();

        if (!this.dropInsideBox) {
            this.dropInsideBox = document.createElement('div');
            this.dropInsideBox.classList.add('drop-inside-box');
            this.dropInsideBox.style.pointerEvents = 'none';
            document.body.appendChild(this.dropInsideBox);
        }

        this.matchingDomNode(this.dropInsideBox, () => {
            if (!this.dropInsideBox || !this.dropInsideBox.isConnected || !this.dropInsideBox.style || !this.domNode || !this.domNode.ownerDocument) return;
            const domRect = this.domNode.getBoundingClientRect();
            const iframe = this.domNode.ownerDocument.defaultView?.frameElement;
            if (!iframe) return;

            const iframeRect = iframe.getBoundingClientRect();
            const absoluteTop = iframeRect.top + domRect.top;
            const absoluteLeft = iframeRect.left + domRect.left;

            Object.assign(this.dropInsideBox.style, {
                position: 'fixed',
                top: `${absoluteTop}px`,
                left: `${absoluteLeft}px`,
                width: `${domRect.width}px`,
                height: `${domRect.height}px`,
                pointerEvents: 'none',
                zIndex: '999999',
            });
        });
    }

    removeDropHighlight() {
        if (this.dropInsideBox) {
            this.dropInsideBox.remove();
            this.dropInsideBox = null;
        }
        if (this.dropBeforeBox) {
            this.dropBeforeBox.remove();
            this.dropBeforeBox = null;
        }
        if (this.dropAfterBox) {
            this.dropAfterBox.remove();
            this.dropAfterBox = null;
        }
    }

    addContainerHightlight() {
        if (!this.containerBox) {
            this.containerBox = document.createElement('div');
            this.containerBox.classList.add('container-box');

            // //
            // this.containerBox.innerHTML = `
            //     <div class="container-label">`+this.getClassName()+`</div>
            // `;

            // Append it to the body
            document.body.appendChild(this.containerBox);
        }

        this.matchingDomNode(this.containerBox);
    }

    removeContainerHightlight() {
        if (this.containerBox) {
            this.containerBox.remove();
        }

        this.containerBox = null;
    }

    addContainerDropHightlight() {
        if (!this.containerDropBox) {
            this.containerDropBox = document.createElement('div');
            this.containerDropBox.classList.add('container-drop-box');

            // //
            // this.containerDropBox.innerHTML = `
            //     <div class="container-label">`+this.getClassName()+`</div>
            // `;

            // Append it to the body
            document.body.appendChild(this.containerDropBox);
        }

        this.matchingDomNode(this.containerDropBox);
    }

    removeContainerDropHightlight() {
        if (this.containerDropBox) {
            this.containerDropBox.remove();
        }

        this.containerDropBox = null;
    }

    checkIfThePositionIsBefore(clientX, clientY) {
        const hoveredBlock = this.domNode;
        const hoveredBlockRect = hoveredBlock.getBoundingClientRect();

        return clientY < hoveredBlockRect.top + hoveredBlockRect.height / 2;
    }
}

export default BaseElement;
