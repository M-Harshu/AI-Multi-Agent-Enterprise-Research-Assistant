import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

api_key = os.getenv("TAVILY_API_KEY")
print("API Key:", api_key)

client = TavilyClient(api_key=api_key)

result = client.search(
    query="NVIDIA",
    max_results=2
)

print(result)