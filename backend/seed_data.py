"""
Seed data for studyOS domains.
Pre-populated domain intelligence data.
"""

DOMAINS_DATA = [
    {
        "slug": "fintech",
        "name": "FinTech",
        "description": "Financial technology combining finance, software, and digital innovation to transform banking, payments, and financial services.",
        "icon": "Wallet",
        "market_demand": 87,
        "difficulty_index": 72,
        "time_to_competency": "8-14 months",
        "avg_salary_min": 95000,
        "avg_salary_max": 180000,
        "overview": "FinTech represents the fusion of financial services with cutting-edge technology. It encompasses digital payments, blockchain-based solutions, algorithmic trading, robo-advisors, and decentralized finance (DeFi). The sector is revolutionizing how individuals and institutions interact with money.",
        "why_it_matters": "The global FinTech market is projected to reach $310 billion by 2026. Traditional banks are being disrupted by agile startups, creating unprecedented career opportunities for engineers who understand both finance and technology.",
        "core_concepts": [
            "Payment Processing Systems",
            "Digital Banking Architecture",
            "Regulatory Compliance (PCI-DSS, SOC2)",
            "Fraud Detection & Prevention",
            "API-First Banking",
            "Real-time Transaction Processing"
        ],
        "required_skills": [
            {"name": "Python/Java", "level": "advanced", "importance": 95},
            {"name": "SQL & NoSQL", "level": "advanced", "importance": 90},
            {"name": "REST APIs", "level": "advanced", "importance": 88},
            {"name": "Cloud (AWS/GCP)", "level": "intermediate", "importance": 82},
            {"name": "Security Fundamentals", "level": "intermediate", "importance": 78}
        ],
        "tool_stack": [
            {"name": "Stripe", "category": "Payments", "icon": "CreditCard"},
            {"name": "Plaid", "category": "Banking APIs", "icon": "Link"},
            {"name": "PostgreSQL", "category": "Database", "icon": "Database"},
            {"name": "Redis", "category": "Caching", "icon": "Zap"},
            {"name": "Kafka", "category": "Event Streaming", "icon": "Activity"}
        ],
        "industry_applications": [
            "Digital Payment Platforms (Square, Stripe)",
            "Neobanks (Chime, Revolut)",
            "Investment Apps (Robinhood, Acorns)",
            "Lending Platforms (LendingClub)",
            "Insurance Tech (Lemonade)"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Foundation", "duration": "2 months", "tasks": ["Master Python/Java", "Learn SQL fundamentals", "Understand REST APIs"]},
            {"step": 2, "title": "Core Finance", "duration": "2 months", "tasks": ["Study payment systems", "Learn regulatory basics", "Build simple payment flow"]},
            {"step": 3, "title": "Integration", "duration": "3 months", "tasks": ["Integrate Stripe/Plaid", "Build banking dashboard", "Implement security measures"]},
            {"step": 4, "title": "Advanced", "duration": "3 months", "tasks": ["Real-time processing", "Fraud detection", "Scale & optimize"]}
        ]
    },
    {
        "slug": "finance",
        "name": "Finance",
        "description": "Traditional and modern financial analysis, investment strategies, and corporate finance powered by quantitative methods.",
        "icon": "TrendingUp",
        "market_demand": 82,
        "difficulty_index": 68,
        "time_to_competency": "6-12 months",
        "avg_salary_min": 85000,
        "avg_salary_max": 160000,
        "overview": "Finance domain covers the systematic study of money management, investments, and financial instruments. It combines theoretical frameworks with practical applications in portfolio management, risk assessment, and corporate valuation.",
        "why_it_matters": "Financial expertise remains one of the most valuable skill sets globally. Understanding how money flows through markets, companies, and economies provides a foundation for countless career paths.",
        "core_concepts": [
            "Financial Statement Analysis",
            "Valuation Methods (DCF, Comparables)",
            "Portfolio Theory",
            "Risk Management",
            "Time Value of Money",
            "Capital Markets"
        ],
        "required_skills": [
            {"name": "Excel/Google Sheets", "level": "advanced", "importance": 95},
            {"name": "Financial Modeling", "level": "advanced", "importance": 92},
            {"name": "Python for Finance", "level": "intermediate", "importance": 85},
            {"name": "Statistics", "level": "intermediate", "importance": 80},
            {"name": "SQL", "level": "beginner", "importance": 70}
        ],
        "tool_stack": [
            {"name": "Excel", "category": "Modeling", "icon": "Table"},
            {"name": "Bloomberg Terminal", "category": "Data", "icon": "Monitor"},
            {"name": "Python (pandas)", "category": "Analysis", "icon": "Code"},
            {"name": "Tableau", "category": "Visualization", "icon": "BarChart"},
            {"name": "Capital IQ", "category": "Research", "icon": "Search"}
        ],
        "industry_applications": [
            "Investment Banking",
            "Asset Management",
            "Private Equity",
            "Corporate Finance",
            "Financial Planning & Analysis"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Fundamentals", "duration": "2 months", "tasks": ["Learn accounting basics", "Master Excel modeling", "Study financial statements"]},
            {"step": 2, "title": "Valuation", "duration": "2 months", "tasks": ["DCF modeling", "Comparable analysis", "LBO basics"]},
            {"step": 3, "title": "Markets", "duration": "2 months", "tasks": ["Portfolio theory", "Risk metrics", "Market dynamics"]},
            {"step": 4, "title": "Application", "duration": "3 months", "tasks": ["Case studies", "Real portfolio", "Industry research"]}
        ]
    },
    {
        "slug": "ai",
        "name": "Artificial Intelligence",
        "description": "Building intelligent systems that can reason, learn, and act autonomously across diverse problem domains.",
        "icon": "Brain",
        "market_demand": 95,
        "difficulty_index": 85,
        "time_to_competency": "12-18 months",
        "avg_salary_min": 120000,
        "avg_salary_max": 250000,
        "overview": "Artificial Intelligence encompasses the development of systems capable of performing tasks that typically require human intelligence. This includes reasoning, problem-solving, perception, and language understanding.",
        "why_it_matters": "AI is transforming every industry from healthcare to transportation. Companies are investing billions in AI capabilities, creating an unprecedented demand for skilled practitioners who can build and deploy intelligent systems.",
        "core_concepts": [
            "Machine Learning Fundamentals",
            "Neural Networks & Deep Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Reinforcement Learning",
            "AI Ethics & Safety"
        ],
        "required_skills": [
            {"name": "Python", "level": "advanced", "importance": 98},
            {"name": "Linear Algebra", "level": "advanced", "importance": 92},
            {"name": "PyTorch/TensorFlow", "level": "advanced", "importance": 90},
            {"name": "Statistics & Probability", "level": "advanced", "importance": 88},
            {"name": "Cloud ML Platforms", "level": "intermediate", "importance": 75}
        ],
        "tool_stack": [
            {"name": "PyTorch", "category": "Framework", "icon": "Flame"},
            {"name": "Hugging Face", "category": "NLP", "icon": "MessageSquare"},
            {"name": "OpenAI API", "category": "LLMs", "icon": "Sparkles"},
            {"name": "Weights & Biases", "category": "MLOps", "icon": "Activity"},
            {"name": "CUDA", "category": "GPU Computing", "icon": "Cpu"}
        ],
        "industry_applications": [
            "Autonomous Vehicles (Tesla, Waymo)",
            "Healthcare Diagnostics",
            "Conversational AI (ChatGPT, Claude)",
            "Recommendation Systems",
            "Robotics & Automation"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Math Foundation", "duration": "2 months", "tasks": ["Linear algebra", "Calculus", "Probability & statistics"]},
            {"step": 2, "title": "ML Basics", "duration": "3 months", "tasks": ["Supervised learning", "Unsupervised learning", "Model evaluation"]},
            {"step": 3, "title": "Deep Learning", "duration": "4 months", "tasks": ["Neural networks", "CNNs/RNNs", "Transformers"]},
            {"step": 4, "title": "Specialization", "duration": "4 months", "tasks": ["Choose domain (NLP/CV)", "Build projects", "Deploy models"]}
        ]
    },
    {
        "slug": "machine-learning",
        "name": "Machine Learning",
        "description": "Engineering systems that automatically learn and improve from experience without being explicitly programmed.",
        "icon": "Cpu",
        "market_demand": 93,
        "difficulty_index": 80,
        "time_to_competency": "10-14 months",
        "avg_salary_min": 110000,
        "avg_salary_max": 220000,
        "overview": "Machine Learning is the science of getting computers to act without being explicitly programmed. It focuses on algorithms that learn patterns from data to make predictions or decisions.",
        "why_it_matters": "ML powers everything from spam filters to self-driving cars. It's the practical engine behind AI applications and represents one of the most in-demand technical skills globally.",
        "core_concepts": [
            "Supervised Learning",
            "Unsupervised Learning",
            "Feature Engineering",
            "Model Selection & Validation",
            "Ensemble Methods",
            "Gradient Descent Optimization"
        ],
        "required_skills": [
            {"name": "Python", "level": "advanced", "importance": 98},
            {"name": "scikit-learn", "level": "advanced", "importance": 95},
            {"name": "Statistics", "level": "advanced", "importance": 90},
            {"name": "pandas/NumPy", "level": "advanced", "importance": 92},
            {"name": "SQL", "level": "intermediate", "importance": 78}
        ],
        "tool_stack": [
            {"name": "scikit-learn", "category": "ML Library", "icon": "Settings"},
            {"name": "XGBoost", "category": "Boosting", "icon": "Zap"},
            {"name": "Jupyter", "category": "Development", "icon": "BookOpen"},
            {"name": "MLflow", "category": "Experiment Tracking", "icon": "GitBranch"},
            {"name": "Docker", "category": "Deployment", "icon": "Box"}
        ],
        "industry_applications": [
            "Fraud Detection Systems",
            "Recommendation Engines",
            "Predictive Maintenance",
            "Customer Churn Prediction",
            "Price Optimization"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Python & Math", "duration": "2 months", "tasks": ["Python mastery", "Statistics fundamentals", "Linear algebra basics"]},
            {"step": 2, "title": "Core ML", "duration": "3 months", "tasks": ["Classification algorithms", "Regression models", "Clustering"]},
            {"step": 3, "title": "Advanced", "duration": "3 months", "tasks": ["Ensemble methods", "Feature engineering", "Hyperparameter tuning"]},
            {"step": 4, "title": "Production", "duration": "3 months", "tasks": ["Model deployment", "MLOps basics", "Real-world projects"]}
        ]
    },
    {
        "slug": "data-science",
        "name": "Data Science",
        "description": "Extracting knowledge and insights from structured and unstructured data using statistics, ML, and visualization.",
        "icon": "BarChart3",
        "market_demand": 90,
        "difficulty_index": 75,
        "time_to_competency": "8-12 months",
        "avg_salary_min": 100000,
        "avg_salary_max": 190000,
        "overview": "Data Science combines statistics, mathematics, programming, and domain expertise to extract meaningful insights from data. It's about asking the right questions and finding answers hidden in data.",
        "why_it_matters": "Data is the new oil, and data scientists are the engineers refining it. Every company needs people who can turn raw data into actionable business intelligence.",
        "core_concepts": [
            "Exploratory Data Analysis",
            "Statistical Inference",
            "Data Visualization",
            "Hypothesis Testing",
            "A/B Testing",
            "Data Storytelling"
        ],
        "required_skills": [
            {"name": "Python/R", "level": "advanced", "importance": 95},
            {"name": "SQL", "level": "advanced", "importance": 92},
            {"name": "Statistics", "level": "advanced", "importance": 90},
            {"name": "Data Visualization", "level": "advanced", "importance": 88},
            {"name": "Machine Learning", "level": "intermediate", "importance": 80}
        ],
        "tool_stack": [
            {"name": "pandas", "category": "Data Manipulation", "icon": "Table"},
            {"name": "matplotlib/seaborn", "category": "Visualization", "icon": "BarChart"},
            {"name": "SQL", "category": "Querying", "icon": "Database"},
            {"name": "Tableau/Power BI", "category": "BI Tools", "icon": "PieChart"},
            {"name": "Apache Spark", "category": "Big Data", "icon": "Flame"}
        ],
        "industry_applications": [
            "Business Intelligence",
            "Customer Analytics",
            "Marketing Optimization",
            "Product Analytics",
            "Operations Research"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Foundation", "duration": "2 months", "tasks": ["Python basics", "SQL mastery", "Statistics fundamentals"]},
            {"step": 2, "title": "Analysis", "duration": "2 months", "tasks": ["pandas proficiency", "EDA techniques", "Data cleaning"]},
            {"step": 3, "title": "Visualization", "duration": "2 months", "tasks": ["matplotlib/seaborn", "Dashboard creation", "Data storytelling"]},
            {"step": 4, "title": "ML & Deployment", "duration": "3 months", "tasks": ["Predictive modeling", "A/B testing", "Business case studies"]}
        ]
    },
    {
        "slug": "cybersecurity",
        "name": "Cybersecurity",
        "description": "Protecting systems, networks, and data from digital attacks, unauthorized access, and cyber threats.",
        "icon": "Shield",
        "market_demand": 92,
        "difficulty_index": 78,
        "time_to_competency": "10-16 months",
        "avg_salary_min": 95000,
        "avg_salary_max": 200000,
        "overview": "Cybersecurity involves protecting computer systems, networks, and data from theft, damage, or unauthorized access. It encompasses everything from network security to cryptography to ethical hacking.",
        "why_it_matters": "Cyber attacks cost businesses trillions annually. With increasing digitization, the demand for security professionals far outpaces supply, making it one of the most stable and lucrative career paths.",
        "core_concepts": [
            "Network Security",
            "Cryptography",
            "Penetration Testing",
            "Incident Response",
            "Security Architecture",
            "Compliance Frameworks"
        ],
        "required_skills": [
            {"name": "Networking (TCP/IP)", "level": "advanced", "importance": 95},
            {"name": "Linux Administration", "level": "advanced", "importance": 92},
            {"name": "Python Scripting", "level": "intermediate", "importance": 85},
            {"name": "Security Tools", "level": "advanced", "importance": 90},
            {"name": "Cloud Security", "level": "intermediate", "importance": 80}
        ],
        "tool_stack": [
            {"name": "Wireshark", "category": "Network Analysis", "icon": "Wifi"},
            {"name": "Metasploit", "category": "Pen Testing", "icon": "Target"},
            {"name": "Burp Suite", "category": "Web Security", "icon": "Globe"},
            {"name": "Nmap", "category": "Scanning", "icon": "Search"},
            {"name": "SIEM Tools", "category": "Monitoring", "icon": "Eye"}
        ],
        "industry_applications": [
            "Security Operations Center (SOC)",
            "Penetration Testing",
            "Security Architecture",
            "Incident Response",
            "Compliance & Audit"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Fundamentals", "duration": "3 months", "tasks": ["Networking basics", "Linux administration", "Security concepts"]},
            {"step": 2, "title": "Defensive", "duration": "3 months", "tasks": ["Firewalls & IDS", "Log analysis", "Incident response"]},
            {"step": 3, "title": "Offensive", "duration": "3 months", "tasks": ["Ethical hacking", "Vulnerability assessment", "CTF challenges"]},
            {"step": 4, "title": "Specialization", "duration": "3 months", "tasks": ["Cloud security", "Certifications prep", "Real engagements"]}
        ]
    },
    {
        "slug": "quant",
        "name": "Quantitative Finance",
        "description": "Applying mathematical models and computational techniques to financial markets and trading strategies.",
        "icon": "LineChart",
        "market_demand": 85,
        "difficulty_index": 92,
        "time_to_competency": "18-24 months",
        "avg_salary_min": 150000,
        "avg_salary_max": 400000,
        "overview": "Quantitative Finance (Quant) combines advanced mathematics, statistics, and programming to develop trading strategies, price derivatives, and manage risk in financial markets.",
        "why_it_matters": "Quants are among the highest-paid professionals in finance. They drive algorithmic trading, risk management, and financial innovation at hedge funds, banks, and prop trading firms.",
        "core_concepts": [
            "Stochastic Calculus",
            "Time Series Analysis",
            "Options Pricing Models",
            "Risk Metrics (VaR, Greeks)",
            "Algorithmic Trading",
            "Market Microstructure"
        ],
        "required_skills": [
            {"name": "Python/C++", "level": "advanced", "importance": 98},
            {"name": "Mathematics", "level": "expert", "importance": 95},
            {"name": "Statistics", "level": "advanced", "importance": 92},
            {"name": "Financial Theory", "level": "advanced", "importance": 88},
            {"name": "Data Engineering", "level": "intermediate", "importance": 75}
        ],
        "tool_stack": [
            {"name": "Python (NumPy/SciPy)", "category": "Computation", "icon": "Calculator"},
            {"name": "C++", "category": "Low Latency", "icon": "Zap"},
            {"name": "QuantLib", "category": "Pricing", "icon": "DollarSign"},
            {"name": "kdb+/q", "category": "Time Series DB", "icon": "Database"},
            {"name": "Jupyter", "category": "Research", "icon": "BookOpen"}
        ],
        "industry_applications": [
            "Hedge Funds (Citadel, Two Sigma)",
            "Prop Trading (Jane Street, Jump)",
            "Investment Banks (Goldman, Morgan Stanley)",
            "Asset Management",
            "Risk Management"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Math Foundation", "duration": "4 months", "tasks": ["Calculus & linear algebra", "Probability theory", "Stochastic processes"]},
            {"step": 2, "title": "Finance Theory", "duration": "3 months", "tasks": ["Market fundamentals", "Derivatives basics", "Risk concepts"]},
            {"step": 3, "title": "Implementation", "duration": "4 months", "tasks": ["Python for finance", "Backtesting frameworks", "Strategy development"]},
            {"step": 4, "title": "Advanced", "duration": "5 months", "tasks": ["Options pricing", "ML in trading", "Low-latency systems"]}
        ]
    },
    {
        "slug": "web3",
        "name": "Web3 & Blockchain",
        "description": "Building decentralized applications, smart contracts, and tokenized systems on blockchain networks.",
        "icon": "Blocks",
        "market_demand": 78,
        "difficulty_index": 82,
        "time_to_competency": "8-14 months",
        "avg_salary_min": 100000,
        "avg_salary_max": 250000,
        "overview": "Web3 represents the next evolution of the internet built on decentralized protocols. It includes blockchain development, smart contracts, DeFi, NFTs, and decentralized autonomous organizations (DAOs).",
        "why_it_matters": "Despite market volatility, blockchain technology continues to mature. The demand for skilled Web3 developers remains strong, with applications expanding beyond cryptocurrency into enterprise, gaming, and identity.",
        "core_concepts": [
            "Blockchain Fundamentals",
            "Smart Contract Development",
            "Consensus Mechanisms",
            "Tokenomics",
            "DeFi Protocols",
            "Wallet Integration"
        ],
        "required_skills": [
            {"name": "Solidity", "level": "advanced", "importance": 95},
            {"name": "JavaScript/TypeScript", "level": "advanced", "importance": 90},
            {"name": "Web3.js/Ethers.js", "level": "advanced", "importance": 92},
            {"name": "React", "level": "intermediate", "importance": 80},
            {"name": "Cryptography Basics", "level": "intermediate", "importance": 75}
        ],
        "tool_stack": [
            {"name": "Hardhat", "category": "Development", "icon": "Hammer"},
            {"name": "Ethers.js", "category": "Web3 Library", "icon": "Link"},
            {"name": "OpenZeppelin", "category": "Security", "icon": "Shield"},
            {"name": "Alchemy/Infura", "category": "Node Provider", "icon": "Cloud"},
            {"name": "IPFS", "category": "Storage", "icon": "HardDrive"}
        ],
        "industry_applications": [
            "DeFi Protocols (Uniswap, Aave)",
            "NFT Marketplaces",
            "DAOs & Governance",
            "Gaming & Metaverse",
            "Enterprise Blockchain"
        ],
        "execution_strategy": [
            {"step": 1, "title": "Blockchain Basics", "duration": "2 months", "tasks": ["Understanding blockchain", "Ethereum fundamentals", "Wallet operations"]},
            {"step": 2, "title": "Smart Contracts", "duration": "3 months", "tasks": ["Solidity basics", "Contract patterns", "Testing & debugging"]},
            {"step": 3, "title": "dApp Development", "duration": "3 months", "tasks": ["Frontend integration", "Web3 libraries", "User authentication"]},
            {"step": 4, "title": "Advanced", "duration": "3 months", "tasks": ["Security auditing", "DeFi mechanics", "Cross-chain development"]}
        ]
    }
]

# Resources data for each domain
RESOURCES_DATA = {
    "fintech": [
        {"title": "Stripe Documentation", "description": "Official Stripe payment integration guide", "url": "https://stripe.com/docs", "resource_type": "article", "category": "core_stack", "difficulty": "intermediate", "provider": "Stripe", "is_free": True},
        {"title": "Building a Digital Bank", "description": "Complete guide to neobank architecture", "url": "https://www.youtube.com/watch?v=fintech101", "resource_type": "video", "category": "foundation", "difficulty": "beginner", "provider": "YouTube", "is_free": True},
        {"title": "Plaid API Tutorial", "description": "Connect to bank accounts programmatically", "url": "https://plaid.com/docs", "resource_type": "article", "category": "core_stack", "difficulty": "intermediate", "provider": "Plaid", "is_free": True},
        {"title": "PCI-DSS Compliance Guide", "description": "Security standards for payment processing", "url": "https://www.pcisecuritystandards.org", "resource_type": "article", "category": "advanced", "difficulty": "advanced", "provider": "PCI Council", "is_free": True},
        {"title": "Build a Payment Gateway", "description": "End-to-end payment system project", "url": "https://github.com/fintech-projects", "resource_type": "project", "category": "projects", "difficulty": "advanced", "provider": "GitHub", "is_free": True}
    ],
    "finance": [
        {"title": "Financial Modeling Fundamentals", "description": "Learn to build DCF models from scratch", "url": "https://www.youtube.com/watch?v=finance101", "resource_type": "video", "category": "foundation", "difficulty": "beginner", "provider": "YouTube", "is_free": True},
        {"title": "CFA Level 1 Study Guide", "description": "Comprehensive CFA prep materials", "url": "https://www.cfainstitute.org", "resource_type": "course", "category": "core_stack", "difficulty": "intermediate", "provider": "CFA Institute", "is_free": False},
        {"title": "Python for Finance", "description": "Financial analysis with Python", "url": "https://www.oreilly.com/library/view/python-for-finance", "resource_type": "book", "category": "advanced", "difficulty": "intermediate", "provider": "O'Reilly", "is_free": False},
        {"title": "Aswath Damodaran's Valuation", "description": "NYU Stern valuation lectures", "url": "https://pages.stern.nyu.edu/~adamodar", "resource_type": "course", "category": "foundation", "difficulty": "intermediate", "provider": "NYU", "is_free": True}
    ],
    "ai": [
        {"title": "Fast.ai Practical Deep Learning", "description": "Top-down approach to deep learning", "url": "https://course.fast.ai", "resource_type": "course", "category": "foundation", "difficulty": "intermediate", "provider": "Fast.ai", "is_free": True},
        {"title": "Stanford CS229 Machine Learning", "description": "Andrew Ng's legendary ML course", "url": "https://cs229.stanford.edu", "resource_type": "course", "category": "foundation", "difficulty": "advanced", "provider": "Stanford", "is_free": True},
        {"title": "Attention Is All You Need", "description": "The transformer paper that changed AI", "url": "https://arxiv.org/abs/1706.03762", "resource_type": "article", "category": "advanced", "difficulty": "expert", "provider": "arXiv", "is_free": True},
        {"title": "Hugging Face NLP Course", "description": "Transformers and NLP from basics to deployment", "url": "https://huggingface.co/learn", "resource_type": "course", "category": "core_stack", "difficulty": "intermediate", "provider": "Hugging Face", "is_free": True},
        {"title": "Build a ChatGPT Clone", "description": "Create your own LLM-powered chatbot", "url": "https://github.com/ai-projects", "resource_type": "project", "category": "projects", "difficulty": "advanced", "provider": "GitHub", "is_free": True}
    ],
    "machine-learning": [
        {"title": "Scikit-learn Documentation", "description": "Official ML library documentation", "url": "https://scikit-learn.org/stable/documentation.html", "resource_type": "article", "category": "core_stack", "difficulty": "intermediate", "provider": "scikit-learn", "is_free": True},
        {"title": "Kaggle Learn", "description": "Hands-on ML micro-courses", "url": "https://www.kaggle.com/learn", "resource_type": "course", "category": "foundation", "difficulty": "beginner", "provider": "Kaggle", "is_free": True},
        {"title": "Hands-On ML with Scikit-Learn", "description": "The ML Bible by Aurélien Géron", "url": "https://www.oreilly.com/library/view/hands-on-machine-learning", "resource_type": "book", "category": "foundation", "difficulty": "intermediate", "provider": "O'Reilly", "is_free": False},
        {"title": "Feature Engineering for ML", "description": "Transform raw data into model features", "url": "https://www.youtube.com/watch?v=ml-features", "resource_type": "video", "category": "advanced", "difficulty": "intermediate", "provider": "YouTube", "is_free": True}
    ],
    "data-science": [
        {"title": "Python Data Science Handbook", "description": "Essential tools for working with data", "url": "https://jakevdp.github.io/PythonDataScienceHandbook", "resource_type": "book", "category": "foundation", "difficulty": "beginner", "provider": "Jake VanderPlas", "is_free": True},
        {"title": "Mode SQL Tutorial", "description": "Learn SQL from basics to advanced", "url": "https://mode.com/sql-tutorial", "resource_type": "course", "category": "foundation", "difficulty": "beginner", "provider": "Mode", "is_free": True},
        {"title": "Storytelling with Data", "description": "Data visualization best practices", "url": "https://www.storytellingwithdata.com", "resource_type": "book", "category": "core_stack", "difficulty": "intermediate", "provider": "Cole Nussbaumer", "is_free": False},
        {"title": "DataCamp", "description": "Interactive data science courses", "url": "https://www.datacamp.com", "resource_type": "course", "category": "foundation", "difficulty": "beginner", "provider": "DataCamp", "is_free": False}
    ],
    "cybersecurity": [
        {"title": "TryHackMe", "description": "Learn cybersecurity through gamified labs", "url": "https://tryhackme.com", "resource_type": "course", "category": "foundation", "difficulty": "beginner", "provider": "TryHackMe", "is_free": True},
        {"title": "HackTheBox", "description": "Penetration testing practice platform", "url": "https://www.hackthebox.com", "resource_type": "tool", "category": "core_stack", "difficulty": "intermediate", "provider": "HackTheBox", "is_free": True},
        {"title": "OWASP Top 10", "description": "Top web application security risks", "url": "https://owasp.org/www-project-top-ten", "resource_type": "article", "category": "foundation", "difficulty": "intermediate", "provider": "OWASP", "is_free": True},
        {"title": "CompTIA Security+ Study Guide", "description": "Industry standard security certification", "url": "https://www.comptia.org/certifications/security", "resource_type": "course", "category": "advanced", "difficulty": "intermediate", "provider": "CompTIA", "is_free": False}
    ],
    "quant": [
        {"title": "QuantConnect Bootcamp", "description": "Learn algorithmic trading with Python", "url": "https://www.quantconnect.com/learning", "resource_type": "course", "category": "foundation", "difficulty": "intermediate", "provider": "QuantConnect", "is_free": True},
        {"title": "Options, Futures, and Derivatives", "description": "The Hull book - derivatives Bible", "url": "https://www.amazon.com/Options-Futures-Other-Derivatives", "resource_type": "book", "category": "foundation", "difficulty": "advanced", "provider": "John Hull", "is_free": False},
        {"title": "Jane Street Puzzles", "description": "Monthly quant puzzles from Jane Street", "url": "https://www.janestreet.com/puzzles", "resource_type": "tool", "category": "projects", "difficulty": "expert", "provider": "Jane Street", "is_free": True},
        {"title": "Stochastic Calculus for Finance", "description": "Mathematical foundations for quant", "url": "https://www.springer.com/stochastic-calculus", "resource_type": "book", "category": "advanced", "difficulty": "expert", "provider": "Springer", "is_free": False}
    ],
    "web3": [
        {"title": "CryptoZombies", "description": "Learn Solidity by building a game", "url": "https://cryptozombies.io", "resource_type": "course", "category": "foundation", "difficulty": "beginner", "provider": "CryptoZombies", "is_free": True},
        {"title": "Ethereum Documentation", "description": "Official Ethereum developer docs", "url": "https://ethereum.org/developers", "resource_type": "article", "category": "foundation", "difficulty": "intermediate", "provider": "Ethereum Foundation", "is_free": True},
        {"title": "Alchemy University", "description": "Free Web3 developer bootcamp", "url": "https://university.alchemy.com", "resource_type": "course", "category": "core_stack", "difficulty": "intermediate", "provider": "Alchemy", "is_free": True},
        {"title": "Smart Contract Security", "description": "Learn to audit smart contracts", "url": "https://github.com/secureum", "resource_type": "course", "category": "advanced", "difficulty": "advanced", "provider": "Secureum", "is_free": True},
        {"title": "Build a DEX", "description": "Create a decentralized exchange", "url": "https://github.com/web3-projects", "resource_type": "project", "category": "projects", "difficulty": "advanced", "provider": "GitHub", "is_free": True}
    ]
}
