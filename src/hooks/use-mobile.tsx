import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    function detectMobile() {
  const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      return isMobileUA || window.innerWidth < MOBILE_BREAKPOINT;
    }
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(detectMobile());
    };
    mql.addEventListener("change", onChange);
    setIsMobile(detectMobile());
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
