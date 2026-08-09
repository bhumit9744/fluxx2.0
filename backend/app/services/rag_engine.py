import os
import json
from pathlib import Path
from typing import List, Dict, Any

try:
    import chromadb
    from chromadb.config import Settings
    from sentence_transformers import SentenceTransformer
    HAS_CHROMADB = True
except ImportError:
    HAS_CHROMADB = False

class RAGEngine:
    def __init__(self):
        self.collection_name = "fluxx_telemetry"
        self.client = None
        self.collection = None
        self.encoder = None
        self.data_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
            "data", 
            "environment"
        )
        self._init_db()

    def _init_db(self):
        if not HAS_CHROMADB:
            print("ChromaDB not installed. RAG Engine disabled.")
            return

        try:
            # Initialize ChromaDB in memory/persistent
            db_path = os.path.join(os.path.dirname(self.data_dir), "chroma_db")
            os.makedirs(db_path, exist_ok=True)
            self.client = chromadb.PersistentClient(path=db_path)
            
            # Load sentence transformer for embeddings
            self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            print("RAG Engine Initialized successfully.")
        except Exception as e:
            print(f"Error initializing RAG Engine: {e}")

    def build_index(self):
        """Reads JSON datasets and ingests them into ChromaDB."""
        if not self.collection or not self.encoder:
            return {"status": "error", "message": "RAG Engine not initialized"}

        try:
            data_path = Path(self.data_dir)
            json_files = list(data_path.glob("*.json"))
            
            if not json_files:
                return {"status": "warning", "message": "No JSON datasets found in data/environment/"}

            documents = []
            metadatas = []
            ids = []
            
            doc_id_counter = 0

            # Clear existing collection if rebuilding
            try:
                self.client.delete_collection(name=self.collection_name)
                self.collection = self.client.create_collection(name=self.collection_name)
            except Exception:
                pass
                
            for jf in json_files:
                with open(jf, 'r', encoding='utf-8') as f:
                    records = json.load(f)
                    
                dataset_name = jf.name
                
                # Chunk records into semantic documents
                # Instead of embedding every single row (which is huge), 
                # we summarize every N rows as a spatial-temporal chunk
                CHUNK_SIZE = 100 
                for i in range(0, len(records), CHUNK_SIZE):
                    chunk = records[i:i+CHUNK_SIZE]
                    
                    if not chunk: continue
                    
                    # Compute aggregations for the chunk
                    timestamps = [r.get('timestamp') for r in chunk if r.get('timestamp')]
                    pm25_vals = [r.get('pm2_5', r.get('pm25')) for r in chunk if r.get('pm2_5', r.get('pm25')) is not None]
                    
                    if not pm25_vals: continue
                    
                    start_time = timestamps[0] if timestamps else "Unknown"
                    end_time = timestamps[-1] if timestamps else "Unknown"
                    avg_pm25 = sum(pm25_vals) / len(pm25_vals)
                    max_pm25 = max(pm25_vals)
                    
                    # Create semantic document
                    text = (
                        f"Dataset: {dataset_name}. "
                        f"From {start_time} to {end_time}, "
                        f"across {len(chunk)} observations, the average PM2.5 was {avg_pm25:.2f} µg/m³. "
                        f"The maximum PM2.5 recorded in this period was {max_pm25:.2f} µg/m³."
                    )
                    
                    # Include location if available
                    lats = [r.get('latitude') for r in chunk if r.get('latitude') is not None]
                    lngs = [r.get('longitude') for r in chunk if r.get('longitude') is not None]
                    if lats and lngs:
                        text += f" Location bounds: Lat ({min(lats):.4f} to {max(lats):.4f}), Lng ({min(lngs):.4f} to {max(lngs):.4f})."

                    documents.append(text)
                    metadatas.append({
                        "dataset": dataset_name,
                        "chunk_index": i // CHUNK_SIZE,
                        "start_time": str(start_time),
                        "end_time": str(end_time)
                    })
                    ids.append(f"doc_{dataset_name}_{doc_id_counter}")
                    doc_id_counter += 1

            if documents:
                # Generate embeddings
                embeddings = self.encoder.encode(documents).tolist()
                
                # Upsert to ChromaDB
                self.collection.upsert(
                    documents=documents,
                    embeddings=embeddings,
                    metadatas=metadatas,
                    ids=ids
                )
                
            return {
                "status": "success", 
                "message": f"Successfully indexed {len(documents)} document chunks from {len(json_files)} datasets."
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def retrieve(self, query: str, k: int = 5) -> str:
        """Retrieves top-k context for a user query."""
        if not self.collection or not self.encoder:
            return ""
            
        try:
            # Check if collection is empty
            if self.collection.count() == 0:
                self.build_index()
                
            query_embedding = self.encoder.encode([query]).tolist()
            
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=k
            )
            
            if not results['documents'] or not results['documents'][0]:
                return ""
                
            context_blocks = []
            for i, doc in enumerate(results['documents'][0]):
                meta = results['metadatas'][0][i]
                dataset = meta.get("dataset", "Unknown")
                context_blocks.append(f"[Source: {dataset}] {doc}")
                
            return "\n\n".join(context_blocks)
        except Exception as e:
            print(f"RAG retrieval error: {e}")
            return ""

rag_engine = RAGEngine()
