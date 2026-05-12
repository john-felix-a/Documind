import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from utils import process_pdf, query_rag, UPLOAD_DIR

app = FastAPI(title="AI RAG Document Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the uploads directory to serve PDF files
app.mount("/view", StaticFiles(directory=UPLOAD_DIR), name="view")

class ChatQuery(BaseModel):
    question: str
    api_key: str = None
    model_name: str = None
    provider: str = "groq"

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Endpoint to upload a PDF file and process it for RAG.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        # Save file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process PDF and store embeddings
        process_pdf(file_path)
        
        return {"message": f"Successfully uploaded and processed {file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_docs(query: ChatQuery):
    """
    Endpoint to query the uploaded documents.
    """
    try:
        response = query_rag(
            query.question, 
            api_key=query.api_key, 
            model_name=query.model_name,
            provider=query.provider
        )
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
