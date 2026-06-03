// ==========================================================================
// DEV PROFILES DATABASE
// ==========================================================================
const PROFILES_DATA = [
  {
    username: "simonw",
    name: "Simon Willison",
    category: "custom",
    tags: ["TILs", "Blog Feed", "Releases"],
    description: "The pioneer of self-updating READMEs. Uses a custom Python script via GitHub Actions to scrap and inject his latest releases, blog posts, and Today-I-Learned entries.",
    color: "purple",
    workflow: `# .github/workflows/build.yml
name: Build README

on:
  push:
  workflow_dispatch:
  schedule:
    - cron: '0 */6 * * *' # Runs every 6 hours

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Check out repo
      uses: actions/checkout@v3
      
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
        
    - name: Install dependencies
      run: pip install -r requirements.txt
      
    - name: Fetch content & Update README
      run: |
        python build_readme.py
        
    - name: Commit and push if changed
      run: |-
        git config user.name "readme-bot"
        git config user.email "actions@users.noreply.github.com"
        git add README.md
        git commit -m "Updated README with latest content" || exit 0
        git push`,
    readme_placeholder: `<!-- Column tags used in simonw/simonw README.md -->
### Recent Today I Learneds
<!-- til starts -->
... dynamic list of TILs ...
<!-- til ends -->

### Recent Blog Posts
<!-- blog starts -->
... dynamic list of posts ...
<!-- blog ends -->`
  },
  {
    username: "gautamkrishnar",
    name: "Gautam Krishna R",
    category: "blogs",
    tags: ["RSS Blogs", "Creator"],
    description: "Creator of the highly popular 'blog-post-workflow' Action. His profile showcases automatic imports from multiple blogs, Dev.to, and StackOverflow.",
    color: "cyan",
    workflow: `# .github/workflows/blog-posts.yml
name: Latest Blog Posts

on:
  schedule:
    # Runs every hour
    - cron: '0 * * * *'
  workflow_dispatch:

jobs:
  update-readme:
    name: Update README with blogs
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Pull RSS posts
        uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "BLOG-POST-LIST"
          feed_list: "https://dev.to/feed/gautamkrishnar,https://medium.com/feed/@gautamkrishnar"`,
    readme_placeholder: `<!-- Place this in your README.md where you want posts to appear -->
### ✍️ My Latest Blog Posts
<!-- BLOG-POST-LIST:START -->
<!-- BLOG-POST-LIST:END -->`
  },
  {
    username: "abhisheknaiidu",
    name: "Abhishek Naidu",
    category: "blogs",
    tags: ["Blog Posts", "Dev.to"],
    description: "Owner of the awesome-github-profile-readme repo. Showcases dynamic blog post integration from Medium/Dev.to and links to active repositories.",
    color: "cyan",
    workflow: `# .github/workflows/blog-posts.yml
name: Update Blog Posts

on:
  schedule:
    - cron: '0 */12 * * *' # Every 12 hours
  workflow_dispatch:

jobs:
  update-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "BLOG-POST-LIST"
          feed_list: "https://dev.to/feed/abhisheknaiidu"`,
    readme_placeholder: `<!-- README.md Section -->
### 📝 Latest Articles
<!-- BLOG-POST-LIST:START -->
<!-- BLOG-POST-LIST:END -->`
  },
  {
    username: "thmsgbrt",
    name: "Thomas Guibert",
    category: "music",
    tags: ["Spotify", "WakaTime"],
    description: "Integrates multiple GitHub Actions: WakaTime coding stats, Spotify current playing song via custom SVGs, and recent dev.to posts.",
    color: "purple",
    workflow: `# .github/workflows/spotify-waka.yml
name: Spotify & WakaTime Sync

on:
  schedule:
    - cron: '*/15 * * * *' # Every 15 minutes
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update WakaTime & Spotify
        uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_OS: "false"
          SHOW_PROJECTS: "true"
      # For Spotify stats
      - name: Spotify Readme
        uses: aralroca/spotify-readme@master
        with:
          client_id: \${{ secrets.SPOTIFY_CLIENT_ID }}
          client_secret: \${{ secrets.SPOTIFY_CLIENT_SECRET }}
          refresh_token: \${{ secrets.SPOTIFY_REFRESH_TOKEN }}`,
    readme_placeholder: `<!-- WakaTime block -->
<!--START_SECTION:waka-->
<!--END_SECTION:waka-->

<!-- Spotify playing block -->
<!--SPOTIFY_WRITING:START-->
<!--SPOTIFY_WRITING:END-->`
  },
  {
    username: "bdougie",
    name: "Brian Douglas",
    category: "activity",
    tags: ["Podcast", "Activity", "RSS"],
    description: "Pulls in latest podcast episodes, blog articles, and real-time GitHub activity feed like PRs, comments, and stargazes.",
    color: "cyan",
    workflow: `# .github/workflows/readme-activity.yml
name: Update README Activity

on:
  schedule:
    - cron: '*/30 * * * *' # Every 30 mins
  workflow_dispatch:

jobs:
  update-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update Activity Feed
        uses: jamesgeorge007/github-activity-readme@master
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          COMMIT_MSG: "Updated README with recent GitHub activity"
          MAX_LINES: 10`,
    readme_placeholder: `<!-- README.md Placement -->
### 🗣️ My Recent Activity
<!--START_SECTION:activity-->
<!--END_SECTION:activity-->`
  },
  {
    username: "sw-yx",
    name: "Shawn Wang",
    category: "custom",
    tags: ["Twitter Feed", "Dev.to", "Newsletters"],
    description: "Features a multi-source self-updating layout containing fresh dev.to posts, recent YouTube uploads, newsletter signups, and tweets using custom Node scripts.",
    color: "purple",
    workflow: `# .github/workflows/sw-yx-sync.yml
name: Sync Profile

on:
  schedule:
    - cron: '0 0 * * *' # Daily
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - name: Fetch API Feeds & Parse
        run: node sync-profile.js
      - name: Deploy changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add README.md
          git commit -m "chore: auto-update readme" || exit 0
          git push`,
    readme_placeholder: `<!-- custom comments in sw-yx README -->
<!-- twitter-feed-start -->
...
<!-- twitter-feed-end -->`
  },
  {
    username: "mokkapps",
    name: "Michael Hoffmann",
    category: "blogs",
    tags: ["Dev.to", "Tech Stack", "Activity"],
    description: "Updates Dev.to articles list automatically and dynamically. Displays beautiful badges for tech stack and GitHub project stats.",
    color: "cyan",
    workflow: `# .github/workflows/mokkapps-blogs.yml
name: Fetch Mokkapps Blogs

on:
  schedule:
    - cron: '0 3 * * *' # 3 AM daily
  workflow_dispatch:

jobs:
  blogs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "BLOG-POST-LIST"
          feed_list: "https://mokkapps.de/rss.xml"`,
    readme_placeholder: `### 📝 Latest Articles from my Blog
<!-- BLOG-POST-LIST:START -->
<!-- BLOG-POST-LIST:END -->`
  },
  {
    username: "athul",
    name: "Athul Cyriac Ajay",
    category: "wakatime",
    tags: ["WakaTime", "Activity", "Dev.to"],
    description: "Maintains a detailed breakdown of daily coding hours (WakaTime) and list of latest written articles automatically using custom actions.",
    color: "purple",
    workflow: `# .github/workflows/waka.yml
name: Waka README

on:
  schedule:
    - cron: '0 0 * * *' # Midnight daily
  workflow_dispatch:

jobs:
  update-readme:
    name: WakaTime Stats
    runs-on: ubuntu-latest
    steps:
      - uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_TITLE: true
          BLOCKS: "░▒▓█"
          TIME_RANGE: "all_time"
          SHOW_TOTAL: true`,
    readme_placeholder: `<!-- START_SECTION:waka -->
<!-- END_SECTION:waka -->`
  },
  {
    username: "roaldnefs",
    name: "Roald Nefs",
    category: "wakatime",
    tags: ["WakaTime", "Contributions", "Activity"],
    description: "Features automatic synchronizations of coding analytics from WakaTime, real-time contribution charts, and recent GitHub pull requests.",
    color: "cyan",
    workflow: `# .github/workflows/update.yml
name: Waka & GitHub Stats

on:
  schedule:
    - cron: '0 2 * * *' # 2 AM daily
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update WakaTime
        uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_TIME: true
          SHOW_MASKED_TIME: true`,
    readme_placeholder: `<!--START_SECTION:waka-->
<!--END_SECTION:waka-->`
  },
  {
    username: "blackcater",
    name: "Elon Tang",
    category: "metrics",
    tags: ["Metrics", "WakaTime", "Blog posts"],
    description: "One of the most complex metrics displays. Aggregates WakaTime stats, GitHub contribution graphs, achievements, and latest posts into dynamic SVG templates.",
    color: "purple",
    workflow: `# .github/workflows/metrics.yml
name: Update Profile Metrics

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  github-metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Generate metrics SVG
        uses: lowlighter/metrics@latest
        with:
          token: \${{ secrets.METRICS_TOKEN }}
          base: header, activity, community, repositories
          plugin_wakatime: yes
          plugin_wakatime_token: \${{ secrets.WAKATIME_API_KEY }}
          plugin_wakatime_sections: time, projects, languages`,
    readme_placeholder: `<!-- README.md integration -->
![GitHub Metrics Info](github-metrics.svg)`
  },
  {
    username: "Spiderpig86",
    name: "Stanley Lim",
    category: "metrics",
    tags: ["WakaTime", "Medium Blogs", "Spotify"],
    description: "Showcases beautiful, automated layout sections including coding metrics, recent articles from Medium, and a dynamic Spotify widget that shows current track.",
    color: "cyan",
    workflow: `# .github/workflows/spider-stats.yml
name: Update Profile README

on:
  schedule:
    - cron: '0 */4 * * *' # Every 4 hours
  workflow_dispatch:

jobs:
  update-stats:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: WakaTime Stats
        uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_PROJECTS: "true"
      - name: Medium Feed
        uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "MEDIUM-POST-LIST"
          feed_list: "https://medium.com/feed/@spiderpig86"`,
    readme_placeholder: `<!--START_SECTION:waka-->
<!--END_SECTION:waka-->

<!-- MEDIUM-POST-LIST:START -->
<!--MEDIUM-POST-LIST:END -->`
  },
  {
    username: "JessicaLim8",
    name: "Jessica Lim",
    category: "custom",
    tags: ["Quotes Generator", "Blogs Feed"],
    description: "Creates an interactive, beautiful experience featuring dynamic RSS newsfeeds, tech stacks, and a custom GitHub Action that generates randomly selected programming quotes.",
    color: "purple",
    workflow: `# .github/workflows/quotes.yml
name: Random Programming Quote

on:
  schedule:
    - cron: '0 0 * * *' # Daily
  workflow_dispatch:

jobs:
  quote:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Quote
        uses: JessicaLim8/readme-quotes-action@master
      - name: Commit and push changes
        run: |
          git config user.name "quote-bot"
          git config user.email "bot@jessicalim.com"
          git commit -am "chore: Update programming quote" || exit 0
          git push`,
    readme_placeholder: `<!-- README.md quote tag -->
<!-- START_SECTION:quote -->
> "Debugging is twice as hard as writing the code in the first place..."
<!-- END_SECTION:quote -->`
  },
  {
    username: "codestackr",
    name: "Jesse (codeSTACKr)",
    category: "blogs",
    tags: ["YouTube Feed", "WakaTime", "Dev.to"],
    description: "Fetches his latest YouTube uploads and dev.to articles automatically, showing them under visual banners alongside live WakaTime coding charts.",
    color: "cyan",
    workflow: `# .github/workflows/codestackr.yml
name: Sync YouTube & Blog

on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch:

jobs:
  update-feeds:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Pull YouTube Videos
        uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "YOUTUBE-FEED"
          feed_list: "https://www.youtube.com/feeds/videos.xml?channel_id=UCJZvR6PxJV_50TqH5QHOP1Q"
      - name: Pull Blogs
        uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "BLOG-FEED"
          feed_list: "https://dev.to/feed/codestackr"`,
    readme_placeholder: `### 📺 Latest YouTube Videos
<!-- YOUTUBE-FEED:START -->
<!-- YOUTUBE-FEED:END -->

### ✍️ Latest Blogs
<!-- BLOG-FEED:START -->
<!-- BLOG-FEED:END -->`
  },
  {
    username: "teoxoy",
    name: "teoxoy",
    category: "metrics",
    tags: ["Metrics", "Stats Cards", "WakaTime"],
    description: "Displays highly interactive, graphical indicators. Uses advanced metrics APIs to output beautiful progress bars for languages and automated repository reviews.",
    color: "purple",
    workflow: `# .github/workflows/teoxoy-metrics.yml
name: Profile Metrics

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: lowlighter/metrics@latest
        with:
          token: \${{ secrets.METRICS_TOKEN }}
          base: ""
          plugin_languages: yes
          plugin_languages_ignored: html, css, tex
          plugin_languages_details: bytes-size, percentage
          plugin_wakatime: yes
          plugin_wakatime_token: \${{ secrets.WAKATIME_API_KEY }}`
  },
  {
    username: "lifeparticle",
    name: "lifeparticle",
    category: "blogs",
    tags: ["Charts", "WakaTime", "Dev.to"],
    description: "Uses profile-readme automation to update Medium/Dev.to articles. Incorporates custom dynamic SVG visual layouts mapping personal progress.",
    color: "cyan",
    workflow: `# .github/workflows/lifeparticle.yml
name: Update README Feed

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch latest blogs
        uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "BLOG-POST-LIST"
          feed_list: "https://dev.to/feed/lifeparticle"`
  }
];

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let activeTab = "dashboard"; // dashboard | builder
let activeFilter = "all";
let searchQuery = "";
let selectedProfile = null;
let modalActiveTab = "overview"; // overview | readme | workflow

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // Navigation & Page Tabs
  const navDashboard = document.getElementById("nav-dashboard");
  const navBuilder = document.getElementById("nav-builder");
  const dashboardSection = document.getElementById("dashboard-section");
  const builderSection = document.getElementById("builder-section");

  navDashboard.addEventListener("click", () => {
    switchTab("dashboard");
  });
  navBuilder.addEventListener("click", () => {
    switchTab("builder");
  });

  function switchTab(tab) {
    activeTab = tab;
    if (tab === "dashboard") {
      navDashboard.classList.add("active");
      navBuilder.classList.remove("active");
      dashboardSection.style.display = "block";
      builderSection.style.display = "none";
    } else {
      navDashboard.classList.remove("active");
      navBuilder.classList.add("active");
      dashboardSection.style.display = "none";
      builderSection.style.display = "grid";
      // Initialize Builder with default templates
      updateBuilderOutput();
    }
  }

  // Dashboard Filters
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-select");
  const chips = document.querySelectorAll(".chip");

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderGrid();
  });

  filterSelect.addEventListener("change", (e) => {
    activeFilter = e.target.value;
    updateChipsUI();
    renderGrid();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      activeFilter = chip.getAttribute("data-filter");
      filterSelect.value = activeFilter;
      updateChipsUI();
      renderGrid();
    });
  });

  function updateChipsUI() {
    chips.forEach(chip => {
      if (chip.getAttribute("data-filter") === activeFilter) {
        chip.classList.add("active");
      } else {
        chip.classList.remove("active");
      }
    });
  }

  // Initial Grid Render
  renderGrid();

  // Modal Setup
  setupModal();

  // Wizard Builder Setup
  setupBuilder();
}

// ==========================================================================
// RENDER PROFILE GRID
// ==========================================================================
function renderGrid() {
  const grid = document.getElementById("profiles-grid");
  grid.innerHTML = "";

  const filtered = PROFILES_DATA.filter(profile => {
    const matchesSearch = profile.username.toLowerCase().includes(searchQuery) ||
                          profile.name.toLowerCase().includes(searchQuery) ||
                          profile.description.toLowerCase().includes(searchQuery) ||
                          profile.tags.some(tag => tag.toLowerCase().includes(searchQuery));
    
    const matchesFilter = activeFilter === "all" || profile.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <div class="no-results-icon">🔍</div>
        <h3>No profile action templates found</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">Try adjusting your keywords or category filters</p>
      </div>
    `;
    return;
  }

  filtered.forEach(profile => {
    const card = document.createElement("div");
    card.className = `dev-card \${profile.color === 'purple' ? 'purple' : ''}`;
    card.addEventListener("click", () => {
      openProfileModal(profile);
    });

    const tagsHTML = profile.tags.map(tag => `<span class="card-tag">\${tag}</span>`).join("");

    card.innerHTML = `
      <div class="card-header">
        <div class="avatar-wrapper">
          <img class="avatar-img" src="https://github.com/\${profile.username}.png" alt="\${profile.name}" onerror="this.src='https://github.com/github.png'">
        </div>
        <div class="card-title-area">
          <h4 class="dev-name">\${profile.name}</h4>
          <span class="dev-username">@\${profile.username}</span>
        </div>
      </div>
      <div class="card-body">
        <p class="card-desc">\${profile.description}</p>
      </div>
      <div class="card-footer">
        <div class="card-tags">
          \${tagsHTML}
        </div>
        <span class="card-action-btn">
          Explore <span style="font-size: 1.1rem; line-height: 1;">→</span>
        </span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==========================================================================
// MODAL CONTROLS & README RENDERING
// ==========================================================================
function setupModal() {
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("close-modal-btn");
  const tabs = document.querySelectorAll(".modal-tab-btn");

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      switchModalTab(targetTab);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeModal();
    }
  });

  // Setup Copy Clipboard button
  const copyBtn = document.getElementById("copy-workflow-btn");
  copyBtn.addEventListener("click", () => {
    if (!selectedProfile) return;
    navigator.clipboard.writeText(selectedProfile.workflow).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `<span>✓ Copied!</span>`;
      copyBtn.style.background = "var(--accent-green)";
      copyBtn.style.borderColor = "var(--accent-green)";
      copyBtn.style.color = "white";
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = "";
        copyBtn.style.borderColor = "";
        copyBtn.style.color = "";
      }, 2000);
    });
  });
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("open");
  selectedProfile = null;
  // Clear modal contents
  document.getElementById("modal-readme-content").innerHTML = "";
  document.getElementById("modal-workflow-code").innerHTML = "";
}

function openProfileModal(profile) {
  selectedProfile = profile;
  const overlay = document.getElementById("modal-overlay");
  
  // Update Profile Headers
  document.getElementById("modal-avatar-img").src = `https://github.com/\${profile.username}.png`;
  document.getElementById("modal-avatar-img").onerror = function() { this.src = 'https://github.com/github.png'; };
  document.getElementById("modal-name").innerText = profile.name;
  document.getElementById("modal-username").innerText = `@\${profile.username}`;
  document.getElementById("modal-github-link").href = `https://github.com/\${profile.username}`;
  
  // Set tab active state default to overview
  switchModalTab("overview");

  // Open overlay
  overlay.classList.add("open");
}

function switchModalTab(tabName) {
  modalActiveTab = tabName;
  const tabs = document.querySelectorAll(".modal-tab-btn");
  const contents = document.querySelectorAll(".modal-tab-content");

  tabs.forEach(btn => {
    if (btn.getAttribute("data-tab") === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  contents.forEach(content => {
    if (content.id === `modal-tab-\${tabName}`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });

  if (tabName === "overview" && selectedProfile) {
    renderOverviewTab();
  } else if (tabName === "readme" && selectedProfile) {
    renderLiveReadme();
  } else if (tabName === "workflow" && selectedProfile) {
    renderWorkflowTab();
  }
}

function renderOverviewTab() {
  const desc = document.getElementById("overview-description");
  const metaWorkflow = document.getElementById("meta-workflow-type");
  const metaAuthor = document.getElementById("meta-author");
  const metaTags = document.getElementById("meta-tags");

  desc.innerHTML = `
    <p class="explanation-text">\${selectedProfile.description}</p>
    <div style="margin-top: 1.5rem;">
      <h4 style="margin-bottom: 0.5rem; font-family: 'Outfit';">Workflow Implementation Details</h4>
      <p class="explanation-text">To integrate this automation, the developer runs a GitHub Actions workflow triggered via a <code>schedule</code> cron job. It periodically runs scripts or pulls feeds to inject dynamic HTML/Markdown comments in their <code>README.md</code> profile page. Check out the <strong>Live Profile Preview</strong> tab to see it live or the <strong>Workflow Code</strong> tab to see their config file.</p>
    </div>
  `;
  
  let catName = "RSS Blog Posts";
  if (selectedProfile.category === "wakatime") catName = "WakaTime Coding Stats";
  if (selectedProfile.category === "metrics") catName = "GitHub Metrics SVG";
  if (selectedProfile.category === "activity") catName = "GitHub Activity Feed";
  if (selectedProfile.category === "music") catName = "Spotify / Music integration";
  if (selectedProfile.category === "custom") catName = "Custom Script Runner";

  metaWorkflow.innerHTML = `<span class="workflow-pill">\${catName}</span>`;
  metaAuthor.innerHTML = `<a href="https://github.com/\${selectedProfile.username}" target="_blank">@\${selectedProfile.username}</a>`;
  metaTags.innerHTML = selectedProfile.tags.map(tag => `<span class="card-tag" style="background: rgba(255,255,255,0.05)">\${tag}</span>`).join(" ");
}

function renderWorkflowTab() {
  const codeBlock = document.getElementById("modal-workflow-code");
  codeBlock.textContent = selectedProfile.workflow;
  
  // Trigger Prism highlighting if loaded
  if (window.Prism) {
    Prism.highlightElement(codeBlock);
  }
}

function renderLiveReadme() {
  const container = document.getElementById("modal-readme-content");
  if (container.innerHTML !== "") return; // Already loaded

  container.innerHTML = `
    <div class="loader-wrapper">
      <div class="spinner"></div>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">Fetching profile README from GitHub...</p>
    </div>
  `;

  const username = selectedProfile.username;
  const mainUrl = `https://raw.githubusercontent.com/\${username}/\${username}/main/README.md`;
  const masterUrl = `https://raw.githubusercontent.com/\${username}/\${username}/master/README.md`;

  // Fetch from main first
  fetchReadme(mainUrl)
    .catch(() => {
      // Fallback to master
      return fetchReadme(masterUrl);
    })
    .then(markdown => {
      // Success: Render Markdown
      if (!markdown) {
        throw new Error("Empty README");
      }
      
      // Parse markdown using marked.js
      let parsedHTML = "";
      if (window.marked && window.marked.parse) {
        parsedHTML = window.marked.parse(markdown);
      } else {
        parsedHTML = `<pre style="white-space: pre-wrap;">\${markdown}</pre>`;
      }
      
      // Clean up relative images and link paths in the generated HTML
      parsedHTML = fixGithubRelativePaths(parsedHTML, username);

      container.innerHTML = `<div class="markdown-body">\${parsedHTML}</div>`;
    })
    .catch(err => {
      // Error
      container.innerHTML = `
        <div class="no-results" style="border: none; background: transparent;">
          <div class="no-results-icon" style="color: var(--accent-magenta);">⚠️</div>
          <h3>Failed to load README.md</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem; max-width: 450px; margin-left: auto; margin-right: auto;">
            We couldn't retrieve the live README.md file. This might be due to GitHub network issues or the file is hosted in a different branch.
          </p>
          <a class="copy-btn" href="https://github.com/\${username}/\${username}" target="_blank" style="display: inline-flex; margin-top: 1.5rem;">
             View repo on GitHub
          </a>
        </div>
      `;
    });
}

function fetchReadme(url) {
  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error("HTTP error " + res.status);
    }
    return res.text();
  });
}

/**
 * Rewrites relative URLs to point to github raw files.
 * Example: 'assets/logo.png' -> 'https://raw.githubusercontent.com/username/username/main/assets/logo.png'
 */
function fixGithubRelativePaths(html, username) {
  const baseUrl = `https://raw.githubusercontent.com/\${username}/\${username}/main`;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Fix image tags
  const images = doc.querySelectorAll("img");
  images.forEach(img => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("https") && !src.startsWith("data:")) {
      // Resolve relative path
      const cleanSrc = src.startsWith("./") ? src.substring(2) : src;
      img.setAttribute("src", `\${baseUrl}/\${cleanSrc}`);
    }
  });

  // Fix anchor tags
  const links = doc.querySelectorAll("a");
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("https") && !href.startsWith("#")) {
      const cleanHref = href.startsWith("./") ? href.substring(2) : href;
      link.setAttribute("href", `https://github.com/\${username}/\${username}/blob/main/\${cleanHref}`);
      link.setAttribute("target", "_blank");
    }
  });

  return doc.body.innerHTML;
}

// ==========================================================================
// INTERACTIVE WORKFLOW BUILDER
// ==========================================================================
function setupBuilder() {
  const bUsername = document.getElementById("builder-username");
  const formRSS = document.getElementById("form-rss");
  const formWaka = document.getElementById("form-waka");
  const formSpotify = document.getElementById("form-spotify");
  const formMetrics = document.getElementById("form-metrics");

  const optionRSS = document.getElementById("opt-rss");
  const optionWaka = document.getElementById("opt-waka");
  const optionSpotify = document.getElementById("opt-spotify");
  const optionMetrics = document.getElementById("opt-metrics");

  const stepCard2 = document.getElementById("step-card-2");
  const stepCard3 = document.getElementById("step-card-3");

  // Setup Radios & Step reveals
  const radios = document.querySelectorAll('input[name="builder-feature"]');
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const value = e.target.value;
      
      // Update Step Card 2 UI to show corresponding form
      stepCard2.classList.add("active");
      
      // Hide all input forms
      formRSS.style.display = "none";
      formWaka.style.display = "none";
      formSpotify.style.display = "none";
      formMetrics.style.display = "none";

      // Show selected input form
      if (value === "rss") formRSS.style.display = "block";
      if (value === "waka") formWaka.style.display = "block";
      if (value === "spotify") formSpotify.style.display = "block";
      if (value === "metrics") formMetrics.style.display = "block";

      stepCard3.classList.add("active");
      updateBuilderOutput();
    });
  });

  // Watch inputs to update generated code in real time
  const inputs = document.querySelectorAll(".form-control, input[name='builder-feature']");
  inputs.forEach(input => {
    input.addEventListener("input", updateBuilderOutput);
    input.addEventListener("change", updateBuilderOutput);
  });

  // Builder outputs copy buttons
  const copyYaml = document.getElementById("copy-gen-yaml");
  const copyMd = document.getElementById("copy-gen-md");

  copyYaml.addEventListener("click", () => {
    const text = document.getElementById("builder-yaml-code").textContent;
    copyToClipboard(text, copyYaml);
  });

  copyMd.addEventListener("click", () => {
    const text = document.getElementById("builder-md-code").textContent;
    copyToClipboard(text, copyMd);
  });

  // Builder tabs
  const tabYaml = document.getElementById("btn-gen-yaml");
  const tabMd = document.getElementById("btn-gen-md");
  const outputYaml = document.getElementById("output-gen-yaml");
  const outputMd = document.getElementById("output-gen-md");

  tabYaml.addEventListener("click", () => {
    tabYaml.classList.add("active");
    tabMd.classList.remove("active");
    outputYaml.classList.add("active");
    outputMd.classList.remove("active");
    copyYaml.style.display = "block";
    copyMd.style.display = "none";
  });

  tabMd.addEventListener("click", () => {
    tabMd.classList.add("active");
    tabYaml.classList.remove("active");
    outputMd.classList.add("active");
    outputYaml.classList.remove("active");
    copyYaml.style.display = "none";
    copyMd.style.display = "block";
  });
}

function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = element.innerHTML;
    element.innerHTML = `<span>✓ Copied!</span>`;
    element.style.background = "var(--accent-green)";
    element.style.borderColor = "var(--accent-green)";
    element.style.color = "white";
    setTimeout(() => {
      element.innerHTML = originalText;
      element.style.background = "";
      element.style.borderColor = "";
      element.style.color = "";
    }, 2000);
  });
}

function updateBuilderOutput() {
  const username = document.getElementById("builder-username").value.trim() || "your-username";
  const feature = document.querySelector('input[name="builder-feature"]:checked')?.value || "rss";

  let generatedYaml = "";
  let generatedMd = "";
  let guideHtml = "";

  if (feature === "rss") {
    const feedUrl = document.getElementById("input-rss-feed").value.trim() || "https://dev.to/feed/your-username";
    const commentTag = document.getElementById("input-rss-tag").value.trim() || "BLOG-POST-LIST";
    
    generatedYaml = `# .github/workflows/blog-posts-sync.yml
name: Blog Feed Auto Sync

on:
  schedule:
    # Runs every 6 hours
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  update-readme:
    name: Fetch Blog Posts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
        
      - name: Fetch RSS feeds
        uses: gautamkrishnar/blog-post-workflow@master
        with:
          comment_tag_name: "${commentTag}"
          feed_list: "${feedUrl}"`;

    generatedMd = `<!-- Add this section to your README.md where you want the blogs to appear -->
### 📝 Latest Articles

<!-- ${commentTag}:START -->
<!-- ${commentTag}:END -->`;

    guideHtml = `
      <div class="generator-guide">
        <span class="guide-icon">💡</span>
        <div>
          <strong style="display:block; margin-bottom: 0.25rem;">How to set up:</strong>
          1. Create <code>.github/workflows/blog-posts-sync.yml</code> in your profile repository.<br>
          2. Paste the Workflow YAML config inside it.<br>
          3. Add the Markdown placeholder inside your root <code>README.md</code> file.<br>
          4. GitHub Actions will run automatically, fetch articles from <strong>${feedUrl}</strong>, and populate them within the tags.
        </div>
      </div>
    `;

  } else if (feature === "waka") {
    const wakaTimeMode = document.getElementById("input-waka-theme").value;
    
    generatedYaml = `# .github/workflows/wakatime-sync.yml
name: Update WakaTime Coding Stats

on:
  schedule:
    # Runs at 00:00 every day
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  update-readme:
    name: Update Waka Stats
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
        
      - name: Sync WakaTime
        uses: athul/waka-readme@master
        with:
          WAKATIME_API_KEY: \${{ secrets.WAKATIME_API_KEY }}
          SHOW_OS: "true"
          SHOW_PROJECTS: "true"
          SHOW_MASKED_TIME: "false"
          TIME_RANGE: "last_7_days"
          SHOW_LANGUAGE_PER_PROJECT: "false"`;

    generatedMd = `<!-- Add this section to your README.md where you want stats to appear -->
### 📊 Coding Activity

<!--START_SECTION:waka-->
<!--END_SECTION:waka-->`;

    guideHtml = `
      <div class="generator-guide">
        <span class="guide-icon">💡</span>
        <div>
          <strong style="display:block; margin-bottom: 0.25rem;">WakaTime Setup Details:</strong>
          1. Create a WakaTime account, go to Account Settings and copy your <strong>API Key</strong>.<br>
          2. Go to your GitHub profile repository, click on <strong>Settings > Secrets and variables > Actions</strong>.<br>
          3. Create a repository secret named <code>WAKATIME_API_KEY</code> and paste your WakaTime API key.<br>
          4. Commit this workflow to <code>.github/workflows/wakatime-sync.yml</code> and add the waka comment tags to your <code>README.md</code>.
        </div>
      </div>
    `;

  } else if (feature === "spotify") {
    generatedYaml = `# .github/workflows/spotify-sync.yml
name: Spotify Readme Sync

on:
  schedule:
    # Runs every 15 minutes to keep it highly updated
    - cron: '*/15 * * * *'
  workflow_dispatch:

jobs:
  spotify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
        
      - name: Spotify Track Updater
        uses: aralroca/spotify-readme@master
        with:
          client_id: \${{ secrets.SPOTIFY_CLIENT_ID }}
          client_secret: \${{ secrets.SPOTIFY_CLIENT_SECRET }}
          refresh_token: \${{ secrets.SPOTIFY_REFRESH_TOKEN }}`;

    generatedMd = `<!-- Add this in your README.md where you want the spotify widget to show -->
### 🎵 Currently Playing
<!--SPOTIFY_WRITING:START-->
<!--SPOTIFY_WRITING:END-->`;

    guideHtml = `
      <div class="generator-guide">
        <span class="guide-icon">💡</span>
        <div>
          <strong style="display:block; margin-bottom: 0.25rem;">Spotify Setup Details:</strong>
          You need to generate Spotify Web API credentials to allow access:<br>
          1. Go to <a href="https://developer.spotify.com/dashboard" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">Spotify Developer Dashboard</a>, create an App, and obtain <code>Client ID</code> and <code>Client Secret</code>.<br>
          2. Set Redirect URI to <code>http://localhost:3000/callback</code>.<br>
          3. Request a <code>refresh_token</code> for the user-read-currently-playing scope.<br>
          4. Add <code>SPOTIFY_CLIENT_ID</code>, <code>SPOTIFY_CLIENT_SECRET</code>, and <code>SPOTIFY_REFRESH_TOKEN</code> to your repository Secrets.
        </div>
      </div>
    `;

  } else if (feature === "metrics") {
    const selectedPlugins = Array.from(document.querySelectorAll("input[name='metrics-plugins']:checked")).map(el => el.value);
    const hasLanguages = selectedPlugins.includes("languages") ? "yes" : "no";
    const hasIso = selectedPlugins.includes("iso") ? "yes" : "no";
    const hasHabits = selectedPlugins.includes("habits") ? "yes" : "no";

    generatedYaml = `# .github/workflows/github-metrics-sync.yml
name: Generate GitHub Metrics SVG

on:
  schedule:
    # Generate once everyday at midnight
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  github-metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Generate metrics infographic
        uses: lowlighter/metrics@latest
        with:
          token: \${{ secrets.METRICS_TOKEN }}
          user: ${username}
          template: classic
          base: header, activity, community, repositories
          config_timezone: UTC
          plugin_languages: ${hasLanguages}
          plugin_languages_details: bytes-size, percentage
          plugin_habits: ${hasHabits}
          plugin_habits_charts: yes
          plugin_isocalendar: ${hasIso}`;

    generatedMd = `<!-- Add this element to your README.md where you want the infographic SVG card to display -->
## 📊 GitHub Analytics Infographic

![GitHub Metrics](https://github.com/${username}/${username}/blob/main/github-metrics.svg)
`;

    guideHtml = `
      <div class="generator-guide">
        <span class="guide-icon">💡</span>
        <div>
          <strong style="display:block; margin-bottom: 0.25rem;">Metrics Setup Details:</strong>
          1. Create a GitHub Personal Access Token (PAT) with <code>repo</code> and <code>read:user</code> permissions from your developer settings.<br>
          2. Save it as a Repository Secret named <code>METRICS_TOKEN</code> in your profile repo.<br>
          3. Commit this workflow to <code>.github/workflows/github-metrics-sync.yml</code>. It will generate a file named <code>github-metrics.svg</code> and commit it directly to your repository, which your README then links to.
        </div>
      </div>
    `;
  }

  // Inject generated codes
  document.getElementById("builder-yaml-code").textContent = generatedYaml;
  document.getElementById("builder-md-code").textContent = generatedMd;
  document.getElementById("guide-box").innerHTML = guideHtml;

  // Trigger highlight updates
  if (window.Prism) {
    Prism.highlightElement(document.getElementById("builder-yaml-code"));
    Prism.highlightElement(document.getElementById("builder-md-code"));
  }
}
