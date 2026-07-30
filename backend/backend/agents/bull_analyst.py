from langchain_ollama import ChatOllama

from backend.models.research_models import ResearchOutput
from backend.models.analysis_models import BullAnalysis

llm = ChatOllama(
    model="gemma3:1b",
    temperature=0
).with_structured_output(BullAnalysis)


def bull_analyst(verified_research: ResearchOutput) -> BullAnalysis:
    """
    Bull Analyst

    Identifies the positive aspects of the company and
    returns a structured BullAnalysis object.
    """

    prompt = f"""
You are a Senior Bull Market Analyst.

Analyze ONLY the positive aspects of the company.

You MUST return ALL of these fields:

- strengths (list)
- opportunities (list)
- recommendation (string)

Do NOT omit any field.

If there is no recommendation, return an empty string.

Focus ONLY on:

1. Competitive strengths
2. Growth opportunities
3. Market leadership
4. Innovation
5. Long-term advantages

Do NOT discuss risks.
Do NOT discuss weaknesses.

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

Sources:
{chr(10).join(
    f"- {source.title} ({source.source}) - {source.url}"
    for source in verified_research.sources
)}
"""

    return llm.invoke(prompt)