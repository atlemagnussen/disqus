export function scrollToTop() {
    const main = document.querySelector("main")
    if (main) {
        main.scroll({
            top: 0,
            left: 0,
            behavior: "instant"
        })
    }
        
}