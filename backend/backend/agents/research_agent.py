from langchain_ollama import ChatOllama

from backend.tools.search import search_web
from backend.models.research_models import ResearchOutput


llm = ChatOllama(
    model="gemma3:1b",
    temperature=0
).with_structured_output(ResearchOutput)


def research_agent(query: str) -> ResearchOutput:
    """
    Research Agent

    Searches the web and returns structured research.
    """

    search_results = search_web(query)

    context = ""
    source_list = []

    # Use only the top 3 search results
    for result in search_results["results"][:3]:

        summary = result.get("content", "")[:350]

        source_list.append({
            "title": result["title"],
            "source": result["url"],
            "url": result["url"]
        })

        context += f"""
Title: {result['title']}

Summary:
{summary}

Source:
{result['url']}

----------------------------------------
"""

    sources_text = "\n".join(
        f"- {src['title']} ({src['source']})"
        for src in source_list
    )

    prompt = f"""
You are a Senior Technology Research Analyst.

Using ONLY the research data below, generate a complete research report.

You MUST return ALL of the following fields.

If any information is unavailable, return an empty list instead of omitting the field.

Required fields:

- company (string)
- summary (string)
- key_findings (list of strings)
- recent_developments (list of strings)
- opportunities (list of strings)
- risks (list of strings)
- sources (list of objects)

Each source object must have:

- title
- source
- url

Available Sources:

{sources_text}

Research Data:

{context}
"""

    return llm.invoke(prompt)