// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Pointer Lock Controls
const controls = new THREE.PointerLockControls(camera, document.body);
document.getElementById('instructions').onclick = () => { controls.lock(); };
controls.addEventListener('lock', () => { document.getElementById('instructions').style.display = 'none'; });
controls.addEventListener('unlock', () => { document.getElementById('instructions').style.display = ''; });

// Movement variables
const moveSpeed = 0.1;
const keysPressed = { w: false, a: false, s: false, d: false };
document.addEventListener('keydown', (event) => { keysPressed[event.key.toLowerCase()] = true; });
document.addEventListener('keyup', (event) => { keysPressed[event.key.toLowerCase()] = false; });

// Add AudioListener to camera
const listener = new THREE.AudioListener();
camera.add(listener);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -Math.PI / 2;

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5);
scene.add(light);

// Sphere geometry and material
const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Add sphere 1 and spatial audio
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere1.position.set(-2.5, 0.15, -2.5);
scene.add(sphere1);

const audio1 = new THREE.PositionalAudio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('./AcousticRock.mp3', function(buffer) {
    audio1.setBuffer(buffer);
    audio1.setRefDistance(1);  // Adjust for range
    audio1.setLoop(true);
    audio1.play();
});
sphere1.add(audio1);

// Add sphere 2 and spatial audio
const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere2.position.set(2.5, 0.15, 2.5);
scene.add(sphere2);

const audio2 = new THREE.PositionalAudio(listener);
audioLoader.load('./Ectoplasm.mp3', function(buffer) {
    audio2.setBuffer(buffer);
    audio2.setRefDistance(1);  // Adjust for range
    audio2.setLoop(true);
    audio2.play();
});
sphere2.add(audio2);

// Camera initial position
camera.position.set(0, 1, 5);

// Movement update
function updateMovement() {
    if (keysPressed.w) controls.moveForward(moveSpeed);
    if (keysPressed.s) controls.moveForward(-moveSpeed);
    if (keysPressed.a) controls.moveRight(-moveSpeed);
    if (keysPressed.d) controls.moveRight(moveSpeed);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    renderer.render(scene, camera);
}
animate();

// Adjust scene on window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});