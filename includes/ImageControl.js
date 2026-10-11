class ImageControl {
    constructor(label, value, callback) {
        this.label = label || 'Image';
        this.value = value.src || '';
        this.alt = value.alt || '';
        this.callback = callback;

        this.UploadMode = true;
        this.PasteMode = false;

        this.domNode = document.createElement('div');
        this.render();
    }

    render() {
        this.domNode.innerHTML = `
            <div class="p-3 bg-white space-y-3">
                <!-- Mode Toggle Segmented Control -->
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">Image Source</label>
                    <div class="flex p-0.5 bg-gray-100 rounded-xl border border-gray-200">
                        <button type="button" id="Upload_Image" class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${this.UploadMode ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}">
                            Upload File
                        </button>
                        <button type="button" id="Paste_Url" class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${this.PasteMode ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}">
                            Image URL
                        </button>
                    </div>
                </div>

                ${this.UploadMode ? `
                <!-- Upload Mode Preview Card -->
                <div class="image-preview-card">
                    <img src="${this.value || 'https://via.placeholder.com/150'}" alt="Preview" class="image-thumb shrink-0" />
                    <div class="flex-1 min-w-0">
                        <div class="image-info mb-2">
                            <p class="text-xs font-bold text-gray-900 truncate filename mb-0.5">Asset image</p>
                            <div class="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                                <span class="dimensions">-- x -- px</span>
                                <span>•</span>
                                <span class="size">-- kB</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <button data-control="upload" type="button" class="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white text-[11px] font-semibold rounded-md flex items-center gap-1 shadow-2xs" title="Upload new image">
                                <span>Upload</span>
                            </button>
                            <button data-control="reload" type="button" class="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold rounded-md border border-gray-200" title="Refresh">
                                ↻
                            </button>
                            <button data-control="delete" type="button" class="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded-md border border-rose-200" title="Remove image">
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
                ` : `
                <!-- URL Mode Input -->
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">Image URL</label>
                    <input type="text" name="image-url" class="w-full text-xs" placeholder="https://example.com/image.png" value="${this.value}" />
                </div>
                `}

                <!-- Alternate Text -->
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">Alternate Text (Alt)</label>
                    <input type="text" name="alt-text" class="w-full text-xs" placeholder="Image description for SEO" value="${this.alt || ''}" />
                </div>
            </div>
        `;

        const uploadRadio = this.domNode.querySelector('#Upload_Image');
        const pasteRadio = this.domNode.querySelector('#Paste_Url');
        if (uploadRadio) uploadRadio.addEventListener('click', () => this.changeMode('upload'));
        if (pasteRadio) pasteRadio.addEventListener('click', () => this.changeMode('paste'));

        const imageInput = this.getImageInput();
        if (imageInput) {
            imageInput.addEventListener('input', (e) => {
                const newUrl = e.target.value;
                this.value = newUrl;
                this.updatePreview(newUrl);
                this.callback.setImage(newUrl);
                this.updateImageInfo(newUrl);
            });
        }

        const altInput = this.getAltInput();
        if (altInput) {
            altInput.addEventListener('input', (e) => {
                this.alt = e.target.value;
                this.updateAltText(e.target.value);
            });
        }

        const uploadBtn = this.getUploadButton();
        if (uploadBtn) uploadBtn.addEventListener('click', () => this.browserAndUpload());

        const reloadBtn = this.getReloadButton();
        if (reloadBtn) reloadBtn.addEventListener('click', () => this.render());

        const removeBtn = this.getRemoveButton();
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                const emptyImageUrl = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOTYgMjk2Ij48cmVjdCB3aWR0aD0iMjk2IiBoZWlnaHQ9IjI5NiIgZmlsbD0iI2YxZjVmOSIvPjwvc3ZnPg==';
                this.value = emptyImageUrl;
                this.callback.setImage(emptyImageUrl);
                this.render();
            });
        }

        this.updateImageInfo(this.value);
    }

    async updateImageInfo(url) {
        if (!url || url.startsWith('data:')) return;
        try {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                const dimensions = `${img.naturalWidth || img.width} x ${img.naturalHeight || img.height} px`;
                const filename = url.split('/').pop().split('?')[0] || 'Image';
                const dimSpan = this.domNode.querySelector('.dimensions');
                const fileSpan = this.domNode.querySelector('.filename');
                if (dimSpan) dimSpan.textContent = dimensions;
                if (fileSpan) fileSpan.textContent = filename;
            };
        } catch (error) {
            // ignore
        }
    }

    browserAndUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const applyImage = (url) => {
                    this.value = url;
                    this.callback.setImage(url);
                    this.render();
                };

                try {
                    const uploadEndpoint = (typeof builder !== 'undefined' && builder.assetUploadHandler) ? builder.assetUploadHandler : '/asset-upload.php';
                    const response = await fetch(uploadEndpoint, {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.url) {
                            applyImage(result.url);
                            return;
                        }
                    }
                } catch (error) {
                    console.warn('Network upload fallback to local Data URL:', error);
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    applyImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    }

    changeMode(mode) {
        if (mode === 'upload') {
            this.UploadMode = true;
            this.PasteMode = false;
        } else if (mode === 'paste') {
            this.UploadMode = false;
            this.PasteMode = true;
        }
        this.render();
    }

    getImageInput() {
        return this.domNode.querySelector('[name="image-url"]');
    }

    getAltInput() {
        return this.domNode.querySelector('[name="alt-text"]');
    }

    getUploadButton() {
        return this.domNode.querySelector('[data-control="upload"]');
    }

    getReloadButton() {
        return this.domNode.querySelector('[data-control="reload"]');
    }

    getRemoveButton() {
        return this.domNode.querySelector('[data-control="delete"]');
    }

    updatePreview(url) {
        const img = this.domNode.querySelector('.image-thumb');
        if (img) img.src = url;
    }

    updateAltText(altText) {
        this.callback.setAlt(altText);
    }
}

export default ImageControl;
