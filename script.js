document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Timeline Slider Logic
    const sliderTabs = document.querySelectorAll('.slider-tab');
    const sliderPanels = document.querySelectorAll('.slider-panel');
    let currentTabIndex = 0;
    let sliderInterval;

    const activateTab = (index) => {
        // Remove active class from all tabs and panels
        sliderTabs.forEach(t => t.classList.remove('active'));
        sliderPanels.forEach(p => p.classList.remove('active'));

        // Add active class to target tab
        if(sliderTabs[index]) {
            sliderTabs[index].classList.add('active');
            const targetId = sliderTabs[index].getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if(targetPanel) {
                targetPanel.classList.add('active');
            }
        }
    };

    const startSliderInterval = () => {
        sliderInterval = setInterval(() => {
            currentTabIndex = (currentTabIndex + 1) % sliderTabs.length;
            activateTab(currentTabIndex);
        }, 4000); // Change every 4 seconds for better readability
    };

    const resetSliderInterval = () => {
        clearInterval(sliderInterval);
        startSliderInterval();
    };

    sliderTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            currentTabIndex = index;
            activateTab(currentTabIndex);
            resetSliderInterval(); // Reset timer on manual click
        });
    });
    
    // Start automatic rotation
    if (sliderTabs.length > 0) {
        startSliderInterval();
    }
});
