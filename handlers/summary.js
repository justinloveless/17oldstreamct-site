/**
 * Handler for summary.md asset
 * Parses markdown and populates summary section
 */
export function handle(data) {
  if (!data) return;

  const summarySection = document.querySelector('.summary');
  if (!summarySection) return;

  const container = summarySection.querySelector('.container');
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  const lines = data.split('\n');
  let currentElement = null;
  let highlightsContainer = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse heading levels
    if (line.startsWith('# ')) {
      const h2 = document.createElement('h2');
      h2.textContent = line.substring(2);
      container.appendChild(h2);
      currentElement = null;
    } else if (line.startsWith('## ')) {
      const h3 = document.createElement('h3');
      h3.textContent = line.substring(3);
      container.appendChild(h3);
      currentElement = null;
    } else if (line.startsWith('### ')) {
      // This is a highlight title
      if (!highlightsContainer) {
        highlightsContainer = document.createElement('div');
        highlightsContainer.className = 'highlights-grid';
        container.appendChild(highlightsContainer);
      }
      const highlightItem = document.createElement('div');
      highlightItem.className = 'highlight-item';
      const h4 = document.createElement('h4');
      h4.textContent = line.substring(4);
      highlightItem.appendChild(h4);
      highlightsContainer.appendChild(highlightItem);
      currentElement = highlightItem;
    } else if (line === '---') {
      // Horizontal rule - start footer section
      currentElement = null;
    } else if (line.match(/^[📸🏡]/)) {
      // Emoji line - summary note
      const note = document.createElement('p');
      note.className = 'summary-note';
      note.innerHTML = line.replace(/\n/g, '<br>');
      container.appendChild(note);
      currentElement = null;
    } else if (line) {
      // Regular paragraph
      if (currentElement && currentElement.classList.contains('highlight-item')) {
        // This is highlight description
        const p = document.createElement('p');
        p.textContent = line;
        currentElement.appendChild(p);
      } else {
        // Regular paragraph or footer
        const p = document.createElement('p');
        if (i > 0 && lines[i - 1].trim() === '---') {
          p.className = 'summary-footer';
        }
        p.textContent = line;
        container.appendChild(p);
      }
    }
  }
}
