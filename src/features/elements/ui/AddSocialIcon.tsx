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
                onClick={async () => {
                  if (!canvas) return;

                  // 아이콘 생성
                  const iconElement = Icon({}).props.children[0];
                  console.log("Icon Element:", iconElement);

                  const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 496 512">
                      <g fill="${item.color}" transform="scale(0.05, 0.05)">
                        <path d="${iconElement.props.d}" />
                      </g>
                    </svg>
                  `;
                  console.log("Generated SVG String:", svgString);

                  try {
                    const result = await loadSVGFromString(svgString);
                    console.log("SVG Load Result:", result);

                    if (
                      !result.objects ||
                      !Array.isArray(result.objects) ||
                      result.objects.length === 0
                    ) {
                      console.log("No valid objects found in result");
                      return;
                    }

                    const objects = result.objects.filter(
                      (obj) => obj !== null
                    );
                    console.log("Filtered Objects:", objects);

                    if (objects.length === 0) {
                      console.log("No objects after filtering");
                      return;
                    }

                    // SVG 객체 위치 조정
                    objects.forEach((obj) => {
                      obj.set({
                        scaleX: 1,
                        scaleY: 1,
                      });
                    });

                    // 아이콘과 배경을 그룹으로 묶기
                    const group = new Group([...objects], {
                      left: 50,
                      top: 50,
                    });

                    canvas.add(group);
                    canvas.setActiveObject(group);
                    canvas.requestRenderAll();
                    close();
                  } catch (error) {
                    console.error("Failed to load SVG:", error);
                  }
                }}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <Icon className="text-2xl" style={{ color: item.color }} />
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
