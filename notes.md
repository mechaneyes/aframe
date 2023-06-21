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





gunicorn --keyfile=./key.pem --certfile=./cert.pem -k uvicorn.workers.UvicornWorker example:app

gunicorn --keyfile=/etc/letsencrypt/live/neoneon.one/privkey.pem --certfile=/etc/letsencrypt/live/neoneon.one/fullchain.pem -k uvicorn.workers.UvicornWorker api.index:app





uvicorn example:app --port 5000 --ssl-keyfile=./key.pem --ssl-certfile=./cert.pem

uvicorn api.index:app --host 127.0.0.1 --port 8000 --ssl-certfile /etc/letsencrypt/live/neoneon.one/fullchain.pem --ssl-keyfile /etc/letsencrypt/live/neoneon.one/privkey.pem



/etc/letsencrypt/live/neoneon.one/fullchain.pem