// ===== 3D THREE.JS ANIMATION =====
(function initHero3D() {
    const container = document.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f6f3);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    mainLight.position.set(3, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const goldLight = new THREE.PointLight(0xb8956a, 0.5);
    goldLight.position.set(2, 1, 4);
    scene.add(goldLight);

    // Main Group
    const group = new THREE.Group();
    scene.add(group);

    // Simple Coffee Cup
    const cupGroup = new THREE.Group();

    // Cup body
    const cupGeo = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 32, 1, true);
    const cupMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8956a,
        metalness: 0.2,
        roughness: 0.3,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.y = 0.2;
    cup.castShadow = true;
    cupGroup.add(cup);

    // Cup bottom
    const bottomGeo = new THREE.CircleGeometry(0.6, 32);
    const bottomMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8956a,
        metalness: 0.3,
        roughness: 0.3,
        side: THREE.DoubleSide
    });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.4;
    cupGroup.add(bottom);

    // Cup top (coffee)
    const topGeo = new THREE.CircleGeometry(0.7, 32);
    const topMat = new THREE.MeshPhysicalMaterial({
        color: 0x3a2a1a,
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    const top = new THREE.Mesh(topGeo, topMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = 0.79;
    cupGroup.add(top);

    // Handle
    const handleShape = new THREE.Shape();
    handleShape.moveTo(0.8, 0.1);
    handleShape.quadraticCurveTo(1.2, 0.1, 1.2, 0.4);
    handleShape.quadraticCurveTo(1.2, 0.7, 0.8, 0.7);
    const handleGeo = new THREE.ShapeGeometry(handleShape);
    const handleMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8956a,
        metalness: 0.2,
        roughness: 0.3,
        side: THREE.DoubleSide
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0.1, 0);
    cupGroup.add(handle);

    cupGroup.position.y = -0.2;
    group.add(cupGroup);

    // Particles (simple floating)
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 4;
        posArray[i*3+1] = Math.random() * 2.5;
        posArray[i*3+2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0xb8956a,
        size: 0.03,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.y = 0.2;
    group.add(particles);

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        group.rotation.y += 0.003;
        group.rotation.x = Math.sin(time * 0.1) * 0.03;

        cupGroup.position.y = -0.2 + Math.sin(time * 0.5) * 0.05;

        // Animate particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i*3+1] += 0.001;
            if (positions[i*3+1] > 2.5) {
                positions[i*3+1] = 0.5;
                positions[i*3] = (Math.random() - 0.5) * 4;
                positions[i*3+2] = (Math.random() - 0.5) * 4;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Camera follow
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 0.2 + 1.5 - camera.position.y) * 0.01;
        camera.lookAt(0, 0.2, 0);

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

// ===== RESERVATION FORM =====
document.getElementById('reservationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ Thank you! Your table has been reserved. We will contact you shortly.');
    this.reset();
});

console.log('☕ The Secret Space – Professional Website Loaded!');
