export default class Layout {
  constructor() {
    this.bps = {
      above: {
        sm: window.matchMedia('(min-width: 640px'),
        md: window.matchMedia('(min-width: 768px'),
        lg: window.matchMedia('(min-width: 1024px'),
        xl: window.matchMedia('(min-width: 1280px'),
        '2xl': window.matchMedia('(min-width: 1536px'),
      },
      below: {
        sm: window.matchMedia('(max-width: 639px'),
        md: window.matchMedia('(max-width: 767px'),
        lg: window.matchMedia('(max-width: 1023px'),
        xl: window.matchMedia('(max-width: 1279px'),
        '2xl': window.matchMedia('(max-width: 1535px'),
      },
    };

    this.watchBreakpoints();
  }

  static getInstance() {
    if (!this.instance) this.instance = new Layout();
    return this.instance;
  }

  watchBreakpoints() {
    const allBps = Object.values(this.bps.above).concat(
      Object.values(this.bps.below),
    );
    allBps.map((bp) =>
      bp.addEventListener('change', (e) => {
        if (e.matches) {
          const bpChange = new CustomEvent('bpChange', {
            detail: { bp: this.isBreakpoint() },
          });
          window.dispatchEvent(bpChange);
        }
      }),
    );
  }

  isBreakpoint() {
    return (
      Object.entries(this.bps.above)
        .reverse()
        .find(([, value]) => value.matches)?.[0] ?? 'xs'
    );
  }

  isAboveBreakpoint(bp) {
    return this.bps.above[bp].matches;
  }

  isBelowBreakpoint(bp) {
    return this.bps.below[bp].matches;
  }
}
