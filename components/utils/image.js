import { h } from 'preact';

const getSizedImageUrl = (src, size) => {
  if (size === null) return src;
  const match = src.match(
    /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif|jpg.webp)(\?v=\d+)?$/i,
  );
  if (!match) return null;
  const prefix = src.split(match[0]);
  const suffix = match[0];
  return `${prefix[0]}_${size}x${suffix}`.replace(/http(s)?:/, '');
};

const Image = ({ alt, src, srcWidths = {}, height, width, classes = '' }) => {
  const bps = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
  const widths = srcWidths;

  // Remove undefined breakpoints
  Object.keys(bps).forEach((key) => !widths[key] ?? delete bps[key]);
  Object.keys(widths).forEach((key) => !bps[key] ?? delete widths[key]);

  // Reduce to values arrays
  const srcWidthsReduced = Object.values(widths);
  const sizeWidthsReduced = Object.values(bps);

  // Convert to srcset and sizes values
  const srcsetFormatted =
    srcWidthsReduced &&
    srcWidthsReduced.map((w) => `${getSizedImageUrl(src, w)} ${w}w`).join(',');
  const sizesFormatted =
    srcWidthsReduced &&
    `${srcWidthsReduced
      .map((w, i) => `(max-width: ${sizeWidthsReduced[i]}px) ${w}px`)
      .slice(0, srcWidthsReduced.length - 1)
      .join(',')}, ${srcWidthsReduced[srcWidthsReduced.length - 1]}px`;

  return (
    <img
      className={`image ${classes}`}
      srcSet={srcsetFormatted}
      sizes={sizesFormatted}
      src={src}
      alt={alt}
      height={height}
      width={width}
      loading="lazy"
    />
  );
};

export default Image;
