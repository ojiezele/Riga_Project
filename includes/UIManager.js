import BlockElement from './BlockElement.js';

class UIManager {
    constructor(builder) {
        this.builder = builder;
        this.elements = [];
        this.hoveringElements = [];
        this.dragOveringElements = [];
        this.draggableItems = [];

        this.draggingItem = null;
        this.activeDropElement = null;
        this.isDropBefore = false;
    }

    init() {
        if (!this.builder || !this.builder.pageElement || !this.builder.pageElement.domNode) {
            return;
        }

        const pageDom = this.builder.pageElement.domNode;
        pageDom.addEventListener('mouseover', (e) => {
            e.preventDefault();
            this.mouseover(this.builder.pageElement);
        });

        pageDom.addEventListener('mouseout', (e) => {
            e.preventDefault();
            this.mouseout(this.builder.pageElement);
        });

        const iframe = this.builder.iframe;
        const iframeDoc = this.builder.iframeDoc;

        // Helper to locate which block in the canvas the pointer is hovering over
        const resolveTargetElement = (e) => {
            if (!e || !e.target) return this.builder.pageElement;
            const targetNode = e.target;
            const blockNode = targetNode.closest ? targetNode.closest('[builder-element="BlockElement"]') : null;
            if (blockNode) {
                const found = this.elements.find(el => el.domNode === blockNode);
                if (found) return found;
            }
            const anyBuilderNode = targetNode.closest ? targetNode.closest('[builder-element]') : null;
            if (anyBuilderNode) {
                const found = this.elements.find(el => el.domNode === anyBuilderNode);
                if (found) {
                    if (found.getClassName() === 'BlockElement') return found;
                    if (found.container && found.container.getClassName?.() === 'BlockElement') return found.container;
                    return found;
                }
            }
            return this.builder.pageElement;
        };

        if (iframe) {
            iframe.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            });
        }

        if (iframeDoc) {
            iframeDoc.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
                if (!this.draggingItem) return;

                const targetEl = resolveTargetElement(e);
                this.dragOver(targetEl, e);
            });

            iframeDoc.addEventListener('dragleave', (e) => {
                // If leaving iframe entirely, remove drop highlights
                if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= iframeDoc.documentElement.clientWidth || e.clientY >= iframeDoc.documentElement.clientHeight) {
                    if (this.activeDropElement) {
                        this.activeDropElement.removeDropHighlight?.();
                        this.activeDropElement = null;
                    }
                }
            });

            iframeDoc.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.draggingItem) {
                    const targetEl = resolveTargetElement(e);
                    this.drop(targetEl || this.activeDropElement || this.builder.pageElement, e);
                }
            });

            // Click outside element on blank canvas unselects active element
            iframeDoc.addEventListener('click', (e) => {
                const isBuilderElement = e.target.closest('[builder-element]');
                if (!isBuilderElement) {
                    this.builder.unselect();
                }
            });
        }

        if (pageDom) {
            pageDom.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
                if (!this.draggingItem) return;

                const targetEl = resolveTargetElement(e);
                this.dragOver(targetEl, e);
            });

            pageDom.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.draggingItem) {
                    const targetEl = resolveTargetElement(e);
                    this.drop(targetEl || this.activeDropElement || this.builder.pageElement, e);
                }
            });
        }
    }

    addElement(element) {
        if (!this.elements.includes(element)) {
            this.elements.push(element);
        }
        this.handleElementEvents(element);
    }

    handleElementEvents(element) {
        if (!element || !element.domNode || element.eventHandled) {
            return;
        }

        element.domNode.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            this.mouseover(element);
        });

        element.domNode.addEventListener('mouseout', (e) => {
            e.stopPropagation();
            this.mouseout(element);
        });

        // Always allow dragover on canvas elements so HTML5 drag never shows 🚫 not-allowed cursor
        element.domNode.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';

            if (this.draggingItem) {
                e.stopPropagation();
                const target = element.getClassName() === 'BlockElement' ? element : (element.container?.getClassName?.() === 'BlockElement' ? element.container : element);
                this.dragOver(target, e);
            }
        });

        element.domNode.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            if (this.activeDropElement === element) {
                // Let the next dragover handle transition
            }
        });

        element.domNode.addEventListener('drop', (e) => {
            if (this.draggingItem) {
                e.preventDefault();
                e.stopPropagation();
                const target = element.getClassName() === 'BlockElement' ? element : (element.container?.getClassName?.() === 'BlockElement' ? element.container : element);
                this.drop(target, e);
            }
        });

        // Select element on click
        element.domNode.addEventListener('click', (e) => {
            e.stopPropagation();
            this.builder.selectElement(element);
        });

        element.eventHandled = true;
    }

    mouseover(element) {
        this.addHoveringElement(element);

        this.hoveringElements.forEach((el) => {
            if (el === this.getTopHoveringElement()) {
                el.addHoverHightlight();
            } else {
                el.removeHoverHightlight();
            }
        });

        if (element.container && typeof element.container.addContainerHightlight === 'function') {
            element.container.addContainerHightlight();
        }
    }

    mouseout(element) {
        this.removeHoveringElement(element);
        element.removeHoverHightlight();

        if (element.container && typeof element.container.removeContainerHightlight === 'function') {
            element.container.removeContainerHightlight();
        }
    }

    addHoveringElement(element) {
        if (!this.hoveringElements.includes(element)) {
            this.hoveringElements.unshift(element); // Most specific element at index 0
        }
    }

    removeHoveringElement(element) {
        this.hoveringElements = this.hoveringElements.filter(e => e !== element);
    }

    getTopHoveringElement() {
        return this.hoveringElements[0];
    }

    addDraggableItem(draggableItem) {
        if (!this.draggableItems.includes(draggableItem)) {
            this.draggableItems.push(draggableItem);
        }

        const anchor = draggableItem.getDragAnchor();
        if (!anchor) return;

        anchor.setAttribute('draggable', 'true');

        anchor.addEventListener('dragstart', (e) => {
            this.dragStart(draggableItem);
            if (e.dataTransfer) {
                const name = draggableItem.getName ? draggableItem.getName() : 'widget';
                e.dataTransfer.setData('text/plain', name);
                e.dataTransfer.effectAllowed = 'copyMove';
            }
        });

        anchor.addEventListener('dragend', () => {
            this.cleanupDrag();
        });

        // 1-Click to Insert Feature: Clicking a widget in the sidebar inserts it directly!
        anchor.addEventListener('click', () => {
            this.insertWidget(draggableItem);
        });
    }

    dragStart(draggableItem) {
        this.draggingItem = draggableItem;
        this.dragOveringElements = [];
        this.activeDropElement = null;
        this.isDropBefore = false;
    }

    cleanupDrag() {
        this.draggingItem = null;
        this.dragOveringElements = [];
        if (this.activeDropElement) {
            this.activeDropElement.removeDropHighlight?.();
            this.activeDropElement = null;
        }
        this.elements.forEach(el => {
            el.removeDropHighlight?.();
            if (el.container) {
                el.container.removeContainerDropHightlight?.();
            }
        });
        if (this.builder.pageElement) {
            this.builder.pageElement.removeDropHighlight?.();
        }
        document.querySelectorAll('.drop-before-box, .drop-after-box, .drop-inside-box, .container-drop-box').forEach(el => el.remove());
    }

    // Direct insertion helper (usable by click or programmatic drops)
    insertWidget(draggableItem) {
        if (!draggableItem) return;
        const renderedElements = draggableItem.renderElements();
        if (!renderedElements || renderedElements.length === 0) return;

        const selected = this.builder.getSelectedElement();
        if (selected && typeof selected.canDropInside === 'function' && selected.canDropInside()) {
            selected.appendElements(renderedElements);
            selected.render();
        } else if (selected && selected.container && typeof selected.container.addElementsAfter === 'function') {
            this.addElementsAfter(selected.container, selected, renderedElements);
        } else {
            this.builder.pageElement.appendElements(renderedElements);
            this.builder.pageElement.render();
        }

        const widgetName = draggableItem.getName ? draggableItem.getName() : 'Widget';
        window.dispatchEvent(new CustomEvent('builder:widgetAdded', { detail: { name: widgetName } }));
    }

    dragOver(element, e) {
        const draggableItem = this.draggingItem;
        if (!draggableItem) return;

        if (this.activeDropElement && this.activeDropElement !== element) {
            this.activeDropElement.removeDropHighlight?.();
            if (this.activeDropElement.container) {
                this.activeDropElement.container.removeContainerDropHightlight?.();
            }
        }
        this.activeDropElement = element;

        if (element.canDropAfter?.() || element.canDropBefore?.()) {
            const rect = element.domNode.getBoundingClientRect();
            const isBefore = (e.clientY - rect.top) < (rect.height / 2);
            this.isDropBefore = isBefore;

            if (isBefore && element.canDropBefore?.()) {
                element.addDropBeforeHighlight?.();
            } else if (element.canDropAfter?.()) {
                element.addDropAfterHighlight?.();
            }
        } else if (element.canDropInside?.()) {
            this.isDropBefore = false;
            element.addDropInsideHighlight?.();
        }
    }

    dragLeave(element) {
        element.removeDropHighlight?.();
        if (element.container?.removeContainerDropHightlight) {
            element.container.removeContainerDropHightlight();
        }
        if (this.activeDropElement === element) {
            this.activeDropElement = null;
        }
    }

    drop(element, e) {
        const draggableItem = this.draggingItem;
        if (!draggableItem) return;

        const target = element || this.activeDropElement || this.builder.pageElement;
        target.removeDropHighlight?.();

        const renderedElements = draggableItem.renderElements();
        if (!renderedElements || renderedElements.length === 0) {
            this.cleanupDrag();
            return;
        }

        if (target.canDropAfter?.() || target.canDropBefore?.()) {
            const rect = target.domNode ? target.domNode.getBoundingClientRect() : { top: 0, height: 100 };
            const isBefore = this.isDropBefore !== null ? this.isDropBefore : ((e.clientY - rect.top) < (rect.height / 2));

            const container = target.container || this.builder.pageElement;
            if (isBefore && target.canDropBefore?.()) {
                this.addElementsBefore(container, target, renderedElements);
            } else if (target.canDropAfter?.()) {
                this.addElementsAfter(container, target, renderedElements);
            } else {
                this.addElementsAfter(container, target, renderedElements);
            }
        } else if (target.canDropInside?.()) {
            const newBlocks = target.appendElements(renderedElements);
            target.render();
            if (Array.isArray(newBlocks)) {
                newBlocks.forEach(b => b.fadeIn?.());
            }
        } else {
            // Default: append directly to PageElement
            const newBlocks = this.builder.pageElement.appendElements(renderedElements);
            this.builder.pageElement.render();
            if (Array.isArray(newBlocks)) {
                newBlocks.forEach(b => b.fadeIn?.());
            }
        }

        if (draggableItem.removeAfterDrop?.()) {
            draggableItem.remove();
        }

        const widgetName = draggableItem.getName ? draggableItem.getName() : 'Widget';
        window.dispatchEvent(new CustomEvent('builder:widgetAdded', { detail: { name: widgetName } }));

        this.cleanupDrag();
    }

    addElementsAfter(container, referenceBlock, elements) {
        if (!container || typeof container.addElementsAfter !== 'function') {
            this.builder.pageElement.appendElements(elements);
            this.builder.pageElement.render();
            return;
        }

        const newBlocks = container.addElementsAfter(elements, referenceBlock);
        container.render();
        if (Array.isArray(newBlocks)) {
            newBlocks.forEach(block => block.fadeIn?.());
        }
    }

    addElementsBefore(container, referenceBlock, elements) {
        if (!container || typeof container.addElementsBefore !== 'function') {
            this.builder.pageElement.appendElements(elements);
            this.builder.pageElement.render();
            return;
        }

        const newBlocks = container.addElementsBefore(elements, referenceBlock);
        container.render();
        if (Array.isArray(newBlocks)) {
            newBlocks.forEach(block => block.fadeIn?.());
        }
    }

    removeDraggableItem(object) {
        this.draggableItems = this.draggableItems.filter(e => e !== object);
    }

    removeElement(element) {
        this.elements = this.elements.filter(e => e !== element);
        this.removeHoveringElement(element);
        this.removeDraggableItem(element);
        if (this.activeDropElement === element) {
            this.activeDropElement = null;
        }
    }
}

export default UIManager;