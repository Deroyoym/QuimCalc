#!/usr/bin/env python3
"""
Script to add Vercel Analytics to all HTML files in the project.
Adds the script tag before the closing </head> tag.
"""

import os
import re
from pathlib import Path

# Analytics script to add
ANALYTICS_SCRIPT = '  <script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>\n'

def add_analytics_to_html(file_path):
    """Add Vercel Analytics script to an HTML file if not already present."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if analytics script is already present
    if 'vercel-insights.com' in content or 'cdn.vercel-insights' in content:
        print(f"⏭️  Skipping {file_path} - analytics already present")
        return False
    
    # Find the closing </head> tag and add the script before it
    if '</head>' in content:
        # Add the script just before </head>
        new_content = content.replace('</head>', f'{ANALYTICS_SCRIPT}</head>')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Added analytics to {file_path}")
        return True
    else:
        print(f"⚠️  Warning: No </head> tag found in {file_path}")
        return False

def main():
    """Process all HTML files in the quimcalc directory."""
    quimcalc_dir = Path('quimcalc')
    
    if not quimcalc_dir.exists():
        print("Error: quimcalc directory not found")
        return
    
    # Find all HTML files
    html_files = list(quimcalc_dir.rglob('*.html'))
    
    print(f"Found {len(html_files)} HTML files\n")
    
    modified_count = 0
    for html_file in sorted(html_files):
        if add_analytics_to_html(html_file):
            modified_count += 1
    
    print(f"\n📊 Summary: Modified {modified_count} of {len(html_files)} files")

if __name__ == '__main__':
    main()
