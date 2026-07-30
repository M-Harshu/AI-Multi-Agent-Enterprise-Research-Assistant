from typing import List
from pydantic import BaseModel, Field


class BullAnalysis(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    opportunities: List[str] = Field(default_factory=list)
    recommendation: str = ""


class BearAnalysis(BaseModel):
    weaknesses: List[str] = Field(default_factory=list)
    threats: List[str] = Field(default_factory=list)
    recommendation: str = ""


class JudgeVerdict(BaseModel):
    decision: str = ""
    reasoning: str = ""

    bull_score: int = Field(
        default=0,
        ge=0,
        le=100
    )

    bear_score: int = Field(
        default=0,
        ge=0,
        le=100
    )

    confidence: int = Field(
        default=0,
        ge=0,
        le=100
    )