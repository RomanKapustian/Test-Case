import Player from '@vimeo/player';

/**
 * The Video class works in conjunction with the video snippet. It scrapes data
 * from the snippet and instantiates a custom Vimeo player on that data.
 * It handles custom play/pause and mute/unmute buttons
 */
export default class Video {
  /**
   * @param {DOMnode} element top-level node for the section/component
   * @param {DOMnode} video top-level node for the video
   * @param {Class} layout for handling breakpoints
   */
  constructor({ element, video, layout }) {
    const dataEl = video.querySelector('[data-component-data]');
    this.element = element;
    this.layout = layout;
    this.data = dataEl ? JSON.parse(dataEl.textContent) : {};
    this.isMuted = true;
    this.isMobile = true;
    this.isPlaying = this.data.autoplay;
    this.hasMultipleVideos =
      !!this.data.videoDesktop && !!this.data.videoMobile;

    this.handlePlay = this.handlePlay.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleBpChange = this.handleBpChange.bind(this);

    this.playEl = this.data.play.selector
      ? element.querySelector(this.data.play.selector)
      : video.querySelector('[data-video-play]');
    this.muteEl = this.data.mute.selector
      ? element.querySelector(this.data.mute.selector)
      : video.querySelector('[data-video-mute]');

    this.init();
  }

  handlePlay() {
    if (this.isPlaying) {
      this.pauseVideo();
    } else this.playVideo();
    if (this.playEl)
      [...this.playEl.children].forEach((child) =>
        child.classList.toggle('hidden'),
      );
  }

  pauseVideo() {
    this.player.pause();
    this.isPlaying = false;
    this.playEl?.setAttribute('aria-label', this.data.play.playText);
  }

  playVideo() {
    this.player.play();
    this.isPlaying = true;
    this.playEl?.setAttribute('aria-label', this.data.play.pauseText);
  }

  handleMute() {
    if (this.isMuted) {
      this.unmuteVideo();
    } else {
      this.muteVideo();
    }

    if (this.muteEl)
      [...this.muteEl.children].forEach((child) =>
        child.classList.toggle('hidden'),
      );
  }

  unmuteVideo() {
    if (this.data.host === 'shopify') {
      this.player.muted = false;
    } else if (this.data.host === 'vimeo') {
      this.player.setVolume(1);
    }
    this.isMuted = false;
    this.muteEl?.setAttribute('aria-label', this.data.mute.muteText);
  }

  muteVideo() {
    if (this.data.host === 'shopify') {
      this.player.muted = true;
    } else if (this.data.host === 'vimeo') {
      this.player.setVolume(0);
    }
    this.isMuted = true;
    this.muteEl?.setAttribute('aria-label', this.data.mute.unmuteText);
  }

  resetPlayer() {
    this.unbindEventListeners();

    if (this.data.host === 'shopify') {
      this.resetShopifyPlayer();
    } else if (this.data.host === 'vimeo') {
      this.resetVimeoPlayer();
    }
  }

  unbindEventListeners() {
    this.playEl?.removeEventListener('click', this.handlePlay);
    this.muteEl?.removeEventListener('click', this.handleMute);
    if (this.layout)
      window.removeEventListener('bpChange', this.handleBpChange);
  }

  resetShopifyPlayer() {
    this.resetControlButtons();
  }

  resetVimeoPlayer() {
    this.player.destroy().then(() => {
      this.resetControlButtons();
      this.init();
    });
  }

  resetControlButtons() {
    this.isPlaying = this.data.autoplay;
    this.playEl?.setAttribute(
      'aria-label',
      this.data.autoplay ? this.data.play.pauseText : this.data.play.playText,
    );
    this.playEl?.children[this.data.autoplay ? 1 : 0].classList.remove(
      'hidden',
    );
    this.playEl?.children[this.data.autoplay ? 0 : 1].classList.add('hidden');

    this.isMuted = true;
    this.muteEl?.setAttribute('aria-label', this.data.mute.unmuteText);
    this.muteEl?.children[0].classList.remove('hidden');
    this.muteEl?.children[1].classList.add('hidden');
  }

  handleBpChange() {
    if (this.isMobile && this.layout.isAboveBreakpoint('sm')) {
      this.isMobile = false;
      this.resetPlayer();
    } else if (!this.isMobile && !this.layout.isAboveBreakpoint('sm')) {
      this.isMobile = true;
      this.resetPlayer();
    }
  }

  init() {
    if (this.layout && this.hasMultipleVideos) {
      if (this.layout.isAboveBreakpoint('sm')) {
        this.initVideoByType(this.data.videoDesktop);
        this.isMobile = false;
      } else {
        this.initVideoByType(this.data.videoMobile);
        this.isMobile = true;
      }
    } else if (this.data.videoDesktop) {
      this.initVideoByType(this.data.videoDesktop);
    } else if (this.data.videoMobile) {
      this.initVideoByType(this.data.videoMobile);
    }
  }

  initVideoByType(video) {
    if (this.data.host === 'shopify') {
      this.initShopifyVideo(video.id);
    } else if (this.data.host === 'vimeo') {
      this.initVimeoVideo(video);
    }
  }

  initVimeoVideo(id) {
    this.player = new Player(`video-${id}`, {
      id,
      controls: false,
      autoplay: this.data.autoplay,
      muted: true,
      responsive: true,
      loop: true,
    });

    this.bindEventListeners();
  }

  initShopifyVideo(id) {
    this.player = this.element.querySelector(`#video-${id} video`);
    this.bindEventListeners();
  }

  bindEventListeners() {
    this.playEl?.addEventListener('click', this.handlePlay);
    this.muteEl?.addEventListener('click', this.handleMute);
    if (this.layout && this.hasMultipleVideos) {
      window.addEventListener('bpChange', this.handleBpChange);
    }
  }
}
