from langchain_ollama import ChatOllama

from backend.models.research_models import ResearchOutput
from backend.models.analysis_models import (
    BullAnalysis,
    BearAnalysis,
    JudgeVerdict,
)
from backend.models.report_models import FinalReport


llm = ChatOllama(
    model="gemma3:4b",
    temperature=0,
).with_structured_output(FinalReport)


def report_writer(
    verified_research: ResearchOutput,
    bull_analysis: BullAnalysis,
    bear_analysis: BearAnalysis,
    final_verdict: JudgeVerdict,
) -> FinalReport:

    prompt = f"""
You are a Senior Enterprise Report Writer.

Generate a professional business report.

Return ONLY a valid JSON object matching the FinalReport schema.

Fields required:

- executive_summary
- verified_research
- sources
- bullish_perspective
- bearish_perspective
- final_verdict
- business_recommendation
- conclusion

If information is unavailable:
- return "" for strings
- return [] for sources

==========================
VERIFIED RESEARCH
==========================

Company:
{verified_research.company}

Summary:
{verified_research.summary}

Key Findings:
{chr(10).join("- " + x for x in verified_research.key_findings)}

Recent Developments:
{chr(10).join("- " + x for x in verified_research.recent_developments)}

Opportunities:
{chr(10).join("- " + x for x in verified_research.opportunities)}

Risks:
{chr(10).join("- " + x for x in verified_research.risks)}

Sources:
{chr(10).join(
    f"- {s.title} ({s.source}) - {s.url}"
    for s in verified_research.sources
)}

==========================
BULL ANALYSIS
==========================

Strengths:
{chr(10).join("- " + x for x in bull_analysis.strengths)}

Opportunities:
{chr(10).join("- " + x for x in bull_analysis.opportunities)}

Recommendation:
{bull_analysis.recommendation}

==========================
BEAR ANALYSIS
==========================

Weaknesses:
{chr(10).join("- " + x for x in bear_analysis.weaknesses)}

Threats:
{chr(10).join("- " + x for x in bear_analysis.threats)}

Recommendation:
{bear_analysis.recommendation}

==========================
JUDGE VERDICT
==========================

Decision:
{final_verdict.decision}

Reasoning:
{final_verdict.reasoning}

Confidence:
{final_verdict.confidence}
"""

    return llm.invoke(prompt)