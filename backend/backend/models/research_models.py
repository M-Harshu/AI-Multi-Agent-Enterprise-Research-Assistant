from typing import List
from pydantic import BaseModel, Field


class Source(BaseModel):
    title: str
    source: str
    url: str


class ResearchOutput(BaseModel):
    company: str
    summary: str

    key_findings: List[str] = Field(default_factory=list)
    recent_developments: List[str] = Field(default_factory=list)
    opportunities: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    sources: List[Source] = Field(default_factory=list)