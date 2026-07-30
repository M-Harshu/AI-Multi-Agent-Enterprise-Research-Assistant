import time

from langgraph.graph import StateGraph, START, END

from backend.graph.state import ResearchState

from backend.agents.research_agent import research_agent
from backend.agents.fact_checker import fact_checker
from backend.agents.bull_analyst import bull_analyst
from backend.agents.bear_analyst import bear_analyst
from backend.agents.judge import judge_agent
from backend.agents.writer import report_writer


# =====================================
# Research
# =====================================
def research_node(state: ResearchState):
    print(">>> Entering Research Node")

    start = time.perf_counter()

    research = research_agent(state["query"])

    print(">>> Research Node Finished")

    print(f"✅ Research Agent      : {time.perf_counter() - start:.2f} sec")

    return {
        "research": research
    }


# =====================================
# Fact Checker
# =====================================
def fact_checker_node(state: ResearchState):
    start = time.perf_counter()

    verified = fact_checker(state["research"])

    print(f"✅ Fact Checker       : {time.perf_counter() - start:.2f} sec")

    return {
        "verified_research": verified
    }


# =====================================
# Bull Analyst
# =====================================
def bull_node(state: ResearchState):
    start = time.perf_counter()

    bull = bull_analyst(state["verified_research"])

    print(f"✅ Bull Analyst       : {time.perf_counter() - start:.2f} sec")

    return {
        "bull_analysis": bull
    }


# =====================================
# Bear Analyst
# =====================================
def bear_node(state: ResearchState):
    start = time.perf_counter()

    bear = bear_analyst(state["verified_research"])

    print(f"✅ Bear Analyst       : {time.perf_counter() - start:.2f} sec")

    return {
        "bear_analysis": bear
    }


# =====================================
# Judge
# =====================================
def judge_node(state: ResearchState):
    start = time.perf_counter()

    verdict = judge_agent(
        state["bull_analysis"],
        state["bear_analysis"]
    )

    print(f"✅ Judge Agent        : {time.perf_counter() - start:.2f} sec")

    return {
        "final_verdict": verdict
    }


# =====================================
# Writer
# =====================================
def writer_node(state: ResearchState):
    start = time.perf_counter()

    report = report_writer(
        state["verified_research"],
        state["bull_analysis"],
        state["bear_analysis"],
        state["final_verdict"]
    )

    print(f"✅ Report Writer      : {time.perf_counter() - start:.2f} sec")

    return {
        "report": report
    }


# =====================================
# Build Workflow
# =====================================

builder = StateGraph(ResearchState)

builder.add_node("research", research_node)
builder.add_node("fact_checker", fact_checker_node)
builder.add_node("bull", bull_node)
builder.add_node("bear", bear_node)
builder.add_node("judge", judge_node)
builder.add_node("writer", writer_node)

builder.add_edge(START, "research")
builder.add_edge("research", "fact_checker")

builder.add_edge("fact_checker", "bull")
builder.add_edge("fact_checker", "bear")

builder.add_edge("bull", "judge")
builder.add_edge("bear", "judge")

builder.add_edge("judge", "writer")

builder.add_edge("writer", END)

workflow = builder.compile()