"""Alizane Labs AI agency: a CrewAI crew of a CEO, a CTO and a Developer.

Run it with an objective::

    python agency_crew.py "Launch a paid waitlist for our analytics product"

Each agent has its own LLM (see ``llm_config.py``), so models can be swapped
per role without touching the agent or task definitions.
"""

import argparse
import sys

from crewai import Agent, Crew, Process, Task
from dotenv import load_dotenv

from llm_config import build_llm

DEFAULT_OBJECTIVE = "Launch a minimal SaaS product that helps freelancers track billable hours."


def build_ceo() -> Agent:
    return Agent(
        role="Chief Executive Officer",
        goal=(
            "Turn the objective '{objective}' into a focused business strategy: "
            "target customer, value proposition, success metrics and priorities."
        ),
        backstory=(
            "You founded and scaled several software companies. You think in "
            "terms of markets, leverage and sequencing, and you ruthlessly cut "
            "scope that does not move the core metric."
        ),
        llm=build_llm("ceo"),
        allow_delegation=True,
        verbose=True,
    )


def build_cto() -> Agent:
    return Agent(
        role="Chief Technology Officer",
        goal=(
            "Translate the CEO's strategy for '{objective}' into a pragmatic "
            "technical plan: architecture, stack, build-vs-buy calls and risks."
        ),
        backstory=(
            "You have shipped production systems for a decade and favour boring, "
            "well-understood technology. You justify every architectural choice "
            "with the constraints of the business."
        ),
        llm=build_llm("cto"),
        allow_delegation=True,
        verbose=True,
    )


def build_developer() -> Agent:
    return Agent(
        role="Software Developer",
        goal=(
            "Implement the CTO's plan for '{objective}' as clean, runnable code "
            "with clear file boundaries and setup instructions."
        ),
        backstory=(
            "You are a senior generalist engineer who writes small, readable, "
            "well-typed modules and never leaves a snippet that cannot run."
        ),
        llm=build_llm("developer"),
        allow_delegation=False,
        verbose=True,
    )


def build_tasks(ceo: Agent, cto: Agent, developer: Agent) -> list[Task]:
    strategy = Task(
        description=(
            "Define the business strategy for: {objective}\n"
            "Cover the target customer, the problem, the value proposition, "
            "the top three priorities for the next 30 days and the metrics "
            "that prove success."
        ),
        expected_output=(
            "A concise strategy brief in markdown with sections: Target Customer, "
            "Problem, Value Proposition, 30-Day Priorities, Success Metrics."
        ),
        agent=ceo,
    )

    architecture = Task(
        description=(
            "Using the CEO's strategy, design the technical plan for: {objective}\n"
            "Choose the stack, outline the components and their interactions, "
            "call out build-vs-buy decisions and the main technical risks."
        ),
        expected_output=(
            "A technical plan in markdown with sections: Stack, Architecture, "
            "Build vs Buy, Risks, and a prioritised implementation checklist."
        ),
        agent=cto,
        context=[strategy],
    )

    implementation = Task(
        description=(
            "Implement the first item of the CTO's implementation checklist for: "
            "{objective}\nWrite complete, runnable code with all imports and a "
            "short note on how to run it."
        ),
        expected_output=(
            "Markdown containing one fenced code block per file (prefixed with the "
            "file path) plus setup and run instructions."
        ),
        agent=developer,
        context=[architecture],
    )

    return [strategy, architecture, implementation]


def build_crew() -> Crew:
    ceo = build_ceo()
    cto = build_cto()
    developer = build_developer()

    return Crew(
        agents=[ceo, cto, developer],
        tasks=build_tasks(ceo, cto, developer),
        process=Process.sequential,
        verbose=True,
    )


def main(argv: list[str] | None = None) -> int:
    load_dotenv()

    parser = argparse.ArgumentParser(description="Run the Alizane Labs AI agency crew.")
    parser.add_argument(
        "objective",
        nargs="?",
        default=DEFAULT_OBJECTIVE,
        help="The business objective the crew should work on.",
    )
    args = parser.parse_args(argv)

    result = build_crew().kickoff(inputs={"objective": args.objective})
    print(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
