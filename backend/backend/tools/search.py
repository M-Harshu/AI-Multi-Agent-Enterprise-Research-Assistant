import os
import time
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

client = TavilyClient(api_key=TAVILY_API_KEY)


def search_web(query):
    """
    Search the web using Tavily.

    Retries automatically if a temporary network error occurs.
    """

    retries = 3

    for attempt in range(retries):
        try:
            response = client.search(
                query=query,
                max_results=5
            )
            return response

        except Exception as e:
            print(f"Tavily Error (Attempt {attempt + 1}/{retries}): {e}")

            if attempt < retries - 1:
                time.sleep(2)
            else:
                raise