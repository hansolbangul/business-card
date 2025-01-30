"use client";

import { useCanvasStore } from "@/entities/canvas/model/store";
import { loadSVGFromString, util, FabricObject } from "@/shared/lib/fabric";
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

export const AddSocialIcon = () => {
  const { canvas } = useCanvasStore();

  const handleAddIcon = () => {
    modalControl.open((close) => (
      <ModalContent close={close} title="소셜 아이콘 추가">
        <div className="grid grid-cols-4 gap-4 p-4">
          {SOCIAL_ICONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (!canvas) return;

                  const iconSvg = Icon({}).props.children;
                  const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                      <g fill="${item.color}">
                        ${
                          typeof iconSvg === "string"
                            ? iconSvg
                            : Array.isArray(iconSvg)
                            ? iconSvg.join("")
                            : ""
                        }
                      </g>
                    </svg>
                  `;

                  loadSVGFromString(svgString, (objects, options) => {
                    const icon = util.groupSVGElements(objects, options);
                    icon.set({
                      left: 50,
                      top: 50,
                      scaleX: 1,
                      scaleY: 1,
                    });

                    canvas.add(icon);
                    canvas.setActiveObject(icon);
                    canvas.renderAll();
                  });

                  close();
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <Icon className="text-2xl" style={{ color: item.color }} />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </div>
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
