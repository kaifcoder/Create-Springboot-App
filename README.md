# Spring Boot Project Generator UI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)

> A modern web-based tool for generating complete Spring Boot applications with a clean, intuitive UI. Create production-ready Spring Boot projects with custom entities, controllers, services, and repositories in minutes.

<img width="50%" alt="image" src="https://github.com/user-attachments/assets/7553640b-1098-4cec-b5e1-a459adbc3310" />


## 🚀 Features

- **Interactive Entity Builder** - Create Java entities with custom fields and data types
- **Live Project Preview** - See your project structure and files in real-time
- **Built-in Code Editor** - Modify generated code directly in the browser with syntax highlighting
- **Multi-database Support** - Generate projects with H2 or MySQL database configurations
- **Maven/Gradle Support** - Choose your preferred build tool
- **Complete Application Generation** - Creates models, repositories, services, and REST controllers
- **One-click Download** - Download your project as a ready-to-use ZIP file
- **Customizable Domain** - Set your Java package structure
- **Responsive Design** - Works on desktop and mobile devices

## 📋 Table of Contents

- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

## 🎮 Demo

Try the Spring Boot Project Generator at [https://create-springboot-app.vercel.app](https://create-springboot-app.vercel.app)
or watch the below video : 

https://github.com/user-attachments/assets/1599c46a-6938-4df1-ad39-747463bf093b

## 💻 Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/spring-boot-generator.git

# Navigate to the project directory
cd spring-boot-generator

# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

## 📖 Usage

1. Open your browser and visit `http://localhost:3000`
2. Use the UI to configure your Spring Boot application
3. Preview the generated code and modify if needed
4. Click "Download" to get a ready-to-use ZIP file

## 📂 Project Structure

```
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Next.js pages
│   ├── styles/        # Global styles
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom hooks
│   ├── context/       # Context API for state management
├── .env               # Environment variables
├── package.json       # Project metadata and dependencies
├── README.md          # Documentation
```

## 🛠 Technologies Used

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js (if applicable)
- **State Management**: React Context API
- **Build Tools**: Webpack, Babel
- **Code Editor**: Monaco Editor
- **Database Support**: H2, MySQL

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgements

- Thanks to the open-source community for their amazing tools and libraries
- Inspired by [Spring Initializr](https://start.spring.io/)
