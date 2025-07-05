const materialLinkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5"/></svg>';

document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector("article.md-content__inner.md-typeset");
  if (!article) return;

  let currentHeader = null;
  const headerTagNames = ['H1','H2','H3','H4','H5','H6'];

  article.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && headerTagNames.includes(node.tagName)) {
      currentHeader = node;
    }

    if (
      node.nodeType === Node.COMMENT_NODE &&
      node.nodeValue.trim().startsWith("official-doc:") &&
      currentHeader
    ) {
      const url = node.nodeValue.trim().replace("official-doc:", "").trim();

      // Avoid duplicating the same URL
      const alreadyExists = Array.from(currentHeader.querySelectorAll('a.headerlink')).some(a => a.href === url);
      if (alreadyExists) return;

      const link = document.createElement("a");
      link.href = url;
      link.title = "Official GroupMe Documentation";
      link.className = "headerlink";
      link.target = "_blank";
      link.rel = "noopener"; // security best practice
      link.insertAdjacentHTML("afterbegin", materialLinkIcon);

      currentHeader.appendChild(link);
    }
  });
});
