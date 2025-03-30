"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, File, Folder, CheckCircle, Code, FolderTree } from "lucide-react"
import { CodeEditor } from "@/components/code-editor"
import { getFileByPath, updateFileByPath, getLanguageByFilename, getAllFiles } from "@/lib/file-utils"
import { DebugPanel } from "@/components/debug-panel"

interface ProjectPreviewProps {
  project: any
  onProjectUpdate: (updatedProject: any) => void
}

export function ProjectPreview({ project, onProjectUpdate }: ProjectPreviewProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [currentView, setCurrentView] = useState<"structure" | "editor">("structure")
  const [fileError, setFileError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedFile) {
      console.log(`Loading content for file: ${selectedFile}`)
      setFileError(null)

      try {
        const content = getFileByPath(project.files, selectedFile)
        if (content !== null) {
          console.log(`Content loaded successfully for: ${selectedFile}`)
          setFileContent(content)
        } else {
          console.error(`Failed to load content for: ${selectedFile}`)
          setFileError(`Could not load file content for ${selectedFile}`)
          // Set an error message in the editor
          setFileContent(`// Error: Could not load file content for ${selectedFile}
// This could be due to the file path not matching the project structure.
// Try using the Debug Panel to access the file directly.`)
        }
      } catch (error) {
        console.error(`Error loading file: ${selectedFile}`, error)
        setFileError(`Error loading file: ${error instanceof Error ? error.message : String(error)}`)
        setFileContent(`// Error loading file: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }, [selectedFile, project.files])

  const handleFileSelect = (filePath: string) => {
    console.log(`File selected: ${filePath}`)
    setSelectedFile(filePath)
    setCurrentView("editor")
  }

  const handleSaveFile = (content: string) => {
    if (selectedFile) {
      try {
        const updatedFiles = updateFileByPath(project.files, selectedFile, content)
        onProjectUpdate({
          ...project,
          files: updatedFiles,
        })
      } catch (error) {
        console.error(`Error saving file: ${selectedFile}`, error)
        setFileError(`Error saving file: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  // Get all Java files for quick access
  const javaFiles = getAllFiles(project.files).filter((file) => file.type === "file" && file.path.endsWith(".java"))

  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>Project Generated Successfully</AlertTitle>
        <AlertDescription>
          Your Spring Boot project has been generated. You can now review and edit the files before downloading.
        </AlertDescription>
      </Alert>

      {fileError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "structure" | "editor")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Project Structure
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2" disabled={!selectedFile}>
            <Code className="h-4 w-4" />
            Code Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="border rounded-md">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="font-medium">Project Structure</h3>
            <p className="text-sm text-muted-foreground mt-1">Click on a file to edit its content</p>

            {/* Quick access to Java files */}
            {javaFiles.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <h4 className="text-sm font-medium mb-1">Quick Access to Java Files:</h4>
                <div className="flex flex-wrap gap-2">
                  {javaFiles.slice(0, 4).map((file, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => handleFileSelect(file.path)}>
                      {file.path.split("/").pop()}
                    </Button>
                  ))}
                  {javaFiles.length > 4 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Open debug panel
                        document.getElementById("debug-panel-toggle")?.click()
                      }}
                    >
                      +{javaFiles.length - 4} more
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <ScrollArea className="h-[500px] p-4">
            <FileTree files={project.files} onFileSelect={handleFileSelect} selectedFile={selectedFile} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="editor" className="border rounded-md">
          {selectedFile ? (
            <div className="h-[500px]">
              <CodeEditor
                fileContent={fileContent}
                filePath={selectedFile}
                language={getLanguageByFilename(selectedFile)}
                onSave={handleSaveFile}
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Select a file from the project structure to edit</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DebugPanel project={project} onSelectFile={handleFileSelect} />
    </div>
  )
}

interface FileTreeProps {
  files: any
  level?: number
  basePath?: string
  onFileSelect: (path: string) => void
  selectedFile: string | null
}

function FileTree({ files, level = 0, basePath = "", onFileSelect, selectedFile }: FileTreeProps) {
  return (
    <div className="space-y-1">
      {Object.entries(files).map(([name, content]: [string, any]) => {
        const path = basePath ? `${basePath}/${name}` : name

        if (typeof content === "object") {
          return (
            <FolderItem
              key={path}
              name={name}
              content={content}
              level={level}
              path={path}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          )
        } else {
          const isSelected = selectedFile === path
          return (
            <div
              key={path}
              className={`flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-muted/50 ${isSelected ? "bg-muted/50" : ""}`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
              onClick={() => {
                console.log(`Clicked file: ${path}`)
                onFileSelect(path)
              }}
            >
              <File className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{name}</span>
            </div>
          )
        }
      })}
    </div>
  )
}

interface FolderItemProps {
  name: string
  content: any
  level: number
  path: string
  onFileSelect: (path: string) => void
  selectedFile: string | null
}

function FolderItem({ name, content, level, path, onFileSelect, selectedFile }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(level < 1)

  // Check if any child of this folder is selected
  const hasSelectedChild = selectedFile ? selectedFile.startsWith(path + "/") : false

  // Auto-expand if a child is selected
  useEffect(() => {
    if (hasSelectedChild) {
      setIsOpen(true)
    }
  }, [hasSelectedChild])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-muted/50"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <CollapsibleContent>
        <FileTree
          files={content}
          level={level + 1}
          basePath={path}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

