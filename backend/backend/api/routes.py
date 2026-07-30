from fastapi import APIRouter
from pydantic import BaseModel
import traceback

from backend.graph.workflow import workflow
from backend.models.report_models import FinalReport

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


@router.post("/analyze", response_model=FinalReport)
def analyze(request: QueryRequest):
    try:
        print("\n========== /analyze START ==========")
        print("Query:", request.query)

        result = workflow.invoke({
            "query": request.query
        })

        print("\n========== WORKFLOW FINISHED ==========")
        print("Result type:", type(result))

        if isinstance(result, dict):
            print("Result keys:", list(result.keys()))

        if "report" not in result:
            raise Exception(
                f"'report' key not found. Available keys: {list(result.keys())}"
            )

        print("\n========== REPORT ==========")
        print(result["report"])

        print("\n========== RETURNING RESPONSE ==========")

        return result["report"]

    except Exception:
        print("\n========== EXCEPTION ==========")
        traceback.print_exc()
        raise