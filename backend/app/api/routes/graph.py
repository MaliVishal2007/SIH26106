from fastapi import APIRouter, HTTPException
from ...models.graph_schema import InvestigationGraphData, NodeDetailResponse
from ...database.neo4j_db import graph_engine

router = APIRouter(prefix="/graph", tags=["Investigation Knowledge Graph"])

@router.get("/investigation", response_model=InvestigationGraphData)
def get_graph(case_id: str = "CASE-2026-0922"):
    """Get complete Neo4j-style threat intelligence relationship graph."""
    return graph_engine.get_full_investigation_graph(case_id=case_id)

@router.get("/node/{node_id}", response_model=NodeDetailResponse)
def get_node_info(node_id: str):
    """Retrieve detailed forensic properties, connected IoCs, and relationships for a node."""
    details = graph_engine.get_node_details(node_id)
    if not details:
        raise HTTPException(status_code=404, detail="Node not found in graph database")
    return details
