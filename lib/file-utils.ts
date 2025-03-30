// Function to get a file from a nested structure using a path
export function getFileByPath(files: any, path: string): string | null {
  console.log(`Getting file at path: ${path}`)

  // Special handling for Java files in src/main/java
  if (path.startsWith("src/main/java/")) {
    // Extract the domain path (e.g., com/example/mypro)
    const afterJava = path.substring("src/main/java/".length)
    const domainParts = afterJava.split("/")

    // Navigate to src/main/java
    let current = files
    if (!current.src) {
      console.error("src directory not found")
      return null
    }
    current = current.src

    if (!current.main) {
      console.error("main directory not found")
      return null
    }
    current = current.main

    if (!current.java) {
      console.error("java directory not found")
      return null
    }
    current = current.java

    // In the project structure, the domain parts might be nested differently
    // Try to find the domain path by exploring the structure
    const domainPath = findDomainPath(current)
    if (!domainPath) {
      console.error("Domain path not found in src/main/java")
      return null
    }

    // Navigate through the domain path
    current = domainPath

    // Extract the project name and file path after the domain
    // For example, from com/example/mypro/controller/UserController.java
    // we need to navigate to the controller directory and then find UserController.java
    const projectName = domainParts.length > 2 ? domainParts[2] : null
    if (!projectName || !current[projectName]) {
      console.error(`Project directory not found: ${projectName}`)
      return null
    }
    current = current[projectName]

    // Navigate to the specific directory (controller, model, etc.)
    const fileCategory = domainParts.length > 3 ? domainParts[3] : null
    if (!fileCategory || !current[fileCategory]) {
      console.error(`Category directory not found: ${fileCategory}`)
      return null
    }
    current = current[fileCategory]

    // Get the file name
    const fileName = domainParts[domainParts.length - 1]
    if (typeof current[fileName] === "string") {
      return current[fileName]
    } else {
      console.error(`File not found: ${fileName}`)
      return null
    }
  }

  // Standard path traversal for non-Java files
  const parts = path.split("/").filter(Boolean)
  let current = files

  for (let i = 0; i < parts.length - 1; i++) {
    if (current[parts[i]] === undefined) {
      console.error(`Path segment not found: ${parts[i]} in ${path}`)
      return null
    }
    current = current[parts[i]]
  }

  const fileName = parts[parts.length - 1]
  if (typeof current[fileName] === "string") {
    return current[fileName]
  } else if (current[fileName] === undefined) {
    console.error(`File not found: ${fileName} in ${path}`)
  } else {
    console.error(`Found item is not a file: ${fileName} in ${path}`)
  }

  return null
}

// Helper function to find the domain path in the project structure
function findDomainPath(javaDir: any): any {
  // The domain path is usually the first directory under java
  // It could be com, org, net, etc.
  const keys = Object.keys(javaDir)
  if (keys.length === 0) {
    return null
  }

  // Check for common domain prefixes
  for (const prefix of ["com", "org", "net", "io", "edu"]) {
    if (keys.includes(prefix)) {
      return javaDir[prefix]
    }
  }

  // If no common prefix is found, just return the first directory
  return javaDir[keys[0]]
}

// Function to update a file in a nested structure using a path
export function updateFileByPath(files: any, path: string, content: string): any {
  console.log(`Updating file at path: ${path}`)

  // Special handling for Java files in src/main/java
  if (path.startsWith("src/main/java/")) {
    const result = JSON.parse(JSON.stringify(files)) // Deep clone

    // Extract the domain path (e.g., com/example/mypro)
    const afterJava = path.substring("src/main/java/".length)
    const domainParts = afterJava.split("/")

    // Navigate to src/main/java
    let current = result
    if (!current.src) {
      console.error("src directory not found for update")
      return files
    }
    current = current.src

    if (!current.main) {
      console.error("main directory not found for update")
      return files
    }
    current = current.main

    if (!current.java) {
      console.error("java directory not found for update")
      return files
    }
    current = current.java

    // Find the domain path
    const domainPath = findDomainPath(current)
    if (!domainPath) {
      console.error("Domain path not found in src/main/java for update")
      return files
    }

    // Navigate through the domain path
    current = domainPath

    // Extract the project name and file path after the domain
    const projectName = domainParts.length > 2 ? domainParts[2] : null
    if (!projectName || !current[projectName]) {
      console.error(`Project directory not found for update: ${projectName}`)
      return files
    }
    current = current[projectName]

    // Navigate to the specific directory (controller, model, etc.)
    const fileCategory = domainParts.length > 3 ? domainParts[3] : null
    if (!fileCategory || !current[fileCategory]) {
      console.error(`Category directory not found for update: ${fileCategory}`)
      return files
    }
    current = current[fileCategory]

    // Update the file
    const fileName = domainParts[domainParts.length - 1]
    if (typeof current[fileName] === "string") {
      current[fileName] = content
      return result
    } else {
      console.error(`File not found for update: ${fileName}`)
      return files
    }
  }

  // Standard path traversal for non-Java files
  const parts = path.split("/").filter(Boolean)
  const result = JSON.parse(JSON.stringify(files)) // Deep clone
  let current = result

  for (let i = 0; i < parts.length - 1; i++) {
    if (current[parts[i]] === undefined) {
      console.error(`Path segment not found when updating: ${parts[i]} in ${path}`)
      return files // Path doesn't exist, return original
    }
    current = current[parts[i]]
  }

  const fileName = parts[parts.length - 1]
  if (typeof current[fileName] === "string") {
    current[fileName] = content
  } else {
    console.error(`Cannot update: ${fileName} is not a file or doesn't exist`)
  }

  return result
}

// Function to determine the language based on file extension
export function getLanguageByFilename(filename: string): string {
  if (filename.endsWith(".java")) return "java"
  if (filename.endsWith(".xml")) return "xml"
  if (filename.endsWith(".properties")) return "properties"
  if (filename.endsWith(".gradle")) return "gradle"
  if (filename.endsWith(".md")) return "markdown"
  if (filename.endsWith(".gitignore")) return "plaintext"
  return "plaintext"
}

// Function to get a flat list of all files in the project
export function getAllFiles(files: any, basePath = ""): { path: string; type: "file" | "folder" }[] {
  const result: { path: string; type: "file" | "folder" }[] = []

  Object.entries(files).forEach(([name, content]: [string, any]) => {
    const path = basePath ? `${basePath}/${name}` : name

    if (typeof content === "object") {
      // It's a folder
      result.push({ path, type: "folder" })
      result.push(...getAllFiles(content, path))
    } else {
      // It's a file
      result.push({ path, type: "file" })
    }
  })

  return result
}

// Function to normalize file paths
export function normalizePath(path: string): string {
  return path.split("/").filter(Boolean).join("/")
}

