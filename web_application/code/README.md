# HTTP Request Tool

A Node.js application with a React frontend and Express backend that allows users to make custom HTTP GET requests with configurable headers.

## Features

- Custom HTTP GET requests with configurable headers
- Pre-populated header fields based on browser request format
- Cookie support
- Response display in both JSON and tabular format
- Response headers visualization
- Status code display

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Package Manager**: Yarn
- **Node Version Manager**: Volta

## Prerequisites

- Node.js (22.12.0 or later)
- Yarn (1.22.22 or later)
- Volta (optional but recommended)

## Installation

1. Install dependencies:
```bash
yarn install
```

## Running the Application

### Development Mode

Start both frontend and backend servers:
```bash
yarn dev
```

The frontend will be available at `http://localhost:5173`
The backend API will run on `http://localhost:3001`

### Production Build

Build the frontend:
```bash
yarn build
```

Start the backend server:
```bash
yarn start
```

## Usage

1. Enter a GET request URL in the URL field
2. Modify any header values as needed (pre-populated with default values)
3. Optionally add a cookie value
4. Click "Send Request" to make the API call
5. View the response in either JSON or Table format
6. Check response headers at the bottom of the response section

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   └── package.json
├── server/                # Backend Express server
│   ├── index.js          # Server entry point
│   └── package.json
└── package.json          # Root package.json with workspaces
```

## License

This project is private and not licensed for public use.
