//Enhanced parse HTML function with HTML detection
export const parseHTML = (htmlString: string): React.ReactNode[] => {
  // Handle null, undefined, or empty strings
  if (!htmlString || htmlString.trim() === '') {
    return [];
  }

  // Check if the string contains HTML tags
  const hasHTMLTags = /<[^>]*>/g.test(htmlString);
  
  // If no HTML tags detected, treat as plain text
  if (!hasHTMLTags) {
    // Split by line breaks and create paragraphs
    const lines = htmlString.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return [(
        <p key={0} className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
          {htmlString}
        </p>
      )];
    }
    
    return lines.map((line, index) => (
      <p key={index} className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
        {line.trim()}
      </p>
    ));
  }

  // Parse as HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const children = Array.from(doc.body.children);
  
  // If parsing resulted in no children, fallback to plain text
  if (children.length === 0) {
    const textContent = doc.body.textContent || htmlString;
    return [(
      <p key={0} className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
        {textContent}
      </p>
    )];
  }

  // Process HTML elements as before
  return children.map((element: Element, index: number) => {
    switch (element.tagName.toLowerCase()) {
      case 'h1':
        return (
          <h1 key={index} className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {element.textContent}
          </h1>
        );
      case 'p':
        if (element.innerHTML === '<br>') {
          return <div key={index} className="h-4" />;
        }
        return (
          <p key={index} className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
            {Array.from(element.childNodes).map((node: ChildNode, nodeIndex: number) => {
              if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                const elementNode = node as Element;
                if (elementNode.tagName === 'A') {
                  const anchorElement = elementNode as HTMLAnchorElement;
                  return (
                    <a
                      key={nodeIndex}
                      href={anchorElement.href.startsWith('www.') ? `https://${anchorElement.href}` : anchorElement.href}
                      target={anchorElement.target}
                      rel={anchorElement.rel}
                      className="text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
                    >
                      {anchorElement.textContent}
                    </a>
                  );
                } else if (elementNode.tagName === 'STRONG') {
                  return (
                    <strong key={nodeIndex} className="font-semibold text-gray-800">
                      {elementNode.textContent}
                    </strong>
                  );
                }
              }
              return null;
            })}
          </p>
        );
      case 'h2':
        return (
          <h2 key={index} className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {element.textContent}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={index} className="text-lg md:text-xl font-bold text-gray-800 mb-3">
            {element.textContent}
          </h3>
        );
      case 'ul':
        return (
          <ul key={index} className="list-disc list-inside text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
            {Array.from(element.children).map((li, liIndex) => (
              <li key={liIndex} className="mb-1">{li.textContent}</li>
            ))}
          </ul>
        );
      case 'ol':
        return (
          <ol key={index} className="list-decimal list-inside text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
            {Array.from(element.children).map((li, liIndex) => (
              <li key={liIndex} className="mb-1">{li.textContent}</li>
            ))}
          </ol>
        );
      case 'div':
        return (
          <div key={index} className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
            {element.textContent}
          </div>
        );
      default:
        return null;
    }
  });
};