export default class Storefront {
  constructor() {
    const technicalDataEl = document.querySelector('[data-technical]');
    if (!technicalDataEl) {
      // eslint-disable-next-line no-console
      console.error(
        'utils/storefront/index.js: Could not locate Storefront credentials',
      );
    }

    this.data = JSON.parse(technicalDataEl.textContent);
    this.apiVersion = this.data.apiVersion;
    this.shopName = this.data.shopName;
    this.storefrontToken = this.data.storefrontToken;
    // Attaching to the window for easy access in storefront queries
    window.TMW.localization = this.data.localization;

    this.headers = {
      'X-Shopify-Storefront-Access-Token': this.storefrontToken,
      'Content-Type': 'application/json',
    };
  }

  static getInstance() {
    if (!this.instance) this.instance = new Storefront();
    return this.instance;
  }

  async request({ query, variables = {} }) {
    const response = await fetch(
      `https://${this.shopName}/api/${this.apiVersion}/graphql.json`,
      {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify({ query, variables }),
      },
    );

    return response.json();
  }
}
