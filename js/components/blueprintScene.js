/**
 * Componente: escena 3D "blueprint industrial" (Three.js), migrada de code.html.
 * Reemplaza el fondo animado de velas del hero de Home.
 * Carga Three.js bajo demanda (solo cuando se monta esta vista) y expone
 * mountBlueprintScene(container) -> Promise<unmountFn>, ya que la carga
 * del script es asíncrona.
 */

let threeLoadPromise = null;

function loadThree() {
    if (window.THREE) return Promise.resolve();
    if (threeLoadPromise) return threeLoadPromise;

    threeLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://ajax.googleapis.com/ajax/libs/threejs/r125/three.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar three.js'));
        document.head.appendChild(script);
    });

    return threeLoadPromise;
}

export async function mountBlueprintScene(container) {
    await loadThree();

    // La vista pudo desmontarse mientras three.js cargaba.
    if (!container || !container.isConnected) return () => {};

    const THREE = window.THREE;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(30, 30, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const blueprintGroup = new THREE.Group();
    scene.add(blueprintGroup);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xbc1515, transparent: true, opacity: 0.6 });
    const structureMaterial = new THREE.MeshPhongMaterial({
        color: 0x999999,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    function createIndustrialPiece(x, y, z, w, h, d, delay) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, structureMaterial);
        mesh.position.set(x, y + h / 2, z);
        mesh.scale.set(0.01, 0.01, 0.01);
        blueprintGroup.add(mesh);

        const edges = new THREE.EdgesGeometry(geo);
        const line = new THREE.LineSegments(edges, lineMaterial);
        line.position.copy(mesh.position);
        line.scale.set(0.01, 0.01, 0.01);
        blueprintGroup.add(line);

        return { mesh, line, targetScale: 1, delay, currentScale: 0 };
    }

    const structures = [];
    const COLS = 25;
    const ROWS = 25;
    const X_SPACING = 5; // cuadrícula cuadrada: mismo espaciado en ambos ejes
    const Z_SPACING = 5;
    const xOffset = ((COLS - 1) * X_SPACING) / 2;
    const zOffset = ((ROWS - 1) * Z_SPACING) / 2;

    for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
            if (Math.random() > 0.6) {
                const h = Math.random() * 5 + 2;
                structures.push(createIndustrialPiece(i * X_SPACING - xOffset, 0, j * Z_SPACING - zOffset, 2, h, 2, Math.random() * 2));
            }
        }
    }

    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, (COLS - 1) * X_SPACING + 8, 8);
    const pipe = new THREE.Mesh(pipeGeo, structureMaterial);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.y = 2;
    blueprintGroup.add(pipe);

    let time = 0;
    let rafId = null;
    let running = true;

    function animate() {
        if (!running) return;
        rafId = requestAnimationFrame(animate);
        time += 0.01;

        structures.forEach((s) => {
            if (time > s.delay) {
                s.currentScale = Math.min(s.targetScale, s.currentScale + 0.02);
                s.mesh.scale.set(s.currentScale, s.currentScale, s.currentScale);
                s.line.scale.set(s.currentScale, s.currentScale, s.currentScale);
            }
        });

        blueprintGroup.rotation.y += 0.0006;
        renderer.render(scene, camera);
    }

    // ResizeObserver en vez de solo 'resize' de window: se autocorrige si la
    // primera medición del contenedor ocurrió antes de que el layout estuviera listo.
    const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    animate();

    return () => {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        resizeObserver.disconnect();

        blueprintGroup.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
        }
    };
}
