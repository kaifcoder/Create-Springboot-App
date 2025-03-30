"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EntityForm } from "@/components/entity-form"
import { ProjectPreview } from "@/components/project-preview"
import { generateProject } from "@/lib/project-generator"
import type { Entity, ProjectConfig } from "@/lib/types"
import { ArrowRight, Download, FileCode, FolderTree, Package, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProjectGenerator() {
  const [step, setStep] = useState(1)
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    projectName: "",
    buildTool: "maven",
    domain: "com.example",
    dbChoice: "h2",
    entities: [],
  })
  const [currentTab, setCurrentTab] = useState("config")
  const [entities, setEntities] = useState<Entity[]>([])
  const [generatedProject, setGeneratedProject] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleProjectConfigChange = (field: keyof ProjectConfig, value: string) => {
    setProjectConfig((prev) => ({ ...prev, [field]: value }))
  }

  const addEntity = (entity: Entity) => {
    setEntities((prev) => [...prev, entity])
  }

  const removeEntity = (index: number) => {
    setEntities((prev) => prev.filter((_, i) => i !== index))
  }

  // Add the toast hook at the top of the component
  const { toast } = useToast()

  const handleGenerate = () => {
    try {
      const config = { ...projectConfig, entities }
      const project = generateProject(config)
      setGeneratedProject(project)
      setCurrentTab("preview")

      toast({
        title: "Project Generated Successfully",
        description: "Your project is ready. You can now review and edit the files before downloading.",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error generating project:", error)
      toast({
        title: "Error Generating Project",
        description: "There was an error generating your project. Please try again.",
        duration: 5000,
      })
    }
  }

  const handleProjectUpdate = (updatedProject: any) => {
    setGeneratedProject(updatedProject)
    toast({
      title: "File Updated",
      description: "Your changes have been saved to the project.",
      duration: 3000,
    })
  }

  const handleDownload = async () => {
    if (!generatedProject) return

    setIsDownloading(true)
    try {
      // Dynamically import JSZip (only when needed)
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Create a recursive function to add files to the zip
      const addFilesToZip = (files: any, folderPath = "") => {
        Object.entries(files).forEach(([name, content]: [string, any]) => {
          const path = folderPath ? `${folderPath}/${name}` : name

          if (typeof content === "object") {
            // It's a folder, recursively add its contents
            addFilesToZip(content, path)
          } else {
            // It's a file, add it to the zip
            zip.file(path, content)
          }
        })
      }

      // Add all files to the zip
      addFilesToZip(generatedProject.files)

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" })

      // Create a download link and trigger the download
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${generatedProject.name}-project.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: `${generatedProject.name}.zip is being downloaded to your computer.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error downloading project:", error)
      toast({
        title: "Download Failed",
        description: "There was an error creating the ZIP file. Please try again.",
        duration: 5000,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Spring Boot Project Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              Project Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            {step === 1 && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="myproject"
                    value={projectConfig.projectName}
                    onChange={(e) => handleProjectConfigChange("projectName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Build Tool</Label>
                  <RadioGroup
                    value={projectConfig.buildTool}
                    onValueChange={(value) => handleProjectConfigChange("buildTool", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maven" id="maven" />
                      <Label htmlFor="maven">Maven</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gradle" id="gradle" />
                      <Label htmlFor="gradle">Gradle</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="com.example"
                    value={projectConfig.domain}
                    onChange={(e) => handleProjectConfigChange("domain", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Database</Label>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <RadioGroup
                      value={projectConfig.dbChoice}
                      onValueChange={(value) => handleProjectConfigChange("dbChoice", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="h2" id="h2" />
                        <Label htmlFor="h2">H2 (In-memory)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mysql" id="mysql" />
                        <Label htmlFor="mysql">MySQL</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} disabled={!projectConfig.projectName} className="w-full">
                  Next: Define Entities <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 py-4">
                <EntityForm onAddEntity={addEntity} />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Defined Entities ({entities.length})</h3>
                  {entities.length === 0 ? (
                    <p className="text-muted-foreground">No entities defined yet. Add at least one entity.</p>
                  ) : (
                    <div className="space-y-3">
                      {entities.map((entity, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{entity.name}</h4>
                            <Button variant="destructive" size="sm" onClick={() => removeEntity(index)}>
                              Remove
                            </Button>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              Fields: {entity.fields.map((f) => `${f.name}:${f.type}`).join(", ")}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleGenerate} disabled={entities.length === 0} className="flex-1">
                    Generate Project
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview">
            {generatedProject ? (
              <div className="space-y-4 py-4">
                <ProjectPreview project={generatedProject} onProjectUpdate={handleProjectUpdate} />
                <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Creating ZIP..." : "Download Project ZIP"}
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Generate a project first to see the preview</p>
                <Button variant="outline" onClick={() => setCurrentTab("config")} className="mt-4">
                  Go to Configuration
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

