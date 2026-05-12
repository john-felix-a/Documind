import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

load_dotenv()

# Configuration
CHROMA_PATH = "chroma_db"
UPLOAD_DIR = "uploads"

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize Local Embeddings (all-MiniLM-L6-v2)
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)

def process_pdf(file_path: str):
    """
    Load a PDF, split it into chunks, and store them in ChromaDB.
    """
    # Load PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    print(f"Loaded {len(documents)} pages from {file_path}")

    # Clear previous knowledge base to avoid irrelevant data
    if os.path.exists(CHROMA_PATH):
        try:
            vector_store = Chroma(
                persist_directory=CHROMA_PATH,
                embedding_function=embeddings
            )
            vector_store.delete_collection()
            print(f"Cleared existing knowledge base at {CHROMA_PATH}")
        except Exception as e:
            print(f"Could not clear ChromaDB collection: {e}")

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")

    # Store in ChromaDB
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )
    print(f"Stored {len(chunks)} chunks in {CHROMA_PATH}")
    return vector_store

def query_rag(query: str, api_key: str = None, model_name: str = None, provider: str = "groq"):
    """
    Perform a similarity search and get a response from the LLM.
    """
    # Load the existing vector store
    vector_store = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

    # Provider fallback to environment variables
    env_keys = {
        "groq": "GROQ_API_KEY",
        "gemini": "GOOGLE_API_KEY",
        "openai": "OPENAI_API_KEY"
    }
    
    final_api_key = api_key or os.getenv(env_keys.get(provider, "GROQ_API_KEY"))
    
    if not final_api_key:
        return f"API Key for {provider.upper()} is missing. Please configure it in Settings."

    # Initialize the LLM based on provider
    try:
        if provider == "gemini":
            # Ensure model name is just the ID
            gemini_model = model_name or "gemini-1.5-pro"
            llm = ChatGoogleGenerativeAI(
                model=gemini_model,
                google_api_key=final_api_key,
                temperature=0,
                convert_system_message_to_human=True # Helps with some Gemini versions
            )
        elif provider == "openai":
            llm = ChatOpenAI(
                model=model_name or "gpt-4o",
                api_key=final_api_key,
                temperature=0
            )
        else: # Default to Groq
            llm = ChatGroq(
                groq_api_key=final_api_key,
                model_name=model_name or "llama-3.3-70b-versatile",
                temperature=0
            )
    except Exception as e:
        return f"Error initializing {provider.upper()}: {str(e)}"

    # Create the RetrievalQA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
    )

    # Run the query
    response = qa_chain.invoke(query)
    return response["result"]
