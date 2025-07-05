// This script adds links to the official GroupMe docs to document headers based on comments in the Markdown files.

const materialLinkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5 5 5 0 0 0-5-5"/></svg>'

document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headers.forEach(header => {
    const commentNode = Array.from(header.parentNode.childNodes).find(
      node => node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim().startsWith("official-doc:")
    );
    if (!commentNode) return;

    const url = commentNode.nodeValue.trim().replace("official-doc:", "").trim();

    const link = document.createElement("a");
    link.href = url;
    link.title = "Extra link";
    link.className = "header-docs-link";
    link.innerHTML = materialLinkIcon;
    link.target = "_blank";
    header.appendChild(link);
  });
});
