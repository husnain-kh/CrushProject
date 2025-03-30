/*--------------------
Vars
--------------------*/
let progress = 0; // Start from the first slide
let startX = 0;
let active = 0;
let isDown = false;

/*--------------------
Constants
--------------------*/
const speedWheel = 0.02;
const speedDrag = -0.1;

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll(".carousel-item");
const $cursors = document.querySelectorAll(".cursor");

const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", (index - active) / $items.length);
};

/*--------------------
Animate
--------------------*/
const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($items.length - 1));

    $items.forEach((item, index) => displayItems(item, index, active));
};
animate();

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
    item.addEventListener("click", () => {
        progress = (i / $items.length) * 100 + 10;
        animate();
    });
});

/*--------------------
Handlers
--------------------*/
const handleWheel = (e) => {
    const wheelProgress = e.deltaY * speedWheel;
    progress += wheelProgress;
    animate();
};

const handleMouseMove = (e) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;

    if (e.type === "mousemove") {
        $cursors.forEach(($cursor) => {
            $cursor.style.transform = `translate(${x}px, ${e.clientY || 0}px)`;
        });
    }

    if (!isDown) return;
    const mouseProgress = (x - startX) * speedDrag;
    progress += mouseProgress;
    startX = x;
    animate();
};

const handleMouseDown = (e) => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
    isDown = false;
};

/*--------------------
Listeners
--------------------*/
document.addEventListener("wheel", handleWheel, { passive: true });
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("touchstart", handleMouseDown, { passive: true });
document.addEventListener("touchmove", handleMouseMove, { passive: true });
document.addEventListener("touchend", handleMouseUp);