from typing import TypedDict

from backend.models.research_models import ResearchOutput
from backend.models.analysis_models import (
    BullAnalysis,
    BearAnalysis,
    JudgeVerdict,
)
from backend.models.report_models import FinalReport


class ResearchState(TypedDict):
    query: str

    research: ResearchOutput

    verified_research: ResearchOutput

    bull_analysis: BullAnalysis

    bear_analysis: BearAnalysis

    final_verdict: JudgeVerdict

    report: FinalReport