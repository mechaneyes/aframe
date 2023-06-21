torch --no-cache-dir fastapi==0.95.2 --no-cache-dir "uvicorn[standard]" --no-cache-dir
lanarky --no-cache-dir langchain --no-cache-dir openai --no-cache-dir tiktoken --no-cache-dir faiss-cpu --no-cache-dir
gradio --no-cache-dir "pinecone-client[grpc]" --no-cache-dir llama-index --no-cache-dir ipython --no-cache-dir 
prompt_engineering --no-cache-dir

python -m uvicorn api.index:app --host 0.0.0.0 --port 8080 --workers 4
python -m uvicorn api.index:app --host 0.0.0.0 --port 443 --workers 4

uvicorn api.index:app --host 0.0.0.0 --port 8080 --workers 4
uvicorn api.index:app --host 0.0.0.0 --port 8443 --workers 4
uvicorn api.index:app --host 127.0.0.1 --port 443 --workers 4

$ sudo update-alternatives --config python3


sudo lsof -t -i tcp:443 | xargs kill -9