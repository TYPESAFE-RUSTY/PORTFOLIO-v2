// --- 1. Content Interfaces (The Data within each file) ---

export interface AboutMeContent {
    title: string;
    content: string;
    status: string;
}

export interface EducationContent {
    institution: string;
    degree: string;
    duration: string;
    gpa: string;
    focus: string[];
}

export interface ProjectContent {
    name: string;
    tech_stack: string[];
    description: string;
    repo: string;
}

export interface SkillsContent {
    languages: string[];
    frameworks: string[];
    styling: string[];
    databases?: string[]; // Optional for frontend file
}

export interface ContactContent {
    email: string;
    linkedin: string;
    github: string;
    note: string;
}

// --- 2. FileNode Interfaces (The File Tree Structure) ---

/**
 * Defines the structure for files containing actual portfolio data 
 * (like about_me.json, project.json, etc.)
 */
export interface DataFileNode<T extends PortfolioContent> {
    fileName: string;
    fileType: 'file';
    fileExtension: extension;
    data: T;
}

export type extension = 'json' | 'cpp'

/**
 * Defines the structure for folders, which contain a nested array of FileNodes.
 */
export interface FolderNode {
    fileName: string;
    fileType: 'folder';
    fileExtension: null; // Folders have no extension
    data: {
        files: FileNode[]; // Recursively holds other FileNodes
    };
}


// --- 3. Union and Root Types ---

// A union type for all possible specific content types
export type PortfolioContent =
    | AboutMeContent
    | EducationContent
    | ProjectContent
    | SkillsContent
    | ContactContent;

// A union type for any item in the file tree (either a file or a folder)
export type FileNode =
    | FolderNode
    | DataFileNode<AboutMeContent>
    | DataFileNode<EducationContent>
    | DataFileNode<ProjectContent>
    | DataFileNode<SkillsContent>
    | DataFileNode<ContactContent>; // Include all possible content types here

/**
 * The interface for the root object of your file system.
 */
export type FileSystemRoot = FolderNode