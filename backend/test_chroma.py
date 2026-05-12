from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
v = Chroma.from_texts(["test 1"], embedding=embeddings, persist_directory="chroma_db")
print("Added 1")
v.delete_collection()
print("Deleted collection")
v2 = Chroma.from_texts(["test 2"], embedding=embeddings, persist_directory="chroma_db")
print("Added 2")
