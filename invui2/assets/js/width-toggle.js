// Width toggle functionality
document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("md-width-toggle");
    const icons = window.__mdWidthIcons;
    
    // Width modes cycle: slim -> wide -> full -> slim
    const modes = ["slim", "wide", "full"];
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function updateButton(mode) {
        toggleButton.innerHTML = mode === "full" ? icons.minimize : icons.maximize;
        const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
        toggleButton.setAttribute("title", `Current: ${capitalize(mode)} - Click for ${capitalize(nextMode)}`);
    }
    
    function applyMode(mode) {
        if (mode === "slim") {
            document.documentElement.removeAttribute("data-md-width");
        } else {
            document.documentElement.setAttribute("data-md-width", mode);
        }
    }
    
    // Initialize button with saved preference
    const savedWidth = localStorage.getItem("md-width") || "slim";
    updateButton(savedWidth);
    
    // Toggle handler - cycle through modes
    toggleButton.addEventListener("click", function() {
        const currentMode = localStorage.getItem("md-width") || "slim";
        const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
        
        applyMode(nextMode);
        localStorage.setItem("md-width", nextMode);
        updateButton(nextMode);
    });
});

