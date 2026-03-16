export class ResourceManager {
    constructor() {
        this.images = {};
    }

    async loadImages(assets) {
        const promises = assets.map(asset => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (this.images[asset.id]) {
                    resolve(this.images[asset.id]);
                    return;
                }

                const img = new Image();
                img.src = `/assets/${asset.src}`;
                img.onload = () => {
                    this.images[asset.id] = img;
                    resolve(img);
                };
                img.onerror = () => {
                    console.warn(`Failed to load asset: ${asset.src}`);
                    resolve(null); // Don't reject — let game continue without the image
                };
            });
        });

        return Promise.all(promises);
    }

    getImage(id) {
        return this.images[id];
    }
}

export const resources = new ResourceManager();
