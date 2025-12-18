import { ProjectDetailData } from "@/components/project-detail";

export const PROJECT_DETAILS: Record<string, ProjectDetailData> = {
    "karate-kata": {
        title: "Karate Kata Evaluation System",
        description: "A real-time AI system for karate pose detection and analysis using MoveNet and custom deep neural networks.",
        longDescription: "Designed and developed a Karate Kata Evaluation System using Google MoveNet and a custom deep neural network for real-time pose detection and analysis. Integrated TensorFlow, OpenCV, Scikit-Learn, and Keras for posture assessment and movement analysis. Built and hosted a user-friendly Streamlit interface for real-time feedback and performance evaluation.",
        image: "/project-karate.png",
        tags: ["Python", "Keras", "OpenCV", "TensorFlow", "Streamlit"],
        techStack: [
            { name: "Python", logo: "https://cdn.simpleicons.org/python", url: "https://www.python.org/" },
            { name: "TensorFlow", logo: "https://cdn.simpleicons.org/tensorflow", url: "https://www.tensorflow.org/" },
            { name: "OpenCV", logo: "https://cdn.simpleicons.org/opencv", url: "https://opencv.org/" },
            { name: "Streamlit", logo: "https://cdn.simpleicons.org/streamlit", url: "https://streamlit.io/" },
            { name: "Keras", logo: "/keras.png", url: "https://keras.io/", invertDark: true },
        ],
        liveUrl: "http://karatekataevaluation.streamlit.app/",
        githubUrl: "https://github.com/shyam-thakkar/karate_kata_evaluation",
        date: "2024",
        team: "Solo Project",
        features: [
            "Real-time pose detection using Google MoveNet",
            "Deep neural network for posture assessment",
            "Instant user feedback via Streamlit interface",
            "Comprehensive movement analysis",
            "High accuracy (87%+) in kata evaluation"
        ],
        challenges: [
            "Optimizing real-time pose estimation for web browsers",
            "Reducing latency in model inference",
            "Designing an intuitive UI for athletic feedback",
            "Handling varying lighting conditions in video feed"
        ]
    },
    "stock-prediction": {
        title: "Stock Price Prediction System",
        description: "Real-time stock price prediction web app using LSTM models for accurate 7-day forecasts.",
        longDescription: "Developed a real-time stock price prediction web application using Streamlit and LSTM models for accurate 7-day forecasts, integrating real-time data sources. Implemented data preprocessing and visualization with Pandas and NumPy to enhance user experience.",
        image: "/project-stock.png",
        tags: ["Python", "Streamlit", "Pandas", "NumPy", "TensorFlow", "Keras"],
        techStack: [
            { name: "Python", logo: "https://cdn.simpleicons.org/python", url: "https://www.python.org/" },
            { name: "TensorFlow", logo: "https://cdn.simpleicons.org/tensorflow", url: "https://www.tensorflow.org/" },
            { name: "Streamlit", logo: "https://cdn.simpleicons.org/streamlit", url: "https://streamlit.io/" },
            { name: "Pandas", logo: "https://simpleicons.org/icons/pandas.svg", url: "https://pandas.pydata.org/", invertDark: true },
            { name: "NumPy", logo: "https://cdn.simpleicons.org/numpy", url: "https://numpy.org/", invertDark: true },
        ],
        date: "2024",
        team: "Solo Project",
        features: [
            "Accurate 7-day stock price forecasts",
            "Real-time data integration",
            "LSTM model with sliding window algorithm",
            "Interactive data visualization",
            "User-friendly financial dashboard"
        ],
        challenges: [
            "Preventing overfitting in LSTM models",
            "Handling missing or noisy stock data",
            "Optimizing visualization performance for large datasets",
            "Ensuring low latency for real-time updates"
        ]
    }
} as const;
