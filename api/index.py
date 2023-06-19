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


llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY, model_name="gpt-3.5-turbo", temperature=0.0
)

embeddings = OpenAIEmbeddings()
docsearch = Pinecone.from_existing_index(index_name, embeddings)

query = "what is massive attack's music like?"
# the_response = docsearch.similarity_search(query, k=3)
# print(the_response)

# vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
# storage_context = StorageContext.from_defaults(vector_store=vector_store)
# index = GPTVectorStoreIndex.from_vector_store(vector_store)


# ————————————————————————————————————o Prompt Templates —>
#
# Prompt Templates and LLMs with Langchain
# https://www.pinecone.io/learn/langchain-prompt-templates/
#

# template = """Answer the question based on the context below. If the
# question cannot be answered using the information provided answer
# with "I don't know".

# Context:

# Question: {query}

# Answer: """

# prompt_template = PromptTemplate(input_variables=["query"], template=template)

# print(
#     prompt_template.format(
#         query="Which libraries and model providers offer LLMs?"
#     )
# )


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



def respond_to_prompt(the_prompt):
    context = docsearch.similarity_search(the_prompt, k=2)

    template = """Answer the question based on the context below. If the
    question cannot be answered using the information provided answer
    with "I don't know".

    Context: {context}
    Question: {the_prompt}
    Answer: """

    prompt = PromptTemplate(
        input_variables=["context", "the_prompt"], template=template
    )
    chain = LLMChain(llm=llm, prompt=prompt)

    output = chain.run({"context": context, "the_prompt": the_prompt})
    output = output + "\n\n" + str(context)
    print(output)
    return output


@app.post("/api/prompt")
def send_prompt(prompt: SendPrompt):
    # respond_to_prompt(prompt.prompt)
    return respond_to_prompt(prompt.prompt)
