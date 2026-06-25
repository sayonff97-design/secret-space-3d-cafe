// ===== 3D COFFEE CUP - CAFENA STYLE =====
(function initHero3D() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f0eb); // Cream background

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 5);
    camera.lookAt(0, 0.2, 0);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Lights (Soft & Warm) ---
    const ambient = new THREE.AmbientLight(0xfff5e6, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcce0ff, 0.5);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffddbb, 0.8);
    rimLight.position.set(-2, 1, -4);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xb8956a, 0.6);
    goldLight.position.set(1, 1.5, 3);
    scene.add(goldLight);

    // --- Ground Shadow (Invisible plane) ---
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.ShadowMaterial({
        opacity: 0.15,
        color: 0x000000
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Main Group ---
    const group = new THREE.Group();
    scene.add(group);

    // ============================================================
    // 1. COFFEE CUP (Realistic)
    // ============================================================
    const cupGroup = new THREE.Group();

    // Cup outer body (slightly tapered, glossy)
    const cupGeo = new THREE.CylinderGeometry(0.85, 0.6, 1.3, 48, 1, true);
    const cupMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5f0eb,
        metalness: 0.05,
        roughness: 0.15,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.6,
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.y = 0.1;
    cup.castShadow = true;
    cup.receiveShadow = true;
    cupGroup.add(cup);

    // Cup inner (coffee color)
    const innerGeo = new THREE.CylinderGeometry(0.75, 0.55, 1.25, 48);
    const innerMat = new THREE.MeshPhysicalMaterial({
        color: 0x3a2a1a,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.BackSide,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.1;
    cupGroup.add(inner);

    // Coffee surface (top)
    const coffeeGeo = new THREE.CircleGeometry(0.72, 48);
    const coffeeMat = new THREE.MeshPhysicalMaterial({
        color: 0x2a1a0a,
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide,
    });
    const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.75;
    cupGroup.add(coffee);

    // Cup bottom
    const bottomGeo = new THREE.CircleGeometry(0.6, 48);
    const bottomMat = new THREE.MeshPhysicalMaterial({
        color: 0xe8e0d8,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
    });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.55;
    cupGroup.add(bottom);

    // Handle (smooth curve)
    const handlePoints = [
        new THREE.Vector3(0.85, 0.0, 0),
        new THREE.Vector3(1.2, 0.1, 0),
        new THREE.Vector3(1.3, 0.3, 0),
        new THREE.Vector3(1.3, 0.5, 0),
        new THREE.Vector3(1.2, 0.6, 0),
        new THREE.Vector3(0.85, 0.6, 0),
    ];
    const handleCurve = new THREE.CatmullRomCurve3(handlePoints);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.06, 8, false);
    const handleMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5f0eb,
        metalness: 0.05,
        roughness: 0.2,
        clearcoat: 0.2,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0, 0);
    handle.castShadow = true;
    cupGroup.add(handle);

    // --- Cup Base / Saucer ---
    const saucerGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.12, 48);
    const saucerMat = new THREE.MeshPhysicalMaterial({
        color: 0xf0ece6,
        metalness: 0.05,
        roughness: 0.2,
        clearcoat: 0.1,
    });
    const saucer = new THREE.Mesh(saucerGeo, saucerMat);
    saucer.position.y = -0.6;
    saucer.receiveShadow = true;
    saucer.castShadow = true;
    cupGroup.add(saucer);

    cupGroup.position.y = 0.1;
    group.add(cupGroup);

    // ============================================================
    // 2. FLOATING PARTICLES (Steam & Magic Dust)
    // ============================================================
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    const velArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);
    const rotArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const radius = 0.2 + Math.random() * 0.9;
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * 1.8 + 0.2;
        posArray[i*3] = Math.cos(angle) * radius * 0.5;
        posArray[i*3+1] = height + 0.4;
        posArray[i*3+2] = Math.sin(angle) * radius * 0.5;
        velArray[i*3] = (Math.random() - 0.5) * 0.005;
        velArray[i*3+1] = 0.005 + Math.random() * 0.01;
        velArray[i*3+2] = (Math.random() - 0.5) * 0.005;
        sizeArray[i] = 0.02 + Math.random() * 0.06;
        rotArray[i] = Math.random() * Math.PI * 2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particleMat = new THREE.PointsMaterial({
        color: 0xb8956a,
        size: 0.04,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.y = 0.3;
    group.add(particles);

    // ============================================================
    // 3. ORBITING RING
    // ============================================================
    const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8956a,
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
        emissive: 0xb8956a,
        emissiveIntensity: 0.05,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.025, 16, 64), ringMat);
    ring.rotation.x = Math.PI / 2.5;
    ring.position.y = 0.1;
    group.add(ring);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.015, 16, 64), ringMat);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 3;
    ring2.position.y = 0.1;
    group.add(ring2);

    // ============================================================
    // 4. MOUSE INTERACTION
    // ============================================================
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotX = mouseY * 0.15;
        targetRotY = mouseX * 0.3;
    });

    // Touch support for mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
            targetRotX = mouseY * 0.15;
            targetRotY = mouseX * 0.3;
        }
    }, { passive: true });

    // ============================================================
    // 5. RESIZE HANDLER
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

        // --- Rotate group based on mouse ---
        const rotY = group.rotation.y;
        const rotX = group.rotation.x;
        group.rotation.y += (targetRotY - rotY) * 0.04;
        group.rotation.x += (targetRotX - rotX) * 0.04;

        // --- Slow auto-rotation when idle ---
        if (Math.abs(mouseX) < 0.05 && Math.abs(mouseY) < 0.05) {
            group.rotation.y += 0.002;
        }

        // --- Float the cup ---
        cupGroup.position.y = 0.1 + Math.sin(time * 0.6) * 0.04;
        cupGroup.rotation.z = Math.sin(time * 0.4) * 0.008;

        // --- Animate particles (steam rising) ---
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i*3+1] += velArray[i*3+1];
            positions[i*3] += Math.sin(time + i) * 0.002;
            positions[i*3+2] += Math.cos(time * 0.7 + i) * 0.002;

            // Reset if too high
            if (positions[i*3+1] > 2.6) {
                const radius = 0.2 + Math.random() * 0.9;
                const angle = Math.random() * Math.PI * 2;
                positions[i*3] = Math.cos(angle) * radius * 0.5;
                positions[i*3+1] = 0.3 + Math.random() * 0.2;
                positions[i*3+2] = Math.sin(angle) * radius * 0.5;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // --- Rotate rings ---
        ring.rotation.z += 0.004;
        ring2.rotation.y += 0.006;
        ring2.rotation.x += 0.003;

        // --- Update camera for slight parallax ---
        const camTargetX = mouseX * 0.2;
        const camTargetY = mouseY * 0.1 + 1.2;
        camera.position.x += (camTargetX - camera.position.x) * 0.02;
        camera.position.y += (camTargetY - camera.position.y) * 0.02;
        camera.lookAt(0, 0.2, 0);

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize observer for container ---
    const resizeObserver = new ResizeObserver(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

})();
