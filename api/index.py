from dotenv import load_dotenv
from fastapi import FastAPI
from langchain import ConversationChain
from langchain.chat_models import ChatOpenAI
from pydantic import BaseModel
from fastapi_async_langchain.responses import StreamingResponse

load_dotenv()
app = FastAPI()


class Request(BaseModel):
    conversation_id: str
    message: str


@app.get("/api/hello/world")
def hello_world():
    return {"message": "Hello World"}


@app.post("/chat")
async def chat(request: Request) -> StreamingResponse:
    chain = ConversationChain(
        llm=ChatOpenAI(temperature=0, streaming=True), verbose=True
    )
    return StreamingResponse.from_chain(
        chain, request.query, media_type="text/event-stream"
    )
