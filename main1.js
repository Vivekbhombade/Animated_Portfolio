import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';

// Setup the scene
const scene = new THREE.Scene();

// Setup the camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of View
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 15; // Move the camera back

// Add ambient light (soft light everywhere)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light
scene.add(ambientLight);

// Add directional light (creates highlights and shadows)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 15); // Adjusted position for better shadow effects
scene.add(directionalLight);

// Torus Geometry
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Load space background texture
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar (cube with texture)
const avatarTexture = new THREE.TextureLoader().load('star-flo-left.png');
const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);
avatar.position.z = -5;
avatar.position.x = 2;
scene.add(avatar);

// Moon (sphere with textures)
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
moon.position.z = 30;
moon.position.setX(-10);
scene.add(moon);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Improve clarity on high-DPI screens

// Attach to the 'bg' div, which will cover the full viewport
document.getElementById('bg').appendChild(renderer.domElement);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Animate the moon and avatar as the user scrolls
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  // Camera position updates
  camera.position.z = 15 + t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

// Add scroll listener
document.body.onscroll = moveCamera;
moveCamera(); // Call once to set initial state

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // Rotate the moon for dynamic appearance
  moon.rotation.x += 0.005;

  renderer.render(scene, camera); // Render the scene
}

// Responsive canvas resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect ratio
  camera.updateProjectionMatrix(); // Recalculate projection matrix
  renderer.setSize(window.innerWidth, window.innerHeight); // Adjust renderer size
});

// Start animation
animate();
