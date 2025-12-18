export interface Job {
    id: string;
    company: string;
    role: string;
    period: string;
    logoSrc: string;
    logoSize: "small" | "medium";
    description: string[];
}

export const EXPERIENCES_DATA: Job[] = [
    {
        id: "weservecodes",
        company: "WeServeCodes Pvt Ltd.",
        role: "SDE -1 (GenAI Developer)",
        period: "June 2025 – Present",
        logoSrc: "/Weserve_logo_small.png",
        logoSize: "medium",
        description: [
            "Engineered AI-driven automation systems by integrating LLMs with complex business logic, enabling natural-language instructions to trigger reliable, validated actions across internal platforms.",
            "Built robust data-extraction and validation pipelines that combined web automation, structured LLM output, and real-time API checks to ensure accuracy.",
            "Designed and implemented custom tool-call frameworks allowing LLMs to safely interact with external APIs and verify user-provided inputs.",
            "Developed dynamic content-generation workflows powered by rule-based logic and LLM capabilities, improving operational efficiency.",
        ],
    },
    {
        id: "crossshores",
        company: "CrossShores Infotech.",
        role: "AI/ML Intern",
        period: "Dec 2024 – June 2025",
        logoSrc: "/Picture1.png",
        logoSize: "small",
        description: [
            "Developed an in-house API for background removal using BiRefNet and open-source Rembg, reducing client costs by 7%.",
            "Designed and implemented a Candidate Filtering RAG System using LLM-based prompt engineering and hybrid retrievers.",
            "Built a modular pipeline incorporating question generation, JSON-based metadata filtering, and vector store retrieval (Weaviate) to optimize relevance scoring.",
        ],
    },
    {
        id: "tech-elecon",
        company: "Tech Elecon Pvt. Ltd.",
        role: "Data Analyst Intern",
        period: "May 2024 - June 2024",
        logoSrc: "/tech-elecon.png",
        logoSize: "medium",
        description: [
            "Developed an invoice reader project using optical character recognition (OCR) technology to accurately read and display the contents of invoices.",
            "Led a team of interns on various projects, providing guidance and support to ensure successful project completion.",
        ],
    },
];
