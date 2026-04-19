from fastapi import FastAPI
from transformers import pipeline
from contextlib import asynccontextmanager
from pydantic import BaseModel

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

@app.post("/predict")
def predict(request: TextRequest):
    classifier = app.state.classifier

    result = classifier(
        request.text,
        candidate_labels=["conservative", "liberal"],
        hypothesis_template="This phrase should belong to a {} political view."
    )

    return {
        "label": result["labels"][0],
        "scores": result["scores"]
    }