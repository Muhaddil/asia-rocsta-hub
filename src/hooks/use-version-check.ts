import { useEffect, useState } from "react";
import { CURRENT_VERSION } from "@/data/version";

const STORAGE_KEY = "rocsta-seen-version";

export function useVersionCheck() {
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/version.json", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const remote: string = data.version;

        if (remote !== CURRENT_VERSION) {
          const seen = localStorage.getItem(STORAGE_KEY);
          if (seen !== remote) {
            setLatestVersion(remote);
            setHasNewVersion(true);
          }
        }
      } catch {
        // silently ignore — offline or missing file
      }
    }
    check();
  }, []);

  function dismiss() {
    if (latestVersion) {
      localStorage.setItem(STORAGE_KEY, latestVersion);
    }
    setHasNewVersion(false);
  }

  return { hasNewVersion, latestVersion, dismiss };
}
