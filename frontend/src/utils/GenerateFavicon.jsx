import React from 'react';
import { Zap } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// Render the Zap icon to an SVG string
const svgString = ReactDOMServer.renderToString(
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    {/* Red rounded square background */}
    <rect x="0" y="0" width="64" height="64" rx="16" fill="#ff3b30" />
    
    {/* Position the Zap icon in the center */}
    <g transform="translate(12, 12) scale(1.7)">
      <Zap color="white" size={24} strokeWidth={2} />
    </g>
  </svg>
);

console.log(svgString);

// This is just a utility script, not a React component
export default function GenerateFavicon() {
  return null;
}
