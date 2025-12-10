// how-it-works.js - Enhanced How It Works Page JavaScript with Animations

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHowItWorksPage();
    setupInteractiveTimeline();
});

// Main initialization
function initializeHowItWorksPage() {
    setupFAQ();
    setupStepAnimations();
    setupSafetyAnimations();
    setupHowItWorksCTA();
    setupProgressIndicator();
    setupTabSwitcher();
    
    console.log('How It Works page enhanced functionality loaded');
}

// Enhanced FAQ with smooth animations
function setupFAQ() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;
    
    const faqQuestions = faqContainer.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
        // Add entrance animation
        question.style.opacity = '0';
        question.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            question.style.transition = 'all 0.5s ease';
            question.style.opacity = '1';
            question.style.transform = 'translateX(0)';
        }, 100 * index);
        
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            const isOpen = answer.classList.contains('show');
            
            // Close all other FAQs with animation
            document.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.style.maxHeight = '0';
                    openAnswer.style.opacity = '0';
                    openAnswer.style.padding = '0 1.5rem';
                    
                    setTimeout(() => {
                        openAnswer.classList.remove('show');
                    }, 300);
                    
                    openAnswer.previousElementSibling.classList.remove('active');
                    openAnswer.previousElementSibling.querySelector('i').style.transform = 'rotate(0)';
                }
            });
            
            // Toggle current FAQ
            if (!isOpen) {
                answer.classList.add('show');
                answer.style.display = 'block';
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0 1.5rem';
                
                // Force reflow
                answer.offsetHeight;
                
                answer.style.transition = 'all 0.4s ease';
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.padding = '0 1.5rem 1.5rem';
                
                this.classList.add('active');
                icon.style.transform = 'rotate(45deg)';
                
                // Highlight effect
                this.style.background = 'linear-gradient(90deg, var(--light-gray) 0%, transparent 100%)';
                setTimeout(() => {
                    this.style.background = '';
                }, 300);
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0 1.5rem';
                
                setTimeout(() => {
                    answer.classList.remove('show');
                    answer.style.display = 'none';
                }, 300);
                
                this.classList.remove('active');
                icon.style.transform = 'rotate(0)';
            }
        });
    });
}

// Enhanced step cards animation with progress
function setupStepAnimations() {
    const stepCards = document.querySelectorAll('.step-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const stepNumber = card.querySelector('.step-number');
                
                // Animate card
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                    
                    // Animate step number
                    if (stepNumber) {
                        stepNumber.style.animation = 'bounceIn 0.6s ease';
                        
                        // Add connecting line animation
                        if (index < stepCards.length - 1) {
                            createConnectionLine(card);
                        }
                    }
                    
                    // Animate icon
                    const icon = card.querySelector('.step-icon');
                    if (icon) {
                        icon.style.animation = 'rotateIn 0.8s ease';
                    }
                }, index * 200);
                
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.2 });
    
    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Create animated connection lines between steps
function createConnectionLine(card) {
    const line = document.createElement('div');
    line.className = 'step-connection-line';
    line.style.cssText = `
        position: absolute;
        top: 50%;
        right: -2rem;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--primary-orange), var(--primary-blue));
        z-index: -1;
        transition: width 0.8s ease;
    `;
    
    card.style.position = 'relative';
    card.appendChild(line);
    
    setTimeout(() => {
        line.style.width = '4rem';
    }, 100);
}

// Safety features animation with icons
function setupSafetyAnimations() {
    const safetyFeatures = document.querySelectorAll('.safety-feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1) rotateY(0)';
                    
                    // Animate icon
                    const icon = entry.target.querySelector('.safety-icon');
                    if (icon) {
                        icon.style.animation = 'pulse 2s ease infinite';
                        icon.style.animationDelay = `${index * 0.2}s`;
                    }
                }, index * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    safetyFeatures.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'scale(0.9) rotateY(180deg)';
        feature.style.transition = 'all 0.8s ease';
        feature.style.transformStyle = 'preserve-3d';
        observer.observe(feature);
    });
}

// Interactive timeline for process steps
function setupInteractiveTimeline() {
    const sections = document.querySelectorAll('.how-it-works-section');
    
    // Create timeline indicator
    const timeline = document.createElement('div');
    timeline.className = 'process-timeline';
    timeline.style.cssText = `
        position: fixed;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `;
    
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'timeline-dot';
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--border-light);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        `;
        
        // Add tooltip
        const tooltip = document.createElement('span');
        tooltip.textContent = section.querySelector('h2')?.textContent || `Step ${index + 1}`;
        tooltip.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--primary-blue);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        dot.appendChild(tooltip);
        
        dot.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        
        dot.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        timeline.appendChild(dot);
    });
    
    if (sections.length > 0) {
        document.body.appendChild(timeline);
    }
    
    // Update active dot on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const dot = timeline.children[index];
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                dot.style.background = 'var(--primary-orange)';
                dot.style.transform = 'scale(1.5)';
            } else {
                dot.style.background = 'var(--border-light)';
                dot.style.transform = 'scale(1)';
            }
        });
    });
    
    // Hide timeline on mobile
    if (window.innerWidth < 768) {
        timeline.style.display = 'none';
    }
}

// Tab switcher for renters/owners
function setupTabSwitcher() {
    const sections = document.querySelectorAll('.how-it-works-section');
    if (sections.length < 2) return;
    
    // Create tab switcher
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-switcher';
    tabContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 0.5rem;
        background: var(--light-gray);
        border-radius: 50px;
        max-width: 400px;
        margin: 2rem auto;
    `;
    
    const tabs = ['For Renters', 'For Owners'];
    
    tabs.forEach((label, index) => {
        const tab = document.createElement('button');
        tab.textContent = label;
        tab.className = index === 0 ? 'tab active' : 'tab';
        tab.style.cssText = `
            flex: 1;
            padding: 0.8rem 1.5rem;
            border: none;
            background: ${index === 0 ? 'var(--primary-orange)' : 'transparent'};
            color: ${index === 0 ? 'white' : 'var(--text-dark)'};
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        tab.addEventListener('click', () => {
            // Update active tab
            tabContainer.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.color = 'var(--text-dark)';
            });
            
            tab.classList.add('active');
            tab.style.background = 'var(--primary-orange)';
            tab.style.color = 'white';
            
            // Scroll to section
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        
        tabContainer.appendChild(tab);
    });
    
    // Insert before first section
    const firstSection = sections[0];
    firstSection.parentNode.insertBefore(tabContainer, firstSection);
}


// CTA buttons functionality
function setupHowItWorksCTA() {
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) return;
            
            e.preventDefault();
            
            // Add click animation
            this.style.animation = 'pulse 0.5s ease';
            
            const buttonText = this.textContent;
            
            showLoading(true);
            
            setTimeout(() => {
                if (buttonText && (buttonText.includes('Find') || buttonText.includes('Vehicle'))) {
                    window.location.href = 'rent.html';
                } else if (buttonText && (buttonText.includes('List') || buttonText.includes('Your'))) {
                    window.location.href = 'list-your-vehicle.html';
                }
            }, 500);
        });
    });
}

// Progress indicator for sections
function setupProgressIndicator() {
    const sections = document.querySelectorAll('.how-it-works-section');
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'section-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--border-light);
        z-index: 100;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        height: 100%;
        background: linear-gradient(90deg, var(--primary-orange), var(--primary-blue));
        width: 0;
        transition: width 0.3s ease;
    `;
    
    progressBar.appendChild(progressFill);
    document.body.appendChild(progressBar);
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (window.scrollY / scrollHeight) * 100;
        progressFill.style.width = `${scrollPercentage}%`;
        
        // Animate sections on scroll
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('in-view');
            }
        });
    });
}

// Add necessary animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes rotateIn {
        from {
            transform: rotate(-360deg);
            opacity: 0;
        }
        to {
            transform: rotate(0);
            opacity: 1;
        }
    }
    
    .video-placeholder {
        text-align: center;
        padding: 4rem;
        background: white;
        border-radius: 20px;
        min-width: 500px;
    }
    
    .video-placeholder i {
        font-size: 4rem;
        color: var(--primary-orange);
        margin-bottom: 1rem;
    }
    
    .modal-content {
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    }
    
    .how-it-works-section.in-view {
        animation: fadeInUp 0.8s ease;
    }
    
    @media (max-width: 768px) {
        .process-timeline,
        .section-progress {
            display: none;
        }
        
        .tab-switcher {
            margin: 1rem;
        }
        
        .video-placeholder {
            min-width: auto;
            padding: 2rem;
        }
    }
`;
document.head.appendChild(style);