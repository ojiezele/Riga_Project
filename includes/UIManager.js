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

        // Global dragover & drop listeners on iframe, document, and body so dragging from outside always works
        const iframe = this.builder.iframe;
        const iframeDoc = this.builder.iframeDoc;

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
            });

            iframeDoc.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggingItem) {
                    this.drop(this.builder.pageElement, e);
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
                if (!this.activeDropElement) {
                    this.dragOver(this.builder.pageElement, e);
                }
            });

            pageDom.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggingItem) {
                    this.drop(this.activeDropElement || this.builder.pageElement, e);
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

        // Droppable elements
        if (element.isDroppable()) {
            element.domNode.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
                this.dragOver(element, e);
            });

            element.domNode.addEventListener('dragleave', (e) => {
                e.stopPropagation();
                this.dragLeave(element);
            });

            element.domNode.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.drop(element, e);
            });
        }

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

            if (isBefore && element.canDropBefore?.()) {
                element.addDropBeforeHighlight?.();
            } else if (element.canDropAfter?.()) {
                element.addDropAfterHighlight?.();
            }

            if (element.container?.addContainerDropHightlight) {
                element.container.addContainerDropHightlight();
            }
        } else if (element.canDropInside?.()) {
            element.addDropInsideHighlight?.();
            if (element.container?.addContainerDropHightlight) {
                element.container.addContainerDropHightlight();
            }
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
            const isBefore = (e.clientY - rect.top) < (rect.height / 2);

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