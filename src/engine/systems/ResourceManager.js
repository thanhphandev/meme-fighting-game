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
                img.onerror = (e) => {
                    console.error(`Failed to load asset: ${asset.src}`, e);
                    reject(e);
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
