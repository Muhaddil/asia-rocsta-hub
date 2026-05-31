import { useEffect } from "react";
import { useLanguage } from "@/components/language-provider";

interface MetaTags {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
}

export function useMetaTags(meta: MetaTags) {
  const { language } = useLanguage();

  useEffect(() => {
    if (meta.title) {
      document.title = meta.title;
    }

    const updateMeta = (name: string, content: string, attribute?: string) => {
      const selector = attribute ? `meta[${attribute}="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        if (attribute) {
          element.setAttribute(attribute, name);
        } else {
          element.setAttribute("name", name);
        }
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    if (meta.description) {
      updateMeta("description", meta.description);
    }

    if (meta.ogTitle) {
      updateMeta("og:title", meta.ogTitle, "property");
    }

    if (meta.ogDescription) {
      updateMeta("og:description", meta.ogDescription, "property");
    }

    if (meta.ogImage) {
      updateMeta("og:image", meta.ogImage, "property");
      updateMeta("twitter:image", meta.ogImage);
    }
  }, [language, meta.title, meta.description, meta.ogTitle, meta.ogDescription, meta.ogImage]);
}
