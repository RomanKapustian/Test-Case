import './main.css';
import Layout from 'utils/layout';
import Video from 'utils/video';

(() => {
  const uniq = (value, index, self) => self.indexOf(value) === index;
  const sections = document.querySelectorAll('[data-section]');
  const sectionNames = [...sections]
    .map((section) => section.dataset.section)
    .filter(uniq);
  const layout = Layout.getInstance();

  sectionNames.forEach((name) => {
    import(/* webpackChunkName: "[index]" */ `./${name}/index.js`)
      .then((m) => {
        const module = m.default;
        const modules = [...sections].filter(
          (section) => section.dataset.section === name,
        );
        modules.forEach((element) => {
          const dataEl = element.querySelector('[data-section-data]');
          const data = dataEl ? JSON.parse(dataEl.textContent) : {};
          const videoEls = element.querySelectorAll('[data-component="video"]');
          const videos =
            videoEls &&
            [...videoEls].map(
              (videoEl) => new Video({ element, video: videoEl, layout }),
            );
          module(element, { ...data, layout, videos });
        });
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  });
})();
