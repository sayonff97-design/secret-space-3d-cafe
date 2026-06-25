// ===== 3D COFFEE CUP - CAFENA PREMIUM STYLE (SIDE VIEW) =====
(function initHero3D() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f0eb); // Cream background

    // --- Camera (Side view, closer) ---
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3.5, 1.2, 3.5); // Side angle
    camera.lookAt(-0.3, 0.1, 0);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Lights (Soft & Premium) ---
    const ambient = new THREE.AmbientLight(0xfff5e6, 0.7);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    keyLight.position.set(4, 6, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.6);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffddbb, 0.8);
    rimLight.position.set(-2, 1, -5);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xb8956a, 0.5);
    goldLight.position.set(1, 1.5, 3);
    scene.add(goldLight);

    // --- Ground Shadow ---
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundMat = new THREE.ShadowMaterial({
        opacity: 0.12,
        color: 0x000000
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Main Group (slightly shifted) ---
    const group = new THREE.Group();
    group.position.x = -0.5;
    scene.add(group);

    // ============================================================
    // 1. COFFEE CUP (Smaller, Premium, with Saucer)
    // ============================================================
    const cupGroup = new THREE.Group();

    // --- Saucer (Plate) ---
    const saucerGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.08, 48);
    const saucerMat = new THREE.MeshPhysicalMaterial({
        color: 0xf0ece6,
        metalness: 0.05,
        roughness: 0.15,
        clearcoat: 0.2,
        clearcoatRoughness: 0.2,
    });
    const saucer = new THREE.Mesh(saucerGeo, saucerMat);
    saucer.position.y = -0.35;
    saucer.receiveShadow = true;
    saucer.castShadow = true;
    cupGroup.add(saucer);

    // Saucer rim detail
    const rimGeo = new THREE.TorusGeometry(0.95, 0.02, 16, 48);
    const rimMat = new THREE.MeshPhysicalMaterial({
        color: 0xd4c8b8,
        metalness: 0.1,
        roughness: 0.2,
    });
    const rimRing = new THREE.Mesh(rimGeo, rimMat);
    rimRing.position.y = -0.31;
    rimRing.rotation.x = Math.PI / 2;
    cupGroup.add(rimRing);

    // --- Cup body (tapered, glossy) ---
    const cupGeo = new THREE.CylinderGeometry(0.55, 0.4, 0.85, 48, 1, true);
    const cupMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5f0eb,
        metalness: 0.02,
        roughness: 0.12,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
        envMapIntensity: 0.6,
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.y = 0.05;
    cup.castShadow = true;
    cup.receiveShadow = true;
    cupGroup.add(cup);

    // --- Cup inner (coffee color) ---
    const innerGeo = new THREE.CylinderGeometry(0.48, 0.36, 0.80, 48);
    const innerMat = new THREE.MeshPhysicalMaterial({
        color: 0x3a2a1a,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.BackSide,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.05;
    cupGroup.add(inner);

    // --- Coffee surface ---
    const coffeeGeo = new THREE.CircleGeometry(0.46, 48);
    const coffeeMat = new THREE.MeshPhysicalMaterial({
        color: 0x2a1a0a,
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide,
    });
    const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.47;
    cupGroup.add(coffee);

    // --- Cup bottom ---
    const bottomGeo = new THREE.CircleGeometry(0.4, 48);
    const bottomMat = new THREE.MeshPhysicalMaterial({
        color: 0xe8e0d8,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
    });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.38;
    cupGroup.add(bottom);

    // --- Handle (elegant curve) ---
    const handlePoints = [
        new THREE.Vector3(0.55, -0.05, 0),
        new THREE.Vector3(0.85, 0.0, 0),
        new THREE.Vector3(0.95, 0.12, 0),
        new THREE.Vector3(0.95, 0.28, 0),
        new THREE.Vector3(0.85, 0.38, 0),
        new THREE.Vector3(0.55, 0.38, 0),
    ];
    const handleCurve = new THREE.CatmullRomCurve3(handlePoints);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.045, 8, false);
    const handleMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5f0eb,
        metalness: 0.02,
        roughness: 0.15,
        clearcoat: 0.2,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0, 0);
    handle.castShadow = true;
    cupGroup.add(handle);

    // --- Gold accent ring on cup ---
    const goldRingGeo = new THREE.TorusGeometry(0.48, 0.015, 16, 48);
    const goldRingMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8956a,
        metalness: 0.6,
        roughness: 0.2,
        emissive: 0xb8956a,
        emissiveIntensity: 0.05,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.position.y = 0.4;
    goldRing.rotation.x = Math.PI / 2;
    cupGroup.add(goldRing);

    const goldRing2 = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing2.position.y = -0.2;
    goldRing2.rotation.x = Math.PI / 2;
    goldRing2.scale.set(0.9, 0.9, 0.9);
    cupGroup.add(goldRing2);

    cupGroup.position.y = 0.1;
    group.add(cupGroup);

    // ============================================================
    // 2. FLOATING PARTICLES (Premium Gold Dust)
    // ============================================================
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const radius = 0.4 + Math.random() * 1.6;
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * 2.0 + 0.2;
        posArray[i*3] = Math.cos(angle) * radius * 0.4 - 0.3;
        posArray[i*3+1] = height + 0.2;
        posArray[i*3+2] = Math.sin(angle) * radius * 0.4;
        sizeArray[i] = 0.015 + Math.random() * 0.04;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particleMat = new THREE.PointsMaterial({
        color: 0xb8956a,
        size: 0.035,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.y = 0.3;
    group.add(particles);

    // ============================================================
    // 3. ORBITING RING (Premium Gold)
    // ============================================================
    const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8956a,
        metalness: 0.5,
        roughness: 0.2,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        emissive: 0xb8956a,
        emissiveIntensity: 0.05,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.02, 16, 64), ringMat);
    ring.rotation.x = Math.PI / 2.5;
    ring.position.y = 0.1;
    group.add(ring);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.012, 16, 64), ringMat);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 3;
    ring2.position.y = 0.1;
    group.add(ring2);

    // ============================================================
    // 4. MOUSE & TOUCH INTERACTION
    // ============================================================
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotX = mouseY * 0.08;
        targetRotY = mouseX * 0.2;
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
            targetRotX = mouseY * 0.08;
            targetRotY = mouseX * 0.2;
        }
    }, { passive: true });

    // ============================================================
    // 5. RESIZE
    // ============================================================
    window.addEventListener('resize', () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // ============================================================
    // 6. ANIMATION LOOP
    // ============================================================
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // --- Smooth rotation ---
        group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.04;

        // --- Idle auto-rotation ---
        if (Math.abs(mouseX) < 0.05 && Math.abs(mouseY) < 0.05) {
            group.rotation.y += 0.002;
        }

        // --- Float the cup ---
        cupGroup.position.y = 0.1 + Math.sin(time * 0.5) * 0.03;
        cupGroup.rotation.z = Math.sin(time * 0.3) * 0.005;

        // --- Animate particles ---
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i*3+1] += 0.004 + Math.sin(time + i) * 0.001;
            positions[i*3] += Math.sin(time * 0.5 + i * 0.1) * 0.001;
            positions[i*3+2] += Math.cos(time * 0.6 + i * 0.1) * 0.001;

            if (positions[i*3+1] > 2.4) {
                const radius = 0.4 + Math.random() * 1.6;
                const angle = Math.random() * Math.PI * 2;
                positions[i*3] = Math.cos(angle) * radius * 0.4 - 0.3;
                positions[i*3+1] = 0.1 + Math.random() * 0.2;
                positions[i*3+2] = Math.sin(angle) * radius * 0.4;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // --- Rotate rings ---
        ring.rotation.z += 0.003;
        ring2.rotation.y += 0.005;
        ring2.rotation.x += 0.002;

        // --- Camera slight parallax ---
        camera.position.x += ((mouseX * 0.15) + 3.5 - camera.position.x) * 0.015;
        camera.position.y += ((mouseY * 0.08) + 1.2 - camera.position.y) * 0.015;
        camera.lookAt(-0.3, 0.1, 0);

        renderer.render(scene, camera);
    }

    animate();

    const resizeObserver = new ResizeObserver(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

})();
