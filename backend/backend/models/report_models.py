from typing import List
from pydantic import BaseModel, Field


class Source(BaseModel):
    title: str
    source: str
    url: str
    confidence: str
    agent: str


class FinalReport(BaseModel):
    executive_summary: str = ""
    verified_research: str = ""

    sources: List[Source] = Field(default_factory=list)

    bullish_perspective: str = ""
    bearish_perspective: str = ""
    final_verdict: str = ""
    business_recommendation: str = ""
    conclusion: str = ""