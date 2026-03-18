// Three.js Scene Setup
let scene, camera, renderer;
let geometries = [];

function initThreeJS() {
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);

    // Camera
    const width = window.innerWidth;
    
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const canvas = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x16c784, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00d4aa, 0.8);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Create 3D Objects
    createObjects();
    createParticles();

    // Animation Loop
    animate();

    // Handle Resize
    window.addEventListener('resize', onWindowResize);

    // Mouse Movement
    document.addEventListener('mousemove', onMouseMove);
}

function createObjects() {
    // Cube
    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x16c784,
        emissive: 0x16c784,
        emissiveIntensity: 0.3
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-8, 0, 0);
    scene.add(cube);
    geometries.push({ mesh: cube, speed: 0.01 });

    // Sphere
    const sphereGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00d4aa,
        emissive: 0x00d4aa,
        emissiveIntensity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(8, 0, 0);
    scene.add(sphere);
    geometries.push({ mesh: sphere, speed: 0.015 });

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(2, 4);
    const icoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xfbbf24,
        emissive: 0xfbbf24,
        emissiveIntensity: 0.2
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(0, 8, -5);
    scene.add(icosahedron);
    geometries.push({ mesh: icosahedron, speed: 0.012 });

    // Torus
    const torusGeometry = new THREE.TorusGeometry(3, 0.8, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x16c784,
        emissive: 0x16c784,
        emissiveIntensity: 0.25
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, -8, 0);
    torus.rotation.x = Math.PI / 4;
    scene.add(torus);
    geometries.push({ mesh: torus, speed: 0.008 });
}

function createParticles() {
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positionArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positionArray[i] = (Math.random() - 0.5) * 100;
        positionArray[i + 1] = (Math.random() - 0.5) * 100;
        positionArray[i + 2] = (Math.random() - 0.5) * 100;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0x16c784,
        emissive: 0x16c784,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    geometries.push({ mesh: particleSystem, speed: 0.002, isParticle: true });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate and animate objects
    geometries.forEach((obj, index) => {
        obj.mesh.rotation.x += obj.speed;
        obj.mesh.rotation.y += obj.speed * 0.7;

        // Orbital motion for some objects
        if (index < 3) {
            const time = Date.now() * 0.001;
            obj.mesh.position.x += Math.sin(time * 0.5) * 0.01;
            obj.mesh.position.y += Math.cos(time * 0.3) * 0.01;
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function onMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Smooth camera movement following mouse
    camera.position.x += (x * 10 - camera.position.x) * 0.05;
    camera.position.y += (y * 10 - camera.position.y) * 0.05;
    
    camera.lookAt(scene.position);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initThreeJS);
