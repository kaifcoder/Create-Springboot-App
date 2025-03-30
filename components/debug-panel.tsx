"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { getAllFiles } from "@/lib/file-utils"
import type { JSX } from "react/jsx-runtime"

interface DebugPanelProps {
  project: any
  onSelectFile: (path: string) => void
}

export function DebugPanel({ project, onSelectFile }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const allFiles = getAllFiles(project.files)
  const [showStructure, setShowStructure] = useState(false)

  // Function to display the project structure
  const displayStructure = (obj: any, indent = 0): JSX.Element => {
    return (
      <div style={{ marginLeft: `${indent * 20}px` }}>
        {Object.entries(obj).map(([key, value]: [string, any]) => (
          <div key={key}>
            {typeof value === "object" ? (
              <>
                <div className="font-medium">{key}/</div>
                {displayStructure(value, indent + 1)}
              </>
            ) : (
              <div className="text-muted-foreground">{key}</div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader className="py-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="text-sm flex items-center justify-between">
          Debug Panel
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
          >
            {isOpen ? "Hide" : "Show"}
          </Button>
        </CardTitle>
      </CardHeader>
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="py-2">
            <div className="text-xs">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">All Files ({allFiles.length})</h4>
                <Button variant="outline" size="sm" onClick={() => setShowStructure(!showStructure)}>
                  {showStructure ? "Show List" : "Show Structure"}
                </Button>
              </div>

              {showStructure ? (
                <div className="max-h-60 overflow-y-auto border rounded p-2">{displayStructure(project.files)}</div>
              ) : (
                <div className="max-h-60 overflow-y-auto border rounded p-2">
                  {allFiles.map((file, index) => (
                    <div
                      key={index}
                      className={`py-1 cursor-pointer hover:bg-muted/50 ${file.type === "folder" ? "font-medium" : ""}`}
                      onClick={() => file.type === "file" && onSelectFile(file.path)}
                    >
                      {file.path} ({file.type})
                    </div>
                  ))}
                </div>
              )}

              {/* Add a section to show Java files specifically */}
              <h4 className="font-medium mt-4 mb-2">Java Files</h4>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {allFiles
                  .filter((file) => file.path.endsWith(".java"))
                  .map((file, index) => (
                    <div
                      key={index}
                      className="py-1 cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectFile(file.path)}
                    >
                      {file.path}
                    </div>
                  ))}
              </div>

              {/* Add a direct file selector for Java files */}
              <h4 className="font-medium mt-4 mb-2">Direct File Access</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Try to access a model file
                    const modelFile = allFiles.find((f) => f.path.includes("/model/") && f.path.endsWith(".java"))
                    if (modelFile) onSelectFile(modelFile.path)
                  }}
                >
                  Open Model File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Try to access a controller file
                    const controllerFile = allFiles.find(
                      (f) => f.path.includes("/controller/") && f.path.endsWith(".java"),
                    )
                    if (controllerFile) onSelectFile(controllerFile.path)
                  }}
                >
                  Open Controller File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Try to access a repository file
                    const repoFile = allFiles.find((f) => f.path.includes("/repository/") && f.path.endsWith(".java"))
                    if (repoFile) onSelectFile(repoFile.path)
                  }}
                >
                  Open Repository File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Try to access a service file
                    const serviceFile = allFiles.find((f) => f.path.includes("/service/") && f.path.endsWith(".java"))
                    if (serviceFile) onSelectFile(serviceFile.path)
                  }}
                >
                  Open Service File
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

