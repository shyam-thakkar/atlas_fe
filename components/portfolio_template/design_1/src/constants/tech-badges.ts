export interface TechBadgeData {
    name: string;
    code_name?: string; // Added code_name to support using slug/code instead of display name
    href: string;
    imageSrc: string;
    variant?: 'colored' | 'black' | 'white';
}

export const DESCRIPTION_TECH_BADGES: TechBadgeData[] = [
    {
        name: "Python",
        href: "https://www.python.org/",
        imageSrc: "/python-svgrepo-com.svg",
    },
    {
        name: "Django",
        href: "https://www.djangoproject.com/",
        imageSrc: "/django-icon-svgrepo-com.svg",
    },
    {
        name: "FastAPI",
        href: "https://fastapi.tiangolo.com/",
        imageSrc: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png",
    },
    {
        name: "LangChain",
        href: "https://www.langchain.com/",
        imageSrc: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
    },
    {
        name: "LangGraph",
        href: "https://langchain-ai.github.io/langgraph/",
        imageSrc: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/langgraph.png",
    },
];
