function getMaterialLinkIcon() {
  // First, try to find an existing twemoji icon to copy styling
  const existingTwemoji = document.querySelector('.twemoji svg');
  if (existingTwemoji) {
    const iconClone = existingTwemoji.cloneNode(true);
    // Replace the path with the link icon path
    const path = iconClone.querySelector('path');
    if (path) {
      path.setAttribute('d', 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5');
      path.setAttribute('fill', 'currentColor');
    }
    return iconClone.outerHTML;
  }
  
  // Fallback: create with Material for MkDocs twemoji styling
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="twemoji" style="width: 1.125em; height: 1.125em; vertical-align: baseline; margin-left: 0.25em; transform: translateY(0.1em);"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5"/></svg>`;
}

const materialLinkIcon = getMaterialLinkIcon();

function addPermanentLinks() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    null,
    false
  );
  
  let comment;
  const processedComments = new Set();
  
  while (comment = walker.nextNode()) {
    if (comment.nodeValue.trim().startsWith("official-doc:") && !processedComments.has(comment)) {
      processedComments.add(comment);
      
      const url = comment.nodeValue.trim().replace("official-doc:", "").trim();
      
      // Find the closest preceding header
      let currentNode = comment.previousSibling;
      let foundHeader = null;
      
      // Go backwards through siblings first
      while (currentNode && !foundHeader) {
        if (currentNode.nodeType === Node.ELEMENT_NODE && 
            /^H[1-6]$/.test(currentNode.tagName)) {
          foundHeader = currentNode;
          break;
        }
        currentNode = currentNode.previousSibling;
      }
      
      // If not found in siblings, check parent's previous siblings
      if (!foundHeader) {
        let parentNode = comment.parentNode;
        while (parentNode && parentNode !== document.body) {
          currentNode = parentNode.previousSibling;
          while (currentNode && !foundHeader) {
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
              // Check if this node is a header
              if (/^H[1-6]$/.test(currentNode.tagName)) {
                foundHeader = currentNode;
                break;
              }
              // Check if this node contains headers
              const headerInNode = currentNode.querySelector('h1, h2, h3, h4, h5, h6');
              if (headerInNode) {
                // Get the last header in this node
                const headers = currentNode.querySelectorAll('h1, h2, h3, h4, h5, h6');
                foundHeader = headers[headers.length - 1];
                break;
              }
            }
            currentNode = currentNode.previousSibling;
          }
          if (foundHeader) break;
          parentNode = parentNode.parentNode;
        }
      }
      
      if (foundHeader) {
        const existingLinks = Array.from(foundHeader.querySelectorAll('a.headerlink'));
        if (existingLinks.some(link => link.href === url)) continue;
        
        const link = document.createElement("a");
        link.href = url;
        link.title = "Permanent link";
        link.className = "headerlink";
        link.target = "_blank";
        link.rel = "noopener";
        
        // Add Material for MkDocs tooltip attributes
        // Check if the site uses data-md-tooltip or other tooltip systems
        const sampleTooltipElement = document.querySelector('[data-md-tooltip]') || 
                                    document.querySelector('[title]') ||
                                    document.querySelector('.md-tooltip');
        
        if (sampleTooltipElement && sampleTooltipElement.hasAttribute('data-md-tooltip')) {
          link.setAttribute('data-md-tooltip', 'Permanent link');
          link.removeAttribute('title'); // Remove title if using data-md-tooltip
        }
        
        const existingHeaderLink = document.querySelector('.md-content__button, .md-header__button, a[title*="Edit"], a[title*="edit"]');
        if (existingHeaderLink) {
          const classesToCopy = ['md-content__button', 'md-header__button', 'md-button', 'md-button--primary'].filter(cls => 
            existingHeaderLink.classList.contains(cls)
          );
          classesToCopy.forEach(cls => link.classList.add(cls));
        }
        
        const iconSpan = document.createElement("span");
        iconSpan.className = "twemoji";
        iconSpan.innerHTML = getMaterialLinkIcon();
        
        link.appendChild(iconSpan);
        
        foundHeader.appendChild(link);
        
        setTimeout(() => {
          if (typeof app !== 'undefined' && app.tooltip) {
            app.tooltip.initialize();
          }
          
          if (typeof tippy !== 'undefined') {
            tippy(link, {
              content: 'Official documentation link',
              placement: 'bottom'
            });
          }
          
          if (!link.hasAttribute('data-md-tooltip') && !link.querySelector('.md-tooltip')) {
            link.addEventListener('mouseenter', function(e) {
              const tooltip = document.createElement('div');
              tooltip.className = 'md-tooltip';
              tooltip.textContent = 'Official documentation link';
              tooltip.style.cssText = `
                position: absolute;
                background: var(--md-tooltip-bg-color, #000);
                color: var(--md-tooltip-fg-color, #fff);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
              `;
              
              document.body.appendChild(tooltip);
              
              const rect = link.getBoundingClientRect();
              tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
              tooltip.style.top = (rect.bottom + 5) + 'px';
              
              setTimeout(() => tooltip.style.opacity = '1', 10);
              
              const hideTooltip = () => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 200);
                link.removeEventListener('mouseleave', hideTooltip);
              };
              
              link.addEventListener('mouseleave', hideTooltip);
            });
          }
        }, 100);
      }
    }
  }
  
  console.log("Permanent links processing complete.");
}

document.addEventListener("DOMContentLoaded", addPermanentLinks);

const observer = new MutationObserver(function(mutations) {
  let shouldProcess = false;
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && 
            (node.tagName && /^H[1-6]$/.test(node.tagName) || 
             node.querySelector && node.querySelector('h1, h2, h3, h4, h5, h6'))) {
          shouldProcess = true;
          break;
        }
      }
    }
  });
  
  if (shouldProcess) {
    console.log("DOM mutation detected, processing links...");
    clearTimeout(window.linkProcessingTimeout);
    window.linkProcessingTimeout = setTimeout(addPermanentLinks, 100);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
