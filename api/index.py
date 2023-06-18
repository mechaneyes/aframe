from fastapi import FastAPI
from pydantic import BaseModel

class Prompt(BaseModel):
    name: str | None = None
    the_prompt: str
    temperature: float | None = 0.0


app = FastAPI()


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


# @app.get("/prompt/{prompt}")
# def read_item(prompt: int, q: Union[str, None] = None):
#     return {"prompt": prompt, "q": q}


@app.post("/third/eyes")
def create_prompt(prompt: Prompt):
    return prompt