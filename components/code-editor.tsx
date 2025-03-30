"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface CodeEditorProps {
  fileContent: string
  filePath: string
  language: string
  onSave: (content: string) => void
}

export function CodeEditor({ fileContent, filePath, language, onSave }: CodeEditorProps) {
  const [content, setContent] = useState(fileContent || "")
  const [isDirty, setIsDirty] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    console.log(`CodeEditor received file: ${filePath}`)
    console.log(`File content length: ${fileContent?.length || 0}`)

    // Check if the content appears to be an error message
    const isErrorContent = fileContent?.startsWith("// Error:") || false
    setIsError(isErrorContent)

    setContent(fileContent || "")
    setIsDirty(false)
  }, [fileContent, filePath])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value)
      setIsDirty(value !== fileContent)
    }
  }

  const handleSave = () => {
    onSave(content)
    setIsDirty(false)
  }

  // Determine language based on file extension
  const getLanguage = () => {
    if (language) return language

    console.log(`Determining language for: ${filePath}`)
    if (filePath.endsWith(".java")) return "java"
    if (filePath.endsWith(".xml")) return "xml"
    if (filePath.endsWith(".properties")) return "properties"
    if (filePath.endsWith(".gradle")) return "gradle"
    if (filePath.endsWith(".md")) return "markdown"
    return "plaintext"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 bg-muted/50 border-b">
        <div className="text-sm font-medium truncate">{filePath}</div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isError}
          variant={isDirty && !isError ? "default" : "outline"}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          language={getLanguage()}
          value={content}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            readOnly: isError,
          }}
        />
      </div>
      {isError && (
        <div className="p-2 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 text-sm">
          There was an error loading this file. Please use the Debug Panel to access Java files directly.
        </div>
      )}
    </div>
  )
}

