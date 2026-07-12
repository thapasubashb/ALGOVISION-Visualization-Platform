import { useEffect, useRef } from "react";
import * as THREE from "three";

function NodeGraphBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- scatter nodes evenly across a sphere (fibonacci sphere) ---
    const NODE_COUNT = 34;
    const nodePositions = [];
    const group = new THREE.Group();

    const nodeGeometry = new THREE.SphereGeometry(0.09, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x60a5fa });

    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const pos = new THREE.Vector3(x, y, z).multiplyScalar(6);
      nodePositions.push(pos);

      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
      sphere.position.copy(pos);
      group.add(sphere);
    }

    // --- connect each node to its 2 closest neighbors ---
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.5,
    });
    const drawnPairs = new Set();

    nodePositions.forEach((pos, i) => {
      const closest = nodePositions
        .map((p, j) => ({ j, dist: pos.distanceTo(p) }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2);

      closest.forEach(({ j }) => {
        const key = [i, j].sort().join("-");
        if (drawnPairs.has(key)) return;
        drawnPairs.add(key);

        const geometry = new THREE.BufferGeometry().setFromPoints([
          pos,
          nodePositions[j],
        ]);
        group.add(new THREE.Line(geometry, lineMaterial));
      });
    });

    scene.add(group);

    // --- animate: slow continuous rotation, like a globe turning ---
    let frameId;
    function animate() {
      group.rotation.y += 0.0015;
      group.rotation.x += 0.0004;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    window.addEventListener("resize", handleResize);

    // --- cleanup: undo everything when this leaves the screen ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
    />
  );
}

export default NodeGraphBackground;
