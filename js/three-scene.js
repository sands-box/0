// js/three-scene.js

const threeScene = (() => {
    // Variabel privat di dalam modul
    let scene, camera, renderer, drone, controls;
    let activeTimelines = [];
    let animationFrameId = null;

    function init3DMap(container, equations) {
        stopAnimation();
        container.innerHTML = '';

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width === 0 || height === 0) {
            console.error("Three.js container has no size! Cannot initialize.");
            return;
        }

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1e23);
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 20, 25);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
        
        if (typeof THREE.OrbitControls === 'function') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.minDistance = 5;
            controls.maxDistance = 100;
            controls.maxPolarAngle = Math.PI / 2 - 0.05;
        } else {
            console.error("OrbitControls not found. Make sure it's loaded in index.html");
        }
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 15);
        scene.add(directionalLight);

        createCity();
        createDrone();

        equations.forEach((eq, index) => {
            const color = index === 0 ? 0xff5722 : 0x03a9f4;
            animateDronePath(eq, color, index * 5);
        });
        
        animate();
    }

    function stopAnimation() {
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        activeTimelines.forEach(tl => tl.kill());
        activeTimelines = [];
        if (renderer) {
            renderer.dispose();
            if(renderer.domElement && renderer.domElement.parentElement) {
                renderer.domElement.parentElement.removeChild(renderer.domElement);
            }
            renderer = null;
        }
    }

    // =========================================================
    //         FUNGSI-FUNGSI YANG HILANG SEBELUMNYA
    // =========================================================
    function createCity() {
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x444444);
        scene.add(gridHelper);
        
        const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
        for (let i = 0; i < 60; i++) {
            const buildingMat = new THREE.MeshLambertMaterial({ color: Math.random() * 0x333333 + 0x222222 });
            const building = new THREE.Mesh(buildingGeo, buildingMat);
            
            building.position.x = Math.random() * 48 - 24;
            building.position.z = Math.random() * 48 - 24;
            building.scale.x = Math.random() * 2 + 1;
            building.scale.z = Math.random() * 2 + 1;
            building.scale.y = Math.random() * 8 + 2;
            building.position.y = building.scale.y / 2;
            
            scene.add(building);
        }
    }

    function createDrone() {
        drone = new THREE.Group();
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 1), bodyMat);
        drone.add(body);
        
        const light = new THREE.PointLight(0xffc107, 2, 10);
        light.position.y = -0.2;
        drone.add(light);
        
        scene.add(drone);
    }

    function animateDronePath(eq, color, delay) {
        const lineData = parseEquation(eq);
        if (!lineData) return;

        const mapSize = 25;
        let start, end;

        if (lineData.type === 'linear') { start = { x: -mapSize, z: lineData.func(-mapSize) }; end = { x: mapSize, z: lineData.func(mapSize) }; }
        else if (lineData.type === 'vertical') { start = { x: lineData.val, z: -mapSize }; end = { x: lineData.val, z: mapSize }; }
        else { start = { x: -mapSize, z: lineData.val }; end = { x: mapSize, z: lineData.val }; }

        const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
        start.z = clamp(start.z, -mapSize, mapSize);
        end.z = clamp(end.z, -mapSize, mapSize);

        drone.position.set(start.x, 5, start.z);
        
        const laserPoints = [new THREE.Vector3(start.x, 0.1, start.z)];
        const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
        const laserMat = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        const laserLine = new THREE.Line(laserGeo, laserMat);
        scene.add(laserLine);

        const tl = gsap.timeline();
        tl.to(drone.position, {
            x: end.x, z: end.z, duration: 4, delay: delay, ease: "none",
            onUpdate: () => {
                const currentPoints = Array.from(laserLine.geometry.attributes.position.array);
                currentPoints.push(drone.position.x, 0.1, drone.position.z);
                laserLine.geometry.setAttribute('position', new THREE.Float32BufferAttribute(currentPoints, 3));
            }
        });
        activeTimelines.push(tl);
    }
    // =========================================================
    //                  AKHIR FUNGSI YANG HILANG
    // =========================================================

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        if (renderer && controls) {
            controls.update();
            renderer.render(scene, camera);
        }
    }

    return {
        init3DMap,
        stopAnimation,
    };
})();