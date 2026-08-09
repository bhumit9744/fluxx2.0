import json


def build_data_context(
    question: str,
    dataset: str,
    result: dict,
) -> str:

    return f"""
FLUXX VERIFIED DATA CONTEXT

Dataset:
{dataset}

User Question:
{question}

The following result was calculated directly from the
CSV dataset using Python/Pandas:

{json.dumps(result, indent=2, default=str)}

IMPORTANT:
These values are authoritative for this response.
Do not modify, invent, estimate, or replace them.
"""


def build_knowledge_context(
    knowledge: str,
) -> str:

    return f"""
FLUXX ENVIRONMENTAL KNOWLEDGE

{knowledge}

This information is general environmental knowledge.
It is not a direct sensor measurement.
"""
