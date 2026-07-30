from langchain_ollama import ChatOllama

from backend.models.analysis_models import (
    BullAnalysis,
    BearAnalysis,
    JudgeVerdict,
)

llm = ChatOllama(
    model="gemma3:4b",
    temperature=0
).with_structured_output(JudgeVerdict)


def judge_agent(
    bull_analysis: BullAnalysis,
    bear_analysis: BearAnalysis
) -> JudgeVerdict:
    """
    Judge Agent

    Compares the bullish and bearish analyses and
    returns a balanced investment verdict.
    """

    prompt = f"""
You are the Chief Investment Judge.

Your task is to evaluate the bullish and bearish analyses and produce a balanced investment judgment.

Use ONLY the evidence provided.

For your structured response:

- decision: Choose one of:
  - Recommend Investment
  - Neutral
  - Avoid Investment

- reasoning:
  Explain your decision in 3-5 concise sentences.

- bull_score:
  An integer from 0 to 100 representing the strength of the bullish case.

- bear_score:
  An integer from 0 to 100 representing the strength of the bearish case.

- confidence:
  An integer from 0 to 100 representing your confidence in the decision.

Rules:
- bull_score + bear_score MUST equal exactly 100.
- Do not invent information.
- Base everything only on the analyses below.

==========================
BULL ANALYSIS
==========================

Strengths:
{chr(10).join("- " + item for item in bull_analysis.strengths)}

Opportunities:
{chr(10).join("- " + item for item in bull_analysis.opportunities)}

Recommendation:
{bull_analysis.recommendation}

==========================
BEAR ANALYSIS
==========================

Weaknesses:
{chr(10).join("- " + item for item in bear_analysis.weaknesses)}

Threats:
{chr(10).join("- " + item for item in bear_analysis.threats)}

Recommendation:
{bear_analysis.recommendation}
"""

    result = llm.invoke(prompt)

    print("\n========== JUDGE OUTPUT ==========")
    print(result)

    return result