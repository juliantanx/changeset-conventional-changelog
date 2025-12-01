const { execSync } = require("child_process");
const repoUrl = "http://git.cyitce.com:30088/tjh/lowcode-ui";

// 获取比较链接
function getCompareUrl(prev, curr) {
  return prev && curr ? `${repoUrl}/compare/${prev}...${curr}` : null;
}

// 获取最近两个 tag（当前和上一个）
function getLatestTags() {
  try {
    const tags = execSync(`git tag --sort=-creatordate`)
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);

    return {
      currentTag: tags[0] || null,
      previousTag: tags[1] || null,
    };
  } catch {
    return { currentTag: null, previousTag: null };
  }
}

// 获取 Conventional Commits 范围内的所有提交
function getAllConventionalCommits(fromRef = "") {
  const range = fromRef ? `${fromRef}..HEAD` : "HEAD";
  const logs = execSync(
    `git log ${range} --pretty=format:"%H|||%s|||%an"`
  ).toString();

  return logs
    .split("\n")
    .map((line) => {
      const [commit, summary, author] = line.split("|||");
      return { commit, summary, author };
    })
    .filter((c) =>
      /^(feat|fix|chore|docs|refactor|perf|test)(\(.+\))?:/.test(c.summary)
    );
}

// 提交分组
function groupCommits(commits) {
  const types = {
    feat: "Features",
    fix: "Bug Fixes",
    chore: "Chores",
    docs: "Documentation",
    refactor: "Refactors",
    perf: "Performance",
    test: "Tests",
    others: "Others",
  };

  const groups = {};

  for (const commit of commits) {
    const { summary, commit: hash, author } = commit;
    const match = summary.match(
      /^(feat|fix|chore|docs|refactor|perf|test)(\(.+\))?:/
    );
    const type = match?.[1] || "others";
    const groupTitle = types[type] || "Others";

    if (!groups[groupTitle]) groups[groupTitle] = [];
    groups[groupTitle].push(
      `- ${summary} ([${hash.slice(
        0,
        7
      )}](${repoUrl}/commit/${hash})) - ${author}`
    );
  }

  return groups;
}

module.exports = {
  getReleaseLine: async (_changeset, _type, _opts, _commits) => {
    const { previousTag } = getLatestTags();
    const commits = getAllConventionalCommits(previousTag);

    if (commits.length === 0) return null;

    const grouped = groupCommits(commits);
    const lines = [];

    for (const [title, commitLines] of Object.entries(grouped)) {
      lines.push(`### ${title}\n`);
      lines.push(...commitLines, "");
    }

    return lines.join("\n");
  },

  getDependencyReleaseLine: async (_changesets, updated) => {
    if (updated.length === 0) return "";
    return `### Dependencies\n\n${updated
      .map((pkg) => `- ${pkg.name}`)
      .join("\n")}\n`;
  },

  getChangelogHeader: (pkg, version, _opts, previousVersion) => {
    const compare = getCompareUrl(previousVersion, version);
    const date = new Date().toISOString().split("T")[0];
    return `## [${version}](${compare}) (${date})\n`;
  },
};
