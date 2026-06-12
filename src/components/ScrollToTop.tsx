import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If we have a hash (e.g. /packages#website-eshop), scroll to that element.
    if (hash) {
      const selector = decodeURIComponent(hash);
      let didScroll = false;

      // Keep in sync with the fixed header height-ish (mobile/desktop).
      const HEADER_OFFSET_PX = 120;

      const scrollToEl = () => {
        const el = document.querySelector(selector);
        if (!el) return false;
        // Use scrollIntoView for scroll-margin-top support, then apply an extra offset
        // to account for the fixed header (mobile can be slightly different).
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => {
          // If header overlaps, nudge up a bit.
          window.scrollBy({ top: -HEADER_OFFSET_PX, left: 0, behavior: "auto" });
        }, 0);
        didScroll = true;
        return true;
      };

      // 1) Try immediately (works when DOM already rendered)
      if (scrollToEl()) return;

      // 1b) Extra retries on next ticks (helps on mobile when layout settles late)
      const retryTimers: number[] = [50, 250, 750, 1500].map((ms) =>
        window.setTimeout(() => {
          if (!didScroll) scrollToEl();
        }, ms)
      );

      // 2) Observe DOM changes (important for mobile / slow network where the section is rendered after data fetch)
      const observer = new MutationObserver(() => {
        if (didScroll) return;
        if (scrollToEl()) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // 3) Safety timeout to avoid keeping an observer forever
      const timeoutId = window.setTimeout(() => {
        observer.disconnect();
      }, 10000);

      return () => {
        retryTimers.forEach((t) => window.clearTimeout(t));
        window.clearTimeout(timeoutId);
        observer.disconnect();
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
