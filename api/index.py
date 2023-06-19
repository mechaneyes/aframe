import os
from dotenv import load_dotenv
import openai
from fastapi import FastAPI
from langchain import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from pydantic import BaseModel

# from fastapi_async_langchain.responses import StreamingResponse
import pinecone
from llama_index import GPTVectorStoreIndex
from llama_index.vector_stores import PineconeVectorStore
from llama_index.storage.storage_context import StorageContext


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or "OPENAI_API_KEY"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY") or "PINECONE_API_KEY"
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT") or "PINECONE_ENVIRONMENT"


pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model.retrieve("gpt-3.5-turbo")


pinecone_index = pinecone.GRPCIndex("pitchfork-rag")
index_name = "pitchfork-rag"
text_field = "content"

# https://community.pinecone.io/t/retrieve-embeddings-stored-in-index-name/906/2
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.0)

# embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
embeddings = OpenAIEmbeddings()

chain = load_qa_chain(llm, chain_type="stuff")

query = "what is massive attack's music like?"
docsearch = Pinecone.from_existing_index(index_name, embeddings)
response = docsearch.similarity_search(query, k=3)
# print(response)

# vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
# storage_context = StorageContext.from_defaults(vector_store=vector_store)
# index = GPTVectorStoreIndex.from_vector_store(vector_store)

# query_engine = index.as_query_engine()
# query = "what is massive attack's music like?"
# response = query_engine.query("what is massive attack's music like?")


# qa = RetrievalQA.from_chain_type(
#     llm=llm,
#     chain_type="stuff",
#     retriever=vectorstore.as_retriever(),
#     return_source_documents=True)
# )

# qa(query)








app = FastAPI()


# class Request(BaseModel):
#     conversation_id: str
#     message: str


@app.get("/api/hello/world")
def hello_world():
    return response


# @app.post("/api/chat")
# async def chat(request: Request) -> StreamingResponse:
#     chain = ConversationChain(
#         llm=ChatOpenAI(temperature=0, streaming=True), verbose=True
#     )
#     return StreamingResponse.from_chain(
#         chain, request.query, media_type="text/event-stream"
#     )
