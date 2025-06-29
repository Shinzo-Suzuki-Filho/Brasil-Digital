// Loading Screen
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hide');
    }, 1000);
});

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', 
        navLinks.classList.contains('active') ? 'true' : 'false'
    );
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Header Scroll Effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString('pt-BR');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('pt-BR');
        }
    }, 16);
}

// Intersection Observer for Stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('users-count'), 50000);
            animateCounter(document.getElementById('projects-count'), 1250);
            animateCounter(document.getElementById('satisfaction-count'), 98);
            animateCounter(document.getElementById('support-count'), 24);
            statsObserver.unobserve(entry.target);
        }
    });
});

statsObserver.observe(document.querySelector('.stats'));

// 3D Scene Setup
let scene, camera, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init3D() {
    const canvas = document.getElementById('canvas3d');
    const container = canvas.parentElement;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    // Create multiple geometric shapes
    const shapes = [];
    
    // Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0);
    const icosahedronMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.position.set(-3, 2, 0);
    shapes.push(icosahedron);
    scene.add(icosahedron);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(3, -2, 0);
    shapes.push(torus);
    scene.add(torus);

    // Octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(1);
    const octahedronMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(0, 0, -2);
    shapes.push(octahedron);
    scene.add(octahedron);

    // Store shapes for animation
    window.shapes3D = shapes;

    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);

    if (window.shapes3D) {
        window.shapes3D.forEach((shape, index) => {
            shape.rotation.x += 0.005 * (index + 1);
            shape.rotation.y += 0.01 * (index + 1);
            
            // Mouse interaction
            shape.rotation.x += (mouseY * 0.001);
            shape.rotation.y += (mouseX * 0.001);
        });
    }

    camera.position.x += (mouseX * 0.0001 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.0001 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Mouse movement
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
});

// Touch support
document.addEventListener('touchmove', (event) => {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].clientX - windowHalfX;
        mouseY = event.touches[0].clientY - windowHalfY;
    }
});

// Resize handler
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera && renderer) {
        const container = document.getElementById('canvas3d').parentElement;
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
});

// Initialize 3D scene when page loads
window.addEventListener('load', () => {
    setTimeout(init3D, 500);
});

// Keyboard navigation support
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        // Ensure focus is visible
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Scroll-based animations can be added here
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Service Worker registration (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        console.log('Site carregado com sucesso!');
    });
}