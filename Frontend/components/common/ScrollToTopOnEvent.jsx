"use client";

const ScrollToTopByEvent = (num) => {
  window.scrollTo({ top: Number(num), behavior: "smooth" });
  return null;
};

export default ScrollToTopByEvent;
