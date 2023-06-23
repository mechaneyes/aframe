import os
from dotenv import load_dotenv
import pinecone
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain import PromptTemplate
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

context = ""


def respond_to_prompt(the_prompt):
    context = docsearch.similarity_search(the_prompt, k=3)

    template = """Answer the question based on the context below. Produce an 
    answer of at least 500 words. Format the answer by breaking up the answer
    into paragraphs that hold discreet, consistent information. Provide the 
    output in HTML with each paragraph wrapped in <p></p> tags. If the question
    cannot be answered using the information provided answer with "I wouldn't
    tell you if I knew".

    Context: {context}
    Question: {the_prompt}
    Answer: """

    prompt = PromptTemplate(
        input_variables=["context", "the_prompt"], template=template
    )
    llmchain = LLMChain(llm=llm, prompt=prompt)
    output = llmchain.run({"context": context, "the_prompt": the_prompt})

    # output = [output, context]
    print(output)
    print("\n\n # ————————————————————————————————————o beep beep —> \n\n")
    print(context)

    # format_output([output, context])
    # return context
    return [output, context]


def format_output(prev):
    template = """Format the copy in the text below. Keep the text the 
    same, but break up the answer into paragraphs that hold discreet, 
    consistent information. Provide the output in HTML with each 
    paragraph wrapped in <p></p> tags.

    Text: {prev[0]}
    Output: """

    prompt = PromptTemplate(input_variables=["prev"], template=template)
    llmchain = LLMChain(llm=llm, prompt=prompt)
    output = llmchain.run({"prev": prev[0]})
    # print(output)
    # return [output, context]
    # return output
    # print([prev[0], prev[1]])
    print(prev[0])
    return output


# ————————————————————————————————————o API —>
#
app = FastAPI()

origins = [
    "http://localhost:3000/",
    "http://localhost:3000",
    "https://third-eyes-pitchfork.vercel.app/",
    "https://hearincolor.com/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


class SendPrompt(BaseModel):
    prompt: str


@app.post("/api/prompt")
def send_prompt(prompt: SendPrompt):
    # respond_to_prompt(prompt.prompt)
    return respond_to_prompt(prompt.prompt)
