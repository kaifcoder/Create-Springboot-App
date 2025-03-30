export interface Field {
  name: string
  type: string
}

export interface Entity {
  name: string
  fields: Field[]
}

export interface ProjectConfig {
  projectName: string
  buildTool: string
  domain: string
  dbChoice: string
  entities: Entity[]
}

