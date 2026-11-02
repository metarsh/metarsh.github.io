import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export interface LightboxSlide {
  src: string;
  alt?: string;
}

interface ProjectImageLightboxProps {
  slides: LightboxSlide[];
  index: number;
  onClose: () => void;
}

export const ProjectImageLightbox = ({ slides, index, onClose }: ProjectImageLightboxProps) => {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      plugins={slides.length > 1 ? [Zoom, Thumbnails] : [Zoom]}
      zoom={{
        maxZoomPixelRatio: 4,
        zoomInMultiplier: 1.6,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        scrollToZoom: true,
      }}
      thumbnails={{
        position: "bottom",
        width: 80,
        height: 52,
        border: 1,
        borderRadius: 8,
        padding: 4,
        gap: 12,
        showToggle: false,
      }}
      animation={{
        fade: 220,
        swipe: 260,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      styles={{
        root: {
          "--yarl__color_backdrop": "#08080c",
          backgroundColor: "#08080c",
          zIndex: 99999,
        },
        container: {
          backgroundColor: "#08080c",
        },
      }}
    />
  );
};
