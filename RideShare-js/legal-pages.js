// base.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Scroll to top button
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Add animation to elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('fade-in');
            }
        });
    };

    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation (if forms exist)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Create error message if it doesn't exist
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // Loading states for buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit' || this.classList.contains('loading-action')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="loading"></span> Processing...';
                this.disabled = true;

                // Reset after 3 seconds (for demo purposes)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
    });
});

// legal-pages.js
document.addEventListener('DOMContentLoaded', function() {
    // Create table of contents navigation
    const createTOC = () => {
        const legalContent = document.querySelector('.legal-content');
        if (!legalContent) return;

        const headings = legalContent.querySelectorAll('h2');
        if (headings.length === 0) return;

        // Desktop navigation
        const desktopNav = document.createElement('nav');
        desktopNav.className = 'legal-navigation';
        desktopNav.innerHTML = '<h3><i class="fas fa-list"></i> Contents</h3><ul></ul>';
        const desktopList = desktopNav.querySelector('ul');

        // Mobile TOC
        const mobileTOC = document.createElement('details');
        mobileTOC.className = 'mobile-toc';
        mobileTOC.innerHTML = '<summary><i class="fas fa-list"></i> Table of Contents</summary><ul></ul>';
        const mobileList = mobileTOC.querySelector('ul');

        headings.forEach((heading, index) => {
            // Add ID if not present
            if (!heading.id) {
                heading.id = `section-${index + 1}`;
            }

            // Create TOC items
            const tocItem = `<li><a href="#${heading.id}">${heading.textContent}</a></li>`;
            desktopList.innerHTML += tocItem;
            mobileList.innerHTML += tocItem;
        });

        // Insert navigation elements
        document.body.appendChild(desktopNav);
        legalContent.parentNode.insertBefore(mobileTOC, legalContent);

        // Update active state on scroll
        const updateActiveSection = () => {
            const scrollPosition = window.scrollY + 100;

            headings.forEach(heading => {
                const section = heading.getBoundingClientRect();
                const sectionTop = section.top + window.scrollY - 100;
                const sectionBottom = sectionTop + section.height;

                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    // Update desktop nav
                    desktopList.querySelectorAll('a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${heading.id}`) {
                            link.classList.add('active');
                        }
                    });

                    // Update mobile nav
                    mobileList.querySelectorAll('a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${heading.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveSection);
        updateActiveSection(); // Initial call

        // Smooth scrolling for TOC links
        const tocLinks = document.querySelectorAll('.legal-navigation a, .mobile-toc a');
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile TOC if open
                    if (mobileTOC.hasAttribute('open')) {
                        mobileTOC.removeAttribute('open');
                    }
                }
            });
        });
    };

    // Initialize TOC
    createTOC();

    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.legal-content h2, .legal-content h3');
    sections.forEach(section => {
        section.classList.add('fade-in-scroll');
    });

    // Copy link functionality for sections
    const addCopyLinks = () => {
        const headings = document.querySelectorAll('.legal-content h2, .legal-content h3');
        
        headings.forEach(heading => {
            const copyLink = document.createElement('button');
            copyLink.className = 'copy-section-link';
            copyLink.innerHTML = '<i class="fas fa-link"></i>';
            copyLink.title = 'Copy link to this section';
            copyLink.style.cssText = `
                margin-left: 0.5rem;
                background: none;
                border: none;
                color: var(--primary-orange);
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s;
            `;

            heading.appendChild(copyLink);

            heading.addEventListener('mouseenter', () => {
                copyLink.style.opacity = '1';
            });

            heading.addEventListener('mouseleave', () => {
                copyLink.style.opacity = '0';
            });

            copyLink.addEventListener('click', async (e) => {
                e.preventDefault();
                const url = window.location.href.split('#')[0] + '#' + heading.id;
                
                try {
                    await navigator.clipboard.writeText(url);
                    copyLink.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyLink.innerHTML = '<i class="fas fa-link"></i>';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy link:', err);
                }
            });
        });
    };

    addCopyLinks();

    // Print functionality
    const addPrintButton = () => {
        const pageHeader = document.querySelector('.page-header');
        if (!pageHeader) return;

        const printBtn = document.createElement('button');
        printBtn.className = 'btn btn-secondary print-btn';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print';
        printBtn.style.cssText = `
            position: absolute;
            top: 2rem;
            right: 2rem;
            z-index: 10;
        `;

        printBtn.addEventListener('click', () => {
            window.print();
        });

        pageHeader.appendChild(printBtn);
    };

    addPrintButton();

    // Search functionality within legal content
    const addSearchFunctionality = () => {
        const legalContent = document.querySelector('.legal-content');
        if (!legalContent) return;

        const searchBox = document.createElement('div');
        searchBox.className = 'legal-search-box';
        searchBox.innerHTML = `
            <div style="background: var(--light-gray); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 2rem;">
                <input type="text" id="legal-search" placeholder="Search in this document..." style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-light); border-radius: var(--border-radius);">
                <div id="search-results" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light);"></div>
            </div>
        `;

        legalContent.parentNode.insertBefore(searchBox, legalContent);

        const searchInput = document.getElementById('legal-search');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length < 3) {
                searchResults.textContent = '';
                removeHighlights();
                return;
            }

            removeHighlights();
            const matches = highlightText(legalContent, searchTerm);
            
            if (matches > 0) {
                searchResults.textContent = `Found ${matches} match${matches > 1 ? 'es' : ''}`;
            } else {
                searchResults.textContent = 'No matches found';
            }
        });
    };

    // Helper function to highlight text
    function highlightText(element, searchTerm) {
        let matches = 0;
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const text = node.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const matchesInNode = text.match(regex);
            
            if (matchesInNode) {
                matches += matchesInNode.length;
                const span = document.createElement('span');
                span.innerHTML = text.replace(regex, '<mark style="background: yellow; padding: 2px;">$1</mark>');
                node.parentNode.replaceChild(span, node);
            }
        });

        return matches;
    }

    // Helper function to remove highlights
    function removeHighlights() {
        const highlights = document.querySelectorAll('mark');
        highlights.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    addSearchFunctionality();

    // Expandable sections for mobile
    if (window.innerWidth <= 768) {
        const dataTypeCards = document.querySelectorAll('.data-type-card');
        dataTypeCards.forEach(card => {
            const heading = card.querySelector('h4');
            const content = card.querySelector('ul');
            
            if (heading && content) {
                heading.style.cursor = 'pointer';
                heading.innerHTML += ' <i class="fas fa-chevron-down" style="float: right;"></i>';
                content.style.display = 'none';
                
                heading.addEventListener('click', () => {
                    const isExpanded = content.style.display === 'block';
                    content.style.display = isExpanded ? 'none' : 'block';
                    const icon = heading.querySelector('i');
                    icon.className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
                });
            }
        });
    }

    // Reading progress indicator
    const addReadingProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--primary-orange);
            z-index: 2000;
            transition: width 0.3s;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / docHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };

    addReadingProgress();
});