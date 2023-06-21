torch --no-cache-dir fastapi==0.95.2 --no-cache-dir "uvicorn[standard]" --no-cache-dir
lanarky --no-cache-dir langchain --no-cache-dir openai --no-cache-dir tiktoken --no-cache-dir faiss-cpu --no-cache-dir
gradio --no-cache-dir "pinecone-client[grpc]" --no-cache-dir llama-index --no-cache-dir ipython --no-cache-dir 
prompt_engineering --no-cache-dir

python -m uvicorn api.index:app --host 0.0.0.0 --port 8080 --workers 4
python -m uvicorn api.index:app --host 0.0.0.0 --port 443 --workers 4

uvicorn api.index:app --host 0.0.0.0 --port 8080 --workers 4
uvicorn api.index:app --host 0.0.0.0 --port 8443 --workers 4
uvicorn api.index:app --host 127.0.0.1 --port 443 --workers 4
uvicorn api.index:app --host 127.0.0.1 --port 443 --workers 4

gunicorn -k uvicorn.workers.UvicornWorker
gunicorn -w 4 -k uvicorn.workers.UvicornWorker






gunicorn api.index:app  --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:80




gunicorn --keyfile=/etc/letsencrypt/live/eyesee.digital-0001/privkey.pem --certfile=/etc/letsencrypt/live/eyesee.digital-0001/fullchain.pem -k uvicorn.workers.UvicornWorker api.index:app


uvicorn api.index:app --host 127.0.0.1 --port 8000 --ssl-certfile /etc/letsencrypt/live/eyesee.digital-0001/fullchain.pem --ssl-keyfile /etc/letsencrypt/live/eyesee.digital-0001/privkey.pem



sudo lsof -t -i tcp:443 | xargs kill -9