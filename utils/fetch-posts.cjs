const fs = require('fs');
const https = require('https');
const path = require('path');

// TODO: use your own Collected Notes site name
const API_URL = 'https://collectednotes.com/victoriadrake.json';

// Directory to save markdown files
const CONTENT_DIR = path.join(__dirname, '../content/blog');

// Ensure the directory exists
fs.mkdir(CONTENT_DIR, { recursive: true }, (err) => {
    if (err) {
        console.error('Failed to create directory:', err);
        return;
    }

    // Fetch the posts using https
    https.get(API_URL, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const posts = JSON.parse(data).notes;

            // Create a directory and markdown file for each post
            posts.forEach(post => {
                // Format the date as YYYYMMDD
                const postDate = new Date(post.updated_at);
                const formattedDate = postDate.toISOString().split('T')[0].replace(/-/g, '');

                // Combine the date with the post.path to form the directory name
                const postDirName = `${formattedDate}-${post.path}`;
                const postDir = path.join(CONTENT_DIR, postDirName);
                
                // Ensure the directory for this post exists
                fs.mkdirSync(postDir, { recursive: true });

                const filePath = path.join(postDir, 'index.md');
                
                // Check if the body contains front matter already
                const hasFrontMatter = post.body.startsWith('---');

                let content;
                if (!hasFrontMatter) {
                    // Split the body into lines
                    const bodyLines = post.body.split('\n');
                    
                    // Remove the first line if it's a title
                    if (bodyLines[0].startsWith('# ')) {
                        bodyLines.splice(0, 1);
                    }

                    const description = post.headline ? post.headline.replace(/"/g, '\\"') : '';

                    content = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: "${postDate.toISOString()}"
draft: false
description: "${description}"
---
${bodyLines.join('\n')}
`;
                } else {
                    // Process the post body to find and remove the title line following the front matter
                    const bodyLines = post.body.split('\n');
                    const endFrontMatterIndex = bodyLines.indexOf('---', 1); // Find the end of the front matter block

                    // Check the next three lines for a title
                    for (let i = endFrontMatterIndex + 1; i <= endFrontMatterIndex + 3; i++) {
                        if (bodyLines[i] && bodyLines[i].startsWith('# ')) {
                            bodyLines.splice(i, 1); // Remove the title line
                            break; // Remove only the first title found
                        }
                    }

                    content = bodyLines.join('\n');
                }

                fs.writeFileSync(filePath, content, 'utf8');
            });
        });
    }).on('error', (e) => {
        console.error(`Failed to fetch posts: ${e.message}`);
    });
});