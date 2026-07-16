const DEVICE_ID_KEY = "device_id";

// Guest carts are identified by this header (see cartOwner.middleware.js on
// the backend) — persisted so a guest's cart survives a page reload.
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
