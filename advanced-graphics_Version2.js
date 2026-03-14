// Advanced Three.js Graphics Engine
let scene, camera, renderer;
let particles = [];
let geometries = [];
let mouse = { x: 0, y: 0 };
let raycaster = new THREE.Raycaster();
let universe = {};

class AdvancedGraphicsEngine {
    constructor() {
        this.initScene();
        this.createUniverse();
        this.createAdvancedParticles();
        this.setupLighting();
        this.animate();
    }

    initScene() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e27);
        scene.fog = new THREE.Fog(0x0a0e27, 100, 150);

        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 50;

        const canvas = document.getElementById('canvas');
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    createUniverse() {
        // Central Sun
        const sunGeometry = new THREE.IcosahedronGeometry(3, 6);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            emissive: 0xfbbf24,
            emissiveIntensity: 0.8,
            metalness: 0.3,
            roughness: 0.4
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.castShadow = true;
        sun.receiveShadow = true;
        scene.add(sun);

        // Orbiting Planets
        const planets = [
            { size: 1.2, color: 0x667eea, distance: 20, speed: 0.001, orbitSpeed: 0.0005 },
            { size: 1.5, color: 0xf093fb, distance: 30, speed: 0.0015, orbitSpeed: 0.0003 },
            { size: 0.8, color: 0x00d4aa, distance: 40, speed: 0.008, orbitSpeed: 0.0002 },
            { size: 1.3, color: 0x43e97b, distance: 50, speed: 0.012, orbitSpeed: 0.0001 }
        ];

        planets.forEach((planet, index) => {
            const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: planet.color,
                emissive: planet.color,
                emissiveIntensity: 0.2,
                metalness: 0.4,
                roughness: 0.6
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            scene.add(mesh);
            geometries.push({
                mesh,
                speed: planet.speed,
                orbitSpeed: planet.orbitSpeed,
                distance: planet.distance,
                angle: Math.random() * Math.PI * 2,
                type: 'planet'
            });

            // Planet Ring
            if (index % 2 === 0) {
                const ringGeometry = new THREE.TorusGeometry(planet.size + 1, 0.3, 16, 100);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    color: planet.color,
                    emissive: planet.color,
                    emissiveIntensity: 0.1,
                    metalness: 0.5,
                    roughness: 0.8
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.receiveShadow = true;
                mesh.add(ring);
            }
        });

        // Asteroid Belt
        const asteroidCount = 100;
        const asteroidGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            metalness: 0.6,
            roughness: 0.8
        });

        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            const angle = (i / asteroidCount) * Math.PI * 2;
            const radius = 60 + Math.random() * 10;
            asteroid.position.x = Math.cos(angle) * radius;
            asteroid.position.z = Math.sin(angle) * radius;
            asteroid.position.y = (Math.random() - 0.5) * 5;
            asteroid.rotation.set(Math.random(), Math.random(), Math.random());
            scene.add(asteroid);

            geometries.push({
                mesh: asteroid,
                speed: Math.random() * 0.01,
                type: 'asteroid'
            });
        }
    }

    createAdvancedParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;

            // Color variation
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        geometries.push({
            mesh: particleSystem,
            speed: 0.0001,
            type: 'particle',
            geometry
        });
    }

    setupLighting() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Main Sun Light
        const sunLight = new THREE.PointLight(0xfbbf24, 2, 200);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);

        // Secondary Lights
        const light1 = new THREE.PointLight(0x16c784, 1, 150);
        light1.position.set(50, 30, 50);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x00d4aa, 0.8, 150);
        light2.position.set(-50, -30, 50);
        scene.add(light2);

        // Directional Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update geometries
        geometries.forEach((obj) => {
            if (obj.type === 'planet') {
                obj.angle += obj.orbitSpeed;
                obj.mesh.position.x = Math.cos(obj.angle) * obj.distance;
                obj.mesh.position.z = Math.sin(obj.angle) * obj.distance;
                obj.mesh.rotation.y += obj.speed;
                obj.mesh.rotation.x += obj.speed * 0.5;
            } else if (obj.type === 'asteroid') {
                obj.mesh.rotation.x += obj.speed;
                obj.mesh.rotation.y += obj.speed;
                obj.mesh.rotation.z += obj.speed;
            } else if (obj.type === 'particle') {
                obj.mesh.rotation.z += obj.speed;
            }
        });

        // Camera movement with mouse
        camera.position.x += (mouse.x * 50 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 30 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}

// Initialize Graphics Engine
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedGraphicsEngine();
    document.getElementById('loading-screen').style.display = 'none';
});