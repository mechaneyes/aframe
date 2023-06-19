import os
from dotenv import load_dotenv
import openai
import pinecone
from langchain import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.chains import LLMChain
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain import PromptTemplate
from llama_index.vector_stores import PineconeVectorStore
from llama_index.storage.storage_context import StorageContext
from llama_index import GPTVectorStoreIndex
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or "OPENAI_API_KEY"
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY") or "PINECONE_API_KEY"
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT") or "PINECONE_ENVIRONMENT"


pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
index_name = "pitchfork-rag"
text_field = "content"

embeddings = OpenAIEmbeddings()
docsearch = Pinecone.from_existing_index(index_name, embeddings)

query = "tell me what autechre events were like in the 90s?"
# the_response = docsearch.similarity_search(query, k=3)
# print(the_response)





# ————————————————————————————————————o prompting + chaining —>
#
llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo-16k", temperature=0.5
)

def respond_to_prompt(the_prompt):
    context = docsearch.similarity_search(the_prompt, k=3)

    template = """Answer the question based on the context below. Please 
    produce an answer of at least 500 words. Where necessary, break up the 
    answer into paragraphs. Paragraphs should be separated by two new line 
    characters, `\n\n`. If the question cannot be answered using the 
    information provided answer with "I don't know".

    Context: {context}
    Question: {the_prompt}
    Answer: """

    prompt = PromptTemplate(
        input_variables=["context", "the_prompt"], template=template
    )
    chain = LLMChain(llm=llm, prompt=prompt)

    output = chain.run({"context": context, "the_prompt": the_prompt})
    output = [output, context]
    print(output)

    return format_output(output)


def format_output(from_response):
    return from_response


# ————————————————————————————————————o API —>
#
app = FastAPI()

origins = [
    "http://localhost:3000/",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SendPrompt(BaseModel):
    prompt: str


@app.post("/api/prompt")
def send_prompt(prompt: SendPrompt):
    # respond_to_prompt(prompt.prompt)
    return respond_to_prompt(prompt.prompt)
