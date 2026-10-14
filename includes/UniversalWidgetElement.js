/**
 * UniversalWidgetElement.js
 * Universal Elementor & Webflow grade component engine supporting 66+ widgets.
 * Features:
 * - Beautiful, production-grade pre-styled default appearances
 * - True vector SVG icon rendering (never raw ligature strings)
 * - True live interactivity for all interactive widgets (Accordion, Tabs, Counter,
 *   Countdown, ProgressBar, FlipBox, StarRating, Form, Alert, AddToCart, etc.)
 * - Deep Sub-Element styling breakdown: style individual labels, input fields,
 *   buttons, cards, badges, and headers independently with live canvas click targeting.
 */

import BaseElement from './BaseElement.js';
import { 
    TextControl, 
    TextareaControl, 
    SelectControl, 
    SliderControl, 
    ColorControl, 
    ButtonGroupControl, 
    FourSideControl, 
    ToggleControl,
    MediaPickerControl,
    IconPickerControl,
    SectionHeaderControl,
    SubStyleSelectorControl,
    BoxModelDiagramControl
} from './ElementorControls.js';
import { renderSvgIcon } from './SvgIcons.js';

export class UniversalWidgetElement extends BaseElement {
    constructor(widgetDef, props = {}, styles = {}, advanced = {}, subStyles = {}) {
        super();
        this.widgetDef = widgetDef || { id: 'Generic', label: 'Component' };
        this.widgetId = this.widgetDef.id || 'Generic';
        this.props = { ...this.getDefaultProps(), ...props };
        this.styles = { ...this.getDefaultStyles(), ...styles };
        this.advanced = { ...this.getDefaultAdvanced(), ...advanced };
        this.subStyles = { ...this.getDefaultSubStyles(), ...subStyles };
        this.activeSubSection = this.getDefaultActiveSubSection();
        this.domNode = null;
        this.countdownTimer = null;
    }

    getClassName() {
        return this.widgetId + 'Element';
    }

    getDefaultActiveSubSection() {
        switch (this.widgetId) {
            case 'Form': return 'labels';
            case 'Accordion': return 'header';
            case 'Tabs': return 'activeBtn';
            case 'PriceTable': return 'card';
            case 'IconBox': return 'icon';
            case 'List': return 'icons';
            case 'Testimonial': return 'quote';
            case 'Navbar': return 'brand';
            case 'Counter': return 'number';
            case 'Countdown': return 'digits';
            case 'ProgressBar': return 'fill';
            case 'StarRating': return 'stars';
            case 'Button': return 'button';
            case 'CookieConsent': return 'style';
            default: return 'container';
        }
    }

    getDefaultSubStyles() {
        return {
            // Form Sub-styles
            formContainer: {
                backgroundColor: '#ffffff',
                padding: '28px',
                borderRadius: '16px',
                borderColor: '#e5e7eb',
                borderWidth: '1px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            },
            formTitle: {
                text: 'Get in Touch',
                color: '#111827',
                fontSize: '18px',
                fontWeight: '800'
            },
            formLabels: {
                color: '#374151',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '6px',
                letterSpacing: '0px'
            },
            formFields: {
                backgroundColor: '#f9fafb',
                color: '#111827',
                borderColor: '#e5e7eb',
                borderWidth: '1px',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px'
            },
            formButton: {
                text: 'Send Message',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                borderRadius: '10px',
                padding: '12px 24px',
                fullWidth: true
            },

            // Accordion Sub-styles
            accordionHeader: {
                backgroundColor: '#ffffff',
                color: '#111827',
                fontSize: '13px',
                fontWeight: '700',
                padding: '14px 18px',
                borderRadius: '12px',
                borderColor: '#e5e7eb',
                borderWidth: '1px'
            },
            accordionContent: {
                backgroundColor: '#fafafa',
                color: '#4b5563',
                fontSize: '12px',
                padding: '14px 18px'
            },
            accordionIcon: {
                color: '#111827',
                size: '16px'
            },

            // Tabs Sub-styles
            tabsActiveBtn: {
                backgroundColor: '#000000',
                color: '#ffffff',
                fontWeight: '700',
                borderRadius: '8px',
                padding: '8px 16px'
            },
            tabsInactiveBtn: {
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '8px 16px'
            },
            tabsPane: {
                backgroundColor: '#ffffff',
                color: '#374151',
                fontSize: '13px',
                padding: '20px',
                borderRadius: '12px',
                borderColor: '#f3f4f6',
                borderWidth: '1px'
            },

            // Price Table Sub-styles
            priceCard: {
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                borderWidth: '2px',
                borderRadius: '24px',
                padding: '32px 24px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)'
            },
            priceBadge: {
                text: 'Most Popular',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '11px',
                fontWeight: '800',
                borderRadius: '9999px',
                padding: '4px 12px'
            },
            priceTitle: {
                text: 'Professional Plan',
                color: '#111827',
                fontSize: '20px',
                fontWeight: '800'
            },
            priceAmount: {
                price: '$49',
                color: '#111827',
                fontSize: '38px',
                fontWeight: '900',
                periodText: '/month',
                periodColor: '#6b7280'
            },
            priceFeatures: {
                color: '#4b5563',
                iconColor: '#10b981',
                fontSize: '12px',
                spacing: '12px'
            },
            priceButton: {
                text: 'Subscribe Now',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '700',
                borderRadius: '12px',
                padding: '12px 24px'
            },

            // IconBox Sub-styles
            iconBoxIcon: {
                symbol: 'bolt',
                color: '#ffffff',
                size: '22px',
                backgroundColor: '#000000',
                borderRadius: '12px',
                padding: '14px'
            },
            iconBoxTitle: {
                color: '#111827',
                fontSize: '16px',
                fontWeight: '800'
            },
            iconBoxDesc: {
                color: '#4b5563',
                fontSize: '13px',
                lineHeight: '1.6'
            },

            // List Sub-styles
            listIcons: {
                symbol: 'check_circle',
                color: '#10b981',
                size: '18px',
                backgroundColor: '#ecfdf5',
                borderRadius: '9999px',
                padding: '4px'
            },
            listText: {
                color: '#1f2937',
                fontSize: '13px',
                fontWeight: '500',
                spacing: '10px'
            },

            // Testimonial Sub-styles
            testimonialCard: {
                backgroundColor: '#f9fafb',
                borderColor: '#e5e7eb',
                borderWidth: '1px',
                borderRadius: '20px',
                padding: '24px'
            },
            testimonialQuote: {
                color: '#1f2937',
                fontSize: '14px',
                fontStyle: 'italic',
                lineHeight: '1.6'
            },
            testimonialStars: {
                color: '#f59e0b',
                size: '16px',
                count: 5
            },
            testimonialAuthor: {
                color: '#111827',
                fontSize: '13px',
                fontWeight: '700'
            },
            testimonialRole: {
                color: '#6b7280',
                fontSize: '11px',
                fontWeight: '500'
            },

            // Counter Sub-styles
            counterNumber: {
                color: '#111827',
                fontSize: '42px',
                fontWeight: '900'
            },
            counterSuffix: {
                color: '#2563eb',
                fontSize: '28px',
                fontWeight: '800'
            },
            counterTitle: {
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1px'
            },

            // Countdown Sub-styles
            countdownHeadline: {
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '1px'
            },
            countdownDigits: {
                color: '#111827',
                fontSize: '24px',
                fontWeight: '900',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                padding: '10px'
            },
            countdownUnits: {
                color: '#9ca3af',
                fontSize: '9px',
                fontWeight: '800'
            },

            // ProgressBar Sub-styles
            progressBarLabel: {
                color: '#111827',
                fontSize: '12px',
                fontWeight: '700'
            },
            progressBarTrack: {
                backgroundColor: '#f3f4f6',
                height: '10px',
                borderRadius: '9999px'
            },
            progressBarFill: {
                backgroundColor: '#000000',
                percentage: 85
            },

            // StarRating Sub-styles
            starRatingStars: {
                color: '#f59e0b',
                size: '18px',
                rating: 4.9
            },
            starRatingScore: {
                color: '#111827',
                fontSize: '13px',
                fontWeight: '800'
            },
            starRatingReviews: {
                color: '#9ca3af',
                fontSize: '12px'
            },

            // Navbar Sub-styles
            navbarBrand: {
                color: '#111827',
                fontSize: '16px',
                fontWeight: '900'
            },
            navbarLinks: {
                color: '#4b5563',
                hoverColor: '#000000',
                fontSize: '12px',
                fontWeight: '600'
            },
            navbarCta: {
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: '10px',
                padding: '8px 16px'
            }
        };
    }

    getDefaultProps() {
        const defaults = {};
        if (this.widgetDef.editableFields) {
            Object.entries(this.widgetDef.editableFields).forEach(([key, field]) => {
                if (field.default !== undefined) {
                    defaults[key] = field.default;
                } else if (field.type === 'text' || field.type === 'media' || field.type === 'icon') {
                    defaults[key] = '';
                } else if (field.type === 'number') {
                    defaults[key] = 0;
                } else if (field.type === 'boolean') {
                    defaults[key] = false;
                } else if (field.type === 'array') {
                    defaults[key] = [];
                }
            });
        }
        return defaults;
    }

    getDefaultStyles() {
        return {
            color: '',
            backgroundColor: '',
            fontSize: '',
            fontWeight: '',
            fontFamily: '',
            lineHeight: '',
            letterSpacing: '',
            textAlign: '',
            textTransform: '',
            width: '',
            height: '',
            maxWidth: '',
            padding: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            borderRadius: '',
            borderColor: '',
            borderWidth: '',
            borderStyle: 'none',
            boxShadow: '',
            opacity: 1
        };
    }

    getDefaultAdvanced() {
        return {
            tag: this.props.tag || 'div',
            htmlId: this.props.htmlId || '',
            cssClasses: this.props.cssClasses || '',
            display: 'block',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gap: '0px',
            position: 'static',
            zIndex: '',
            animation: 'none',
            customCss: ''
        };
    }

    setProp(key, value) {
        this.props[key] = value;
        this.render();
    }

    setStyle(key, value) {
        this.styles[key] = value;
        this.applyDomStyles();
    }

    setSubStyle(section, key, value) {
        if (!this.subStyles[section]) {
            this.subStyles[section] = {};
        }
        this.subStyles[section][key] = value;
        this.render();
    }

    setAdvanced(key, value) {
        this.advanced[key] = value;
        this.applyDomStyles();
    }

    applyDomStyles() {
        if (!this.domNode) return;
        const target = this.domNode.firstElementChild || this.domNode;
        const s = this.styles;

        if (s.color) target.style.color = s.color;
        if (s.backgroundColor) target.style.backgroundColor = s.backgroundColor;
        if (s.fontSize) target.style.fontSize = s.fontSize;
        if (s.fontWeight) target.style.fontWeight = s.fontWeight;
        if (s.fontFamily) target.style.fontFamily = s.fontFamily;
        if (s.lineHeight) target.style.lineHeight = s.lineHeight;
        if (s.letterSpacing) target.style.letterSpacing = s.letterSpacing;
        if (s.textAlign) target.style.textAlign = s.textAlign;
        if (s.textTransform) target.style.textTransform = s.textTransform;

        if (s.width) target.style.width = s.width;
        if (s.height) target.style.height = s.height;
        if (s.maxWidth) target.style.maxWidth = s.maxWidth;

        if (s.padding) {
            const p = s.padding;
            if (typeof p === 'object') {
                target.style.padding = `${p.top || '0px'} ${p.right || '0px'} ${p.bottom || '0px'} ${p.left || '0px'}`;
            } else if (p) {
                target.style.padding = p;
            }
        }

        if (s.margin) {
            const m = s.margin;
            if (typeof m === 'object') {
                target.style.margin = `${m.top || '0px'} ${m.right || '0px'} ${m.bottom || '0px'} ${m.left || '0px'}`;
            } else if (m) {
                target.style.margin = m;
            }
        }

        if (s.borderRadius) target.style.borderRadius = s.borderRadius;
        if (s.borderStyle && s.borderStyle !== 'none') {
            target.style.border = `${s.borderWidth || '1px'} ${s.borderStyle} ${s.borderColor || '#e5e7eb'}`;
        }
        if (s.boxShadow && s.boxShadow !== 'none') target.style.boxShadow = s.boxShadow;
        if (s.opacity !== undefined && s.opacity !== 1) target.style.opacity = s.opacity;
    }

    render() {
        const isInitial = !this.domNode;
        if (isInitial) {
            this.domNode = document.createElement('div');
            this.domNode.setAttribute('builder-element', this.getClassName());
            this.domNode.setAttribute('widget-id', this.widgetId);
            this.domNode.className = `riga-widget-wrapper ${this.widgetId.toLowerCase()}-wrapper relative group`;
        }

        // Render HTML content
        this.domNode.innerHTML = this.generateHtml();
        this.applyDomStyles();

        // Canvas sub-element click targeting:
        // Clicking directly on a label, input, button, or header switches inspector to that sub-element!
        this.domNode.addEventListener('click', (e) => {
            const subElem = e.target.closest('[data-sub-elem]');
            if (subElem) {
                const subType = subElem.getAttribute('data-sub-elem');
                if (subType && subType !== this.activeSubSection) {
                    this.activeSubSection = subType;
                    const builder = (typeof window !== 'undefined' && window.builder) ? window.builder : null;
                    if (builder && builder.getSelectedElement() === this) {
                        builder.renderElementControls(this);
                    }
                }
            }
        });

        // Wire inline contenteditable fields for double-click text editing
        const editables = this.domNode.querySelectorAll('[data-inline-edit]');
        editables.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            el.addEventListener('input', () => {
                const propKey = el.getAttribute('data-inline-edit');
                if (propKey) {
                    this.props[propKey] = el.innerText || el.textContent;
                }
            });
        });

        // Wire full live interactivity on the canvas!
        this.attachInteractivity();

        return this.domNode;
    }

    // Attach true interactive behaviors to widgets
    attachInteractivity() {
        if (!this.domNode) return;

        // 1. Accordion Interactivity
        const accordionItems = this.domNode.querySelectorAll('.riga-accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.riga-accordion-header');
            const content = item.querySelector('.riga-accordion-content');
            const chevron = item.querySelector('.riga-accordion-chevron');
            if (header && content) {
                header.onclick = (e) => {
                    e.stopPropagation();
                    const isClosed = content.style.display === 'none';
                    content.style.display = isClosed ? 'block' : 'none';
                    if (chevron) {
                        chevron.style.transform = isClosed ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                };
            }
        });

        // 2. Tabs Interactivity
        const tabBtns = this.domNode.querySelectorAll('.riga-tab-btn');
        const tabPanes = this.domNode.querySelectorAll('.riga-tab-pane');
        tabBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const idx = btn.getAttribute('data-tab-idx');
                tabBtns.forEach(b => {
                    b.classList.remove('active-tab', 'bg-black', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                btn.classList.add('active-tab', 'bg-black', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');
                tabPanes.forEach(pane => {
                    pane.style.display = pane.getAttribute('data-tab-pane-idx') === idx ? 'block' : 'none';
                });
            };
        });

        // 3. StarRating Interactivity
        const starBtns = this.domNode.querySelectorAll('.riga-star-btn');
        const scoreDisplay = this.domNode.querySelector('.riga-rating-score');
        starBtns.forEach(btn => {
            btn.onmouseenter = () => {
                const hoverIdx = parseInt(btn.getAttribute('data-star-idx'), 10);
                starBtns.forEach(s => {
                    const idx = parseInt(s.getAttribute('data-star-idx'), 10);
                    s.style.color = idx <= hoverIdx ? '#f59e0b' : '#d1d5db';
                });
            };
            btn.onmouseleave = () => {
                const currentRating = parseFloat(this.props.rating || 4.9);
                starBtns.forEach(s => {
                    const idx = parseInt(s.getAttribute('data-star-idx'), 10);
                    s.style.color = idx <= Math.round(currentRating) ? '#f59e0b' : '#d1d5db';
                });
            };
            btn.onclick = (e) => {
                e.stopPropagation();
                const clickedIdx = parseInt(btn.getAttribute('data-star-idx'), 10);
                this.props.rating = clickedIdx;
                if (scoreDisplay) scoreDisplay.textContent = clickedIdx.toFixed(1);
                starBtns.forEach(s => {
                    const idx = parseInt(s.getAttribute('data-star-idx'), 10);
                    s.style.color = idx <= clickedIdx ? '#f59e0b' : '#d1d5db';
                });
            };
        });

        // 4. Countdown Live Clock
        const daysEl = this.domNode.querySelector('[data-countdown="days"]');
        const hrsEl = this.domNode.querySelector('[data-countdown="hours"]');
        const minsEl = this.domNode.querySelector('[data-countdown="mins"]');
        const secsEl = this.domNode.querySelector('[data-countdown="secs"]');
        if (daysEl && hrsEl && minsEl && secsEl) {
            if (this.countdownTimer) clearInterval(this.countdownTimer);
            let totalSeconds = 3 * 86400 + 14 * 3600 + 42 * 60 + 18;
            this.countdownTimer = setInterval(() => {
                totalSeconds = Math.max(0, totalSeconds - 1);
                const d = Math.floor(totalSeconds / 86400);
                const h = Math.floor((totalSeconds % 86400) / 3600);
                const m = Math.floor((totalSeconds % 3600) / 60);
                const s = totalSeconds % 60;
                daysEl.textContent = String(d).padStart(2, '0');
                hrsEl.textContent = String(h).padStart(2, '0');
                minsEl.textContent = String(m).padStart(2, '0');
                secsEl.textContent = String(s).padStart(2, '0');
            }, 1000);
        }

        // 5. FlipBox Click / Hover Interactivity
        const flipCard = this.domNode.querySelector('.riga-flip-inner');
        if (flipCard) {
            this.domNode.onclick = (e) => {
                e.stopPropagation();
                flipCard.classList.toggle('flipped');
            };
        }

        // 6. Form Interactive Submission
        const formEl = this.domNode.querySelector('.riga-interactive-form');
        const submitBtn = this.domNode.querySelector('.riga-form-submit-btn');
        const successBox = this.domNode.querySelector('.riga-form-success');
        if (submitBtn && successBox) {
            submitBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = `
                    <span class="inline-flex items-center gap-2">
                        <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                        <span>Submitting...</span>
                    </span>
                `;
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    if (formEl) formEl.style.display = 'none';
                    successBox.style.display = 'block';
                }, 600);
            };
            const resetBtn = this.domNode.querySelector('.riga-form-reset-btn');
            if (resetBtn) {
                resetBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (formEl) formEl.style.display = 'block';
                    successBox.style.display = 'none';
                };
            }
        }

        // 7. Alert Dismiss Button
        const alertDismiss = this.domNode.querySelector('.riga-alert-dismiss');
        const alertBox = this.domNode.querySelector('.riga-alert-box');
        if (alertDismiss && alertBox) {
            alertDismiss.onclick = (e) => {
                e.stopPropagation();
                alertBox.style.opacity = '0';
                alertBox.style.transform = 'scale(0.96)';
                alertBox.style.transition = 'all 0.25s ease';
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 250);
            };
        }

        // 8. Add to Cart / Products Interactivity
        const cartBtns = this.domNode.querySelectorAll('.riga-add-to-cart-btn');
        cartBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const currentCount = parseInt(btn.getAttribute('data-cart-count') || 0, 10) + 1;
                btn.setAttribute('data-cart-count', currentCount);
                btn.classList.add('bg-emerald-600');
                btn.innerHTML = `✓ Added to Cart (${currentCount})`;
                setTimeout(() => {
                    btn.classList.remove('bg-emerald-600');
                }, 1500);
            };
        });

        // 9. Carousel Prev / Next Interactivity
        const carouselPrev = this.domNode.querySelector('.riga-carousel-prev');
        const carouselNext = this.domNode.querySelector('.riga-carousel-next');
        const carouselSlide = this.domNode.querySelector('.riga-carousel-slide');
        if (carouselPrev && carouselNext && carouselSlide) {
            const slideHeadlines = [
                'Sub-50ms Global Edge Delivery',
                'Zero Lock-In Static Exports',
                'Built for Conversion & Scale'
            ];
            let activeSlide = 0;
            const updateSlide = () => {
                const titleEl = carouselSlide.querySelector('h4');
                if (titleEl) titleEl.textContent = slideHeadlines[activeSlide];
            };
            carouselPrev.onclick = (e) => {
                e.stopPropagation();
                activeSlide = (activeSlide - 1 + slideHeadlines.length) % slideHeadlines.length;
                updateSlide();
            };
            carouselNext.onclick = (e) => {
                e.stopPropagation();
                activeSlide = (activeSlide + 1) % slideHeadlines.length;
                updateSlide();
            };
        }
    }

    generateHtml() {
        const p = this.props;
        const wid = this.widgetId;
        const sub = this.subStyles;
        const svg = (typeof window !== 'undefined' && window.renderSvgIcon) ? window.renderSvgIcon : renderSvgIcon;

        switch (wid) {
            case 'Container':
            case 'Section':
                return `
                    <div class="riga-container" data-sub-elem="container" style="min-height: ${p.minHeight || '120px'}; padding: 36px 28px; border: 1.5px dashed rgba(0,0,0,0.15); border-radius: 16px; background: rgba(0,0,0,0.015);">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">${p.contentWidth === 'full-width' ? 'Full Width Section' : 'Boxed Container'}</span>
                            <span class="text-[9px] px-2.5 py-0.5 rounded-full bg-black text-white font-bold">Section Container</span>
                        </div>
                        <div class="container-content space-y-2">
                            <h3 class="text-xl font-extrabold text-gray-900" data-inline-edit="title">${p.title || 'Section Container'}</h3>
                            <p class="text-xs text-gray-600 leading-relaxed" data-inline-edit="subtitle">${p.subtitle || 'Drag components inside here to construct high-converting layouts.'}</p>
                        </div>
                    </div>
                `;

            case 'Grid':
            case 'Columns':
                const cols = p.columns || 3;
                const colGap = p.columnGap || '20px';
                return `
                    <div class="riga-grid" style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${colGap}; padding: 12px 0;">
                        ${Array.from({ length: cols }).map((_, i) => `
                            <div style="background: rgba(243, 244, 246, 0.7); border: 1px dashed #d1d5db; border-radius: 12px; padding: 28px 16px; text-align: center;">
                                <div class="text-xs font-bold text-gray-800">Column ${i + 1}</div>
                                <p class="text-[10px] text-gray-500 mt-1">Responsive Column Slot</p>
                            </div>
                        `).join('')}
                    </div>
                `;

            case 'DivBlock':
            case 'Flex':
                return `
                    <div class="riga-div-block" style="padding: 20px; border: 1px dashed #e5e7eb; border-radius: 8px; background: rgba(0,0,0,0.01);">
                        <span class="text-xs text-gray-500 font-mono font-bold">${p.label || 'Div Block'} (&lt;${p.tag || 'div'}&gt;)</span>
                    </div>
                `;

            case 'Spacer':
                return `
                    <div class="riga-spacer" style="height: ${p.height || '48px'}; width: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.02); border: 1px dashed rgba(0,0,0,0.08); border-radius: 6px;">
                        <span class="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Spacer (${p.height || '48px'})</span>
                    </div>
                `;

            case 'Heading':
                const Tag = p.tag || 'h2';
                const align = p.alignment || 'center';
                return `
                    <div style="text-align: ${align}; width: 100%; padding: 8px 0;" data-sub-elem="heading">
                        ${p.subtitle ? `<div class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1.5" data-inline-edit="subtitle">${p.subtitle}</div>` : ''}
                        <${Tag} class="font-extrabold tracking-tight text-gray-900" data-inline-edit="text" style="margin: 0; line-height: 1.25; font-size: ${Tag === 'h1' ? '2.5rem' : Tag === 'h2' ? '2rem' : Tag === 'h3' ? '1.5rem' : '1.25rem'};">${p.text || 'High-Converting Headline'}</${Tag}>
                    </div>
                `;

            case 'Paragraph':
            case 'TextBlock':
                return `<p class="text-sm sm:text-base text-gray-700 leading-relaxed" data-inline-edit="content" style="text-align: ${p.alignment || 'left'}; margin: 0; line-height: 1.6;">${p.content || 'Craft high-converting websites and marketing funnels in minutes with an enterprise visual builder designed for speed and scale.'}</p>`;

            case 'RichText':
                return `
                    <div class="prose max-w-none text-gray-800 text-sm leading-relaxed" data-inline-edit="content">
                        ${p.content || '<p>Deliver <strong>lightning-fast</strong> digital experiences. Explore our <a href="#" class="text-blue-600 underline font-semibold">documentation</a> to learn how edge delivery scales conversion rates globally.</p>'}
                    </div>
                `;

            case 'Blockquote':
                return `
                    <blockquote class="p-5 my-3 border-l-4 border-black bg-gray-50/90 rounded-r-2xl shadow-2xs">
                        <p class="text-sm sm:text-base font-medium italic text-gray-900 leading-relaxed" data-inline-edit="quote">"${p.quote || 'Simplicity is the ultimate sophistication.'}"</p>
                        <footer class="mt-2.5 text-xs font-bold text-gray-700 flex items-center gap-1.5">
                            <span data-inline-edit="author">${p.author || 'Leonardo da Vinci'}</span>
                            ${p.cite ? `<span class="text-gray-400 font-normal">(${p.cite})</span>` : ''}
                        </footer>
                    </blockquote>
                `;

            case 'Button':
                const btnSub = sub.button?.appearance || {};
                const btnBg = btnSub.backgroundColor || (p.variant === 'secondary' ? '#f3f4f6' : p.variant === 'outline' ? 'transparent' : '#000000');
                const btnTextCol = btnSub.color || (p.variant === 'secondary' || p.variant === 'outline' ? '#111827' : '#ffffff');
                const btnBorder = p.variant === 'outline' ? '2px solid #000000' : 'none';
                return `
                    <div style="display: inline-block;" data-sub-elem="button">
                        <a href="${p.url || '#'}" target="${p.target || '_self'}" class="riga-btn inline-flex items-center justify-center font-bold transition-all shadow-xs hover:opacity-90" style="background-color: ${btnBg}; color: ${btnTextCol}; border: ${btnBorder}; border-radius: 12px; padding: 12px 24px; text-decoration: none; cursor: pointer; gap: 8px; font-size: 13px;">
                            ${p.iconPosition === 'left' && p.icon ? svg(p.icon, { size: '15px', color: btnTextCol }) : ''}
                            <span data-inline-edit="text">${p.text || 'Get Started Now'}</span>
                            ${p.iconPosition !== 'left' && p.icon ? svg(p.icon || 'arrow_forward', { size: '15px', color: btnTextCol }) : ''}
                        </a>
                    </div>
                `;

            case 'Image':
                const src = p.src || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
                return `
                    <div class="riga-image-box" style="overflow: hidden; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                        <img src="${src}" alt="${p.alt || 'Showcase visual'}" style="width: 100%; height: auto; aspect-ratio: ${p.aspectRatio === 'auto' ? 'auto' : p.aspectRatio}; object-fit: ${p.objectFit || 'cover'}; display: block; border-radius: inherit;" />
                        ${p.caption ? `<div class="text-[11px] text-gray-500 text-center mt-2 font-medium" data-inline-edit="caption">${p.caption}</div>` : ''}
                    </div>
                `;

            case 'Gallery':
                return `
                    <div class="riga-gallery grid gap-3" style="grid-template-columns: repeat(${p.columns || 3}, 1fr);">
                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" class="w-full h-44 object-cover rounded-xl shadow-2xs hover:scale-102 transition-transform" />
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" class="w-full h-44 object-cover rounded-xl shadow-2xs hover:scale-102 transition-transform" />
                        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80" class="w-full h-44 object-cover rounded-xl shadow-2xs hover:scale-102 transition-transform" />
                    </div>
                `;

            case 'Icon':
                const iconName = p.iconName || 'bolt';
                return `
                    <div class="inline-flex items-center justify-center p-3.5 rounded-2xl bg-black text-white shadow-xs hover:scale-105 transition-transform cursor-pointer" data-sub-elem="icon">
                        ${svg(iconName, { size: p.size || '28px', color: '#ffffff' })}
                    </div>
                `;

            case 'IconBox':
                const ib = sub.iconBoxIcon || {};
                const ibTitle = sub.iconBoxTitle || {};
                const ibDesc = sub.iconBoxDesc || {};
                return `
                    <div class="p-6 bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-all select-none" data-sub-elem="iconBoxCard">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform hover:scale-105" data-sub-elem="iconBoxIcon" style="background-color: ${ib.backgroundColor || '#000000'}; color: ${ib.color || '#ffffff'};">
                            ${svg(p.icon || 'bolt', { size: ib.size || '22px', color: ib.color || '#ffffff' })}
                        </div>
                        <h4 class="text-base font-extrabold mb-1 tracking-tight" data-sub-elem="iconBoxTitle" data-inline-edit="title" style="color: ${ibTitle.color || '#111827'}; font-size: ${ibTitle.fontSize || '16px'};">${p.title || 'Ultra Fast Latency'}</h4>
                        <p class="text-xs leading-relaxed" data-sub-elem="iconBoxDesc" data-inline-edit="description" style="color: ${ibDesc.color || '#4b5563'};">${p.description || 'Sub-50ms edge delivery worldwide ensuring optimal conversion rates.'}</p>
                    </div>
                `;

            case 'ImageBox':
                return `
                    <div class="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-xs hover:shadow-md transition-all" data-sub-elem="imageBoxCard">
                        <img src="${p.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}" class="w-full h-44 object-cover" />
                        <div class="p-5">
                            <h4 class="text-base font-extrabold text-gray-900 mb-1 tracking-tight" data-sub-elem="imageBoxTitle" data-inline-edit="title">${p.title || 'Strategic Vision'}</h4>
                            <p class="text-xs text-gray-600 leading-relaxed" data-sub-elem="imageBoxDesc" data-inline-edit="description">${p.description || 'High converting landing page architecture tailored for enterprise scale.'}</p>
                        </div>
                    </div>
                `;

            case 'List':
                const lIcon = sub.listIcons || {};
                const lText = sub.listText || {};
                const listItems = [
                    p.item1 || 'Unlimited Custom Domains with SSL',
                    p.item2 || 'Global Edge Cloudflare CDN Hosting',
                    p.item3 || '24/7 Enterprise SLA Support'
                ];
                return `
                    <ul class="space-y-3 p-1 m-0 list-none text-xs font-medium" data-sub-elem="list">
                        ${listItems.map((item, idx) => `
                            <li class="flex items-center gap-3">
                                <span class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" data-sub-elem="listIcons" style="background-color: ${lIcon.backgroundColor || '#ecfdf5'}; color: ${lIcon.color || '#10b981'};">
                                    ${svg(p.icon || 'check_circle', { size: '16px', color: lIcon.color || '#10b981' })}
                                </span>
                                <span class="text-gray-800 font-semibold" data-sub-elem="listText" data-inline-edit="item${idx + 1}" style="color: ${lText.color || '#1f2937'}; font-size: ${lText.fontSize || '13px'};">${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                `;

            case 'SocialIcons':
                return `
                    <div class="flex items-center gap-2.5 p-1" data-sub-elem="socialIcons">
                        <a href="#" class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs">${svg('twitter', { size: '14px', color: '#fff' })}</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-[#0a66c2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs">${svg('linkedin', { size: '14px', color: '#fff' })}</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-[#e4405f] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs">${svg('instagram', { size: '14px', color: '#fff' })}</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs">${svg('youtube', { size: '14px', color: '#fff' })}</a>
                        <a href="#" class="w-9 h-9 rounded-full bg-[#181717] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs">${svg('github', { size: '14px', color: '#fff' })}</a>
                    </div>
                `;

            case 'Accordion':
                const accHead = sub.accordionHeader || {};
                const accContent = sub.accordionContent || {};
                return `
                    <div class="riga-accordion space-y-2.5" data-sub-elem="accordion">
                        <div class="riga-accordion-item bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                            <div class="riga-accordion-header flex items-center justify-between p-4 cursor-pointer select-none transition-colors hover:bg-gray-50/80" data-sub-elem="accordionHeader" style="background-color: ${accHead.backgroundColor || '#ffffff'}; color: ${accHead.color || '#111827'}; font-size: ${accHead.fontSize || '13px'}; font-weight: ${accHead.fontWeight || '700'};">
                                <span data-inline-edit="item1Title">${p.item1Title || 'What is included in the plan?'}</span>
                                <span class="riga-accordion-chevron transition-transform duration-200" data-sub-elem="accordionIcon" style="transform: rotate(180deg);">${svg('chevron_down', { size: '16px', color: accHead.color || '#111827' })}</span>
                            </div>
                            <div class="riga-accordion-content px-4 pb-4 border-t border-gray-100 pt-3" data-sub-elem="accordionContent" style="display: block; background-color: ${accContent.backgroundColor || '#fafafa'}; color: ${accContent.color || '#4b5563'}; font-size: ${accContent.fontSize || '12px'};">
                                <span data-inline-edit="item1Content">${p.item1Content || 'Complete visual builder, custom domains, high-speed CDN, and automated SSL.'}</span>
                            </div>
                        </div>
                        <div class="riga-accordion-item bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                            <div class="riga-accordion-header flex items-center justify-between p-4 cursor-pointer select-none transition-colors hover:bg-gray-50/80" data-sub-elem="accordionHeader" style="background-color: ${accHead.backgroundColor || '#ffffff'}; color: ${accHead.color || '#111827'}; font-size: ${accHead.fontSize || '13px'}; font-weight: ${accHead.fontWeight || '700'};">
                                <span data-inline-edit="item2Title">${p.item2Title || 'Can I connect custom domains?'}</span>
                                <span class="riga-accordion-chevron transition-transform duration-200" data-sub-elem="accordionIcon" style="transform: rotate(0deg);">${svg('chevron_down', { size: '16px', color: accHead.color || '#111827' })}</span>
                            </div>
                            <div class="riga-accordion-content px-4 pb-4 border-t border-gray-100 pt-3" data-sub-elem="accordionContent" style="display: none; background-color: ${accContent.backgroundColor || '#fafafa'}; color: ${accContent.color || '#4b5563'}; font-size: ${accContent.fontSize || '12px'};">
                                <span data-inline-edit="item2Content">${p.item2Content || 'Yes, add unlimited custom subdomains and root domains in 1 click.'}</span>
                            </div>
                        </div>
                    </div>
                `;

            case 'Tabs':
                const tActive = sub.tabsActiveBtn || {};
                const tInactive = sub.tabsInactiveBtn || {};
                const tPane = sub.tabsPane || {};
                return `
                    <div class="riga-tabs bg-white border border-gray-200 rounded-2xl p-5 shadow-xs" data-sub-elem="tabs">
                        <div class="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                            <button type="button" class="riga-tab-btn active-tab px-4 py-2 rounded-lg bg-black text-white text-xs font-bold transition-all cursor-pointer" data-tab-idx="1" data-sub-elem="tabsActiveBtn" style="background-color: ${tActive.backgroundColor || '#000000'}; color: ${tActive.color || '#ffffff'};">${p.tab1Label || 'Overview'}</button>
                            <button type="button" class="riga-tab-btn px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold transition-all hover:bg-gray-200 cursor-pointer" data-tab-idx="2" data-sub-elem="tabsInactiveBtn" style="background-color: ${tInactive.backgroundColor || '#f3f4f6'}; color: ${tInactive.color || '#4b5563'};">${p.tab2Label || 'Features'}</button>
                            <button type="button" class="riga-tab-btn px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold transition-all hover:bg-gray-200 cursor-pointer" data-tab-idx="3" data-sub-elem="tabsInactiveBtn" style="background-color: ${tInactive.backgroundColor || '#f3f4f6'}; color: ${tInactive.color || '#4b5563'};">${p.tab3Label || 'Pricing'}</button>
                        </div>
                        <div class="riga-tab-pane text-xs leading-relaxed" data-tab-pane-idx="1" data-sub-elem="tabsPane" style="display: block; color: ${tPane.color || '#374151'};">
                            <h5 class="font-extrabold text-sm mb-1 text-gray-900">Enterprise Builder Platform</h5>
                            <p data-inline-edit="tabContent">${p.tabContent || 'Interactive tab content pane allowing seamless categorization of product features and workflows.'}</p>
                        </div>
                        <div class="riga-tab-pane text-xs leading-relaxed" data-tab-pane-idx="2" data-sub-elem="tabsPane" style="display: none; color: ${tPane.color || '#374151'};">
                            <h5 class="font-extrabold text-sm mb-1 text-gray-900">Advanced Edge Features</h5>
                            <p>Global edge distribution, custom domain mapping, automated SSL certificates, and zero-latency database replication.</p>
                        </div>
                        <div class="riga-tab-pane text-xs leading-relaxed" data-tab-pane-idx="3" data-sub-elem="tabsPane" style="display: none; color: ${tPane.color || '#374151'};">
                            <h5 class="font-extrabold text-sm mb-1 text-gray-900">Predictable Flat Pricing</h5>
                            <p>Starting at $49/mo with unlimited bandwidth, custom domains, and edge rendering included.</p>
                        </div>
                    </div>
                `;

            case 'Counter':
                const cNum = sub.counterNumber || {};
                const cSuffix = sub.counterSuffix || {};
                const cTitle = sub.counterTitle || {};
                return `
                    <div class="text-center p-6 bg-white border border-gray-100 rounded-2xl shadow-xs cursor-pointer hover:shadow-md transition-shadow select-none" data-sub-elem="counter">
                        <div class="flex items-center justify-center gap-0.5 tracking-tight">
                            <span class="text-xl font-bold text-gray-400">${p.prefix || ''}</span>
                            <span class="font-black" data-sub-elem="counterNumber" data-inline-edit="end" style="color: ${cNum.color || '#111827'}; font-size: ${cNum.fontSize || '42px'}; font-weight: ${cNum.fontWeight || '900'};">${p.end !== undefined ? p.end : '99'}</span>
                            <span class="font-extrabold" data-sub-elem="counterSuffix" style="color: ${cSuffix.color || '#2563eb'}; font-size: ${cSuffix.fontSize || '28px'};">${p.suffix || '%'}</span>
                        </div>
                        <div class="text-xs uppercase tracking-wider mt-1.5" data-sub-elem="counterTitle" data-inline-edit="title" style="color: ${cTitle.color || '#6b7280'}; font-size: ${cTitle.fontSize || '12px'}; font-weight: ${cTitle.fontWeight || '700'};">${p.title || 'Satisfaction Rate'}</div>
                    </div>
                `;

            case 'ProgressBar':
                const pct = p.percentage !== undefined ? p.percentage : 85;
                const pbLabel = sub.progressBarLabel || {};
                const pbTrack = sub.progressBarTrack || {};
                const pbFill = sub.progressBarFill || {};
                return `
                    <div class="space-y-2 p-1" data-sub-elem="progressBar">
                        <div class="flex justify-between text-xs font-bold text-gray-800" data-sub-elem="progressBarLabel">
                            <span data-inline-edit="title" style="color: ${pbLabel.color || '#111827'}; font-size: ${pbLabel.fontSize || '12px'};">${p.title || 'Project Velocity'}</span>
                            <span class="font-mono">${pct}%</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden cursor-pointer" data-sub-elem="progressBarTrack" style="background-color: ${pbTrack.backgroundColor || '#f3f4f6'}; height: ${pbTrack.height || '10px'};">
                            <div class="h-full rounded-full transition-all duration-500" data-sub-elem="progressBarFill" style="width: ${pct}%; background-color: ${pbFill.backgroundColor || '#000000'};"></div>
                        </div>
                    </div>
                `;

            case 'Countdown':
                const cdHead = sub.countdownHeadline || {};
                const cdDigits = sub.countdownDigits || {};
                const cdUnits = sub.countdownUnits || {};
                return `
                    <div class="p-6 bg-white border border-gray-200 rounded-2xl text-center shadow-xs" data-sub-elem="countdown">
                        <div class="text-xs font-extrabold uppercase tracking-widest mb-3.5" data-sub-elem="countdownHeadline" data-inline-edit="headline" style="color: ${cdHead.color || '#6b7280'}; font-size: ${cdHead.fontSize || '12px'};">${p.headline || 'Special Offer Ends In'}</div>
                        <div class="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
                            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100" data-sub-elem="countdownDigits" style="background-color: ${cdDigits.backgroundColor || '#f3f4f6'};">
                                <div class="text-2xl font-black text-gray-900" data-countdown="days" style="color: ${cdDigits.color || '#111827'};">03</div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5" data-sub-elem="countdownUnits">DAYS</div>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100" data-sub-elem="countdownDigits" style="background-color: ${cdDigits.backgroundColor || '#f3f4f6'};">
                                <div class="text-2xl font-black text-gray-900" data-countdown="hours" style="color: ${cdDigits.color || '#111827'};">14</div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5" data-sub-elem="countdownUnits">HOURS</div>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100" data-sub-elem="countdownDigits" style="background-color: ${cdDigits.backgroundColor || '#f3f4f6'};">
                                <div class="text-2xl font-black text-gray-900" data-countdown="mins" style="color: ${cdDigits.color || '#111827'};">42</div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5" data-sub-elem="countdownUnits">MINS</div>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100" data-sub-elem="countdownDigits" style="background-color: ${cdDigits.backgroundColor || '#f3f4f6'};">
                                <div class="text-2xl font-black text-gray-900" data-countdown="secs" style="color: ${cdDigits.color || '#111827'};">18</div>
                                <div class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5" data-sub-elem="countdownUnits">SECS</div>
                            </div>
                        </div>
                    </div>
                `;

            case 'FlipBox':
                return `
                    <div class="riga-flip-wrapper group h-52 [perspective:1000px] cursor-pointer" data-sub-elem="flipBox">
                        <div class="riga-flip-inner relative h-full w-full rounded-2xl border border-gray-200 transition-all duration-500 [transform-style:preserve-3d] shadow-xs group-hover:[transform:rotateY(180deg)]">
                            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white rounded-2xl [backface-visibility:hidden]">
                                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2.5 text-black">${svg('sparkles', { size: '20px' })}</div>
                                <h4 class="text-base font-extrabold text-gray-900 tracking-tight" data-inline-edit="frontTitle">${p.frontTitle || 'Hover / Click to Flip'}</h4>
                                <p class="text-xs text-gray-500 mt-1">Interactive 3D Perspective Card</p>
                            </div>
                            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black text-white rounded-2xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <h4 class="text-base font-extrabold text-white tracking-tight" data-inline-edit="backTitle">${p.backTitle || 'Exclusive Offer!'}</h4>
                                <p class="text-xs text-gray-300 mt-1 mb-3 text-center leading-relaxed" data-inline-edit="backContent">${p.backContent || 'Unlock 20% off annual plan with instantaneous deployment.'}</p>
                                <button type="button" class="px-4 py-1.5 bg-white text-black font-bold text-xs rounded-xl shadow-xs cursor-pointer hover:bg-gray-100">Claim Now</button>
                            </div>
                        </div>
                    </div>
                `;

            case 'StarRating':
                const curRating = parseFloat(p.rating || 4.9);
                const sStars = sub.starRatingStars || {};
                const sScore = sub.starRatingScore || {};
                const sReviews = sub.starRatingReviews || {};
                return `
                    <div class="flex items-center gap-2.5 p-1 select-none" data-sub-elem="starRating">
                        <div class="flex items-center gap-1 cursor-pointer" data-sub-elem="starRatingStars">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <button type="button" class="riga-star-btn p-0.5 border-none bg-transparent cursor-pointer transition-transform hover:scale-115" data-star-idx="${i}" style="color: ${i <= Math.round(curRating) ? (sStars.color || '#f59e0b') : '#d1d5db'};">
                                    ${svg('star', { size: sStars.size || '18px' })}
                                </button>
                            `).join('')}
                        </div>
                        <span class="riga-rating-score text-xs font-black" data-sub-elem="starRatingScore" style="color: ${sScore.color || '#111827'}; font-size: ${sScore.fontSize || '13px'};">${curRating.toFixed(1)}</span>
                        <span class="text-[11px]" data-sub-elem="starRatingReviews" data-inline-edit="reviewCount" style="color: ${sReviews.color || '#9ca3af'}; font-size: ${sReviews.fontSize || '12px'};">(${p.reviewCount || '1,420+ reviews'})</span>
                    </div>
                `;

            case 'Form':
                const fCont = sub.formContainer || {};
                const fTitle = sub.formTitle || {};
                const fLabels = sub.formLabels || {};
                const fFields = sub.formFields || {};
                const fBtn = sub.formButton || {};
                return `
                    <div class="riga-form-card max-w-md mx-auto" data-sub-elem="formContainer" style="background-color: ${fCont.backgroundColor || '#ffffff'}; padding: ${fCont.padding || '28px'}; border-radius: ${fCont.borderRadius || '16px'}; border: ${fCont.borderWidth || '1px'} solid ${fCont.borderColor || '#e5e7eb'}; box-shadow: ${fCont.boxShadow || '0 4px 12px rgba(0,0,0,0.05)'};">
                        <!-- Success Banner (Interactive) -->
                        <div class="riga-form-success hidden text-center py-6 px-4 animate-in fade-in">
                            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                                ${svg('check', { size: '22px', color: '#059669' })}
                            </div>
                            <h4 class="text-base font-extrabold text-gray-900 mb-1">Message Received!</h4>
                            <p class="text-xs text-gray-600 mb-4">${p.successMessage || 'Thank you! We will get back to you shortly.'}</p>
                            <button type="button" class="riga-form-reset-btn px-4 py-1.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200">Send Another</button>
                        </div>

                        <!-- Main Form Body -->
                        <form class="riga-interactive-form space-y-4">
                            <h4 class="font-extrabold tracking-tight" data-sub-elem="formTitle" data-inline-edit="title" style="color: ${fTitle.color || '#111827'}; font-size: ${fTitle.fontSize || '18px'}; margin: 0 0 12px 0;">${p.title || 'Get in Touch'}</h4>
                            
                            <div>
                                <label class="block font-semibold" data-sub-elem="formLabels" style="color: ${fLabels.color || '#374151'}; font-size: ${fLabels.fontSize || '12px'}; margin-bottom: ${fLabels.marginBottom || '6px'}; font-weight: ${fLabels.fontWeight || '600'};">Full Name</label>
                                <input type="text" placeholder="John Doe" data-sub-elem="formFields" class="w-full transition-all focus:outline-none focus:ring-1 focus:ring-black" style="background-color: ${fFields.backgroundColor || '#f9fafb'}; color: ${fFields.color || '#111827'}; border: ${fFields.borderWidth || '1px'} solid ${fFields.borderColor || '#e5e7eb'}; border-radius: ${fFields.borderRadius || '10px'}; padding: ${fFields.padding || '10px 14px'}; font-size: ${fFields.fontSize || '13px'};" />
                            </div>

                            <div>
                                <label class="block font-semibold" data-sub-elem="formLabels" style="color: ${fLabels.color || '#374151'}; font-size: ${fLabels.fontSize || '12px'}; margin-bottom: ${fLabels.marginBottom || '6px'}; font-weight: ${fLabels.fontWeight || '600'};">Email Address</label>
                                <input type="email" placeholder="john@company.com" data-sub-elem="formFields" class="w-full transition-all focus:outline-none focus:ring-1 focus:ring-black" style="background-color: ${fFields.backgroundColor || '#f9fafb'}; color: ${fFields.color || '#111827'}; border: ${fFields.borderWidth || '1px'} solid ${fFields.borderColor || '#e5e7eb'}; border-radius: ${fFields.borderRadius || '10px'}; padding: ${fFields.padding || '10px 14px'}; font-size: ${fFields.fontSize || '13px'};" />
                            </div>

                            <div>
                                <label class="block font-semibold" data-sub-elem="formLabels" style="color: ${fLabels.color || '#374151'}; font-size: ${fLabels.fontSize || '12px'}; margin-bottom: ${fLabels.marginBottom || '6px'}; font-weight: ${fLabels.fontWeight || '600'};">Message</label>
                                <textarea rows="3" placeholder="Tell us about your project..." data-sub-elem="formFields" class="w-full transition-all focus:outline-none focus:ring-1 focus:ring-black resize-y" style="background-color: ${fFields.backgroundColor || '#f9fafb'}; color: ${fFields.color || '#111827'}; border: ${fFields.borderWidth || '1px'} solid ${fFields.borderColor || '#e5e7eb'}; border-radius: ${fFields.borderRadius || '10px'}; padding: ${fFields.padding || '10px 14px'}; font-size: ${fFields.fontSize || '13px'};"></textarea>
                            </div>

                            <button type="submit" class="riga-form-submit-btn w-full font-bold transition-all shadow-xs hover:opacity-90 cursor-pointer flex items-center justify-center gap-2" data-sub-elem="formButton" style="background-color: ${fBtn.backgroundColor || '#000000'}; color: ${fBtn.color || '#ffffff'}; border-radius: ${fBtn.borderRadius || '10px'}; padding: ${fBtn.padding || '12px 24px'}; font-size: ${fBtn.fontSize || '13px'};">
                                <span data-inline-edit="buttonText">${p.buttonText || 'Send Message'}</span>
                                ${svg('send', { size: '14px', color: fBtn.color || '#ffffff' })}
                            </button>
                        </form>
                    </div>
                `;

            case 'PriceTable':
                const pCard = sub.priceCard || {};
                const pBadge = sub.priceBadge || {};
                const pTitle = sub.priceTitle || {};
                const pAmt = sub.priceAmount || {};
                const pFeat = sub.priceFeatures || {};
                const pBtn = sub.priceButton || {};
                return `
                    <div class="riga-pricing-card text-center max-w-sm mx-auto select-none" data-sub-elem="priceCard" style="background-color: ${pCard.backgroundColor || '#ffffff'}; border: ${pCard.borderWidth || '2px'} solid ${pCard.borderColor || '#000000'}; border-radius: ${pCard.borderRadius || '24px'}; padding: ${pCard.padding || '32px 24px'}; box-shadow: ${pCard.boxShadow || '0 10px 20px rgba(0,0,0,0.08)'};">
                        <span class="inline-block uppercase tracking-wider mb-3.5" data-sub-elem="priceBadge" data-inline-edit="badge" style="background-color: ${pBadge.backgroundColor || '#eff6ff'}; color: ${pBadge.color || '#1d4ed8'}; font-size: ${pBadge.fontSize || '11px'}; font-weight: ${pBadge.fontWeight || '800'}; border-radius: ${pBadge.borderRadius || '9999px'}; padding: ${pBadge.padding || '4px 12px'};">${p.badge || 'Most Popular'}</span>
                        <h4 class="tracking-tight" data-sub-elem="priceTitle" data-inline-edit="title" style="color: ${pTitle.color || '#111827'}; font-size: ${pTitle.fontSize || '20px'}; font-weight: ${pTitle.fontWeight || '800'}; margin: 0;">${p.title || 'Professional Plan'}</h4>
                        <div class="my-4 flex items-baseline justify-center gap-1">
                            <span class="tracking-tight" data-sub-elem="priceAmount" data-inline-edit="price" style="color: ${pAmt.color || '#111827'}; font-size: ${pAmt.fontSize || '38px'}; font-weight: ${pAmt.fontWeight || '900'};">${p.price || '$49'}</span>
                            <span class="font-semibold" style="color: ${pAmt.periodColor || '#6b7280'}; font-size: 13px;" data-inline-edit="period">${p.period || '/month'}</span>
                        </div>
                        <ul class="space-y-3 text-xs my-6 text-left border-t border-gray-100 pt-5 list-none p-0" data-sub-elem="priceFeatures">
                            <li class="flex items-center gap-2.5" style="color: ${pFeat.color || '#4b5563'};">
                                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">${svg('check', { size: '12px', color: '#059669' })}</span>
                                <span>Unlimited Funnels & Websites</span>
                            </li>
                            <li class="flex items-center gap-2.5" style="color: ${pFeat.color || '#4b5563'};">
                                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">${svg('check', { size: '12px', color: '#059669' })}</span>
                                <span>Custom Domain with Automated SSL</span>
                            </li>
                            <li class="flex items-center gap-2.5" style="color: ${pFeat.color || '#4b5563'};">
                                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">${svg('check', { size: '12px', color: '#059669' })}</span>
                                <span>Global Edge CDN Delivery (Sub-50ms)</span>
                            </li>
                            <li class="flex items-center gap-2.5" style="color: ${pFeat.color || '#4b5563'};">
                                <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">${svg('check', { size: '12px', color: '#059669' })}</span>
                                <span>24/7 Priority SLA Support</span>
                            </li>
                        </ul>
                        <a href="${p.buttonUrl || '#'}" class="w-full block font-bold transition-all shadow-xs hover:opacity-90 cursor-pointer text-decoration-none" data-sub-elem="priceButton" data-inline-edit="buttonText" style="background-color: ${pBtn.backgroundColor || '#000000'}; color: ${pBtn.color || '#ffffff'}; border-radius: ${pBtn.borderRadius || '12px'}; padding: ${pBtn.padding || '12px 24px'}; font-size: ${pBtn.fontSize || '13px'};">
                            ${p.buttonText || 'Subscribe Now'}
                        </a>
                    </div>
                `;

            case 'CallToAction':
                return `
                    <div class="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white text-center relative overflow-hidden shadow-sm" data-sub-elem="ctaBanner">
                        <h3 class="text-2xl sm:text-3xl font-black mb-3 tracking-tight" data-inline-edit="title">${p.title || 'Ready to Scale Your Brand?'}</h3>
                        <p class="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto mb-6 leading-relaxed" data-inline-edit="description">
                            ${p.description || 'Join thousands of creators building high-converting web storefronts today with zero lock-in.'}
                        </p>
                        <a href="${p.buttonUrl || '#'}" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-100 transition-transform hover:scale-105" data-inline-edit="buttonText">
                            <span>${p.buttonText || 'Start Free Trial'}</span>
                            ${svg('arrow_forward', { size: '14px', color: '#000' })}
                        </a>
                    </div>
                `;

            case 'Testimonial':
                const tCard = sub.testimonialCard || {};
                const tQuote = sub.testimonialQuote || {};
                const tAuthor = sub.testimonialAuthor || {};
                const tRole = sub.testimonialRole || {};
                return `
                    <div class="riga-testimonial-card relative select-none" data-sub-elem="testimonialCard" style="background-color: ${tCard.backgroundColor || '#f9fafb'}; border: ${tCard.borderWidth || '1px'} solid ${tCard.borderColor || '#e5e7eb'}; border-radius: ${tCard.borderRadius || '20px'}; padding: ${tCard.padding || '24px'};">
                        <div class="flex text-amber-400 mb-2.5">${svg('star', { size: '16px' })}${svg('star', { size: '16px' })}${svg('star', { size: '16px' })}${svg('star', { size: '16px' })}${svg('star', { size: '16px' })}</div>
                        <p class="mb-4 leading-relaxed" data-sub-elem="testimonialQuote" data-inline-edit="quote" style="color: ${tQuote.color || '#1f2937'}; font-size: ${tQuote.fontSize || '14px'}; font-style: ${tQuote.fontStyle || 'italic'};">
                            "${p.quote || 'This visual builder transformed how our agency builds and launches client storefronts in record time.'}"
                        </p>
                        <div class="flex items-center gap-3">
                            <img src="${p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" class="w-10 h-10 rounded-full object-cover border border-gray-300" />
                            <div>
                                <h5 class="font-extrabold tracking-tight" data-sub-elem="testimonialAuthor" data-inline-edit="author" style="color: ${tAuthor.color || '#111827'}; font-size: ${tAuthor.fontSize || '13px'}; margin: 0;">${p.author || 'Elena Rostova'}</h5>
                                <div class="font-medium" data-sub-elem="testimonialRole" data-inline-edit="role" style="color: ${tRole.color || '#6b7280'}; font-size: ${tRole.fontSize || '11px'};">${p.role || 'Design Director, Vertex Labs'}</div>
                            </div>
                        </div>
                    </div>
                `;

            case 'Navbar':
                const nbBrand = sub.navbarBrand || {};
                const nbLinks = sub.navbarLinks || {};
                const nbCta = sub.navbarCta || {};
                return `
                    <nav class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs" data-sub-elem="navbar">
                        <div class="tracking-tight" data-sub-elem="navbarBrand" data-inline-edit="logoText" style="color: ${nbBrand.color || '#111827'}; font-size: ${nbBrand.fontSize || '16px'}; font-weight: ${nbBrand.fontWeight || '900'};">${p.logoText || 'Riga Studio'}</div>
                        <div class="hidden sm:flex items-center gap-6 text-xs font-bold" data-sub-elem="navbarLinks" style="color: ${nbLinks.color || '#4b5563'};">
                            <a href="#" class="hover:text-black transition-colors">Features</a>
                            <a href="#" class="hover:text-black transition-colors">Pricing</a>
                            <a href="#" class="hover:text-black transition-colors">Showcase</a>
                        </div>
                        <a href="#" class="font-bold transition-all shadow-xs" data-sub-elem="navbarCta" data-inline-edit="ctaText" style="background-color: ${nbCta.backgroundColor || '#000000'}; color: ${nbCta.color || '#ffffff'}; border-radius: ${nbCta.borderRadius || '10px'}; padding: ${nbCta.padding || '8px 16px'}; font-size: ${nbCta.fontSize || '12px'}; text-decoration: none;">${p.ctaText || 'Get Started'}</a>
                    </nav>
                `;

            case 'Alert':
                const alertType = p.type || 'info';
                const alertColors = {
                    success: { bg: '#ecfdf5', border: '#a7f3d0', text: '#064e3b', icon: 'check_circle' },
                    warning: { bg: '#fffbeb', border: '#fde68a', text: '#78350f', icon: 'shield' },
                    danger: { bg: '#fef2f2', border: '#fecaca', text: '#7f1d1d', icon: 'close' },
                    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a8a', icon: 'bolt' }
                };
                const conf = alertColors[alertType] || alertColors.info;
                return `
                    <div class="riga-alert-box p-4 rounded-xl border flex items-start justify-between gap-3 shadow-2xs" data-sub-elem="alert" style="background-color: ${conf.bg}; border-color: ${conf.border}; color: ${conf.text};">
                        <div class="flex items-start gap-2.5">
                            <span class="mt-0.5 shrink-0">${svg(conf.icon, { size: '16px', color: conf.text })}</span>
                            <div>
                                <h5 class="font-extrabold text-xs mb-0.5" data-inline-edit="title" style="color: inherit; margin: 0;">${p.title || 'System Update'}</h5>
                                <p class="text-[11px] opacity-90 leading-relaxed" data-inline-edit="message" style="margin: 2px 0 0 0;">${p.message || 'All systems operational. Version 2.4 deployed across all edge zones.'}</p>
                            </div>
                        </div>
                        ${p.dismissible ? `<button type="button" class="riga-alert-dismiss text-xs font-bold opacity-60 hover:opacity-100 p-0.5 cursor-pointer">${svg('close', { size: '14px', color: conf.text })}</button>` : ''}
                    </div>
                `;

            case 'Products':
                return `
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" data-sub-elem="products">
                        ${[1, 2, 3].map(i => `
                            <div class="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs text-center hover:shadow-md transition-shadow">
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" class="w-full h-32 object-contain mb-3" />
                                <h5 class="text-xs font-extrabold text-gray-900">Minimalist Chronograph ${i}</h5>
                                <div class="text-xs font-black text-gray-900 my-1">$149.00</div>
                                <button type="button" class="riga-add-to-cart-btn w-full py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer" data-cart-count="0" data-inline-edit="buttonText">${p.buttonText || 'Add to Cart'}</button>
                            </div>
                        `).join('')}
                    </div>
                `;

            case 'AddToCart':
                return `
                    <div style="display: inline-block;">
                        <button type="button" class="riga-add-to-cart-btn inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer" data-cart-count="0">
                            ${svg('shopping_cart', { size: '15px', color: '#fff' })}
                            <span data-inline-edit="buttonText">${p.buttonText || 'Add to Cart - $149'}</span>
                        </button>
                    </div>
                `;

            case 'SearchForm':
                return `
                    <div class="relative max-w-md mx-auto" data-sub-elem="searchForm">
                        <div class="absolute left-3.5 top-3 pointer-events-none text-gray-400">${svg('search', { size: '14px' })}</div>
                        <input type="text" placeholder="${p.placeholder || 'Search articles, docs...'}" class="w-full pl-9 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-black" />
                        <button type="button" class="absolute right-1.5 top-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg cursor-pointer">${p.buttonText || 'Search'}</button>
                    </div>
                `;

            case 'Carousel':
            case 'MediaCarousel':
                return `
                    <div class="riga-carousel relative overflow-hidden rounded-2xl bg-neutral-950 text-white p-8 sm:p-12 flex items-center justify-between min-h-[240px] shadow-sm select-none" data-sub-elem="carousel">
                        <button type="button" class="riga-carousel-prev w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors">${svg('chevron_left', { size: '16px', color: '#fff' })}</button>
                        <div class="riga-carousel-slide text-center px-4 max-w-lg">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-blue-400">Featured Showcase</span>
                            <h4 class="text-2xl font-black mb-1 mt-1 tracking-tight" data-inline-edit="caption">${p.caption || 'Featured Media Slide'}</h4>
                            <p class="text-xs text-gray-400" data-inline-edit="subtitle">${p.subtitle || 'Sub-50ms global latency infrastructure.'}</p>
                        </div>
                        <button type="button" class="riga-carousel-next w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors">${svg('chevron_right', { size: '16px', color: '#fff' })}</button>
                    </div>
                `;

            case 'GoogleMaps':
                return `
                    <div class="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xs" style="height: ${p.height || '280px'};">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameborder="0" 
                            scrolling="no" 
                            src="https://maps.google.com/maps?q=${encodeURIComponent(p.address || 'San Francisco, CA')}&t=&z=${p.zoom || 13}&ie=UTF8&iwloc=&output=embed"
                        ></iframe>
                    </div>
                `;

            case 'Divider':
                return `<hr style="border: none; border-top: ${p.thickness || '1px'} ${p.style || 'solid'} ${p.color || '#e5e7eb'}; width: ${p.width || '100%'}; margin: 24px auto;" />`;

            case 'WhatsAppButton': {
                const waPhone = (p.phoneNumber || '+15551234567').replace(/[^0-9+]/g, '');
                const waMsg = encodeURIComponent(p.message || 'Hello! I need assistance.');
                const waText = p.buttonText || 'Chat on WhatsApp';
                return `
                    <div class="my-4 text-center">
                        <a href="https://wa.me/${waPhone}?text=${waMsg}" target="_blank" rel="noopener noreferrer" 
                           class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 no-underline">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                            <span>${waText}</span>
                        </a>
                    </div>
                `;
            }

            case 'CookieConsent': {
                const accent = p.accentColor || '#000000';
                return `
                    <div class="riga-cookie-dual-preview select-none space-y-5 p-4 sm:p-5 bg-gray-50/70 rounded-2xl border border-gray-200" data-sub-elem="cookieConsentWrapper">
                        <div class="flex items-center justify-between pb-2.5 border-b border-gray-200">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span class="text-xs font-bold text-gray-900 tracking-tight">Compliance Shield · Dual Layout Preview</span>
                            </div>
                            <div class="flex items-center gap-1.5 text-[10px] font-mono bg-white px-2.5 py-0.5 rounded-md border border-gray-200 text-gray-700">
                                <span>${p.regulationPreset || 'EU GDPR & ePrivacy'}</span>
                            </div>
                        </div>

                        <!-- 1. CENTERED MODAL PREVIEW -->
                        <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-left" data-sub-elem="cookieModal">
                            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">
                                        ${svg('lock', { size: '13px', color: '#fff' })}
                                    </div>
                                    <div>
                                        <h4 class="font-extrabold text-xs text-gray-950">${p.title || 'Privacy Preferences · riga'}</h4>
                                        <p class="text-[10px] text-gray-400">Configure cookie retention for this session</p>
                                    </div>
                                </div>
                                <span class="text-gray-400 text-xs cursor-pointer">✕</span>
                            </div>
                            <div class="p-3.5 space-y-2">
                                <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start justify-between">
                                    <div class="pr-2">
                                        <div class="text-[11px] font-bold text-gray-900 flex items-center gap-1.5">
                                            <span>Essential & Security</span>
                                            <span class="text-[8px] bg-black text-white px-1.5 py-0.2 rounded font-bold uppercase">Required</span>
                                        </div>
                                        <p class="text-[10px] text-gray-500 mt-0.5">Session authentication, CSRF tokens, and visual editor rendering.</p>
                                    </div>
                                    <input type="checkbox" checked disabled class="accent-black mt-1" />
                                </div>
                                <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start justify-between">
                                    <div class="pr-2">
                                        <div class="text-[11px] font-bold text-gray-900">Performance & Analytics</div>
                                        <p class="text-[10px] text-gray-500 mt-0.5">Sub-50ms TTFB edge cache hit telemetry and builder response times.</p>
                                    </div>
                                    <input type="checkbox" ${p.analyticsEnabled !== false ? 'checked' : ''} class="accent-black mt-1" />
                                </div>
                                <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start justify-between">
                                    <div class="pr-2">
                                        <div class="text-[11px] font-bold text-gray-900">Marketing & Conversions</div>
                                        <p class="text-[10px] text-gray-500 mt-0.5">Attribution tags for marketing funnels and lead forms.</p>
                                    </div>
                                    <input type="checkbox" ${p.marketingEnabled ? 'checked' : ''} class="accent-black mt-1" />
                                </div>
                            </div>
                            <div class="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                                <button type="button" class="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-black">Reject Non-Essential</button>
                                <button type="button" class="px-3.5 py-1 text-xs font-bold bg-black text-white rounded-lg shadow-2xs">Save Preferences</button>
                            </div>
                        </div>

                        <!-- 2. FLOATING BOTTOM DOCK PREVIEW -->
                        <div class="bg-neutral-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-xl mx-auto text-left" data-sub-elem="cookieDock">
                            <div class="flex items-start gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0 border border-neutral-700">
                                    ${svg('shield', { size: '15px' })}
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                                        <span>${p.title || 'We value your privacy on riga'}</span>
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    </p>
                                    <p class="text-[11px] text-neutral-400 leading-tight mt-0.5">${p.description || 'We use essential cookies to maintain secure sessions and performance metrics.'}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                                <button type="button" class="px-2 py-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800 rounded-lg">Customize</button>
                                <button type="button" class="px-2 py-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-lg">Reject</button>
                                <button type="button" class="px-3 py-1 text-[11px] font-bold text-black bg-white rounded-lg shadow-2xs" style="background-color: ${accent === '#000000' ? '#ffffff' : accent}; color: ${accent === '#000000' ? '#000000' : '#ffffff'};">Accept All</button>
                            </div>
                        </div>
                    </div>
                `;
            }

            default:
                const renderer = this.widgetDef.customRender || this.widgetDef.render;
                if (typeof renderer === 'function') {
                    try {
                        return renderer(p, this.styles, this);
                    } catch (e) {
                        console.warn('Custom widget render error:', e);
                    }
                }
                return `
                    <div class="p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                        <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mx-auto mb-2">${svg('star', { size: '16px' })}</div>
                        <div class="text-xs font-extrabold text-gray-900">${this.widgetDef.label || wid}</div>
                        <p class="text-[11px] text-gray-500 mt-1">${this.widgetDef.description || 'Configurable component element'}</p>
                    </div>
                `;
        }
    }

    getControls() {
        return this.getContentControls();
    }

    getContentControls() {
        const controls = [];
        const fields = this.widgetDef.editableFields || {};

        if (Object.keys(fields).length > 0) {
            controls.push(new SectionHeaderControl('Content & Data Settings'));
        }

        Object.entries(fields).forEach(([key, field]) => {
            const label = field.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            const val = this.props[key];

            if (field.type === 'media') {
                controls.push(new MediaPickerControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'icon') {
                controls.push(new IconPickerControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'color') {
                controls.push(new ColorControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'textarea' || field.type === 'richtext') {
                controls.push(new TextareaControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else if (field.type === 'select') {
                controls.push(new SelectControl(key, label, val, (newVal) => this.setProp(key, newVal), { options: field.options }));
            } else if (field.type === 'number') {
                controls.push(new SliderControl(key, label, val, (newVal, num) => this.setProp(key, num), { min: field.min || 0, max: field.max || 100, step: field.step || 1, unit: field.unit || '' }));
            } else if (field.type === 'boolean') {
                controls.push(new ToggleControl(key, label, val, (newVal) => this.setProp(key, newVal)));
            } else {
                controls.push(new TextControl(key, label, val, (newVal) => this.setProp(key, newVal), { placeholder: field.default || '' }));
            }
        });

        return controls;
    }

    // Granular Sub-Element Styling breakdown controls
    getStyleControls() {
        const controls = [];
        const wid = this.widgetId;
        const sub = this.subStyles;
        const SubSelector = (typeof window !== 'undefined' && window.SubStyleSelectorControl) ? window.SubStyleSelectorControl : SubStyleSelectorControl;

        // Custom Breakdown for Composite Widgets
        if (wid === 'CookieConsent') {
            const sections = [
                { id: 'style', label: 'Style' },
                { id: 'behavior', label: 'Behavior' },
                { id: 'regulation', label: 'Regulation' },
                { id: 'code', label: 'Code' }
            ];
            controls.push(new SubSelector(this.activeSubSection || 'style', sections, (selectedSec) => {
                this.activeSubSection = selectedSec;
                if (window.builder) window.builder.renderElementControls(this);
            }));

            if (this.activeSubSection === 'style' || !this.activeSubSection) {
                controls.push(new SectionHeaderControl('Visual Style & Box Model'));
                // Box Model Diagram Control with concentric Margin & Padding
                controls.push(new BoxModelDiagramControl('boxModel', 'CSS Box Model', {
                    margin: this.styles.margin || { top: '0px', right: '0px', bottom: '0px', left: '0px' },
                    padding: this.styles.padding || { top: '16px', right: '16px', bottom: '16px', left: '16px' }
                }, (val) => {
                    this.setStyle('margin', val.margin);
                    this.setStyle('padding', val.padding);
                }, {
                    onMarginChange: (m) => this.setStyle('margin', m),
                    onPaddingChange: (p) => this.setStyle('padding', p)
                }));

                controls.push(new ColorControl('accentColor', 'Accent Color', this.props.accentColor || '#000000', (v) => this.setProp('accentColor', v)));
                controls.push(new SliderControl('borderRadius', 'Corner Radius', parseFloat(this.styles.borderRadius) || 16, (v, num) => this.setStyle('borderRadius', `${num}px`), { min: 0, max: 32, unit: 'px' }));
                controls.push(new SelectControl('breakpointPreview', 'Device Viewport', 'Desktop (All)', () => {}, {
                    options: ['Desktop (All)', 'Tablet (768px)', 'Mobile (375px)']
                }));
            } else if (this.activeSubSection === 'behavior') {
                controls.push(new SectionHeaderControl('Behavior & Presentation'));
                controls.push(new SelectControl('layoutMode', 'Display Format', this.props.layoutMode || 'dual', (v) => this.setProp('layoutMode', v), {
                    options: ['dual', 'floatingDock', 'centerModal']
                }));
                controls.push(new SelectControl('position', 'Dock Position', 'Bottom Full', (v) => this.setProp('position', v), {
                    options: ['Bottom Full', 'Bottom Right', 'Bottom Left', 'Center Modal']
                }));
                controls.push(new SliderControl('autoDelay', 'Auto-Show Delay (ms)', 1200, (v, num) => this.setProp('autoDelay', num), { min: 0, max: 5000, step: 200, unit: 'ms' }));
                controls.push(new SliderControl('retentionDays', 'Consent Retention', this.props.retentionDays || 365, (v, num) => this.setProp('retentionDays', num), { min: 30, max: 730, step: 30, unit: 'days' }));
            } else if (this.activeSubSection === 'regulation') {
                controls.push(new SectionHeaderControl('Regulatory Framework'));
                controls.push(new SelectControl('regulationPreset', 'Regulatory Preset', this.props.regulationPreset || 'EU GDPR & ePrivacy', (v) => this.setProp('regulationPreset', v), {
                    options: ['EU GDPR & ePrivacy', 'California CCPA/CPRA', 'Global Strict (Opt-in)', 'Lightweight Notice']
                }));
                controls.push(new ToggleControl('essentialEnabled', 'Essential Cookies (Always Active)', true, () => {}));
                controls.push(new ToggleControl('analyticsEnabled', 'Analytics & Telemetry Category', this.props.analyticsEnabled !== false, (v) => this.setProp('analyticsEnabled', v)));
                controls.push(new ToggleControl('marketingEnabled', 'Marketing & Ads Category', Boolean(this.props.marketingEnabled), (v) => this.setProp('marketingEnabled', v)));
                controls.push(new TextControl('policyUrl', 'Privacy Policy URL', '/privacy', (v) => this.setProp('policyUrl', v)));
            } else if (this.activeSubSection === 'code') {
                controls.push(new SectionHeaderControl('Integration & Embed Snippet'));
                const embedCode = `<!-- Riga Compliance Shield Banner -->\n<div id="riga-consent-banner" data-framework="${this.props.regulationPreset || 'GDPR'}"></div>\n<script src="https://cdn.riga.site/v2/shield.js" async></script>`;
                controls.push(new TextareaControl('embedSnippet', 'HTML Embed Code', embedCode, () => {}));
                const exportJson = JSON.stringify({
                    widget: 'CookieConsent',
                    preset: this.props.regulationPreset,
                    retentionDays: this.props.retentionDays || 365,
                    categories: { essential: true, analytics: this.props.analyticsEnabled !== false, marketing: Boolean(this.props.marketingEnabled) }
                }, null, 2);
                controls.push(new TextareaControl('settingsJson', 'JSON Configuration', exportJson, () => {}));
            }
            return controls;
        }

        if (wid === 'Form') {
            const sections = [
                { id: 'labels', label: 'Labels' },
                { id: 'fields', label: 'Inputs' },
                { id: 'button', label: 'Button' },
                { id: 'title', label: 'Title' },
                { id: 'container', label: 'Card' }
            ];
            controls.push(new SubSelector(this.activeSubSection || 'labels', sections, (selectedSec) => {
                this.activeSubSection = selectedSec;
                if (window.builder) window.builder.renderElementControls(this);
            }));

            if (this.activeSubSection === 'labels' || !this.activeSubSection) {
                const fl = sub.formLabels || {};
                controls.push(new SectionHeaderControl('Form Labels Styling'));
                controls.push(new ColorControl('lblColor', 'Label Text Color', fl.color || '#374151', (v) => this.setSubStyle('formLabels', 'color', v)));
                controls.push(new SliderControl('lblFontSize', 'Label Font Size', parseFloat(fl.fontSize) || 12, (v, num) => this.setSubStyle('formLabels', 'fontSize', `${num}px`), { min: 9, max: 24, unit: 'px' }));
                controls.push(new SelectControl('lblFontWeight', 'Font Weight', fl.fontWeight || '600', (v) => this.setSubStyle('formLabels', 'fontWeight', v), {
                    options: ['normal', '500', '600', '700', '800']
                }));
                controls.push(new SliderControl('lblMarginBottom', 'Margin Bottom', parseFloat(fl.marginBottom) || 6, (v, num) => this.setSubStyle('formLabels', 'marginBottom', `${num}px`), { min: 0, max: 24, unit: 'px' }));
            } else if (this.activeSubSection === 'fields') {
                const ff = sub.formFields || {};
                controls.push(new SectionHeaderControl('Input Fields Styling'));
                controls.push(new ColorControl('fieldBg', 'Background Color', ff.backgroundColor || '#f9fafb', (v) => this.setSubStyle('formFields', 'backgroundColor', v)));
                controls.push(new ColorControl('fieldColor', 'Text Color', ff.color || '#111827', (v) => this.setSubStyle('formFields', 'color', v)));
                controls.push(new ColorControl('fieldBorder', 'Border Color', ff.borderColor || '#e5e7eb', (v) => this.setSubStyle('formFields', 'borderColor', v)));
                controls.push(new SliderControl('fieldRadius', 'Corner Radius', parseFloat(ff.borderRadius) || 10, (v, num) => this.setSubStyle('formFields', 'borderRadius', `${num}px`), { min: 0, max: 32, unit: 'px' }));
                controls.push(new SliderControl('fieldPadding', 'Field Height / Padding', parseFloat(ff.padding) || 10, (v, num) => this.setSubStyle('formFields', 'padding', `${num}px 14px`), { min: 6, max: 24, unit: 'px' }));
            } else if (this.activeSubSection === 'button') {
                const fb = sub.formButton || {};
                controls.push(new SectionHeaderControl('Submit Button Styling'));
                controls.push(new ColorControl('btnBg', 'Button Background', fb.backgroundColor || '#000000', (v) => this.setSubStyle('formButton', 'backgroundColor', v)));
                controls.push(new ColorControl('btnColor', 'Button Text Color', fb.color || '#ffffff', (v) => this.setSubStyle('formButton', 'color', v)));
                controls.push(new SliderControl('btnRadius', 'Corner Radius', parseFloat(fb.borderRadius) || 10, (v, num) => this.setSubStyle('formButton', 'borderRadius', `${num}px`), { min: 0, max: 32, unit: 'px' }));
                controls.push(new SliderControl('btnFontSize', 'Font Size', parseFloat(fb.fontSize) || 13, (v, num) => this.setSubStyle('formButton', 'fontSize', `${num}px`), { min: 10, max: 20, unit: 'px' }));
            } else if (this.activeSubSection === 'title') {
                const ft = sub.formTitle || {};
                controls.push(new SectionHeaderControl('Title Styling'));
                controls.push(new ColorControl('titleColor', 'Title Color', ft.color || '#111827', (v) => this.setSubStyle('formTitle', 'color', v)));
                controls.push(new SliderControl('titleFontSize', 'Title Font Size', parseFloat(ft.fontSize) || 18, (v, num) => this.setSubStyle('formTitle', 'fontSize', `${num}px`), { min: 12, max: 36, unit: 'px' }));
            } else if (this.activeSubSection === 'container') {
                const fc = sub.formContainer || {};
                controls.push(new SectionHeaderControl('Form Card Container'));
                controls.push(new ColorControl('cardBg', 'Card Background', fc.backgroundColor || '#ffffff', (v) => this.setSubStyle('formContainer', 'backgroundColor', v)));
                controls.push(new ColorControl('cardBorder', 'Border Color', fc.borderColor || '#e5e7eb', (v) => this.setSubStyle('formContainer', 'borderColor', v)));
                controls.push(new SliderControl('cardRadius', 'Corner Radius', parseFloat(fc.borderRadius) || 16, (v, num) => this.setSubStyle('formContainer', 'borderRadius', `${num}px`), { min: 0, max: 40, unit: 'px' }));
                controls.push(new SliderControl('cardPadding', 'Padding', parseFloat(fc.padding) || 28, (v, num) => this.setSubStyle('formContainer', 'padding', `${num}px`), { min: 12, max: 64, unit: 'px' }));
            }
            return controls;
        }

        if (wid === 'PriceTable') {
            const sections = [
                { id: 'card', label: 'Card' },
                { id: 'price', label: 'Price' },
                { id: 'badge', label: 'Badge' },
                { id: 'button', label: 'Button' }
            ];
            controls.push(new SubSelector(this.activeSubSection || 'card', sections, (sec) => {
                this.activeSubSection = sec;
                if (window.builder) window.builder.renderElementControls(this);
            }));

            if (this.activeSubSection === 'price') {
                const pa = sub.priceAmount || {};
                controls.push(new SectionHeaderControl('Price Display Styling'));
                controls.push(new ColorControl('priceColor', 'Price Color', pa.color || '#111827', (v) => this.setSubStyle('priceAmount', 'color', v)));
                controls.push(new SliderControl('priceSize', 'Price Font Size', parseFloat(pa.fontSize) || 38, (v, num) => this.setSubStyle('priceAmount', 'fontSize', `${num}px`), { min: 20, max: 64, unit: 'px' }));
            } else if (this.activeSubSection === 'badge') {
                const pb = sub.priceBadge || {};
                controls.push(new SectionHeaderControl('Ribbon / Badge Styling'));
                controls.push(new ColorControl('badgeBg', 'Badge Background', pb.backgroundColor || '#eff6ff', (v) => this.setSubStyle('priceBadge', 'backgroundColor', v)));
                controls.push(new ColorControl('badgeColor', 'Badge Text Color', pb.color || '#1d4ed8', (v) => this.setSubStyle('priceBadge', 'color', v)));
            } else if (this.activeSubSection === 'button') {
                const pbtn = sub.priceButton || {};
                controls.push(new SectionHeaderControl('Action Button Styling'));
                controls.push(new ColorControl('pbtnBg', 'Button Background', pbtn.backgroundColor || '#000000', (v) => this.setSubStyle('priceButton', 'backgroundColor', v)));
                controls.push(new ColorControl('pbtnColor', 'Button Text Color', pbtn.color || '#ffffff', (v) => this.setSubStyle('priceButton', 'color', v)));
                controls.push(new SliderControl('pbtnRadius', 'Corner Radius', parseFloat(pbtn.borderRadius) || 12, (v, num) => this.setSubStyle('priceButton', 'borderRadius', `${num}px`), { min: 0, max: 32, unit: 'px' }));
            } else {
                const pc = sub.priceCard || {};
                controls.push(new SectionHeaderControl('Pricing Card Box'));
                controls.push(new ColorControl('pcardBg', 'Card Background', pc.backgroundColor || '#ffffff', (v) => this.setSubStyle('priceCard', 'backgroundColor', v)));
                controls.push(new ColorControl('pcardBorder', 'Border Color', pc.borderColor || '#000000', (v) => this.setSubStyle('priceCard', 'borderColor', v)));
                controls.push(new SliderControl('pcardRadius', 'Corner Radius', parseFloat(pc.borderRadius) || 24, (v, num) => this.setSubStyle('priceCard', 'borderRadius', `${num}px`), { min: 0, max: 48, unit: 'px' }));
            }
            return controls;
        }

        if (wid === 'Accordion') {
            const sections = [
                { id: 'header', label: 'Header Bar' },
                { id: 'content', label: 'Content' }
            ];
            controls.push(new SubSelector(this.activeSubSection || 'header', sections, (sec) => {
                this.activeSubSection = sec;
                if (window.builder) window.builder.renderElementControls(this);
            }));

            if (this.activeSubSection === 'content') {
                const ac = sub.accordionContent || {};
                controls.push(new SectionHeaderControl('Accordion Answer Panel'));
                controls.push(new ColorControl('accContBg', 'Panel Background', ac.backgroundColor || '#fafafa', (v) => this.setSubStyle('accordionContent', 'backgroundColor', v)));
                controls.push(new ColorControl('accContColor', 'Panel Text Color', ac.color || '#4b5563', (v) => this.setSubStyle('accordionContent', 'color', v)));
                controls.push(new SliderControl('accContFont', 'Font Size', parseFloat(ac.fontSize) || 12, (v, num) => this.setSubStyle('accordionContent', 'fontSize', `${num}px`), { min: 10, max: 18, unit: 'px' }));
            } else {
                const ah = sub.accordionHeader || {};
                controls.push(new SectionHeaderControl('Accordion Question Bar'));
                controls.push(new ColorControl('accHeadBg', 'Header Background', ah.backgroundColor || '#ffffff', (v) => this.setSubStyle('accordionHeader', 'backgroundColor', v)));
                controls.push(new ColorControl('accHeadColor', 'Header Text Color', ah.color || '#111827', (v) => this.setSubStyle('accordionHeader', 'color', v)));
                controls.push(new SliderControl('accHeadFont', 'Font Size', parseFloat(ah.fontSize) || 13, (v, num) => this.setSubStyle('accordionHeader', 'fontSize', `${num}px`), { min: 11, max: 20, unit: 'px' }));
            }
            return controls;
        }

        if (wid === 'List') {
            const sections = [
                { id: 'icons', label: 'Icons' },
                { id: 'text', label: 'List Text' }
            ];
            controls.push(new SubSelector(this.activeSubSection || 'icons', sections, (sec) => {
                this.activeSubSection = sec;
                if (window.builder) window.builder.renderElementControls(this);
            }));

            if (this.activeSubSection === 'text') {
                const lt = sub.listText || {};
                controls.push(new SectionHeaderControl('List Text Styling'));
                controls.push(new ColorControl('ltColor', 'Text Color', lt.color || '#1f2937', (v) => this.setSubStyle('listText', 'color', v)));
                controls.push(new SliderControl('ltFont', 'Font Size', parseFloat(lt.fontSize) || 13, (v, num) => this.setSubStyle('listText', 'fontSize', `${num}px`), { min: 10, max: 20, unit: 'px' }));
            } else {
                const li = sub.listIcons || {};
                controls.push(new SectionHeaderControl('List Icons Styling'));
                controls.push(new ColorControl('liColor', 'Icon Color', li.color || '#10b981', (v) => this.setSubStyle('listIcons', 'color', v)));
                controls.push(new ColorControl('liBg', 'Icon Circle Background', li.backgroundColor || '#ecfdf5', (v) => this.setSubStyle('listIcons', 'backgroundColor', v)));
            }
            return controls;
        }

        if (wid === 'IconBox') {
            const sections = [
                { id: 'icon', label: 'Icon Badge' },
                { id: 'title', label: 'Title' },
                { id: 'desc', label: 'Description' }
            ];
            controls.push(new SubSelector(this.activeSubSection || 'icon', sections, (sec) => {
                this.activeSubSection = sec;
                if (window.builder) window.builder.renderElementControls(this);
            }));

            if (this.activeSubSection === 'title') {
                const ibt = sub.iconBoxTitle || {};
                controls.push(new SectionHeaderControl('Title Styling'));
                controls.push(new ColorControl('ibTitleColor', 'Color', ibt.color || '#111827', (v) => this.setSubStyle('iconBoxTitle', 'color', v)));
                controls.push(new SliderControl('ibTitleSize', 'Font Size', parseFloat(ibt.fontSize) || 16, (v, num) => this.setSubStyle('iconBoxTitle', 'fontSize', `${num}px`), { min: 12, max: 28, unit: 'px' }));
            } else if (this.activeSubSection === 'desc') {
                const ibd = sub.iconBoxDesc || {};
                controls.push(new SectionHeaderControl('Description Styling'));
                controls.push(new ColorControl('ibDescColor', 'Color', ibd.color || '#4b5563', (v) => this.setSubStyle('iconBoxDesc', 'color', v)));
                controls.push(new SliderControl('ibDescSize', 'Font Size', parseFloat(ibd.fontSize) || 13, (v, num) => this.setSubStyle('iconBoxDesc', 'fontSize', `${num}px`), { min: 10, max: 18, unit: 'px' }));
            } else {
                const ibi = sub.iconBoxIcon || {};
                controls.push(new SectionHeaderControl('Icon Badge Styling'));
                controls.push(new ColorControl('ibiColor', 'Icon Symbol Color', ibi.color || '#ffffff', (v) => this.setSubStyle('iconBoxIcon', 'color', v)));
                controls.push(new ColorControl('ibiBg', 'Badge Background', ibi.backgroundColor || '#000000', (v) => this.setSubStyle('iconBoxIcon', 'backgroundColor', v)));
                controls.push(new SliderControl('ibiRadius', 'Corner Radius', parseFloat(ibi.borderRadius) || 12, (v, num) => this.setSubStyle('iconBoxIcon', 'borderRadius', `${num}px`), { min: 0, max: 32, unit: 'px' }));
            }
            return controls;
        }

        // Standard Universal Styling for other elements
        const s = this.styles;
        controls.push(new SectionHeaderControl('Typography'));
        controls.push(new SelectControl('fontFamily', 'Font Family', s.fontFamily || 'inherit', (v) => this.setStyle('fontFamily', v), { 
            options: ['inherit', 'Inter, sans-serif', 'Plus Jakarta Sans, sans-serif', 'Outfit, sans-serif', 'Syne, sans-serif', 'Roboto, sans-serif', 'Playfair Display, serif'] 
        }));
        controls.push(new SliderControl('fontSize', 'Font Size', parseFloat(s.fontSize) || 16, (v) => this.setStyle('fontSize', v), { min: 8, max: 96, unit: 'px' }));
        controls.push(new ColorControl('color', 'Text Color', s.color, (v) => this.setStyle('color', v)));
        
        controls.push(new SectionHeaderControl('Background & Spacing'));
        controls.push(new ColorControl('backgroundColor', 'Background Color', s.backgroundColor, (v) => this.setStyle('backgroundColor', v)));
        controls.push(new FourSideControl('padding', 'Padding', s.padding, (v) => this.setStyle('padding', v)));
        controls.push(new FourSideControl('margin', 'Margin', s.margin, (v) => this.setStyle('margin', v)));

        controls.push(new SectionHeaderControl('Borders & Corners'));
        controls.push(new SliderControl('borderRadius', 'Corner Radius', parseFloat(s.borderRadius) || 0, (v) => this.setStyle('borderRadius', v), { min: 0, max: 64, unit: 'px' }));
        controls.push(new ColorControl('borderColor', 'Border Color', s.borderColor || '#e5e7eb', (v) => this.setStyle('borderColor', v)));

        return controls;
    }

    getAdvancedControls() {
        const controls = [];
        const a = this.advanced;

        controls.push(new SectionHeaderControl('Layout & Flexbox'));
        controls.push(new SelectControl('display', 'Display Mode', a.display || 'block', (v) => this.setAdvanced('display', v), {
            options: ['block', 'flex', 'grid', 'inline-block', 'none']
        }));
        controls.push(new SelectControl('flexDirection', 'Flex Direction', a.flexDirection || 'row', (v) => this.setAdvanced('flexDirection', v), {
            options: ['row', 'column', 'row-reverse', 'column-reverse']
        }));
        controls.push(new SliderControl('gap', 'Flex/Grid Gap', parseFloat(a.gap) || 0, (v) => this.setAdvanced('gap', v), { min: 0, max: 64, unit: 'px' }));

        controls.push(new SectionHeaderControl('Attributes & Custom Code'));
        controls.push(new TextControl('htmlId', 'CSS ID (#)', a.htmlId, (v) => this.setAdvanced('htmlId', v), { placeholder: 'hero-section' }));
        controls.push(new TextControl('cssClasses', 'CSS Classes', a.cssClasses, (v) => this.setAdvanced('cssClasses', v), { placeholder: 'shadow-lg rounded-2xl' }));
        controls.push(new TextareaControl('customCss', 'Custom CSS Rules', a.customCss, (v) => this.setAdvanced('customCss', v), { placeholder: '/* filter: blur(2px); */' }));

        return controls;
    }

    getData() {
        return {
            name: this.getClassName(),
            widgetId: this.widgetId,
            widgetDef: this.widgetDef,
            props: this.props,
            styles: this.styles,
            advanced: this.advanced,
            subStyles: this.subStyles
        };
    }

    static parse(data) {
        return new UniversalWidgetElement(data.widgetDef, data.props, data.styles, data.advanced, data.subStyles);
    }
}

export default UniversalWidgetElement;
