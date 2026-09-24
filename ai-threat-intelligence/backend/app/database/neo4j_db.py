from typing import List, Dict, Any, Optional
from ..models.graph_schema import GraphNode, GraphEdge, InvestigationGraphData, NodeDetailResponse

# Pre-seeded enterprise knowledge graph linking threat actors, domains, IPs, and campaigns
DEFAULT_NODES: List[GraphNode] = [
    GraphNode(id="email-101", label="Urgent: Verify Microsoft 365 Account", type="email", risk_level="CRITICAL", threat_score=94, properties={"subject": "Urgent: Verify Microsoft 365 Account", "date": "2026-09-22 18:24 UTC"}),
    GraphNode(id="sender-101", label="attacker-phish@secure-microsoft-verify.top", type="sender", risk_level="CRITICAL", threat_score=96, properties={"reputation": 6, "first_seen": "2026-09-18"}),
    GraphNode(id="domain-101", label="secure-microsoft-verify.top", type="domain", risk_level="CRITICAL", threat_score=98, properties={"age_days": 4, "registrar": "Namecheap Inc", "mx": True}),
    GraphNode(id="ip-101", label="185.220.101.5", type="ip", risk_level="CRITICAL", threat_score=98, properties={"country": "Germany", "asn": "AS200651", "is_tor": True}),
    GraphNode(id="url-101", label="https://secure-microsoft-verify.top/auth/login.php", type="url", risk_level="CRITICAL", threat_score=95, properties={"vt_positives": 58, "target": "Microsoft 365"}),
    GraphNode(id="att-101", label="Security_Verification_Notice.html", type="attachment", risk_level="HIGH", threat_score=85, properties={"sha256": "4b7f8c2e...9a12", "type": "HTML Phishing Template"}),
    GraphNode(id="camp-101", label="Operation SilentHarvest (FIN7)", type="campaign", risk_level="CRITICAL", threat_score=99, properties={"threat_actor": "FIN7 / Carbanak", "active_targets": "Financial & Cloud Users"}),
    GraphNode(id="loc-101", label="Frankfurt, Germany (Tor Node)", type="location", risk_level="MEDIUM", threat_score=60, properties={"coords": [50.1109, 8.6821]})
]

DEFAULT_EDGES: List[GraphEdge] = [
    GraphEdge(id="e1", source="email-101", target="sender-101", relationship="SENT_BY", label="Sent By"),
    GraphEdge(id="e2", source="sender-101", target="domain-101", relationship="REGISTERED_TO", label="Uses Domain"),
    GraphEdge(id="e3", source="domain-101", target="ip-101", relationship="RESOLVES_TO", label="Resolves To IP"),
    GraphEdge(id="e4", source="email-101", target="url-101", relationship="CONTAINS_URL", label="Embedded Link"),
    GraphEdge(id="e5", source="email-101", target="att-101", relationship="ATTACHED_FILE", label="Contains Attachment"),
    GraphEdge(id="e6", source="url-101", target="domain-101", relationship="HOSTED_ON", label="Hosted On"),
    GraphEdge(id="e7", source="ip-101", target="loc-101", relationship="LOCATED_IN", label="Geolocated In"),
    GraphEdge(id="e8", source="domain-101", target="camp-101", relationship="ATTRIBUTED_TO", label="Attributed To Campaign")
]

class Neo4jGraphEngine:
    """Graph Engine providing Neo4j Cypher compatibility and embedded in-memory graph representation."""
    def __init__(self):
        self.nodes = list(DEFAULT_NODES)
        self.edges = list(DEFAULT_EDGES)

    def get_full_investigation_graph(self, case_id: str = "CASE-2026-0922") -> InvestigationGraphData:
        return InvestigationGraphData(
            case_id=case_id,
            nodes=self.nodes,
            edges=self.edges,
            stats={
                "total_nodes": len(self.nodes),
                "total_edges": len(self.edges),
                "critical_entities": sum(1 for n in self.nodes if n.risk_level == "CRITICAL"),
                "high_entities": sum(1 for n in self.nodes if n.risk_level == "HIGH"),
                "campaigns_detected": sum(1 for n in self.nodes if n.type == "campaign")
            }
        )

    def generate_email_subgraph(self, email_addr: str, domain: str, ip: str, urls: list, attachments: list) -> tuple:
        """Dynamically build a Neo4j-style graph for a specific analyzed email."""
        nodes = []
        edges = []

        # Email node
        nodes.append(GraphNode(
            id="node-email",
            label="Analyzed Email",
            type="email",
            risk_level="CRITICAL",
            threat_score=94,
            properties={"subject": "Analyzed Message", "sender": email_addr}
        ))

        # Sender
        nodes.append(GraphNode(
            id="node-sender",
            label=email_addr,
            type="sender",
            risk_level="CRITICAL",
            threat_score=92,
            properties={"email": email_addr}
        ))
        edges.append(GraphEdge(id="sub-e1", source="node-email", target="node-sender", relationship="SENT_BY", label="Sent By"))

        # Domain
        nodes.append(GraphNode(
            id="node-domain",
            label=domain,
            type="domain",
            risk_level="CRITICAL",
            threat_score=95,
            properties={"domain": domain}
        ))
        edges.append(GraphEdge(id="sub-e2", source="node-sender", target="node-domain", relationship="REGISTERED_TO", label="From Domain"))

        # IP
        nodes.append(GraphNode(
            id="node-ip",
            label=ip,
            type="ip",
            risk_level="CRITICAL",
            threat_score=98,
            properties={"ip": ip}
        ))
        edges.append(GraphEdge(id="sub-e3", source="node-domain", target="node-ip", relationship="RESOLVES_TO", label="A Record (DNS)"))

        # URLs
        for i, u in enumerate(urls[:2]):
            u_id = f"node-url-{i}"
            nodes.append(GraphNode(
                id=u_id,
                label=u.url[:36] + "..." if len(u.url) > 36 else u.url,
                type="url",
                risk_level="CRITICAL" if u.is_suspicious else "LOW",
                threat_score=95 if u.is_suspicious else 15,
                properties={"full_url": u.url}
            ))
            edges.append(GraphEdge(id=f"sub-u-{i}", source="node-email", target=u_id, relationship="CONTAINS_URL", label="Embedded Link"))
            edges.append(GraphEdge(id=f"sub-uh-{i}", source=u_id, target="node-domain", relationship="HOSTED_AT", label="Resolves To"))

        # Attachments
        for j, a in enumerate(attachments[:2]):
            a_id = f"node-att-{j}"
            nodes.append(GraphNode(
                id=a_id,
                label=a.filename,
                type="attachment",
                risk_level="CRITICAL" if a.is_suspicious else "SAFE",
                threat_score=90 if a.is_suspicious else 5,
                properties={"sha256": a.sha256, "size": a.size_bytes}
            ))
            edges.append(GraphEdge(id=f"sub-a-{j}", source="node-email", target=a_id, relationship="CONTAINS_ATTACHMENT", label="Attached"))

        # Campaign attribution
        nodes.append(GraphNode(
            id="node-campaign",
            label="Campaign: SpearPhish-Cluster-99",
            type="campaign",
            risk_level="CRITICAL",
            threat_score=97,
            properties={"actor": "APT29 / Nobelium Associated"}
        ))
        edges.append(GraphEdge(id="sub-camp", source="node-domain", target="node-campaign", relationship="ATTRIBUTED_TO", label="Known Campaign"))

        return nodes, edges

    def get_node_details(self, node_id: str) -> Optional[NodeDetailResponse]:
        node = next((n for n in self.nodes if n.id == node_id), None)
        if not node:
            # Generate generic details
            return NodeDetailResponse(
                node_id=node_id,
                type="entity",
                label=node_id,
                threat_score=75,
                risk_level="HIGH",
                first_seen="2026-09-01 00:00 UTC",
                last_seen="2026-09-22 18:24 UTC",
                tags=["Phishing", "IoC", "Active Threat"],
                technical_details={"id": node_id},
                connected_iocs_count=4,
                related_nodes=[]
            )
        
        # Find neighbors
        connected = []
        for e in self.edges:
            if e.source == node_id:
                tgt = next((n for n in self.nodes if n.id == e.target), None)
                if tgt:
                    connected.append({"id": tgt.id, "label": tgt.label, "type": tgt.type, "relationship": e.relationship})
            elif e.target == node_id:
                src = next((n for n in self.nodes if n.id == e.source), None)
                if src:
                    connected.append({"id": src.id, "label": src.label, "type": src.type, "relationship": e.relationship})

        return NodeDetailResponse(
            node_id=node.id,
            type=node.type,
            label=node.label,
            threat_score=node.threat_score,
            risk_level=node.risk_level,
            first_seen="2026-09-18 12:00 UTC",
            last_seen="2026-09-22 18:24 UTC",
            tags=["IoC Indicator", "Threat Intel Match", node.type.upper()],
            technical_details=node.properties,
            connected_iocs_count=len(connected),
            related_nodes=connected
        )

graph_engine = Neo4jGraphEngine()
