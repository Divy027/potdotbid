# PotDotBid Frontend

This is the frontend of **PotDotBid**, a **pump.fun** clone where users can create new tokens, trade them, and experience a unique bonding mechanism where tokens act as a honeypot, allowing selling only once per day.

## Features
- **Token Creation**: Users can create their own tokens.
- **Trading System**: Trade tokens seamlessly.
- **Honeypot Mechanism**: Tokens are initially bonded, restricting sales to once per day.
- **Blockchain Integration**: Interacts with smart contracts via the backend.

## Tech Stack
- **Next.js**
- **React.js**
- **Tailwind CSS**
- **Ethers.js**
- **REST API Integration**

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)

### Setup
Clone the repository:
```sh
 git clone https://github.com/Divy027/potdotbid.git
 cd potdotbid
```

Install dependencies:
```sh
 npm install
```

## Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_APPKIT=
NEXT_PUBLIC_BASE_API_KEY=
```

> ⚠️ **Security Note:** Never expose API keys in public repositories. Use `.env.example` to document required variables.

## Running the Frontend
Start the development server:
```sh
 npm run dev
```

The application will be running on `http://localhost:3000` (default Next.js port).

## License
This project is licensed under the MIT License.

---
**Repository:** [GitHub](https://github.com/Divy027/potdotbid)

