Presentation Speech: Forecasting and Explainable AI Platform
Supply Chain and Logistics Management Demand Forecasting Using Explainable AI
Duration: about 20 minutes. Reference: w1998744_20220247.pdf and Forecasting-and-Explainable-AI-Platform (1).pptx

Use the [SLIDE: …] labels to match each part of the speech to your slide. Speak at a steady pace; this script is about 3,000 words for about 20 minutes.


[SLIDE: Title / Cover]

Good morning or afternoon. I am [Your Name]. Today I am presenting my Final Year Project: Supply Chain and Logistics Management Demand Forecasting Using Explainable AI—the Forecasting and Explainable AI Platform. My project is supervised by Obasha Priyankara, and I am from the Informatics Institute of Technology in collaboration with the University of Westminster. Thank you for being here.


[SLIDE: Agenda / Overview]

I will walk you through the problem we are solving, why it matters, what others have done, where the gap is, our research questions and objectives, the literature and methodology, then the system design, implementation, and initial results. I will end with contributions and a short conclusion.


[SLIDE: Problem Background]

Problem background. Accurate demand forecasting is essential in supply chain and logistics. It drives production scheduling, inventory control, procurement, and transportation planning. With good forecasts, organizations can cut holding costs, improve service, and balance supply and demand. But demand is hard to predict: markets change, seasons and promotions matter, and events like pandemics or disruptions add uncertainty. In recent years, machine learning and deep learning—models like XGBoost, ensemble methods, and Long Short-Term Memory, or LSTM—have improved accuracy and often beat traditional methods like ARIMA or exponential smoothing. The catch is that these powerful models often act as black boxes: they give numbers but not clear reasons. Planners must explain and defend forecasts to management and operations; when the model cannot be explained, trust and adoption suffer. That is the core problem we address.


[SLIDE: Problem Definition / Problem Statement]

Problem definition. We face a tension: modern AI forecasting is accurate but opaque. Managers and planners cannot easily see why a forecast changed or what drove it. Adopting such models for critical decisions becomes difficult. Our project focuses on interpretability and actionable explanations. Many current systems output only numbers and rarely provide human-understandable insights or recommendations. We propose to integrate Explainable AI, or XAI—including SHAP analysis, attention visualization, and counterfactual reasoning—into demand forecasting. The goal is to let stakeholders understand the main drivers of forecasts and run what-if scenarios, turning black-box systems into transparent, decision-support tools that supply chain experts can trust and use. The problem statement is: the interpretability and practical explanations of contemporary demand forecasting models in supply chain management are lacking, which restricts their credibility and decision-makers' ability to use them.


[SLIDE: Research Motivation]

Research motivation. In practice, many organizations have accurate models that are rejected because users cannot explain or justify the outputs. That shows we need models that are not only accurate but visible and interpretable. This project aims to help planners and managers understand model reasoning, build confidence in AI-driven recommendations, and make better operational decisions by integrating Explainable AI into demand forecasting. The work is technically demanding because it combines time-series forecasting with interpretability—SHAP, counterfactuals, attention—while keeping prediction accuracy high.


[SLIDE: Existing Work]

Existing work. Several studies are relevant. Jahin, Shahriar, and Al Amin (2024) proposed an explainable hybrid CNN–LSTM–GRU model for demand forecasting; they improved accuracy and added some explainability but focused mainly on feature importance and lacked actionable insights. Zhu, Christensen, Zarrin, and Alstrøm (2025) defined a user-centric explainability framework for supply chain demand planning—conceptually strong but without a concrete implementation. Arboleda-Florez and Castro-Zuluaga (2023) applied SHAP to explain ML-based forecasts in direct sales; they showed SHAP is feasible for demand but did not include counterfactuals or simulation. Nair and Subramanian (2022) reviewed AI techniques for supply chain forecasting and highlighted the need for explainable models. Zhou and Wang (2023) developed an LSTM model with XAI for purchase prediction and demonstrated that transparent predictions are possible but did not add decision-support or what-if analysis. So existing work improves accuracy or explainability in parts, but not in one integrated, decision-oriented system.


[SLIDE: Research Gap]

Research gap. Despite progress in AI-driven demand forecasting, decision-makers still struggle to understand and use these systems. Most research prioritizes accuracy over practical decision support and human-understandable reasoning. Specifically: counterfactual or what-if explanations are rarely built into forecasting systems; current explainability tools like SHAP often show which factors matter but not how changing them changes outcomes; attention-based visualization is not widely used to highlight important time periods or events; and user-centric trust and interpretability are still under-studied in real forecasting settings. So the gap is the lack of an interpretable, decision-oriented forecasting framework that combines interpretability, transparency, and actionable knowledge. This project aims to fill that gap by turning black-box prediction systems into transparent tools that planners can understand, trust, and act on.


[SLIDE: Research Questions and Aim]

Research questions and aim. We address four research questions. RQ1: How can demand forecasting models incorporate Explainable AI to improve interpretability without sacrificing accuracy? RQ2: Which explainability strategies—such as SHAP, counterfactuals, and attention visualization—work best for supply chain decision-making? RQ3: How can managers and planners use forecast explanations to gain practical insights? RQ4: How can the proposed model stay reliable and adaptable when demand patterns and external disruptions change? The research aim is to design, develop, and evaluate an Explainable AI–based demand forecasting framework that improves the efficiency, transparency, and trust of supply chain decision-making. The system will integrate SHAP-based feature interpretation, attention visualization, and counterfactual reasoning with LSTM and XGBoost forecasting models, so that planners can understand, defend, and act on forecasts. The aim is to close the gap between model accuracy and interpretability and to support proactive, transparent, data-driven decisions.


[SLIDE: Research Objectives]

Research objectives. First, problem identification: we determine the interpretability and decision-support shortcomings of current demand forecasting models. Second, literature review: we examine AI and XAI techniques used in supply chain demand forecasting. Third, requirement elicitation: we identify functional and non-functional requirements for an explainable forecasting system using domain analysis and literature. Fourth, system design: we design a transparent hybrid forecasting framework combining LSTM, XGBoost, and XAI techniques. Fifth, implementation: we build and train forecasting models using SHAP and counterfactual techniques on real or benchmark supply chain datasets. Sixth, testing: we run experiments to evaluate forecasting accuracy—using metrics like RMSE and MAPE—and explanation quality, including usefulness and clarity. Seventh, documentation: we produce a structured research report with technical, professional, and ethical perspectives. These objectives are mapped to learning outcomes and research questions in the proposal.


[SLIDE: Literature Review – Problem Domain]

Literature review – problem domain. Demand forecasting is central to operational effectiveness, cost control, and customer satisfaction in supply chain and logistics. Accurate forecasts help match production, inventory, and procurement to expected demand and reduce waste, stockouts, and excess inventory. But forecasting has become harder due to changing behaviour, volatile markets, and disruptions. Traditional methods like ARIMA and exponential smoothing provide a baseline but often struggle with non-linear trends and sudden shifts. Machine learning and deep learning—Random Forest, XGBoost, LSTM—capture more complex patterns and improve accuracy, but a key challenge in the domain is interpretability: many high-performing models are black boxes. When planners cannot see why a model forecasts a certain value, trust and adoption suffer. Recent work has stressed the need for forecasting systems that are both interpretable and decision-supportive. Explainable AI techniques—SHAP for feature importance, attention for time-based analysis, counterfactuals for scenarios—can help turn forecasts into understandable, actionable insights. Our study addresses the need for an XAI-driven demand forecasting framework that increases transparency, supports decisions, and builds trust among supply chain practitioners.


[SLIDE: Traditional Demand Forecasting and the Black-Box Problem]

Traditional forecasting and the black-box problem. Before advanced AI, demand forecasting relied on statistical methods—ARIMA, exponential smoothing, linear regression—which were relatively interpretable. But they often fail to capture non-linear patterns and complex drivers like promotions, competition, and market shifts. To improve accuracy, researchers turned to ML and DL: XGBoost, Random Forests, and LSTM. These models perform well but act as black boxes: the internal logic linking inputs to the forecast is not visible. In practice, planners are reluctant to act on forecasts they cannot explain or defend. For example, if an LSTM predicts a 30% demand jump, explaining why to a logistics manager is difficult without interpretability. The result is a gap between model performance and practical use, which has driven interest in Explainable AI for supply chain forecasting.


[SLIDE: Post-hoc Explainable AI (XAI) for Demand Forecasting]

Post-hoc Explainable AI for demand forecasting. Post-hoc XAI methods explain a model after it has made a prediction, without changing the model itself. SHAP—SHapley Additive exPlanations—is widely used. It uses game-theoretic ideas to attribute each input feature's contribution to a given forecast. Arboleda-Florez and Castro-Zuluaga (2023) applied SHAP to ML-based demand forecasting in direct sales and showed how to break down the drivers of a demand change—promotions, seasonality, marketing. Jahin et al. (2024) combined SHAP with a hybrid CNN–LSTM–GRU model and achieved both high accuracy and some transparency. A limitation is that these methods are descriptive and static: they answer what mattered but often not so what—actionable insights or alternative scenarios that planners need for decisions. So post-hoc XAI improves transparency but does not yet fully support prescriptive, interactive decision-making.


[SLIDE: Actionable and Decision-Centric Explanations]

Actionable and decision-centric explanations. Another line of work focuses on explanations that directly support operational decisions—for example staffing, transport, inventory, promotions. Zhu et al. (2025) proposed a user-centric explainability framework for demand planning: explanations should be tied to levers planners can control, and should support counterfactual questions—for example What would demand be if lead time were reduced by two days?—and what-if simulations. Counterfactual explanations do exactly that: they change inputs and show how the forecast changes, for example If promotion X did not exist, demand would be 15% lower. That makes the model's logic prescriptive. Many of these frameworks are still conceptual or tested in limited settings; a fully integrated, end-to-end system that delivers these capabilities in a real forecasting platform is missing. Our project aims to move in that direction.


[SLIDE: Inherently Interpretable Deep Learning for Temporal Data]

Inherently interpretable deep learning for temporal data. Some research builds interpretability into the model, especially for sequential demand data. Attention mechanisms in recurrent networks like LSTM assign weights to past time steps, so we can see when history mattered most. Zhou and Wang (2023) used an LSTM with attention for purchase prediction and showed that attention can indicate which weeks or promotional periods influenced the forecast. That gives temporal explainability and can increase trust. A limitation is that this insight is often descriptive: it shows what the model attended to in the past but does not by itself produce what-if scenarios or prescriptive advice. So attention is valuable for transparency but needs to be combined with other XAI and simulation tools for full decision support.


[SLIDE: Integration Gap – From Predictive to Prescriptive]

Integration gap: from predictive to prescriptive. There is a clear integration gap. Accuracy, post-hoc explainability, and actionable scenario planning are often treated separately, so we lack a single platform that does all three. Zhu et al. and others call for explanations tied to decisions, but end-to-end implementations are rare. SHAP gives feature-level what; attention gives temporal when; counterfactuals give what-if—but in practice planners must combine these manually. A unified system would have: (1) a prediction layer—for example XGBoost and LSTM producing forecasts; (2) a multi-modal explanation layer—SHAP for feature importance, attention for temporal importance; and (3) a prescriptive simulation layer—counterfactuals and what-if so planners can test price, promotion, or lead-time changes. Our framework is designed to move toward this integration.


[SLIDE: Methodology Overview]

Methodology overview. We use Saunders' research onion. Philosophically we take a pragmatist stance: we combine quantitative metrics (for example MAPE, RMSE) with qualitative evaluation (for example planner trust, explanation usefulness). The approach is deductive with abductive elements: we test known ideas (XGBoost, LSTM, XAI) and abduce explanations and what-if scenarios that fit planners' reasoning. We use mixed methods—quantitative for accuracy and compute, qualitative for actionability and trust. The strategy is design science plus case study: we build the XAI-driven forecasting artefact and validate it in a real or realistic supply chain context. The time horizon is cross-sectional with iterative prototyping. Data come from mixed sources: public benchmarks like M5, proprietary supply chain data where available, and synthetic data for what-if and counterfactual testing.


[SLIDE: Development Methodology – Requirements, Design, Testing]

Development methodology. For requirement elicitation we use interviews with planners and analysts, surveys on explanation preferences and trust, document analysis, brainstorming with domain and technical experts, and self-evaluation. For design we use object-oriented analysis and design: the forecasting engine, XAI interpreter, and scenario simulator are modular, reusable, and scalable. For programming we follow object-oriented principles in Python, using TensorFlow, Scikit-learn, XGBoost, SHAP, and related libraries. For testing we evaluate both models and XAI: we measure forecast accuracy (MAPE, RMSE, WAPE) and explanation quality (fidelity, robustness, and usability with planners). We also do integration and usability testing of the full system. Project management is Agile: iterative sprints, flexibility, continuous feedback, and collaboration between data science, software, and domain experts.


[SLIDE: Solution Methodology / Pipeline]

Solution methodology—the pipeline. First, dataset collection: we use public benchmarks such as M5 and Favorita, and where possible proprietary supply chain data; we also generate synthetic scenarios for what-if and counterfactuals. Second, data preprocessing: we clean and align time series, handle missing values and outliers, encode categorical variables, and split into train, validation, and test sets. Third, feature selection and engineering: we build lagged and rolling features, promotion and seasonality indicators, and use mutual information and SHAP to select predictive features. Fourth, model selection: we use XGBoost for strong performance and SHAP compatibility, and LSTM with attention for temporal structure and built-in temporal explainability; we integrate SHAP and a counterfactual engine. Fifth, model training: we tune hyperparameters and use validation to avoid overfitting. Sixth, testing: we evaluate accuracy and explanation quality. Seventh, a feedback loop: we collect planner feedback and retrain or refine explanations over time. This end-to-end pipeline is what we implement in the Forecasting and Explainable AI Platform.


[SLIDE: Dataset Selection]

Dataset selection. We use a hybrid dataset strategy. Public retail data—for example M5 Forecasting (Walmart) and Favorita—provide long time series of sales, pricing, and promotions for many products and stores, and allow comparison with standard benchmarks. Proprietary supply chain data, when available, anchor the work in real operational settings (lead times, inventory, logistics). Synthetic feature generation lets us create plausible scenarios for promotions, competitor prices, weather, or discounts that may be rare in historical data, so we can stress-test what-if and counterfactual explanations. Event annotation—for example Black Friday, supplier disruption, new product launch—helps validate that the XAI system can recognize and explain the impact of key events. Together, these sources support both accuracy evaluation and explainability evaluation.


[SLIDE: System Design / Architecture]

System design and architecture. The platform is designed as a transparent hybrid forecasting framework. The forecasting engine runs XGBoost and LSTM (with attention) to produce demand forecasts. The XAI interpreter provides SHAP-based feature attributions and attention-based temporal importance. The scenario simulator supports counterfactuals and what-if simulations—for example changing price, promotion, or lead time and seeing the effect on the forecast. The front end allows planners to view forecasts, explanations, and run scenarios. The architecture is modular so we can add or swap models and XAI methods. This aligns with the three-layer vision: prediction, multi-modal explanation, and prescriptive simulation.


[SLIDE: Implementation – Models and XAI]

Implementation—models and XAI. We implement XGBoost and LSTM with attention as core forecasting models. We integrate SHAP for post-hoc feature-level explanations: each forecast is explained by how much each feature (for example price, promotion, seasonality) pushed the prediction up or down. We use attention visualization so planners can see which past time steps the LSTM emphasized. We implement counterfactual and what-if logic so users can change drivers and see updated forecasts. The stack includes Python, TensorFlow, Scikit-learn, XGBoost, SHAP, and a Next.js-based front end for the Forecasting and Explainable AI Platform. The implementation is documented in the project report and codebase.


[SLIDE: Initial Results / Findings]

Initial results. Early experiments show that adding SHAP-based feature analysis improves interpretability without clearly hurting accuracy. On validation subsets of the M5 dataset, the LSTM–XGBoost ensemble achieved competitive accuracy. SHAP visualizations correctly identified promotions, price changes, and seasonal effects as major demand drivers, giving planners useful, interpretable information. So we have initial evidence that our XAI-driven approach can deliver both accuracy and transparency. Further work will expand evaluation—more products, time horizons, and user studies—and refine the prescriptive simulation layer.


[SLIDE: Benchmarking and Evaluation]

Benchmarking and evaluation. We evaluate on three dimensions. Forecasting accuracy: MAPE, RMSE, WAPE. Explanation quality: explanation fidelity (how well explanations reflect the model), decision-support score from experts (for example 1 to 5), and scenario-planning efficiency (time to decide with explanations). Computational performance: training time, inference time, and what-if simulation latency. Compared to traditional ARIMA (interpretable but less accurate), black-box LSTM (accurate but not interpretable), and current XAI-enhanced models (often descriptive only), our proposed framework targets higher accuracy (for example MAPE less than 8%), multi-modal explainability, integrated what-if capability, and a higher decision-support score. We accept a possible increase in inference and simulation time and will tune for near–real-time use where needed.


[SLIDE: Contributions]

Contributions. To the problem domain: we deliver an explainable demand forecasting framework that helps planners understand and trust AI-driven forecasts and supports decisions with SHAP, attention, and counterfactuals—for example If price is reduced by 10%, demand may increase by 15%. We contribute human-understandable forecasts, actionable insights, transparency, and operational value (for example fewer stockouts, better responsiveness). To the research domain: we contribute an integrated XAI-driven forecasting framework that combines LSTM, XGBoost, and multiple XAI techniques (SHAP, counterfactuals, attention) in one system; a methodological demonstration that XAI can improve transparency without necessarily sacrificing accuracy; decision-oriented explainability (scenario-based and actionable); and a repeatable approach to bringing XAI into supply chain forecasting.


[SLIDE: Challenges and Scope]

Challenges and scope. Key challenges include: maintaining interpretability while keeping high accuracy when using ensemble and deep learning models; moving from descriptive explanations to prescriptive, decision-support insights; data quality and integration (missing values, multiple sources); and adaptability to changing demand and disruptions while keeping explanations reliable. In scope: short- and medium-term demand forecasting in supply chain and logistics, use of XAI (SHAP, counterfactuals, attention), and evaluation with specific datasets and both accuracy and interpretability metrics. Out of scope: real-time deployment in live production, explicit modelling of extreme external shocks (for example political or natural disasters), and reinforcement learning or multi-agent optimization. This scope keeps the project focused and feasible.


[SLIDE: Conclusion]

Conclusion. Accurate demand forecasting is critical for supply chains, but many accurate models are black boxes and hard to trust or act on. This project proposed and implemented a Forecasting and Explainable AI Platform that combines LSTM and XGBoost with Explainable AI—SHAP, attention visualization, and counterfactual reasoning—to close the gap between accuracy and interpretability. We showed that SHAP-based explanations can highlight the right drivers (promotions, price, seasonality) without sacrificing competitive accuracy. The framework is designed to support transparent, decision-oriented supply chain planning. Thank you.


[SLIDE: Thank You / Q&A]

Thank you for your attention. I am happy to take your questions.


End of script. Adjust the [SLIDE: …] labels to match your actual slide titles in Forecasting-and-Explainable-AI-Platform (1).pptx. If a slide is missing or ordered differently, skip or reorder the corresponding section. Rehearse with a timer to stay close to 20 minutes.
