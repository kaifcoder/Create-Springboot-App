"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Entity, Field } from "@/lib/types"

interface EntityFormProps {
  onAddEntity: (entity: Entity) => void
}

export function EntityForm({ onAddEntity }: EntityFormProps) {
  const [entityName, setEntityName] = useState("")
  const [fields, setFields] = useState<Field[]>([{ name: "", type: "String" }])

  const addField = () => {
    setFields([...fields, { name: "", type: "String" }])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: Partial<Field>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...field }
    setFields(newFields)
  }

  const handleSubmit = () => {
    // Validate
    if (!entityName || fields.some((f) => !f.name)) return

    // Create entity
    const entity: Entity = {
      name: entityName,
      fields: fields.filter((f) => f.name.trim() !== ""),
    }

    // Add entity
    onAddEntity(entity)

    // Reset form
    setEntityName("")
    setFields([{ name: "", type: "String" }])
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Entity Name</Label>
            <Input
              id="entityName"
              placeholder="User"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Fields</Label>
            {fields.map((field, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                  className="flex-1"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value })}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="String">String</option>
                  <option value="Integer">Integer</option>
                  <option value="Long">Long</option>
                  <option value="Double">Double</option>
                  <option value="Boolean">Boolean</option>
                  <option value="Date">Date</option>
                </select>
                <Button variant="ghost" size="icon" onClick={() => removeField(index)} disabled={fields.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addField} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Field
            </Button>
          </div>

          <Button onClick={handleSubmit} disabled={!entityName || fields.some((f) => !f.name)} className="w-full">
            Add Entity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

