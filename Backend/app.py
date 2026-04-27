from fastapi import FastAPI
from transformers import pipeline
from contextlib import asynccontextmanager
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class TextRequest(BaseModel):
    text: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli"
    )
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(request: TextRequest):
    classifier = app.state.classifier

    result = classifier(
        request.text,
        candidate_labels=["conservative", "liberal"],
        hypothesis_template="This phrase should belong to a {} political view."
    )

    scores = []
    if result["labels"][0] == "conservative":
        scores = [result["scores"][1],result["scores"][0]]
    else:   
        scores = [result["scores"][0],result["scores"][1]]


    return {
        "label": result["labels"][0],
        "scores": scores
    }