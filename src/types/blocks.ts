export type BlockCategory =
  | 'writing'
  | 'data-viz'
  | 'visual-effects'
  | 'media'
  | 'research'
  | 'developer'
  | 'layout';

export interface BlockDefinition {
  name: string;
  label: string;
  icon: string;
  category: BlockCategory;
  description: string;
}

export const BLOCK_REGISTRY: BlockDefinition[] = [
  // Writing
  { name: 'heading', label: 'Heading', icon: 'H', category: 'writing', description: 'Chapter heading with number' },
  { name: 'epigraph', label: 'Epigraph', icon: '\u275D', category: 'writing', description: 'Opening quote' },
  { name: 'pullQuote', label: 'Pull Quote', icon: '\u275D', category: 'writing', description: 'Highlighted quote with halftone' },
  { name: 'marginNote', label: 'Margin Note', icon: '\u2197', category: 'writing', description: 'Sidenote in the margin' },
  { name: 'footnote', label: 'Footnote', icon: '\u00B9', category: 'writing', description: 'Numbered footnote' },
  { name: 'sectionDivider', label: 'Section Divider', icon: '\u2500', category: 'writing', description: 'Halftone break or line' },
  { name: 'bilingualBlock', label: 'Bilingual Block', icon: '\uD83C\uDF10', category: 'writing', description: 'EN/ZH content pair' },
  // Data Viz
  { name: 'barChart', label: 'Bar Chart', icon: '\uD83D\uDCCA', category: 'data-viz', description: 'Horizontal bar chart' },
  { name: 'comparisonTable', label: 'Comparison Table', icon: '\uD83D\uDCCB', category: 'data-viz', description: 'Multi-column comparison' },
  { name: 'lineChart', label: 'Line Chart', icon: '\uD83D\uDCC8', category: 'data-viz', description: 'Line or area chart' },
  { name: 'statCallout', label: 'Stat Callout', icon: '\uD83D\uDD22', category: 'data-viz', description: 'Big number with label' },
  { name: 'sparkline', label: 'Sparkline', icon: '\u3030', category: 'data-viz', description: 'Inline mini chart' },
  { name: 'radarChart', label: 'Radar Chart', icon: '\uD83D\uDD78', category: 'data-viz', description: 'Spider chart' },
  { name: 'costTable', label: 'Cost Table', icon: '\uD83D\uDCB0', category: 'data-viz', description: 'Cost breakdown with totals' },
  // Visual Effects
  { name: 'halftoneBreak', label: 'Halftone Break', icon: '\u2B1B', category: 'visual-effects', description: 'Halftone gradient divider' },
  { name: 'ditheredImage', label: 'Dithered Image', icon: '\uD83D\uDDBC', category: 'visual-effects', description: 'Image with dither effects' },
  { name: 'svgPattern', label: 'SVG Pattern', icon: '\u2B21', category: 'visual-effects', description: 'Generated pattern' },
  // Media
  { name: 'image', label: 'Image', icon: '\uD83D\uDDBC', category: 'media', description: 'Image with caption' },
  { name: 'codeBlock', label: 'Code Block', icon: '\uD83D\uDCBB', category: 'media', description: 'Syntax highlighted code' },
  { name: 'embed', label: 'Embed', icon: '\uD83D\uDD17', category: 'media', description: 'Twitter, YouTube, etc.' },
  { name: 'mermaidDiagram', label: 'Mermaid Diagram', icon: '\uD83D\uDCD0', category: 'media', description: 'Code to diagram' },
  { name: 'audioPlayer', label: 'Audio Player', icon: '\uD83D\uDD0A', category: 'media', description: 'Audio with waveform' },
  { name: 'beforeAfter', label: 'Before/After', icon: '\u2194', category: 'media', description: 'Image comparison slider' },
  { name: 'pdfEmbed', label: 'PDF Embed', icon: '\uD83D\uDCC4', category: 'media', description: 'Inline PDF viewer' },
  // Research
  { name: 'citation', label: 'Citation', icon: '\uD83D\uDCD1', category: 'research', description: 'Paper reference card' },
  { name: 'thesisBlock', label: 'Thesis Block', icon: '\uD83C\uDFAF', category: 'research', description: 'Claim \u2192 evidence \u2192 implication' },
  { name: 'asideCallout', label: 'Aside / Callout', icon: '\uD83D\uDCA1', category: 'research', description: 'Callout with icon' },
  { name: 'axiom', label: 'Axiom / Principle', icon: '\uD83D\uDCDC', category: 'research', description: 'Numbered principle' },
  { name: 'literatureTable', label: 'Literature Table', icon: '\uD83D\uDCD6', category: 'research', description: 'Paper comparison grid' },
  // Developer
  { name: 'modelMatrix', label: 'Model Matrix', icon: '\uD83E\uDD16', category: 'developer', description: 'Model comparison grid' },
  { name: 'pipelineDiagram', label: 'Pipeline Diagram', icon: '\uD83D\uDD00', category: 'developer', description: 'Stage flow diagram' },
  { name: 'apiDoc', label: 'API Doc', icon: '\uD83D\uDCE1', category: 'developer', description: 'Endpoint documentation' },
  { name: 'terminalOutput', label: 'Terminal', icon: '\u25B6', category: 'developer', description: 'CLI output display' },
  { name: 'benchmark', label: 'Benchmark', icon: '\uD83D\uDCCA', category: 'developer', description: 'Metric display' },
  // Layout
  { name: 'twoColumn', label: 'Two Columns', icon: '\u2016', category: 'layout', description: 'Side by side layout' },
  { name: 'accordion', label: 'Accordion', icon: '\u25BC', category: 'layout', description: 'Collapsible section' },
  { name: 'timeline', label: 'Timeline', icon: '\uD83D\uDCC5', category: 'layout', description: 'Chronological entries' },
  { name: 'tabGroup', label: 'Tab Group', icon: '\uD83D\uDDC2', category: 'layout', description: 'Tabbed content' },
  { name: 'tocBlock', label: 'Table of Contents', icon: '\uD83D\uDCCB', category: 'layout', description: 'Auto-generated TOC' },
];

export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  'writing': 'Writing',
  'data-viz': 'Data Visualization',
  'visual-effects': 'Visual Effects',
  'media': 'Media & Embeds',
  'research': 'Research & Academic',
  'developer': 'Developer & AI/ML',
  'layout': 'Layout & Structure',
};

/**
 * Get blocks filtered by category
 */
export function getBlocksByCategory(category: BlockCategory): BlockDefinition[] {
  return BLOCK_REGISTRY.filter((block) => block.category === category);
}

/**
 * Find a block definition by name
 */
export function getBlockByName(name: string): BlockDefinition | undefined {
  return BLOCK_REGISTRY.find((block) => block.name === name);
}

/**
 * Get all unique categories in registry order
 */
export function getCategories(): BlockCategory[] {
  const seen = new Set<BlockCategory>();
  const categories: BlockCategory[] = [];
  for (const block of BLOCK_REGISTRY) {
    if (!seen.has(block.category)) {
      seen.add(block.category);
      categories.push(block.category);
    }
  }
  return categories;
}
