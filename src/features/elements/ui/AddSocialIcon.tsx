"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { Group, loadSVGFromString } from "@/shared/lib/fabric";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaBlogger,
  FaEnvelope,
} from "react-icons/fa";
import { modalControl } from "@/shared/lib/modal/modalControl";
import { ModalContent } from "@/features/elements/ui/ModalContent";

const SOCIAL_ICONS = [
  { icon: FaGithub, name: "GitHub", color: "#333333" },
  { icon: FaLinkedin, name: "LinkedIn", color: "#0077B5" },
  { icon: FaTwitter, name: "Twitter", color: "#1DA1F2" },
  { icon: FaInstagram, name: "Instagram", color: "#E4405F" },
  { icon: FaFacebook, name: "Facebook", color: "#1877F2" },
  { icon: FaYoutube, name: "YouTube", color: "#FF0000" },
  { icon: FaBlogger, name: "Blog", color: "#FF5722" },
  { icon: FaEnvelope, name: "Email", color: "#333333" },
];

interface AddSocialIconProps {
  close: () => void;
}

export const AddSocialIcon = ({ close }: AddSocialIconProps) => {
  const { canvas } = useCanvasStore();

  const handleAddIcon = async (item: typeof SOCIAL_ICONS[0]) => {
    if (!canvas) return;

    const Icon = item.icon;
    const iconElement = Icon({}).props.children[0];

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 496 512">
        <g fill="${item.color}" transform="scale(0.05, 0.05)">
          <path d="${iconElement.props.d}" />
        </g>
      </svg>
    `;

    try {
      const result = await loadSVGFromString(svgString);

      if (!result.objects || !Array.isArray(result.objects) || result.objects.length === 0) {
        console.log("No valid objects found in result");
        return;
      }

      const objects = result.objects.filter((obj) => obj !== null);
      if (objects.length === 0) {
        console.log("No objects after filtering");
        return;
      }

      objects.forEach((obj) => {
        obj.set({
          scaleX: 1,
          scaleY: 1,
        });
      });

      const canvasCenter = canvas.getCenter();
      const group = new Group([...objects], {
        left: canvasCenter.left,
        top: canvasCenter.top,
        originX: 'center',
        originY: 'center',
      });

      canvas.add(group);
      canvas.bringObjectForward(group, true); // 새로 추가된 아이콘을 맨 앞으로 가져옴
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
      close();
    } catch (error) {
      console.error("Failed to load SVG:", error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {SOCIAL_ICONS.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={`social-icon-${item.name}-${index}`}
            onClick={() => handleAddIcon(item)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
          >
            <Icon className="text-2xl" style={{ color: item.color }} />
            <span className="text-sm">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export const AddSocialIconButton = () => {
  const handleAddIcon = () => {
    modalControl.open((close) => (
      <ModalContent close={close} title="소셜 아이콘 추가">
        <AddSocialIcon close={close} />
      </ModalContent>
    ));
  };

  return (
    <button
      onClick={handleAddIcon}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-900 flex flex-col items-center gap-2"
    >
      <span className="material-icons text-2xl">share</span>
      <span className="text-sm">SNS</span>
    </button>
  );
};
