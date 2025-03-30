import type { ProjectConfig, Entity } from "@/lib/types"

// Update the generateProject function to return actual file content
export function generateProject(config: ProjectConfig) {
  const { projectName, buildTool, domain, dbChoice, entities } = config

  // Create project structure with actual file content
  const project = {
    name: projectName,
    buildTool,
    domain,
    dbChoice,
    files: {},
  }

  // Create the project structure
  const projectFiles: any = {}

  // Create src directory structure
  const srcMainJava: any = {}
  const domainPath = domain.replace(/\./g, "/")
  const packagePath: any = {}

  // Create model files
  const modelFiles: any = {}
  entities.forEach((entity) => {
    modelFiles[`${entity.name}.java`] = generateEntityClass(entity)
  })

  // Create repository files
  const repositoryFiles: any = {}
  entities.forEach((entity) => {
    repositoryFiles[`${entity.name}Repository.java`] = generateRepositoryInterface(entity, projectName, domain)
  })

  // Create service files
  const serviceFiles: any = {}
  entities.forEach((entity) => {
    serviceFiles[`${entity.name}Service.java`] = generateServiceInterface(entity, projectName, domain)
  })

  // Create service impl files
  const serviceImplFiles: any = {}
  entities.forEach((entity) => {
    serviceImplFiles[`${entity.name}ServiceImpl.java`] = generateServiceImplementation(entity, projectName, domain)
  })

  // Create controller files
  const controllerFiles: any = {}
  entities.forEach((entity) => {
    controllerFiles[`${entity.name}Controller.java`] = generateControllerClass(entity, projectName, domain)
  })

  // Assemble the package structure
  packagePath[projectName] = {
    model: modelFiles,
    repository: repositoryFiles,
    service: {
      impl: serviceImplFiles,
      ...serviceFiles,
    },
    controller: controllerFiles,
    [`${projectName}Application.java`]: generateMainApplicationFile(projectName, domain),
  }

  // Assemble the Java path
  srcMainJava[domainPath] = packagePath

  // Create resources directory
  const resources: any = {
    "application.properties": generateApplicationProperties(dbChoice, projectName),
  }

  // Assemble the project structure
  projectFiles["src"] = {
    main: {
      java: srcMainJava,
      resources: resources,
    },
    test: {
      java: {},
    },
  }

  // Add build file
  if (buildTool === "maven") {
    projectFiles["pom.xml"] = generatePomXml(projectName, domain, dbChoice)
  } else {
    projectFiles["build.gradle"] = generateBuildGradle(projectName, domain, dbChoice)
  }

  // Add README
  projectFiles["README.md"] = generateReadme(projectName, entities)

  // Add .gitignore
  projectFiles[".gitignore"] = generateGitignore()

  project.files = projectFiles

  return project
}

function generateModelFiles(entities: Entity[]) {
  const files: Record<string, string> = {}

  entities.forEach((entity) => {
    files[`${entity.name}.java`] = generateEntityClass(entity)
  })

  return files
}

function generateRepositoryFiles(entities: Entity[], projectName: string, domain: string) {
  const files: Record<string, string> = {}

  entities.forEach((entity) => {
    files[`${entity.name}Repository.java`] = generateRepositoryInterface(entity, projectName, domain)
  })

  return files
}

function generateServiceFiles(entities: Entity[], projectName: string, domain: string) {
  const files: Record<string, string> = {}

  entities.forEach((entity) => {
    files[`${entity.name}Service.java`] = generateServiceInterface(entity, projectName, domain)
  })

  return files
}

function generateServiceImplFiles(entities: Entity[], projectName: string, domain: string) {
  const files: Record<string, string> = {}

  entities.forEach((entity) => {
    files[`${entity.name}ServiceImpl.java`] = generateServiceImplementation(entity, projectName, domain)
  })

  return files
}

function generateControllerFiles(entities: Entity[], projectName: string, domain: string) {
  const files: Record<string, string> = {}

  entities.forEach((entity) => {
    files[`${entity.name}Controller.java`] = generateControllerClass(entity, projectName, domain)
  })

  return files
}

function generateEntityClass(entity: Entity) {
  return `package com.example.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ${entity.name} implements Serializable {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
${entity.fields
  .map(
    (field) => `  @Column
  private ${field.type} ${field.name};`,
  )
  .join("\n\n")}
}`
}

function generateRepositoryInterface(entity: Entity, projectName: string, domain: string) {
  return `package ${domain}.${projectName}.repository;

import ${domain}.${projectName}.model.${entity.name};
import org.springframework.data.jpa.repository.JpaRepository;

public interface ${entity.name}Repository extends JpaRepository<${entity.name}, Long> {}`
}

function generateServiceInterface(entity: Entity, projectName: string, domain: string) {
  return `package ${domain}.${projectName}.service;

import ${domain}.${projectName}.model.${entity.name};
import java.util.List;

public interface ${entity.name}Service {
  List<${entity.name}> findAll();
  ${entity.name} findById(Long id);
  ${entity.name} save(${entity.name} entity);
  void delete(Long id);
}`
}

function generateServiceImplementation(entity: Entity, projectName: string, domain: string) {
  return `package ${domain}.${projectName}.service.impl;

import ${domain}.${projectName}.model.${entity.name};
import ${domain}.${projectName}.repository.${entity.name}Repository;
import ${domain}.${projectName}.service.${entity.name}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ${entity.name}ServiceImpl implements ${entity.name}Service {

  @Autowired
  private ${entity.name}Repository ${entity.name.toLowerCase()}Repository;

  @Override
  public List<${entity.name}> findAll() {
    return ${entity.name.toLowerCase()}Repository.findAll();
  }

  @Override
  public ${entity.name} findById(Long id) {
    Optional<${entity.name}> entity = ${entity.name.toLowerCase()}Repository.findById(id);
    return entity.orElse(null);
  }

  @Override
  public ${entity.name} save(${entity.name} entity) {
    return ${entity.name.toLowerCase()}Repository.save(entity);
  }

  @Override
  public void delete(Long id) {
    ${entity.name.toLowerCase()}Repository.deleteById(id);
  }
}`
}

function generateControllerClass(entity: Entity, projectName: string, domain: string) {
  return `package ${domain}.${projectName}.controller;

import ${domain}.${projectName}.model.${entity.name};
import ${domain}.${projectName}.service.${entity.name}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/${entity.name.toLowerCase()}")
public class ${entity.name}Controller {

  @Autowired
  private ${entity.name}Service ${entity.name.toLowerCase()}Service;

  @GetMapping
  public List<${entity.name}> getAll() {
    return ${entity.name.toLowerCase()}Service.findAll();
  }

  @GetMapping("/{id}")
  public ${entity.name} getById(@PathVariable Long id) {
    return ${entity.name.toLowerCase()}Service.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ${entity.name} create(@RequestBody ${entity.name} entity) {
    return ${entity.name.toLowerCase()}Service.save(entity);
  }

  @PutMapping("/{id}")
  public ${entity.name} update(@PathVariable Long id, @RequestBody ${entity.name} entity) {
    entity.setId(id);
    return ${entity.name.toLowerCase()}Service.save(entity);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    ${entity.name.toLowerCase()}Service.delete(id);
  }
}`
}

function generateMainApplicationFile(projectName: string, domain: string) {
  return `package ${domain}.${projectName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${projectName}Application {

  public static void main(String[] args) {
    SpringApplication.run(${projectName}Application.class, args);
  }
}`
}

function generateApplicationProperties(dbChoice: string, projectName: string) {
  if (dbChoice === "h2") {
    return `# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:${projectName.toLowerCase()}db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true`
  } else {
    return `# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/${projectName.toLowerCase()}db?useSSL=false
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
spring.jpa.show-sql=true`
  }
}

function generatePomXml(projectName: string, domain: string, dbChoice: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
    <relativePath/>
  </parent>
  <groupId>${domain}</groupId>
  <artifactId>${projectName}</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <name>${projectName}</name>
  <description>Spring Boot application</description>
  
  <properties>
    <java.version>11</java.version>
  </properties>
  
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
    ${
      dbChoice === "h2"
        ? `<dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>runtime</scope>
    </dependency>`
        : `<dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <scope>runtime</scope>
    </dependency>`
    }
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <configuration>
          <excludes>
            <exclude>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
            </exclude>
          </excludes>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>`
}

function generateBuildGradle(projectName: string, domain: string, dbChoice: string) {
  return `plugins {
  id 'org.springframework.boot' version '2.7.0'
  id 'io.spring.dependency-management' version '1.0.11.RELEASE'
  id 'java'
}

group = '${domain}'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

configurations {
  compileOnly {
    extendsFrom annotationProcessor
  }
}

repositories {
  mavenCentral()
}

dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
  compileOnly 'org.projectlombok:lombok'
  ${dbChoice === "h2" ? "runtimeOnly 'com.h2database:h2'" : "runtimeOnly 'mysql:mysql-connector-java'"}
  annotationProcessor 'org.projectlombok:lombok'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
  useJUnitPlatform()
}`
}

// Add a function to generate README.md
function generateReadme(projectName: string, entities: Entity[]) {
  return `# ${projectName}

A Spring Boot application generated with Spring Boot Project Generator.

## Project Structure

This project follows the standard Spring Boot application structure:

- \`src/main/java\`: Contains Java source code
- \`src/main/resources\`: Contains application properties and static resources
- \`src/test/java\`: Contains test code

## Entities

${entities
  .map(
    (entity) => `### ${entity.name}

Fields:
${entity.fields.map((field) => `- ${field.name}: ${field.type}`).join("\n")}
`,
  )
  .join("\n")}

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven or Gradle (depending on your build choice)

### Running the Application

#### With Maven

\`\`\`
./mvnw spring-boot:run
\`\`\`

#### With Gradle

\`\`\`
./gradlew bootRun
\`\`\`

## API Endpoints

${entities
  .map(
    (entity) => `### ${entity.name} Endpoints

- GET /api/${entity.name.toLowerCase()}: Get all ${entity.name}s
- GET /api/${entity.name.toLowerCase()}/{id}: Get a specific ${entity.name} by ID
- POST /api/${entity.name.toLowerCase()}: Create a new ${entity.name}
- PUT /api/${entity.name.toLowerCase()}/{id}: Update an existing ${entity.name}
- DELETE /api/${entity.name.toLowerCase()}/{id}: Delete a ${entity.name}
`,
  )
  .join("\n")}
`
}

// Add a function to generate .gitignore
function generateGitignore() {
  return `HELP.md
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/

### Gradle ###
.gradle
**/build/
`
}

