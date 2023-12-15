let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updateTouch = (e) => {
      if (!this.rotating) {
        this.touchX = e.clientX || e.touches[0].clientX;
        this.touchY = e.clientY || e.touches[0].clientY;

        this.velX = this.touchX - this.prevTouchX;
        this.velY = this.touchY - this.prevTouchY;
      }

      const dirX = (e.clientX || e.touches[0].clientX) - this.touchX;
      const dirY = (e.clientY || e.touches[0].clientY) - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchX;
        this.prevTouchY = this.touchY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    document.addEventListener('mousemove', updateTouch);
    document.addEventListener('touchmove', updateTouch, { passive: false });

    const handleTouchStart = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];

      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;

      if (e.touches.length === 2) {
        this.rotating = true;
      }
    };

    const handleTouchEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    paper.addEventListener('mousedown', handleTouchStart);
    paper.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseup', handleTouchEnd);
    window.addEventListener('touchend', handleTouchEnd);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
