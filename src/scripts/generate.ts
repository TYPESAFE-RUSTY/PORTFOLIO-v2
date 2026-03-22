#!/usr/bin/env ts-node
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

interface FileNode {
  name: string;
  ext: string | null;
  type: "DIR" | "FILE";
  nodes: FileNode[];
  parentNode: null;
  content: string | null;
}

// Paths
const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, "src/terminalSeedData");
const OUTPUT_DIR = path.join(ROOT_DIR, "src/generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "constants.json");

// Counters
let fileCount = 0;
let dirCount = 0;

/**
 * Parse filename into name + extension
 */
function parseFileName(fileName: string): { name: string; ext: string | null } {
  // Dotfile (e.g. ".env")
  if (fileName.startsWith(".") && !fileName.slice(1).includes(".")) {
    return {
      name: "",
      ext: fileName.slice(1),
    };
  }

  const ext = path.extname(fileName);
  if (!ext) {
    return {
      name: fileName,
      ext: null,
    };
  }

  return {
    name: path.basename(fileName, ext),
    ext: ext.slice(1),
  };
}

/**
 * Recursively walk directory and build FileNode tree
 */
function buildTree(currentPath: string): FileNode[] {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  const nodes: FileNode[] = [];

  for (const entry of entries) {
    // Ignore unwanted files
    if (entry.name === ".DS_Store" || entry.name === ".gitkeep") {
      continue;
    }

    const fullPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      dirCount++;

      const dirNode: FileNode = {
        name: entry.name,
        ext: null,
        type: "DIR",
        nodes: buildTree(fullPath),
        parentNode: null,
        content: null,
      };

      nodes.push(dirNode);
    } else if (entry.isFile()) {
      fileCount++;

      const { name, ext } = parseFileName(entry.name);

      let content: string | null = null;

      try {
        content = fs.readFileSync(fullPath, "utf-8");
      } catch (err) {
        console.log(
          chalk.yellow(`⚠️ Could not read file: ${fullPath}. Skipping content.`),
        );
      }

      const fileNode: FileNode = {
        name,
        ext,
        type: "FILE",
        nodes: [],
        parentNode: null,
        content,
      };

      nodes.push(fileNode);
    }
  }

  return nodes;
}

/**
 * Ensure content directory exists
 */
function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log(
      chalk.yellow(
        `⚠️ 'content/' directory was missing. Created at: ${CONTENT_DIR}`,
      ),
    );
    console.log(chalk.blue("ℹ️ Add files to 'content/' and rerun the script."));
    process.exit(0);
  }
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(chalk.blue(`ℹ️ Created output directory: ${OUTPUT_DIR}`));
  }
}

/**
 * Main execution
 */
function main() {
  console.log(chalk.blue("🚀 Starting faketerm JSON generator...\n"));

  ensureContentDir();
  ensureOutputDir();

  const tree: FileNode = {
    name: "~",
    ext: null,
    type: "DIR",
    nodes: buildTree(CONTENT_DIR),
    parentNode: null,
    content: null,
  };

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2), "utf-8");

    console.log(chalk.green("\n✅ Successfully generated constants.json!"));
    console.log(chalk.green(`📁 Output written to: ${OUTPUT_FILE}`));
    console.log(
      chalk.blue(
        `📊 Processed ${dirCount} directories and ${fileCount} files.`,
      ),
    );
  } catch (err) {
    console.error(chalk.red("❌ Failed to write output file."));
    console.error(err);
    process.exit(1);
  }
}

// Run
main();
