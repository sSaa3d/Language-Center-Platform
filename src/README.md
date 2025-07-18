# Backend Structure

This directory contains the modular backend structure for the course enrollment dashboard.

## Directory Structure

```
src/
├── config/           # Configuration files
│   ├── database.js   # Prisma client configuration
│   ├── email.js      # Nodemailer configuration
│   └── upload.js     # Multer file upload configuration
├── controllers/      # Route handlers (business logic)
│   ├── courseController.js
│   ├── enrollmentController.js
│   ├── requestController.js
│   ├── studentController.js
│   ├── rejectionController.js
│   └── index.js
├── routes/          # Route definitions
│   ├── courseRoutes.js
│   ├── enrollmentRoutes.js
│   ├── requestRoutes.js
│   ├── studentRoutes.js
│   ├── rejectionRoutes.js
│   └── index.js
├── services/        # Business logic services
│   └── emailService.js
├── middlewares/     # Custom middleware
│   └── logger.js
├── utils/           # Utility functions
│   └── responseHandler.js
└── README.md
```

## Key Features

- **Modular Structure**: Each feature has its own controller and routes
- **Separation of Concerns**: Business logic separated from route handling
- **Reusable Services**: Email service can be used across different controllers
- **Consistent Error Handling**: Centralized error handling utilities
- **Clean Configuration**: Database, email, and upload configurations separated

## Usage

The main `server.js` file now serves as a clean entry point that:

1. Imports all necessary middleware
2. Sets up route handlers
3. Starts the server

This makes the codebase more maintainable and easier to extend with new features.
