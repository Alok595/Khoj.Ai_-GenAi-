from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pipeline import run_research_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.post("/research")
async def research(req: ResearchRequest):
    result = run_research_pipeline(req.topic)
    return {
        "search_result": result.get("search_result", ""),
        "scraped_content": result.get("scraped_content", ""),
        "report": result.get("report", ""),
        "feedback": result.get("feedback", ""),
    }

@app.get("/health")
def health():
    return {"status": "ok"}