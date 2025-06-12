/**
 * Table of Contents script for Study theme
 * Handles the behavior of the table of contents on post pages
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get the table of contents element
  const toc = document.getElementById('tableOfContents');
  
  // If there's no table of contents, exit early
  if (!toc) {
    return;
  }
  
  // Make TOC links smooth scroll to their targets
  const tocLinks = toc.querySelectorAll('a');
  
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target element
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Smooth scroll to the target
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Offset for fixed header
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, '#' + targetId);
      }
    });
  });
  
  // Highlight the current section in the TOC
  function highlightTocSection() {
    // Get all headings in the content
    const headings = document.querySelectorAll('.post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');
    
    if (headings.length === 0) {
      return;
    }
    
    // Find the heading that's currently at the top of the viewport
    let currentHeading = headings[0];
    const scrollPosition = window.scrollY + 150; // Add offset for header
    
    for (const heading of headings) {
      if (heading.offsetTop <= scrollPosition) {
        currentHeading = heading;
      } else {
        break;
      }
    }
    
    // Remove active class from all TOC links
    tocLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to the current section's TOC link
    if (currentHeading.id) {
      const activeLink = toc.querySelector(`a[href="#${currentHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }
  
  // Call the highlight function on scroll
  window.addEventListener('scroll', highlightTocSection);
  
  // Initial highlight
  highlightTocSection();
});
