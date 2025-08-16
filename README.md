# PlayMate

A Next.js application for team generation and game organization with integrated chat functionality.

## Features

- **Team Generation**: Automatically generate balanced teams for various games
- **Chat Interface**: Real-time chat functionality for game coordination
- **Game Selection**: Support for multiple game types
- **Modern UI**: Built with a clean, responsive interface using Tailwind CSS and shadcn/ui components

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable UI components

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PlayMate
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components including UI components from shadcn/ui
- `/data` - Static data and game configurations
- `/hooks` - Custom React hooks for chat and team generation
- `/lib` - Utility functions and shared logic
- `/types` - TypeScript type definitions
- `/utils` - Helper functions and utilities

## API Routes

- `/api/chat` - Handles chat functionality
- `/api/generate-teams` - Handles team generation logic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.