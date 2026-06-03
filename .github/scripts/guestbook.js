const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const author = process.env.ISSUE_AUTHOR;
    const rawBody = process.env.ISSUE_BODY || '';
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY; // e.g. "evannoshy/evannoshy"
    
    // We get the issue number from the environment if available
    const eventPath = process.env.GITHUB_EVENT_PATH;
    let issueNumber = '';
    if (eventPath && fs.existsSync(eventPath)) {
      const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      issueNumber = eventData.issue ? eventData.issue.number : '';
    }

    if (!author || !token || !repo) {
      console.error("Missing required environment variables.");
      process.exit(1);
    }

    // Clean and truncate message to prevent spam/markdown breaking (max 140 chars)
    let message = rawBody
      .replace(/[\r\n]+/g, ' ') // Make single-line
      .replace(/<[^>]*>/g, '')  // Remove HTML
      .trim();
      
    if (message.length > 140) {
      message = message.substring(0, 137) + '...';
    }

    if (!message) {
      message = "Hello! Left a signature on your profile.";
    }

    // Format date: YYYY-MM-DD
    const dateStr = new Date().toISOString().split('T')[0];

    // Read README.md
    const readmePath = path.join(process.cwd(), 'README.md');
    if (!fs.existsSync(readmePath)) {
      console.error("README.md not found in workspace root.");
      process.exit(1);
    }
    
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Parse guestbook block
    const startMarker = "<!-- START_SECTION:guestbook -->";
    const endMarker = "<!-- END_SECTION:guestbook -->";

    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      console.error("Guestbook comment markers not found in README.md.");
      process.exit(1);
    }

    // Get current contents between markers
    const currentBlock = readmeContent.substring(startIndex + startMarker.length, endIndex);
    
    // Extract list items
    const lines = currentBlock
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'));

    // Create new line with visitor avatar & sign
    // e.g. - <img src="https://github.com/author.png" width="20" height="20" style="border-radius: 50%"/> **[@author](https://github.com/author)**: "message" *2026-06-03*
    const newLine = `- <img src="https://github.com/${author}.png" width="20" height="20" style="border-radius: 50%; vertical-align: middle;"/> **[@${author}](https://github.com/${author})**: "${message}" _${dateStr}_`;

    // Add new line to top of the list
    lines.unshift(newLine);

    // Limit list size to 8 entries
    const limitedLines = lines.slice(0, 8);

    // Reconstruct guestbook content block
    const newBlockContent = `\n${limitedLines.join('\n')}\n`;

    // Update README.md file
    const newReadmeContent = 
      readmeContent.substring(0, startIndex + startMarker.length) +
      newBlockContent +
      readmeContent.substring(endIndex);

    fs.writeFileSync(readmePath, newReadmeContent, 'utf8');
    console.log("README.md updated successfully with new guestbook sign.");

    // Close issue and leave a thank-you comment using GitHub REST API via native fetch
    if (issueNumber) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Guestbook-Sync-Action'
      };

      // 1. Create a comment
      const commentUrl = `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`;
      const commentBody = JSON.stringify({
        body: `🎉 Thanks for signing, @${author}! Your message has been dynamically integrated into my README profile.`
      });
      
      const commentRes = await fetch(commentUrl, { method: 'POST', headers, body: commentBody });
      if (commentRes.ok) {
        console.log("Comment successfully posted to issue.");
      } else {
        console.error("Failed to post comment:", await commentRes.text());
      }

      // 2. Close the issue
      const closeUrl = `https://api.github.com/repos/${repo}/issues/${issueNumber}`;
      const closeBody = JSON.stringify({ state: 'closed', state_reason: 'completed' });
      
      const closeRes = await fetch(closeUrl, { method: 'PATCH', headers, body: closeBody });
      if (closeRes.ok) {
        console.log(`Issue #${issueNumber} successfully closed.`);
      } else {
        console.error("Failed to close issue:", await closeRes.text());
      }
    }

  } catch (error) {
    console.error("Action error:", error);
    process.exit(1);
  }
}

run();
