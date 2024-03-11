## Files Manager

This project aims to create a backend platform for file management using NodeJS, MongoDB, Redis for background processing.

### Overview

- Build an Express API for user authentication and file management.
- Utilize MongoDB for data storage.
- Use Redis for temporary data storage.
- Implement background processing with Bull.

### Requirements

- Editors: vi, vim, emacs, Visual Studio Code
- Ubuntu 18.04 LTS with Node 12.x.x
- Mandatory README.md file
- `.js` extension for code files
- ESLint for linting

### Structure

- `package.json`: Dependencies and scripts
- `.eslintrc.js`: ESLint configuration
- `babel.config.js`: Babel configuration
- `utils/`: Utility functions

### Tasks

1. **Redis Utils**: Implement Redis utilities for managing connections and data storage.

### Getting Started

1. Clone the repository:

```
git clone https://github.com/your-username/alx-files_manager.git
```

2. Navigate to the project directory:

```
cd alx-files_manager
```

3. Install dependencies:

```
npm install
```

4. Start the server:

```
npm run start-server
```

5. Start the worker:

```
npm run start-worker
```

6. Run tests:

```
npm test
```

### Notes

- Ensure MongoDB and Redis are installed and running.
- Refer to provided resources for further learning and documentation.

For any queries, feel free to reach out!