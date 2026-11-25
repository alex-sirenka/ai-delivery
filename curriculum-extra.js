window.AIDM_ADDITIONS = [
  {
    ch: 1, t: "Transformers, attention and why context matters",
    m: "Most modern language models use transformer networks. Attention lets each token weigh information from other tokens in the context, while model layers build increasingly useful representations. This helps explain why context order, length and relevance can affect an answer, without requiring delivery managers to understand the math.",
    s: "A policy assistant receives a long prompt with the user's key constraint buried between copied email threads. The model answers fluently but misses the constraint. The team trims irrelevant history, moves the required rule into a clearly labeled instruction and tests it in several positions.",
    h: ["Understand tokens as the model's input units, not words.", "Keep critical instructions concise and explicit.", "Test whether important facts survive realistic context length and ordering."],
    tl: "Google's Machine Learning Crash Course for introductory concepts; model-provider documentation for context limits.",
    x: "Assuming a larger context window guarantees that every detail will be used correctly.",
    q: "Which information must the model notice, and have we tested that under realistic context?"
  },
  {
    ch: 3, t: "GraphRAG and knowledge graphs",
    m: "GraphRAG combines retrieval with explicit relationships between entities, such as people, products, policies or events. It can help answer questions that require connecting information across many documents, but it adds extraction, graph-quality and maintenance work.",
    s: "A legal team asks which suppliers are affected by a new clause. Keyword search finds documents mentioning the clause; a graph can connect clauses to contracts, suppliers and business units. The pilot compares both approaches against the same reviewed questions before committing to graph infrastructure.",
    h: ["Start with questions that need multi-hop relationships.", "Measure entity and relationship extraction quality.", "Compare graph retrieval with a simpler hybrid-search baseline."],
    tl: "Microsoft GraphRAG; graph databases such as Neo4j; evaluation sets from representative user questions.",
    x: "Choosing a graph because it is newer, without showing that relationships improve task success.",
    q: "Which real user questions cannot be answered reliably by simpler retrieval?"
  },
  {
    ch: 4, t: "Agent interoperability: MCP and A2A",
    m: "MCP standardizes how an AI application connects to tools and data sources. A2A focuses on communication and task handoff between agents. They solve different integration problems; neither protocol grants safe permissions or guarantees another agent's behavior.",
    s: "A travel assistant needs to query an internal booking tool and delegate a complex itinerary to a specialist agent. The team uses a tool protocol for the booking API and an agent protocol for the specialist, while keeping authorization, timeouts and human approval in the host application.",
    h: ["Choose a protocol based on the boundary: tools/data or agent-to-agent tasks.", "Review authentication, authorization, data exposure and version compatibility.", "Treat all remote tools and agents as untrusted dependencies."],
    tl: "Official Model Context Protocol specification; A2A protocol documentation.",
    x: "Believing protocol compatibility is equivalent to security, governance or interoperability of business meaning.",
    q: "What is the trust boundary for each tool or remote agent?"
  },
  {
    ch: 5, t: "Synthetic data and annotation for evaluation",
    m: "Synthetic data is generated or transformed data used to supplement real examples. It can broaden test coverage or reduce exposure to sensitive records, but it can also reproduce errors and biases. Human review and clear provenance remain important for high-impact evaluation sets.",
    s: "A health-services team cannot copy real patient questions into a vendor test environment. They create synthetic examples from approved templates, have clinicians review them, label edge cases and keep a small controlled set of real cases for final validation.",
    h: ["Define what each label means before annotators begin.", "Record whether an example is synthetic, transformed or real.", "Measure reviewer agreement and adjudicate disagreements.", "Keep final evaluation examples separate from prompt tuning."],
    tl: "NIST Generative AI Profile; a versioned spreadsheet or data-labeling tool with annotation guidelines.",
    x: "Treating generated examples as ground truth simply because they are numerous.",
    q: "Who reviewed the evaluation examples, and how do we know the labels are consistent?"
  },
  {
    ch: 5, t: "Benchmark leakage and contamination",
    m: "Evaluation leakage occurs when test examples or their answers influence model, prompt or system design. Public benchmarks may also overlap with model training data. Scores can then overstate performance on genuinely unseen work.",
    s: "A team repeatedly tunes a prompt against the same 50 acceptance examples and reports a rising score. A separate hidden set later reveals that the improvements do not generalize. The team reserves a held-out set and adds fresh examples from pilot failures.",
    h: ["Separate development, validation and final test data.", "Limit access to held-out answers.", "Track benchmark versions and data lineage.", "Confirm promising results on real, representative tasks."],
    tl: "Versioned evaluation datasets; experiment tracking in the model platform or CI system.",
    x: "Calling a benchmark score a release guarantee when the set is small, public or repeatedly reused.",
    q: "Which examples were never used to tune this system?"
  },
  {
    ch: 6, t: "Copyright, licensing and AI procurement",
    m: "AI procurement must address data rights, model and dependency licenses, output use, confidentiality, retention, indemnities and change notice. Copyright rules differ by jurisdiction and continue to evolve; involve qualified legal and procurement specialists rather than assuming prompts transfer ownership.",
    s: "A marketing pilot uses a model to draft campaign copy. Before scaling, procurement checks whether submitted material is retained, whether outputs can be used commercially, how third-party claims are handled and which model updates require re-evaluation.",
    h: ["Inventory data sent to the provider and its permitted uses.", "Review model, SDK and dataset licenses with counsel.", "Put retention, incident notice, audit and exit terms in writing.", "Record who accepts residual legal and commercial risk."],
    tl: "U.S. Copyright Office AI reports; SPDX license list; your organization's legal and procurement review.",
    x: "Assuming an enterprise plan or a provider's indemnity resolves every copyright, privacy or licensing question.",
    q: "What data and outputs can the contract retain, reuse or license, and who approved that?"
  },
  {
    ch: 8, t: "EU AI Act and risk-based governance",
    m: "The EU AI Act uses a risk-based framework with obligations that depend on the system, its role in the value chain and its intended use. A delivery team should identify whether it is provider, deployer or another actor, document the intended purpose and consult current legal guidance on applicable obligations and dates.",
    s: "A company plans to use an AI assistant in employee screening. The delivery lead does not classify it from the product name alone: legal and compliance assess the intended use, affected people, provider/deployer roles and applicable controls before the pilot.",
    h: ["Document intended purpose, users, affected people and deployment context.", "Ask counsel to assess role, risk category and jurisdiction-specific duties.", "Map required evidence, human oversight and monitoring into delivery gates.", "Re-check the official timeline because rules and guidance can change."],
    tl: "European Commission AI Act Service Desk and the current consolidated legal text; internal legal counsel.",
    x: "Treating a checklist or a general risk label as a substitute for a legal assessment.",
    q: "Who has assessed our role and intended use under the applicable AI rules?"
  },
  {
    ch: 8, t: "NIST AI RMF and ISO/IEC 42001",
    m: "The NIST AI Risk Management Framework is voluntary guidance organized around Govern, Map, Measure and Manage. ISO/IEC 42001 specifies requirements for an AI management system. They can help structure organizational practices, but neither automatically certifies an individual AI system as safe or compliant with every law.",
    s: "A global organization wants one governance approach for several AI pilots. It uses the NIST functions to organize use-case risk work and aligns its management system with ISO/IEC 42001, while mapping legal obligations separately by jurisdiction.",
    h: ["Use a framework to assign owners and repeatable processes.", "Map each control to evidence, review cadence and accountable role.", "Keep legal compliance analysis distinct from voluntary framework adoption.", "Assess gaps using the organization's size and risk context."],
    tl: "NIST AI RMF and Generative AI Profile; ISO/IEC 42001 standard overview.",
    x: "Claiming that adopting a framework alone makes a product compliant or trustworthy.",
    q: "Which evidence demonstrates that each identified risk is governed and reviewed?"
  },
  {
    ch: 8, t: "Content safety, moderation and output guardrails",
    m: "Content-safety controls detect or limit categories of harmful content in inputs or outputs. They are one layer in a broader safety design that can also include product policy, access controls, human review and incident handling. Thresholds need testing against the intended users and context.",
    s: "A youth-support assistant blocks some harmless educational questions while allowing a euphemistic harmful request. The team tests representative and adversarial examples, adjusts thresholds with safety specialists and provides an escalation route instead of relying on one filter.",
    h: ["Define harms, allowed content and escalation paths with domain owners.", "Test false positives and false negatives across relevant languages and groups.", "Use defense in depth; don't rely on prompt instructions alone.", "Monitor incidents and update the evaluation set."],
    tl: "Microsoft Foundry risk and safety evaluations; OWASP GenAI Security Project guidance.",
    x: "Treating a content filter as proof that the application is safe.",
    q: "Which harms are in scope, and how will we detect both over-blocking and under-blocking?"
  },
  {
    ch: 8, t: "Red teaming, jailbreaks and prompt injection",
    m: "Prompt injection and jailbreak attempts try to steer a model away from intended behavior, including through untrusted documents or tool results. Red teaming systematically probes these paths. Because models interpret language probabilistically, there is no single filter that guarantees prevention.",
    s: "A RAG assistant retrieves a document containing instructions to reveal private records. The team tests direct and indirect attacks, limits retrieval permissions, prevents the model from authorizing access and verifies that tool calls are checked by application code.",
    h: ["Model threats across user input, retrieved content, memory and tool output.", "Test realistic attacks and document residual risk.", "Enforce authorization and output validation outside the model.", "Re-test after model, prompt, retrieval or tool changes."],
    tl: "OWASP Top 10 for LLM Applications; NIST GenAI Profile; structured red-team test cases.",
    x: "Assuming a system prompt or a one-time penetration test permanently prevents injection.",
    q: "Can untrusted text cause an unauthorized data disclosure or action?"
  },
  {
    ch: 8, t: "Shadow AI, AI literacy and acceptable-use policy",
    m: "Shadow AI is the use of AI tools outside approved organizational controls. A practical AI-literacy program helps staff recognize limitations, protect information and escalate concerns. Clear, usable approved tools and policies reduce risk more effectively than awareness training alone.",
    s: "Staff paste client material into consumer chat tools because the approved service is difficult to access. The organization provides a supported alternative, publishes examples of prohibited data, explains review expectations and offers a simple path to request new tools.",
    h: ["Survey actual tools and tasks without blaming users.", "Define data classes, approved services and prohibited uses.", "Train by role using realistic scenarios and short refreshers.", "Measure adoption, incidents and policy exceptions."],
    tl: "NIST AI RMF; internal acceptable-use and data-classification policies.",
    x: "Publishing a restrictive policy without providing usable approved options or a feedback channel.",
    q: "What are staff doing today, and can they complete that work safely with approved tools?"
  },
  {
    ch: 9, t: "Staffing an AI delivery team",
    m: "AI delivery usually needs product and domain ownership, software engineering, data or ML expertise, evaluation, security, privacy and operations. Roles can be combined in a small pilot, but accountabilities must still be explicit and scaled as the system's risk and usage grow.",
    s: "A pilot team has two developers and a business sponsor but no domain reviewer or operations owner. The delivery manager identifies these gaps early and secures part-time specialists before the pilot can affect real customer decisions.",
    h: ["Map capabilities to project risks and lifecycle stages.", "Name accountable owners even when roles are part-time.", "Plan production support, evaluation and data stewardship before pilot exit.", "Review capacity and specialist dependencies at each gate."],
    tl: "Skills matrix, RACI and delivery charter; NIST AI RMF role and governance guidance.",
    x: "Assuming one prompt engineer or one data scientist can cover product, security, legal and operations responsibilities.",
    q: "Which critical capability has no named owner on this team?"
  },
  {
    ch: 11, t: "LLMOps: tracing and monitoring AI applications",
    m: "LLMOps applies operational practices to AI systems: versioning prompts and models, tracing requests, tracking quality and cost, managing evaluations, and responding to incidents. Telemetry must be designed with privacy controls because prompts and outputs can contain sensitive data.",
    s: "A support assistant becomes slower and more expensive after a retrieval change. Traces show that reranking added latency and the prompt sent duplicate context. The team compares versions, rolls back the retrieval setting and updates its cost and quality dashboards.",
    h: ["Trace model, prompt, retrieval and tool versions for each request.", "Monitor quality, latency, failures, token use and unit cost.", "Redact or restrict sensitive prompt and response content in telemetry.", "Connect incidents and user feedback to regression tests."],
    tl: "OpenTelemetry GenAI semantic conventions; Microsoft Foundry evaluation and monitoring tools; Langfuse.",
    x: "Logging full prompts and responses by default without a data-protection review.",
    q: "Can we trace a bad answer to the exact model, prompt, sources and tools involved?"
  },
  {
    ch: 11, t: "AI workload economics, energy and data sovereignty",
    m: "AI workload placement affects cost, latency, data location, resilience and energy use. A model hosted locally is not automatically cheaper or more private; capacity, operations, licensing and lifecycle costs still matter. Compare options against explicit service and governance requirements.",
    s: "A team proposes a local model for a sensitive workflow. Its total-cost comparison includes hardware utilization, upgrades, support, energy, model quality and staff time, then checks whether the deployment actually meets residency requirements.",
    h: ["Define residency, sovereignty and availability requirements with legal and security teams.", "Compare total cost per successful task, not just model-token price.", "Measure energy and utilization where credible data is available.", "Reassess workload placement as volume and model quality change."],
    tl: "FinOps Framework; provider data-residency documentation; organization-specific sustainability reporting.",
    x: "Assuming a model's hosting location alone guarantees data sovereignty or lower environmental impact.",
    q: "What evidence shows this deployment meets residency needs at acceptable lifecycle cost?"
  },
  {
    ch: 11, t: "Small language models, quantization and LoRA",
    m: "Small language models can reduce latency or deployment cost for suitable tasks. Quantization stores model weights at lower precision, while LoRA adapts a model with smaller trainable parameter sets. These techniques introduce quality, hardware, licensing and maintenance trade-offs that require evaluation.",
    s: "A company considers a small local model for ticket classification. It benchmarks the model against a hosted baseline on representative cases, checks language coverage and hardware utilization, and keeps a fallback for ambiguous requests.",
    h: ["Establish a quality and latency baseline before optimizing.", "Compare quantized and unquantized versions on the same held-out set.", "Include license, security updates, hardware and support in total cost.", "Use fine-tuning only when simpler prompting or retrieval is insufficient."],
    tl: "Hugging Face PEFT and quantization documentation; model-provider deployment guides.",
    x: "Treating a smaller or locally hosted model as an automatic win without measuring task quality.",
    q: "What quality loss, if any, is acceptable for the savings this model provides?"
  },
  {
    ch: 12, t: "Comparing AI platforms and providers",
    m: "Cloud AI platforms differ in model choice, data handling, regions, identity integration, evaluation tools, quotas, pricing and operational support. Compare the same representative workload across candidates rather than selecting by a feature checklist or model leaderboard alone.",
    s: "A team compares Azure, AWS and Google services for an internal knowledge assistant. It tests the same evaluation set, retrieval design and security requirements, then compares total operating cost and regional availability.",
    h: ["Write non-negotiable requirements before vendor demos.", "Run a small, repeatable benchmark with representative data.", "Review contract, region, retention, support and exit options.", "Record the decision and triggers for reassessment."],
    tl: "Microsoft Foundry, Amazon Bedrock and Google Vertex AI official documentation; provider contracts and pricing pages.",
    x: "Comparing vendors using different prompts, datasets or pricing assumptions.",
    q: "Would each provider be evaluated against the same task and constraints?"
  },
  {
    ch: 12, t: "Open-weight models and self-hosting",
    m: "Open-weight models make model parameters available under a license, but that does not necessarily mean the training data, code or unrestricted usage rights are open. Self-hosting also shifts infrastructure, security patching, scaling and support responsibilities to the organization.",
    s: "A regulated team prefers self-hosting for control. Before choosing a model, procurement checks the exact license and acceptable-use terms; engineering estimates GPU capacity, patch cadence, incident ownership and fallback needs.",
    h: ["Distinguish open weights from open-source training data and code.", "Review license obligations and permitted uses for the exact model version.", "Budget for hosting, upgrades, security and on-call support.", "Compare with managed hosting using the same acceptance tests."],
    tl: "Model cards and license files from model publishers; internal security and procurement review.",
    x: "Assuming publicly downloadable weights can be used for any purpose without conditions.",
    q: "Who owns updates, security fixes and service reliability if we self-host?"
  },
  {
    ch: 13, t: "Worked case: operating model and exit criteria",
    m: "A delivery case is incomplete until it defines who operates the product, how incidents are handled and what evidence triggers scale, pause or shutdown. Operational readiness should be tested during the pilot, not written only after the business case is approved.",
    s: "A successful document assistant pilot meets answer-quality targets, but nobody owns content refresh or after-hours incidents. The steering group delays scale until service ownership, a rollback path and a funded support model are agreed.",
    h: ["Name service, data, model and business owners.", "Exercise rollback, incident escalation and content refresh.", "Compare pilot evidence with agreed go/no-go thresholds.", "Record scale, pause or stop decisions with an owner and date."],
    tl: "Release readiness checklist, SLO dashboard, runbook and decision log.",
    x: "Equating a successful demo or pilot with production readiness.",
    q: "Could the named team safely operate this service next Monday?"
  },
  {
    ch: 14, t: "Building an evidence-based AI portfolio",
    m: "An interview or professional portfolio should show decisions and evidence, not just tool names. Strong examples describe the initial problem, constraints, options considered, delivery actions, measurable outcomes and lessons learned, while protecting confidential information.",
    s: "A candidate describes a RAG pilot by explaining the baseline, evaluation set, retrieval trade-off, security gate and measured result. The story is credible because it separates their contribution from the team's work and avoids exposing client data.",
    h: ["Choose a case with a clear business problem and your specific role.", "Include one decision, one piece of evidence and one outcome.", "State limitations and what you would change next time.", "Anonymize or obtain permission before sharing project material."],
    tl: "A one-page case-study template; sanitized evaluation and delivery artifacts.",
    x: "Claiming ownership of team results or disclosing confidential client details to make a story sound impressive.",
    q: "What evidence can I share that demonstrates my contribution without exposing protected information?"
  },
  {
    ch: 15, t: "AI vendor due diligence and model cards",
    m: "Vendor due diligence should cover intended use, model limitations, data handling, security, regional availability, change notices, support, audit evidence and exit arrangements. Model cards can help describe a model, but they are not a substitute for application-level evaluation or contract review.",
    s: "A provider's model card reports strong benchmark results. The buyer still tests its own languages and workflows, reviews retention and subprocessors, and agrees how model-version changes will be announced and assessed.",
    h: ["Request model and service documentation for the exact version.", "Ask about data use, retention, regions, subprocessors and incident response.", "Agree on version notices, service levels and an exit plan.", "Validate claims in a controlled pilot using your own criteria."],
    tl: "Provider model cards and trust documentation; NIST AI RMF; procurement questionnaire.",
    x: "Treating marketing claims, certifications or benchmark scores as proof of suitability for your use case.",
    q: "What can change at the provider without notice, and how would we detect the impact?"
  },
  {
    ch: 15, t: "AI change log and evidence register",
    m: "A change log connects releases to the model version, prompt, retrieval configuration, tools, evaluation results, approvals and rollback plan. An evidence register makes it easier to explain why a release was accepted and to investigate regressions.",
    s: "After a model update, answer quality drops for one language. The release manifest shows when the provider version changed, which cases regressed and who accepted the prior release, allowing the team to roll back and notify affected users.",
    h: ["Version the model identifier, prompts, data snapshot and tool schemas.", "Attach evaluation results and approval records to each release.", "Record known limitations, rollback conditions and owners.", "Keep audit evidence proportional to risk and retention policy."],
    tl: "Git, CI/CD release manifests, evaluation reports and a decision log.",
    x: "Keeping evidence only in chat messages or personal notebooks that cannot be reconstructed later.",
    q: "Could we reconstruct the exact configuration and approval for a production answer?"
  }
];

window.AIDM_CURRICULUM.push(...window.AIDM_ADDITIONS);

window.AIDM_PATHS = {
  all: { name: "Complete curriculum", chapters: Array.from({ length: 16 }, (_, i) => i) },
  foundations: { name: "AI delivery foundations", chapters: [0, 1, 2, 8, 9, 10, 14, 15] },
  rag: { name: "Knowledge assistant / RAG", chapters: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15] },
  agents: { name: "Agents and automation", chapters: [1, 2, 4, 5, 7, 8, 9, 10, 11, 12, 13, 15] },
  production: { name: "Production readiness", chapters: [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15] }
};

window.AIDM_CHAPTER_SOURCES = {
  0: [
    { title: "Scrum Guide", url: "https://scrumguides.org/scrum-guide.html" },
    { title: "GOV.UK Service Manual: agile delivery", url: "https://www.gov.uk/service-manual/agile-delivery" }
  ],
  1: [
    { title: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
    { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" }
  ],
  2: [
    { title: "OpenAI prompt engineering guide", url: "https://platform.openai.com/docs/guides/prompt-engineering" },
    { title: "OpenAI structured outputs guide", url: "https://platform.openai.com/docs/guides/structured-outputs" }
  ],
  3: [
    { title: "Microsoft: RAG overview", url: "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview" },
    { title: "Microsoft GraphRAG", url: "https://microsoft.github.io/graphrag/" }
  ],
  4: [
    { title: "Model Context Protocol specification", url: "https://modelcontextprotocol.io/specification" },
    { title: "A2A protocol", url: "https://a2a-protocol.org/latest/" }
  ],
  5: [
    { title: "NIST Generative AI Profile", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
    { title: "Microsoft Foundry evaluation overview", url: "https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-overview" }
  ],
  6: [
    { title: "NIST Privacy Framework", url: "https://www.nist.gov/privacy-framework" },
    { title: "U.S. Copyright Office: Copyright and Artificial Intelligence", url: "https://www.copyright.gov/ai/index.html" }
  ],
  7: [
    { title: "Pro Git book", url: "https://git-scm.com/book/en/v2" },
    { title: "OpenTelemetry GenAI semantic conventions", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/" }
  ],
  8: [
    { title: "OWASP Top 10 for LLM Applications (2026)", url: "https://genai.owasp.org/top-10-for-llm-applications-2026/" },
    { title: "European Commission: AI Act implementation timeline", url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline" },
    { title: "ISO/IEC 42001 overview", url: "https://www.iso.org/standard/42001" },
    { title: "Microsoft Foundry risk and safety evaluations", url: "https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/risk-safety-evaluators" }
  ],
  9: [
    { title: "GOV.UK Service Manual: discovery", url: "https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works" },
    { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" }
  ],
  10: [
    { title: "Scrum Guide", url: "https://scrumguides.org/scrum-guide.html" },
    { title: "The Kanban Guide", url: "https://kanbanguides.org/english/" }
  ],
  11: [
    { title: "FinOps Framework", url: "https://www.finops.org/framework/" },
    { title: "Google SRE book", url: "https://sre.google/sre-book/table-of-contents/" },
    { title: "OpenTelemetry GenAI semantic conventions", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/" }
  ],
  12: [
    { title: "Microsoft Foundry documentation", url: "https://learn.microsoft.com/en-us/azure/ai-foundry/" },
    { title: "Amazon Bedrock documentation", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" },
    { title: "Google Vertex AI generative AI documentation", url: "https://cloud.google.com/vertex-ai/generative-ai/docs/overview" }
  ],
  13: [
    { title: "NIST Generative AI Profile", url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" },
    { title: "Microsoft: RAG overview", url: "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview" }
  ],
  14: [
    { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    { title: "Scrum Guide", url: "https://scrumguides.org/scrum-guide.html" }
  ],
  15: [
    { title: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
    { title: "European Commission: AI Act implementation timeline", url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline" },
    { title: "ISO/IEC 42001 overview", url: "https://www.iso.org/standard/42001" }
  ]
};

window.AIDM_CURRICULUM.forEach(item => {
  item.editorial = {
    owner: "Unassigned - assign a subject-matter reviewer",
    contentUpdatedOn: null,
    lastFactCheck: null,
    referencesAddedOn: "2026-11-25"
  };
});
window.AIDM_ADDITIONS.forEach(item => {
  item.editorial.contentUpdatedOn = "2026-11-25";
});

window.AIDM_GLOSSARY = {
  "A2A": "Agent-to-agent protocol for communication and task handoff between agents.",
  "AI RMF": "NIST AI Risk Management Framework.",
  "API": "Application programming interface.",
  "CI/CD": "Continuous integration and continuous delivery or deployment.",
  "EU AI Act": "European Union regulation establishing a risk-based framework for AI systems.",
  "F1": "Harmonic mean of precision and recall.",
  "FinOps": "Collaborative operating practice for managing technology cost and business value.",
  "GDPR": "General Data Protection Regulation.",
  "HITL": "Human in the loop.",
  "LLM": "Large language model.",
  "LLMOps": "Operational practices for building, evaluating and running LLM applications.",
  "LoRA": "Low-Rank Adaptation, a parameter-efficient model adaptation method.",
  "MCP": "Model Context Protocol.",
  "MRR": "Mean Reciprocal Rank.",
  "NDCG": "Normalized Discounted Cumulative Gain.",
  "NFR": "Non-functional requirement.",
  "NIST": "U.S. National Institute of Standards and Technology.",
  "PII": "Personally identifiable information.",
  "RAG": "Retrieval-Augmented Generation.",
  "RAID": "Risks, assumptions, issues and dependencies.",
  "RACI": "Responsible, Accountable, Consulted and Informed.",
  "RICE": "Reach, Impact, Confidence and Effort prioritization framework.",
  "SLA": "Service-level agreement.",
  "SLO": "Service-level objective.",
  "SLM": "Small language model.",
  "TCO": "Total cost of ownership."
};

window.AIDM_CONTENT_META = {
  release: "2026-11",
  sourceNote: "Sources are further reading, not legal advice. Product documentation and regulations change; confirm current requirements before relying on them.",
  editorialNote: "Existing topics need a named subject-matter review; additions were authored in this release."
};
