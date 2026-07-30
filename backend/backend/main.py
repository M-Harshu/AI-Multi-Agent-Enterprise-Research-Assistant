import time

from backend.graph.workflow import workflow


initial_state = {
    "query": "Analyze NVIDIA's latest AI strategy."
}

print("=" * 80)
print("MULTI-AGENT RESEARCH ASSISTANT")
print("=" * 80)

start_time = time.time()

result = workflow.invoke(initial_state)

end_time = time.time()

report = result["report"]

print("\n" + "=" * 80)
print("ENTERPRISE INTELLIGENCE REPORT")
print("=" * 80)

print("\n# Executive Summary\n")
print(report.executive_summary)

print("\n# Verified Research\n")
print(report.verified_research)

print("\n# Bullish Perspective\n")
print(report.bullish_perspective)

print("\n# Bearish Perspective\n")
print(report.bearish_perspective)

print("\n# Final Verdict\n")
print(report.final_verdict)

print("\n# Business Recommendation\n")
print(report.business_recommendation)

print("\n# Conclusion\n")
print(report.conclusion)

print("\n" + "=" * 80)
print(f"Total Execution Time : {end_time - start_time:.2f} seconds")
print("=" * 80)