const fs = require('fs');
const https = require('https');
const path = require('path');
const yaml = require('js-yaml');

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

                // Split the body into lines
                const bodyLines = post.body.split('\n');

                let frontMatter = {};
                let contentBody = post.body;

                // Check if the body contains front matter already
                if (post.body.startsWith('---')) {
                    // Extract existing front matter
                    const bodyLines = post.body.split('\n');
                    const endFrontMatterIndex = bodyLines.indexOf('---', 1);
                    const frontMatterLines = bodyLines.slice(1, endFrontMatterIndex);
                    frontMatter = yaml.load(frontMatterLines.join('\n'));

                    // Update content body without front matter
                    contentBody = bodyLines.slice(endFrontMatterIndex + 1).join('\n');
                }

                // At this point, `contentBody` contains the body without front matter
                console.log(contentBody)
                // At this point, `contentBody` contains the body without front matter
                let contentLines = contentBody.split('\n');

                // Remove leading empty lines only
                while (contentLines.length > 0 && contentLines[0].trim() === '') {
                    contentLines.shift(); // Remove the first line if it's empty
                }

                // Now check if the first non-empty line is a title (i.e., starts with '# ')
                if (contentLines[0] && contentLines[0].startsWith('# ')) {
                    contentLines = contentLines.slice(1); // Remove the title line
                }

                // Rejoin the remaining lines into the final content body
                contentBody = contentLines.join('\n');

                console.log(contentLines)


                // Merge with new front matter
                frontMatter.title = post.title.replace(/"/g, '\\"');
                frontMatter.date = postDate.toISOString();
                frontMatter.draft = false;
                if (post.headline) {
                    frontMatter.description = post.headline.replace(/"/g, '\\"');
                }

                // Convert merged front matter back to YAML format
                const mergedFrontMatter = yaml.dump(frontMatter);

                // Final content with merged front matter
                const content = `---
${mergedFrontMatter.trim()}
---
${contentBody.trim()}
`;

                fs.writeFileSync(filePath, content, 'utf8');
            });
        });
    }).on('error', (e) => {
        console.error(`Failed to fetch posts: ${e.message}`);
    });
});
