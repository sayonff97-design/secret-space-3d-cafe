// ===== 3D THREE.JS ANIMATION =====
(function initThree() {
    const container = document.getElementById('three-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0e0e);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ===== LIGHTS =====
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0xd4a859, 0.5);
    backLight.position.set(-3, 1, 5);
    scene.add(backLight);

    const goldLight = new THREE.PointLight(0xd4a859, 0.8);
    goldLight.position.set(2, 3, 4);
    scene.add(goldLight);

    // ===== MAIN 3D GROUP =====
    const group = new THREE.Group();
    scene.add(group);

    // ===== CENTRAL CUBE WITH GOLD EDGES =====
    const cubeMat = new THREE.MeshStandardMaterial({
        color: 0xd4a859,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x0f0e0e,
        emissiveIntensity: 0.1
    });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), cubeMat);
    cube.castShadow = true;
    group.add(cube);

    // Glowing edges
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 1.2, 1.2));
    const lineMat = new THREE.LineBasicMaterial({ color: 0xd4a859 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    group.add(wireframe);

    // ===== FLOATING PARTICLES (STARS) =====
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 16;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xd4a859,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ===== ROTATING RINGS =====
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0xd4a859,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.25,
        wireframe: true
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.04, 16, 32), ringMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.03, 16, 32), ringMat);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 4;
    group.add(ring2);

    // ===== SMALL FLOATING SPHERES =====
    const smallSpheres = [];
    for (let i = 0; i < 8; i++) {
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0xd4a859,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xd4a859,
            emissiveIntensity: 0.1
        });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), sphereMat);
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.6;
        sphere.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.6, Math.sin(angle) * radius * 0.4);
        group.add(sphere);
        smallSpheres.push({ mesh: sphere, angle: angle, radius: radius, speed: 0.5 + Math.random() * 0.3 });
    }

    // ===== MOUSE INTERACTION =====
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ===== RESIZE HANDLER =====
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ===== ANIMATION LOOP =====
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Rotate main group
        group.rotation.x = Math.sin(time * 0.2) * 0.1;
        group.rotation.y += 0.008;
        group.rotation.z = Math.sin(time * 0.15) * 0.05;

        // Ring rotations
        ring1.rotation.z += 0.005;
        ring2.rotation.y += 0.007;

        // Float spheres
        smallSpheres.forEach((s, i) => {
            s.mesh.position.x = Math.cos(time * s.speed + s.angle) * s.radius;
            s.mesh.position.z = Math.sin(time * s.speed + s.angle) * s.radius * 0.4;
            s.mesh.position.y = Math.sin(time * 0.5 + i) * 0.3;
        });

        // Particle rotation
        particles.rotation.y += 0.0005;

        // Camera follow mouse (gentle)
        camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.4 + 1.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();
})();

// ===== MOBILE MENU =====
document.getElementById('hamburger')?.addEventListener('click', function() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
    const icon = this.querySelector('i');
    icon.className = menu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navMenu').classList.remove('active');
        const icon = document.querySelector('#hamburger i');
        if (icon) icon.className = 'fas fa-bars';
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== RESERVATION FORM (Demo) =====
document.getElementById('reservationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ Thank you! Your table has been reserved. We will contact you shortly.');
    this.reset();
});

console.log('🚀 The Secret Space 3D website loaded successfully!');
