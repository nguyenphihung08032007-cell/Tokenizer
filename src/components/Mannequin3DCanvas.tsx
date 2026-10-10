import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCw,
  Sun,
  Camera,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  OutfitConfiguration,
  FABRIC_OPTIONS,
  MANNEQUIN_POSES,
} from '../data/vietPhucData';
import { soundEngine } from '../utils/soundEngine';

export type StudioLightingMode = 'classic-gold' | 'white-studio' | 'sunset-glow';

interface Mannequin3DCanvasProps {
  config: OutfitConfiguration;
  onPoseChange: (poseId: string) => void;
  comparisonOriginalImage?: string | null;
  onClearComparisonImage?: () => void;
  onCaptureReady?: (captureFn: (mode: 'transparent' | 'framed') => string) => void;
}

function createFabricPatternTexture(
  baseHex: string,
  trimHex: string,
  patternId: string,
  density: number,
  offsetY: number,
  isBump: boolean = false
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = isBump ? '#808080' : baseHex;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = isBump ? '#969696' : 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const count = Math.max(2, Math.round(4 * density));
  const cell = 512 / count;
  const shiftY = offsetY * 120;

  ctx.strokeStyle = isBump ? '#FFFFFF' : trimHex;
  ctx.fillStyle = isBump ? '#E0E0E0' : trimHex;
  ctx.lineWidth = isBump ? 3.2 : 2.2;

  for (let row = -1; row <= count; row++) {
    for (let col = 0; col < count; col++) {
      const cx = col * cell + cell / 2 + (row % 2 === 0 ? 0 : cell / 4);
      const cy = ((row * cell + cell / 2 + shiftY) % 512 + 512) % 512;
      const r = cell * 0.26;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = isBump ? 0.9 : 0.65;

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createDongSonStageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
  grad.addColorStop(0, '#5A3A22');
  grad.addColorStop(0.65, '#3A2312');
  grad.addColorStop(1, '#241409');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#C9A24B';
  ctx.lineWidth = 3;
  [45, 85, 130, 175, 220, 244].forEach((radius) => {
    ctx.beginPath();
    ctx.arc(256, 256, radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const Mannequin3DCanvas: React.FC<Mannequin3DCanvasProps> = ({
  config,
  onPoseChange,
  comparisonOriginalImage,
  onClearComparisonImage,
  onCaptureReady,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<StudioLightingMode>('classic-gold');
  const [splitPercent, setSplitPercent] = useState<number>(50);

  const groupsRef = useRef<{
    mannequinRoot?: THREE.Group;
    headGroup?: THREE.Group;
    chestMesh?: THREE.Mesh;
    waistMesh?: THREE.Mesh;
    hipMesh?: THREE.Mesh;
    leftArmGroup?: THREE.Group;
    rightArmGroup?: THREE.Group;
    leftArmMesh?: THREE.Mesh;
    rightArmMesh?: THREE.Mesh;
    leftLegGroup?: THREE.Group;
    rightLegGroup?: THREE.Group;
    leftLegMesh?: THREE.Mesh;
    rightLegMesh?: THREE.Mesh;
    garmentGroup?: THREE.Group;
    stageDisc?: THREE.Mesh;
    petalsGroup?: THREE.Group;
    keyLight?: THREE.DirectionalLight;
    fillLight?: THREE.DirectionalLight;
    rimLight?: THREE.SpotLight;
    ambientLight?: THREE.AmbientLight;
  }>({});

  const captureSnapshot = useCallback(
    (mode: 'transparent' | 'framed'): string => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !scene || !camera) return '';

      soundEngine.playCameraShutter();
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    },
    []
  );

  useEffect(() => {
    if (onCaptureReady) {
      onCaptureReady(captureSnapshot);
    }
  }, [onCaptureReady, captureSnapshot]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 620;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 3.85);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.02, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.1;
    controls.maxDistance = 6.0;
    controls.update();
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight('#FFF6E5', 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#FFE4B5', 1.85);
    keyLight.position.set(2.6, 4.2, 3.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#E0F2FE', 0.75);
    fillLight.position.set(-2.8, 2.2, 2.0);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight('#C9A24B', 1.6);
    rimLight.position.set(0, 3.6, -2.8);
    scene.add(rimLight);

    const stageGeo = new THREE.CylinderGeometry(1.18, 1.26, 0.1, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      map: createDongSonStageTexture(),
      roughness: 0.45,
      metalness: 0.35,
    });
    const stageDisc = new THREE.Mesh(stageGeo, stageMat);
    stageDisc.position.y = -0.05;
    stageDisc.receiveShadow = true;
    scene.add(stageDisc);

    const petalsGroup = new THREE.Group();
    const petalGeo = new THREE.CircleGeometry(0.032, 6);
    const petalMat = new THREE.MeshBasicMaterial({
      color: '#E7A1B0',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    for (let i = 0; i < 24; i++) {
      const pMesh = new THREE.Mesh(petalGeo, petalMat);
      pMesh.position.set((Math.random() - 0.5) * 2.4, Math.random() * 2.5, -0.4 - Math.random() * 1.1);
      petalsGroup.add(pMesh);
    }
    scene.add(petalsGroup);

    const mannequinRoot = new THREE.Group();
    scene.add(mannequinRoot);

    const skinMat = new THREE.MeshStandardMaterial({ color: '#E6C6A8', roughness: 0.55 });

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.66, 0);
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.115, 32, 32), skinMat);
    headMesh.scale.set(0.92, 1.16, 0.96);
    headGroup.add(headMesh);
    mannequinRoot.add(headGroup);

    const chestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.135, 0.28, 28), skinMat);
    chestMesh.position.set(0, 1.34, 0);
    chestMesh.scale.set(1, 1, 0.72);
    mannequinRoot.add(chestMesh);

    const waistMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.155, 0.22, 28), skinMat);
    waistMesh.position.set(0, 1.11, 0);
    waistMesh.scale.set(1, 1, 0.72);
    mannequinRoot.add(waistMesh);

    const hipMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.168, 0.22, 28), skinMat);
    hipMesh.position.set(0, 0.91, 0);
    hipMesh.scale.set(1, 1, 0.76);
    mannequinRoot.add(hipMesh);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.2, 1.44, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.48, 12, 16), skinMat);
    leftArmMesh.position.set(0, -0.26, 0);
    leftArmGroup.add(leftArmMesh);
    mannequinRoot.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.2, 1.44, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.48, 12, 16), skinMat);
    rightArmMesh.position.set(0, -0.26, 0);
    rightArmGroup.add(rightArmMesh);
    mannequinRoot.add(rightArmGroup);

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.09, 0.82, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.042, 0.78, 18), skinMat);
    leftLegMesh.position.set(0, -0.39, 0);
    leftLegGroup.add(leftLegMesh);
    mannequinRoot.add(leftLegGroup);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.09, 0.82, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.042, 0.78, 18), skinMat);
    rightLegMesh.position.set(0, -0.39, 0);
    rightLegGroup.add(rightLegMesh);
    mannequinRoot.add(rightLegGroup);

    const garmentGroup = new THREE.Group();
    mannequinRoot.add(garmentGroup);

    groupsRef.current = {
      mannequinRoot,
      headGroup,
      chestMesh,
      waistMesh,
      hipMesh,
      leftArmGroup,
      rightArmGroup,
      leftArmMesh,
      rightArmMesh,
      leftLegGroup,
      rightLegGroup,
      leftLegMesh,
      rightLegMesh,
      garmentGroup,
      stageDisc,
      petalsGroup,
      keyLight,
      fillLight,
      rimLight,
      ambientLight,
    };

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (groupsRef.current.stageDisc) {
        groupsRef.current.stageDisc.rotation.y = t * 0.08;
      }

      if (groupsRef.current.petalsGroup) {
        groupsRef.current.petalsGroup.children.forEach((child) => {
          child.position.y -= 0.0035;
          if (child.position.y < 0.05) child.position.y = 2.45;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 620;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  useEffect(() => {
    const { keyLight, fillLight, rimLight, ambientLight } = groupsRef.current;
    if (!keyLight || !fillLight || !rimLight || !ambientLight) return;

    if (lightingMode === 'classic-gold') {
      ambientLight.color.set('#FFF4E0');
      keyLight.color.set('#FFE0A3');
    } else if (lightingMode === 'white-studio') {
      ambientLight.color.set('#FFFFFF');
      keyLight.color.set('#FFFFFF');
    } else {
      ambientLight.color.set('#FFD8BE');
      keyLight.color.set('#FF7E47');
    }
  }, [lightingMode]);

  useEffect(() => {
    const {
      mannequinRoot,
      chestMesh,
      waistMesh,
      hipMesh,
      leftArmGroup,
      rightArmGroup,
      leftArmMesh,
      rightArmMesh,
      leftLegGroup,
      rightLegGroup,
      leftLegMesh,
      rightLegMesh,
      garmentGroup,
    } = groupsRef.current;

    if (!mannequinRoot || !chestMesh || !waistMesh || !hipMesh || !leftArmGroup || !rightArmGroup || !garmentGroup) return;

    const weightKg = Number(config.bodyMetrics.weightKg) || 52;
    const heightCm = Number(config.bodyMetrics.heightCm) || 165;
    const bustCm = Number(config.bodyMetrics.bustCm) || 84;
    const waistCm = Number(config.bodyMetrics.waistCm) || 66;
    const hipCm = Number(config.bodyMetrics.hipCm) || 90;

    // Hệ số cân nặng tỷ lệ TRỰC QUAN & RÕ RỆT:
    // 38kg -> gầy thanh mảnh rõ nét (x0.72)
    // 52kg -> vóc dáng chuẩn mực (x1.0)
    // 75kg -> đẫy đà tròn trịa (x1.35)
    // 95-110kg -> đậm người, to lớn rõ rệt (x1.65 - x1.85)
    const weightGirthFactor = THREE.MathUtils.clamp(
      0.72 + ((weightKg - 38) / (110 - 38)) * 1.05,
      0.68,
      1.88
    );
    const heightScale = THREE.MathUtils.clamp(heightCm / 165, 0.82, 1.25);

    // Kích thước các vòng kết hợp với cân nặng:
    const bustScale = THREE.MathUtils.clamp((bustCm / 84) * weightGirthFactor, 0.65, 2.3);
    const waistScale = THREE.MathUtils.clamp((waistCm / 66) * weightGirthFactor, 0.62, 2.5);
    const hipScale = THREE.MathUtils.clamp((hipCm / 90) * weightGirthFactor, 0.65, 2.4);
    const limbThickness = THREE.MathUtils.clamp(Math.pow(weightGirthFactor, 0.75), 0.70, 1.85);

    // Toàn bộ mannequinRoot co giãn theo chiều cao và BỀ NGANG CÂN NẶNG:
    mannequinRoot.scale.set(weightGirthFactor, heightScale, weightGirthFactor);

    // Ngực, eo, mông to/nhỏ thêm theo số đo riêng lẻ:
    chestMesh.scale.set(bustCm / 84, 1, (bustCm / 84) * 0.78);
    waistMesh.scale.set(waistCm / 66, 1, (waistCm / 66) * 0.78);
    hipMesh.scale.set(hipCm / 90, 1, (hipCm / 90) * 0.82);

    // Độ dày tay và chân:
    if (leftArmMesh) leftArmMesh.scale.set(limbThickness, 1, limbThickness);
    if (rightArmMesh) rightArmMesh.scale.set(limbThickness, 1, limbThickness);
    if (leftLegMesh) leftLegMesh.scale.set(limbThickness, 1, limbThickness);
    if (rightLegMesh) rightLegMesh.scale.set(limbThickness, 1, limbThickness);

    // Dịch chuyển vị trí bắp tay và chân ra ngoài khi thân người nở nang:
    const armOffsetX = 0.16 * (bustCm / 84) + 0.05 * limbThickness;
    leftArmGroup.position.set(-armOffsetX, 1.44, 0);
    rightArmGroup.position.set(armOffsetX, 1.44, 0);

    const legOffsetX = 0.055 * (hipCm / 90) + 0.04 * limbThickness;
    if (leftLegGroup) leftLegGroup.position.set(-legOffsetX, 0.82, 0);
    if (rightLegGroup) rightLegGroup.position.set(legOffsetX, 0.82, 0);

    // Xóa trang phục cũ để dựng mới theo số đo và màu RGB mới
    while (garmentGroup.children.length > 0) {
      const child = garmentGroup.children[0] as THREE.Mesh;
      garmentGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
    }

    const outerTex = createFabricPatternTexture(
      config.colors.outerRobe,
      config.colors.collarAndTrim,
      config.patternId,
      config.patternDensity,
      config.patternOffsetY,
      false
    );

    const outerMat = new THREE.MeshStandardMaterial({
      map: outerTex,
      color: config.colors.outerRobe,
      roughness: 0.38,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });

    const innerMat = new THREE.MeshStandardMaterial({
      color: config.colors.innerShirt,
      roughness: 0.45,
      side: THREE.DoubleSide,
    });

    const bottomMat = new THREE.MeshStandardMaterial({
      color: config.bottomType === 'quan-jeans' ? '#2B4C7E' : config.colors.bottomWear,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: config.colors.collarAndTrim,
      roughness: 0.3,
      metalness: 0.7,
      side: THREE.DoubleSide,
    });

    // 1. LỚP QUẦN / VÁY (BOTTOM WEAR)
    if (config.layersVisible.bottomWear) {
      if (config.bottomType === 'vay-dup') {
        const skirtMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.145 * (waistCm / 66), 0.33 * (hipCm / 90), 0.96, 36),
          bottomMat
        );
        skirtMesh.position.set(0, 0.52, 0);
        garmentGroup.add(skirtMesh);
      } else {
        const pantRadiusTop = 0.082 * (hipCm / 90) * limbThickness;
        const pantRadiusBot = 0.115 * (hipCm / 90);
        const leftPant = new THREE.Mesh(
          new THREE.CylinderGeometry(pantRadiusTop, pantRadiusBot, 0.88, 24),
          bottomMat
        );
        leftPant.position.set(-legOffsetX, 0.48, 0);
        garmentGroup.add(leftPant);

        const rightPant = new THREE.Mesh(
          new THREE.CylinderGeometry(pantRadiusTop, pantRadiusBot, 0.88, 24),
          bottomMat
        );
        rightPant.position.set(legOffsetX, 0.48, 0);
        garmentGroup.add(rightPant);
      }
    }

    // 2. LỚP ÁO TRONG / YẾM (INNER SHIRT / YEM)
    if (config.layersVisible.innerShirt) {
      if (config.garmentModel === 'ao-yem') {
        // Áo yếm hình quả trám che ngực và bụng
        const yemMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.145 * (bustCm / 84), 0.138 * (waistCm / 66), 0.42, 28, 1, false, -Math.PI / 2, Math.PI),
          innerMat
        );
        yemMesh.position.set(0, 1.26, 0.02);
        garmentGroup.add(yemMesh);

        // Dây buộc cổ yếm
        const yemStrap = new THREE.Mesh(
          new THREE.TorusGeometry(0.065, 0.005, 8, 24, Math.PI),
          new THREE.MeshStandardMaterial({ color: config.colors.collarAndTrim })
        );
        yemStrap.rotation.x = Math.PI / 2;
        yemStrap.position.set(0, 1.48, 0);
        garmentGroup.add(yemStrap);
      } else {
        // Áo lương / áo cánh lót trắng chuẩn cổ phục
        const innerTunic = new THREE.Mesh(
          new THREE.CylinderGeometry(0.168 * (bustCm / 84), 0.152 * (waistCm / 66), 0.46, 28),
          innerMat
        );
        innerTunic.position.set(0, 1.25, 0);
        garmentGroup.add(innerTunic);
      }
    }

    // 3. LỚP ÁO NGOÀI (OUTER ROBE)
    if (config.layersVisible.outerRobe) {
      const outerTorso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.176 * (bustCm / 84), 0.154 * (waistCm / 66), 0.45, 32),
        outerMat
      );
      outerTorso.position.set(0, 1.25, 0);
      garmentGroup.add(outerTorso);

      // Thân tà áo rủ xuống theo đặc trưng từng dáng áo
      let panelLength = 0.80;
      if (config.garmentModel === 'ao-ba-ba') {
        panelLength = 0.52; // Áo bà ba ngắn chấm hông
      } else if (config.garmentModel === 'ao-dai') {
        panelLength = 0.96; // Áo dài thướt tha chấm gót
      } else if (config.garmentModel === 'ao-tac') {
        panelLength = 0.90; // Áo tấc thụng dài uy nghiêm
      } else if (config.garmentModel === 'ao-nhat-binh' || config.garmentModel === 'ao-giao-linh') {
        panelLength = 0.88;
      } else if (config.garmentModel === 'ao-truc-linh') {
        panelLength = 0.84;
      } else if (config.garmentModel === 'ao-tu-than') {
        panelLength = 0.82;
      }

      const frontPanel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.156 * (waistCm / 66), 0.265 * (hipCm / 90), panelLength, 28),
        outerMat
      );
      frontPanel.position.set(0, 1.03 - panelLength / 2, 0);
      garmentGroup.add(frontPanel);

      // Ống tay áo theo từng kiểu dáng (thụng rộng vs tay chẽn ôm)
      const isWideSleeve =
        config.garmentModel === 'ao-tac' ||
        config.garmentModel === 'ao-nhat-binh' ||
        config.garmentModel === 'ao-giao-linh';
      const radTop = 0.055 * limbThickness;
      const radBot = isWideSleeve
        ? config.garmentModel === 'ao-tac'
          ? 0.17
          : 0.155
        : config.garmentModel === 'ao-truc-linh'
        ? 0.115
        : 0.046 * limbThickness;

      const leftSleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(radTop, radBot, 0.48, 24),
        outerMat
      );
      leftSleeve.position.set(-armOffsetX, 1.19, 0);
      garmentGroup.add(leftSleeve);

      const rightSleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(radTop, radBot, 0.48, 24),
        outerMat
      );
      rightSleeve.position.set(armOffsetX, 1.19, 0);
      garmentGroup.add(rightSleeve);

      // Chi tiết đặc thù cho từng loại áo:
      // 1. Áo Bà Ba: 2 túi trước vạt + hàng cúc giữa
      if (config.garmentModel === 'ao-ba-ba') {
        const pocketGeo = new THREE.BoxGeometry(0.065, 0.065, 0.008);
        const pocketLeft = new THREE.Mesh(pocketGeo, trimMat);
        pocketLeft.position.set(-0.08, 0.82, 0.14 * (waistCm / 66));
        garmentGroup.add(pocketLeft);

        const pocketRight = new THREE.Mesh(pocketGeo, trimMat);
        pocketRight.position.set(0.08, 0.82, 0.14 * (waistCm / 66));
        garmentGroup.add(pocketRight);

        // Hàng cúc giữa áo bà ba
        for (let i = 0; i < 4; i++) {
          const button = new THREE.Mesh(
            new THREE.SphereGeometry(0.007, 8, 8),
            trimMat
          );
          button.position.set(0, 1.32 - i * 0.12, 0.15 * (bustCm / 84));
          garmentGroup.add(button);
        }
      }

      // 2. Áo Ngũ Thân Tay Chẽn: 5 hạt khuy ngọc cài bên ngực phải
      if (config.garmentModel === 'ao-ngu-than-tay-chen' || config.garmentModel === 'ao-tac') {
        const buttonMat = new THREE.MeshStandardMaterial({
          color: '#F8E2A8',
          metalness: 0.85,
          roughness: 0.25,
        });
        const buttonOffsets = [
          [0.02, 1.44, 0.14],
          [0.05, 1.37, 0.15],
          [0.08, 1.30, 0.15],
          [0.09, 1.21, 0.14],
          [0.09, 1.11, 0.14],
        ];
        buttonOffsets.forEach(([bx, by, bz]) => {
          const btn = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), buttonMat);
          btn.position.set(bx * (bustCm / 84), by, bz * (bustCm / 84));
          garmentGroup.add(btn);
        });
      }

      // 3. Áo Nhật Bình: Dải Thủy ba ngũ sắc ở gấu tay áo
      if (config.garmentModel === 'ao-nhat-binh') {
        const cuffBandColors = ['#3A75C4', '#F1C40F', '#E74C3C', '#2ECC71'];
        cuffBandColors.forEach((hex, idx) => {
          const bandMat = new THREE.MeshBasicMaterial({ color: hex });
          const bandGeo = new THREE.TorusGeometry(0.156, 0.003, 6, 24);
          const leftBand = new THREE.Mesh(bandGeo, bandMat);
          leftBand.rotation.x = Math.PI / 2;
          leftBand.position.set(-armOffsetX, 0.98 + idx * 0.015, 0);
          garmentGroup.add(leftBand);

          const rightBand = new THREE.Mesh(bandGeo, bandMat);
          rightBand.rotation.x = Math.PI / 2;
          rightBand.position.set(armOffsetX, 0.98 + idx * 0.015, 0);
          garmentGroup.add(rightBand);
        });
      }

      // 4. Áo Giao Lĩnh & Áo Tứ Thân: Đai lưng gấm / đai lụa thắt eo
      if (config.garmentModel === 'ao-giao-linh' || config.garmentModel === 'ao-tu-than') {
        const sashBelt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.162 * (waistCm / 66), 0.164 * (waistCm / 66), 0.08, 30),
          trimMat
        );
        sashBelt.position.set(0, 1.05, 0);
        garmentGroup.add(sashBelt);
      }
    }

    // 4. CỔ ÁO & NẸP VIỀN (COLLAR & TRIM)
    if (config.layersVisible.collarAndTrim) {
      if (config.garmentModel === 'ao-nhat-binh') {
        // Cổ áo hình chữ nhật đặc trưng cung đình triều Nguyễn
        const rectCollar = new THREE.Mesh(
          new THREE.BoxGeometry(0.24 * (bustCm / 84), 0.28, 0.04),
          trimMat
        );
        rectCollar.position.set(0, 1.34, 0.13 * (bustCm / 84));
        garmentGroup.add(rectCollar);

        // Viền chỉ vàng bên trong cổ chữ Nhật
        const innerCollarBorder = new THREE.Mesh(
          new THREE.BoxGeometry(0.18 * (bustCm / 84), 0.22, 0.042),
          new THREE.MeshStandardMaterial({ color: '#B3261E' })
        );
        innerCollarBorder.position.set(0, 1.34, 0.131 * (bustCm / 84));
        garmentGroup.add(innerCollarBorder);
      } else if (config.garmentModel === 'ao-giao-linh') {
        // Cổ áo giao vạt chéo chữ Y (hữu nhẫm)
        const leftCrossCollar = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.28, 0.02),
          trimMat
        );
        leftCrossCollar.rotation.z = -0.55;
        leftCrossCollar.position.set(-0.06, 1.34, 0.14 * (bustCm / 84));
        garmentGroup.add(leftCrossCollar);

        const rightCrossCollar = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.28, 0.02),
          trimMat
        );
        rightCrossCollar.rotation.z = 0.55;
        rightCrossCollar.position.set(0.06, 1.34, 0.14 * (bustCm / 84));
        garmentGroup.add(rightCrossCollar);
      } else if (config.garmentModel === 'ao-truc-linh') {
        // Nẹp cổ thẳng buông dọc hai bên ngực (đối khâm)
        const leftPlacket = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 0.55, 0.02),
          trimMat
        );
        leftPlacket.position.set(-0.05, 1.22, 0.14 * (bustCm / 84));
        garmentGroup.add(leftPlacket);

        const rightPlacket = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 0.55, 0.02),
          trimMat
        );
        rightPlacket.position.set(0.05, 1.22, 0.14 * (bustCm / 84));
        garmentGroup.add(rightPlacket);
      } else if (config.garmentModel === 'ao-ba-ba') {
        // Cổ tròn không bâu thanh nhã
        const roundCollar = new THREE.Mesh(
          new THREE.TorusGeometry(0.062, 0.007, 8, 24),
          trimMat
        );
        roundCollar.rotation.x = Math.PI / 2;
        roundCollar.position.set(0, 1.44, 0.03);
        garmentGroup.add(roundCollar);
      } else {
        // Cổ áo đứng cao thanh nhã (Áo dài, Áo ngũ thân, Áo tấc)
        const standingCollar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.058, 0.054, 24),
          trimMat
        );
        standingCollar.position.set(0, 1.48, 0);
        garmentGroup.add(standingCollar);
      }
    }

    // 5. NÓN LÁ & PHỤ KIỆN ĐẦU (HEADWEAR) - HIỂN THỊ RÕ RÀNG TRỰC TIẾP TRÊN ĐẦU
    // Luôn hiển thị khi headwear !== 'none' (kể cả khi layersVisible.headwear chưa được gán)
    const showHeadwear = config.headwear && config.headwear !== 'none' && config.layersVisible.headwear !== false;
    if (showHeadwear) {
      if (config.headwear === 'non-la') {
        // ------------------ NÓN LÁ TRUYỀN THỐNG VIỆT NAM ------------------
        const nonLaGroup = new THREE.Group();
        // Đặt nón lá ngay đỉnh đầu (y=1.78), nghiêng nhẹ về sau và sang bên duyên dáng
        nonLaGroup.position.set(0, 1.78, 0.01);
        nonLaGroup.rotation.x = -0.06; // Hơi ngửa nhẹ để khuôn mặt thanh tú rõ nét
        nonLaGroup.rotation.z = 0.03;

        // Chất liệu nan lá cọ vàng óng ấm áp đặc trưng Nón Lá Bài Thơ xứ Huế
        const hatStrawMat = new THREE.MeshStandardMaterial({
          color: '#E8D29F',
          roughness: 0.58,
          metalness: 0.08,
          side: THREE.DoubleSide,
        });

        // 1. Thân nón lá hình nón chóp nhọn rõ rệt
        const coneMesh = new THREE.Mesh(
          new THREE.ConeGeometry(0.35, 0.22, 40, 4, false),
          hatStrawMat
        );
        coneMesh.position.set(0, 0.11, 0);
        nonLaGroup.add(coneMesh);

        // 2. Vành nón cật nứa tròn bao quanh đáy
        const rimMesh = new THREE.Mesh(
          new THREE.TorusGeometry(0.352, 0.009, 12, 40),
          new THREE.MeshStandardMaterial({ color: '#A0763C', roughness: 0.45, metalness: 0.2 })
        );
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.set(0, 0.005, 0);
        nonLaGroup.add(rimMesh);

        // 3. Các vòng vành nứa đồng tâm trang trí trên nón (vành số 4, 8, 12)
        [0.05, 0.10, 0.15].forEach((hOffset, idx) => {
          const rRing = 0.35 * (1 - hOffset / 0.22);
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(rRing, 0.003, 8, 36),
            new THREE.MeshStandardMaterial({ color: '#C8A265', roughness: 0.6 })
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.set(0, hOffset, 0);
          nonLaGroup.add(ring);
        });

        // 4. Đỉnh chóp nón
        const tipMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.016, 14, 14),
          new THREE.MeshStandardMaterial({ color: '#8F6126', roughness: 0.4 })
        );
        tipMesh.position.set(0, 0.222, 0);
        nonLaGroup.add(tipMesh);

        // 5. Quai nón bằng lụa rủ xuống hai bên cằm áo (theo màu phụ kiện RGB hoặc hồng sen)
        const quaiColor = config.colors.accessory || '#E7A1B0';
        const quaiMat = new THREE.MeshStandardMaterial({
          color: quaiColor,
          roughness: 0.35,
          side: THREE.DoubleSide,
        });

        const leftQuai = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.34, 12), quaiMat);
        leftQuai.position.set(-0.13, -0.10, 0.03);
        leftQuai.rotation.z = -0.32;
        nonLaGroup.add(leftQuai);

        const rightQuai = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.34, 12), quaiMat);
        rightQuai.position.set(0.13, -0.10, 0.03);
        rightQuai.rotation.z = 0.32;
        nonLaGroup.add(rightQuai);

        garmentGroup.add(nonLaGroup);
      } else if (config.headwear === 'khan-van') {
        // ------------------ KHĂN VẤN CUNG ĐÌNH ------------------
        const turbanGroup = new THREE.Group();
        turbanGroup.position.set(0, 1.73, 0);
        const turbanMat = new THREE.MeshStandardMaterial({
          color: config.colors.accessory || '#B3261E',
          roughness: 0.35,
          metalness: 0.15,
        });
        const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.128, 0.038, 16, 32), turbanMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.12;
        turbanGroup.add(ringMesh);

        // Vành mạ vàng viền ngoài
        const goldBand = new THREE.Mesh(
          new THREE.TorusGeometry(0.144, 0.008, 12, 32),
          new THREE.MeshStandardMaterial({ color: '#DFB85C', roughness: 0.2, metalness: 0.8 })
        );
        goldBand.rotation.x = Math.PI / 2 + 0.12;
        turbanGroup.add(goldBand);

        garmentGroup.add(turbanGroup);
      } else if (config.headwear === 'non-quai-thao') {
        // ------------------ NÓN QUAI THAO KINH BẮC ------------------
        const thaoGroup = new THREE.Group();
        thaoGroup.position.set(0, 1.75, 0);
        const thaoMat = new THREE.MeshStandardMaterial({ color: '#E5D0A8', roughness: 0.6, side: THREE.DoubleSide });
        const flatDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.40, 0.03, 40), thaoMat);
        thaoGroup.add(flatDisc);

        const quaiMat = new THREE.MeshStandardMaterial({ color: '#B3261E', roughness: 0.4 });
        const strap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 12), quaiMat);
        strap1.position.set(-0.18, -0.18, 0);
        thaoGroup.add(strap1);

        const strap2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.42, 12), quaiMat);
        strap2.position.set(0.18, -0.18, 0);
        thaoGroup.add(strap2);

        garmentGroup.add(thaoGroup);
      } else if (config.headwear === 'khan-dong') {
        // ------------------ KHĂN ĐÓNG ------------------
        const dongMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.125, 0.07, 32),
          new THREE.MeshStandardMaterial({ color: config.colors.accessory || '#1F1D1B', roughness: 0.4 })
        );
        dongMesh.position.set(0, 1.72, 0);
        dongMesh.rotation.x = 0.08;
        garmentGroup.add(dongMesh);
      }
    }

    // 6. PHỤ KIỆN TAY (HAND ACCESSORY)
    if (config.layersVisible.handAccessory && config.handAccessory && config.handAccessory !== 'none') {
      if (config.handAccessory === 'quat-giay') {
        // Quạt giấy cầm tay
        const fanGroup = new THREE.Group();
        fanGroup.position.set(armOffsetX + 0.02, 0.96, 0.08);
        fanGroup.rotation.z = 0.4;

        const fanMat = new THREE.MeshStandardMaterial({
          color: config.colors.accessory || '#DFB85C',
          roughness: 0.4,
          side: THREE.DoubleSide,
        });
        const fanMesh = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16, 0, Math.PI * 0.75), fanMat);
        fanGroup.add(fanMesh);
        garmentGroup.add(fanGroup);
      } else {
        // Túi gấm / Túi tote
        const bagMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.12, 0.05),
          new THREE.MeshStandardMaterial({ color: config.colors.accessory || '#C9A24B' })
        );
        bagMesh.position.set(armOffsetX + 0.04, 0.88, 0.05);
        garmentGroup.add(bagMesh);
      }
    }

    // 7. GIÀY DÉP (FOOTWEAR)
    if (config.layersVisible.footwear && config.footwear) {
      const shoeColor = config.footwear === 'sneaker-trang' ? '#FFFFFF' : '#3E2513';
      const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.35 });

      const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.075 * limbThickness, 0.04, 0.14), shoeMat);
      leftShoe.position.set(-legOffsetX, 0.02, 0.03);
      garmentGroup.add(leftShoe);

      const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.075 * limbThickness, 0.04, 0.14), shoeMat);
      rightShoe.position.set(legOffsetX, 0.02, 0.03);
      garmentGroup.add(rightShoe);
    }

    // 8. ÁO KHOÁC HIỆN ĐẠI BLAZER (MODERN OUTER)
    if (config.modernOuter === 'blazer' && config.layersVisible.modernOuter) {
      const blazerMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.192 * bustScale, 0.178 * waistScale, 0.52, 28, 1, false, -Math.PI / 1.7, Math.PI * 1.18),
        new THREE.MeshStandardMaterial({ color: '#2B2B2B', roughness: 0.6 })
      );
      blazerMesh.position.set(0, 1.25, 0);
      garmentGroup.add(blazerMesh);
    }
  }, [config]);

  const handleZoom = (delta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, delta);
    controlsRef.current.update();
  };

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 1.35, 3.85);
    controlsRef.current.target.set(0, 1.02, 0);
    controlsRef.current.update();
  };

  return (
    <div className="emboss-card rounded-2xl p-3 sm:p-4 flex flex-col justify-between relative h-full min-h-[580px]">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#C9A24B]/35 z-20">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              autoRotate ? 'bg-[#B3261E] text-[#FDF7EE]' : 'emboss-btn text-[#5A3A22] dark:text-[#DEC5A4]'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Xoay 360°</span>
          </button>
          <button onClick={() => handleZoom(0.35)} className="emboss-btn p-1.5 rounded-lg cursor-pointer">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => handleZoom(-0.35)} className="emboss-btn p-1.5 rounded-lg cursor-pointer">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={resetCamera} className="emboss-btn p-1.5 rounded-lg cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Sun className="w-3.5 h-3.5 text-[#C9A24B] mr-1" />
          {(
            [
              { id: 'classic-gold', label: 'Vàng Cổ Điển' },
              { id: 'white-studio', label: 'Trắng Studio' },
              { id: 'sunset-glow', label: 'Hoàng Hôn' },
            ] as const
          ).map((l) => (
            <button
              key={l.id}
              onClick={() => setLightingMode(l.id)}
              className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer ${
                lightingMode === l.id ? 'bg-[#C9A24B] text-[#2D1B0E] font-semibold' : 'text-[#5A3A22] dark:text-[#DEC5A4]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 w-full min-h-[430px] rounded-xl overflow-hidden border border-[#C9A24B]/45 bg-gradient-to-b from-[#2A1B10] via-[#3D2818] to-[#1D120A] my-2.5">
        {webglSupported ? (
          <div ref={mountRef} className="w-full h-full min-h-[430px] cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="w-full h-full min-h-[430px] flex items-center justify-center text-white">
            WebGL đang tạm tắt
          </div>
        )}

        {comparisonOriginalImage && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#DFB85C]"
              style={{ width: `${splitPercent}%` }}
            >
              <img src={comparisonOriginalImage} alt="Ảnh đối chiếu" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-14 inset-x-6 pointer-events-auto bg-black/65 rounded-xl p-2.5 flex items-center gap-3 text-xs text-white">
              <SlidersHorizontal className="w-4 h-4 text-[#DFB85C]" />
              <span>So sánh Ảnh gốc ↔ 3D:</span>
              <input
                type="range"
                min={5}
                max={95}
                value={splitPercent}
                onChange={(e) => setSplitPercent(Number(e.target.value))}
                className="flex-1 accent-[#C9A24B]"
              />
              {onClearComparisonImage && (
                <button onClick={onClearComparisonImage} className="px-2 py-0.5 rounded bg-[#B3261E] text-white">
                  Đóng
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2.5 z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {MANNEQUIN_POSES.map((pose) => (
            <button
              key={pose.id}
              onClick={() => {
                soundEngine.playZitherPluck(3);
                onPoseChange(pose.id);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate cursor-pointer ${
                config.poseId === pose.id ? 'bg-[#B3261E] text-[#FDF7EE]' : 'emboss-btn text-[#5A3A22] dark:text-[#DEC5A4]'
              }`}
            >
              {pose.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
