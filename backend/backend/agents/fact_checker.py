from langchain_ollama import ChatOllama

from backend.models.research_models import ResearchOutput

llm = ChatOllama(
    model="gemma3:1b",
    temperature=0
).with_structured_output(ResearchOutput)


def fact_checker(research: ResearchOutput) -> ResearchOutput:
    """
    Fact Checker

    Reviews the research and returns a verified
    ResearchOutput object.
    """

    prompt = f"""
You are an expert AI Fact Checker.

Review the research below.

Your tasks:

1. Remove unsupported or speculative claims.
2. Improve factual accuracy.
3. Preserve important verified information.
4. Keep the same structure.
5. Do NOT invent new facts.

Research

Company:
{research.company}

Summary:
{research.summary}

Key Findings:
{chr(10).join("- " + item for item in research.key_findings)}

Recent Developments:
{chr(10).join("- " + item for item in research.recent_developments)}

Opportunities:
{chr(10).join("- " + item for item in research.opportunities)}

Risks:
{chr(10).join("- " + item for item in research.risks)}

Sources:
{chr(10).join(
    f"- {source.title} ({source.source}) - {source.url}"
    for source in research.sources
)}
"""

    return llm.invoke(prompt)