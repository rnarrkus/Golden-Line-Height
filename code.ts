// Golden Line Height Plugin by Markus Wilson (hi@mrk.us)

// Show the HTML page in "ui.html".
figma.showUI(__html__, { themeColors: true, width: 260, height: 260, /* other options */ });

figma.ui.onmessage = msg => {
  // Get data from plugin UI
  if (msg.type === 'apply-line-height') {
    (async () => {
      // Get the current selection
      const selected = figma.currentPage.selection;
      // Check there are layers selected
      if (selected.length !== 0) {
        // Run through multiple selections
        for (const node of selected) {
          // Check if the layer is a text layer
          if (node.type === "TEXT") {
            // Load the fonts of the text layer
            await Promise.all(
              node.getRangeAllFontNames(0, node.characters.length).map(font => {
                return figma.loadFontAsync(font);
              })
            );
      
            // Get the current font size of the text layer
            const fontSize: number = node.fontSize as number;
      
            // Round lineHeight to nearest number divisible by 8
            let roundedLineHeight 
            
            if (msg.checked) {
              roundedLineHeight = Math.round(fontSize * 1.618 / 8) * 8;
            } else {
              roundedLineHeight = fontSize * 1.618;
            }
      
            // Set the line height of the text layer to the roundedLineHeight value
            node.lineHeight = {
              value: roundedLineHeight,
              unit: "PIXELS"
            };

            // Pluralize selected layer count
            // TODO: Calculate number of selected layers that are type "TEXT" only
            const selectedCount = selected.length + (selected.length === 1 ? ' layer' : ' layers');
            // Show message on success
            figma.notify("✅ Applied Golden Line Height to " + selectedCount);
          } else {
            // If the current selected node is not a text layer, show an error message
            figma.notify("❌ Golden Line Height can only be applied to text layers");
          }
        }
      } else {
        // If nothing is selected, show an error message
        figma.notify("❌ Select one or multiple text layers before applying");
      }
    })();
  }
};