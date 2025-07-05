// Get the Material Design Icons link icon by checking if it's already loaded on the page
// or creating it with the correct SVG content
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="twemoji" style="width: 1.125em; height: 1.125em; vertical-align: top; margin-left: 0.25em;"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5"/></svg>`;
}

const materialLinkIcon = getMaterialLinkIcon();

function addPermanentLinks() {
  console.log("Adding permanent links to headers...");
  
  // Find all comments first, then work backwards to find their associated headers
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    null,
    false
  );
  
  let comment;
  const processedComments = new Set(); // Avoid processing the same comment twice
  
  while (comment = walker.nextNode()) {
    if (comment.nodeValue.trim().startsWith("official-doc:") && !processedComments.has(comment)) {
      processedComments.add(comment);
      
      const url = comment.nodeValue.trim().replace("official-doc:", "").trim();
      console.log("Found official-doc comment with URL:", url);
      
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
        console.log("Associating comment with header:", foundHeader.textContent.trim());
        
        // Check if this specific URL already exists in the header
        const existingLinks = Array.from(foundHeader.querySelectorAll('a.headerlink'));
        if (existingLinks.some(link => link.href === url)) {
          console.log("Link already exists, skipping");
          continue;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.title = "Permanent link";
        link.className = "headerlink";
        link.target = "_blank";
        link.rel = "noopener";
        
        // Wrap the icon in a span like MkDocs does
        const iconSpan = document.createElement("span");
        iconSpan.className = "twemoji";
        iconSpan.innerHTML = getMaterialLinkIcon();
        
        link.appendChild(iconSpan);
        
        foundHeader.appendChild(link);
        console.log("Added permanent link to header:", foundHeader.textContent.trim(), "->", url);
        
        // Verify the link was actually added
        const verification = foundHeader.querySelector('a.headerlink[href="' + url + '"]');
        if (verification) {
          console.log("✓ Link successfully added and verified");
        } else {
          console.log("✗ Link creation failed - not found in DOM");
        }
      } else {
        console.log("No header found for comment with URL:", url);
      }
    }
  }
  
  console.log("Permanent links processing complete.");
}

// Run on initial page load
document.addEventListener("DOMContentLoaded", addPermanentLinks);

// For static sites with client-side navigation:

// 1. Hash changes (for anchor navigation)
window.addEventListener("hashchange", () => {
  console.log("Hash changed, processing links...");
  setTimeout(addPermanentLinks, 100);
});

// 2. History changes (for pushState/replaceState navigation)
window.addEventListener("popstate", () => {
  console.log("Popstate event, processing links...");
  setTimeout(addPermanentLinks, 100);
});

// 3. For MkDocs Material theme specifically - listen for their navigation
// Override pushState and replaceState to detect programmatic navigation
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
  originalPushState.apply(history, arguments);
  console.log("PushState detected, processing links...");
  setTimeout(addPermanentLinks, 200);
};

history.replaceState = function() {
  originalReplaceState.apply(history, arguments);
  console.log("ReplaceState detected, processing links...");
  setTimeout(addPermanentLinks, 200);
};

// 4. Modern approach: use MutationObserver for DOM changes
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

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 5. Additional fallback: periodically check for new content
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    console.log("URL change detected, processing links...");
    lastUrl = location.href;
    setTimeout(addPermanentLinks, 100);
  }
}, 1000);