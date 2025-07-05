const materialLinkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5"/></svg>';

document.addEventListener("DOMContentLoaded", () => {

  console.log("Adding permanent links to headers...");
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headers.forEach(header => {
    let nextNode = header.nextSibling;
    while (nextNode) {
      if (nextNode.nodeType === Node.COMMENT_NODE && nextNode.nodeValue.trim().startsWith("official-doc:")) {
        console.log("found official-doc comment in header:", header.textContent.trim());
        const url = nextNode.nodeValue.trim().replace("official-doc:", "").trim();
        
        const existingLinks = Array.from(header.querySelectorAll('a.headerlink'));
        if (existingLinks.some(link => link.href === url)) break;
        
        const link = document.createElement("a");
        link.href = url;
        link.title = "Permanent link";
        link.className = "headerlink";
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = materialLinkIcon;
        
        header.appendChild(link);
        console.log("Added permanent link to header:", header.textContent.trim(), "->", url);
        break;
      }
      nextNode = nextNode.nextSibling;
    }
  });
  console.log("Permanent links added to headers.");
});