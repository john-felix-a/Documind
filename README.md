# AI RAG Document Assistant

A minimal end-to-end RAG (Retrieval-Augmented Generation) application built with Next.js, FastAPI, LangChain, and OpenAI.

## Features

- **PDF Upload**: Upload documents and process them into chunks.
- **Embeddings**: Local free embeddings using HuggingFace (`all-MiniLM-L6-v2`).
- **Vector Search**: Semantic similarity search using ChromaDB.
- **Contextual Chat**: Get answers using Groq API (`llama-3.3-70b-versatile`).
- **Premium UI**: Modern dark theme with responsive design.

## Architecture

- **Frontend**: Next.js (App Router), Tailwind CSS, Axios, Lucide React.
- **Backend**: FastAPI, LangChain, Groq, ChromaDB, PyPDF.

## Prerequisites

- Python 3.9+
- Node.js 18+
- Groq API Key

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
5. Edit `.env` and add your `GROQ_API_KEY`.
6. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── backend/
│   ├── main.py        # FastAPI endpoints
│   ├── utils.py       # LangChain & RAG logic
│   ├── requirements.txt
│   ├── .env.example
│   ├── uploads/       # Local PDF storage
│   └── chroma_db/     # Vector database persistence
└── frontend/
    ├── src/
    │   ├── app/       # Next.js pages
    │   └── components/# UI components
    └── tailwind.config.ts
```

## Usage

1. Upload a PDF document using the "Upload Knowledge Base" section.
2. Wait for the success message (this processes the PDF and generates embeddings).
3. Type your question in the chat interface.
4. The AI will respond based on the context found in your document.
