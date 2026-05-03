document.addEventListener("click", (event) => {
    const s = document.createElement("div");

    s.className = "spark";
    s.style.left = event.pageX + "px";
    s.style.top = event.pageY + "px";
    s.style.transform = "translate(-50%, -50%)";
    s.style.pointerEvents = "none";
    document.body.appendChild(s);

    setTimeout(() => {
        s.remove();
    }, 600);
});
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'your-super-secret-jwt-token-with-at-least-32-characters'

const anonKey = jwt.sign({ role: 'anon' }, JWT_SECRET, { expiresIn: '10y' })
const serviceKey = jwt.sign({ role: 'service_role' }, JWT_SECRET, { expiresIn: '10y' })

console.log('anon:', anonKey)
console.log('service_role:', serviceKey)