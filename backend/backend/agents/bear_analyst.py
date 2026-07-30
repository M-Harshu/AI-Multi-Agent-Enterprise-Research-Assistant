from langchain_ollama import ChatOllama

from backend.models.research_models import ResearchOutput
from backend.models.analysis_models import BearAnalysis

llm = ChatOllama(
    model="gemma3:1b",
    temperature=0
).with_structured_output(BearAnalysis)


def bear_analyst(verified_research: ResearchOutput) -> BearAnalysis:
    """
    Bear Analyst

    Identifies the negative aspects of the company and
    returns a structured BearAnalysis object.
    """

    prompt = f"""
You are a Senior Bear Market Analyst.

Analyze ONLY the negative aspects of the company.

Focus ONLY on:

1. Weaknesses
2. Risks
3. Market threats
4. Competitive challenges
5. Regulatory concerns

Do NOT discuss strengths.

Do NOT discuss opportunities.

Research

Company:
{verified_research.company}

Summary:
{verified_research.summary}

Key Findings:
{chr(10).join("- " + item for item in verified_research.key_findings)}

Recent Developments:
{chr(10).join("- " + item for item in verified_research.recent_developments)}

Opportunities:
{chr(10).join("- " + item for item in verified_research.opportunities)}

Risks:
{chr(10).join("- " + item for item in verified_research.risks)}

Sources:
{chr(10).join(
    f"- {source.title} ({source.source}) - {source.url}"
    for source in verified_research.sources
)}
"""

    return llm.invoke(prompt)