/**
 * Decorator to mark class as a service and store theirs instances in global variable.
 */
export function Service() {
  return function decorator(target: any) {
    setTimeout(() => {
      const WINDOW = window as any;
      const ngRef = WINDOW.ngRef;
      if (!ngRef) return;
      if (!WINDOW.SERVICES) {
        WINDOW.SERVICES = {};
      }
      WINDOW.SERVICES[target.name] = ngRef.injector.get(target);
    });
  };
}
