import { useEffect } from "react";
import { toast } from "sonner";
import { useVersionCheck } from "@/hooks/use-version-check";
import { useLanguage } from "@/components/language-provider";
import { useNavigate } from "@tanstack/react-router";
import { localePath } from "@/lib/locale-helpers";

export function UpdateBanner() {
  const { hasNewVersion, latestVersion, dismiss } = useVersionCheck();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasNewVersion || !latestVersion) return;

    const id = toast(t("version.newAvailable"), {
      description: `${t("version.current")} ${latestVersion}`,
      duration: 15000,
      action: {
        label: t("version.viewChangelog"),
        onClick: () => {
          navigate({ to: localePath("/changelog") });
          dismiss();
        },
      },
      onDismiss: () => {
        dismiss();
      },
      richColors: true,
    });

    return () => {
      toast.dismiss(id);
    };
  }, [hasNewVersion, latestVersion, dismiss, navigate, t]);

  return null;
}
