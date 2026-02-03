# Project Report: Forecasting & XAI Platform

## Executive Summary

This report outlines the technical approaches and recommendations for implementing two critical features in the Forecasting & Explainable AI (XAI) Platform:

1. **Drag-and-Drop Report Template Design System** - For creating and updating customizable report templates in admin/task management pages
2. **AWS-Supported AI Systems** - For implementing AI assistance features using AWS cloud services

---

## 1. Drag-and-Drop Report Template Design System

### 1.1 Overview

The admin pages in the task management system require "Create Report" and "Update Report" functionality that allows users to design their own report templates using drag-and-drop components. This system will enable users to customize report layouts, add various components (charts, tables, text blocks, images), and save templates for reuse.

### 1.2 Recommended Approaches

#### **Option 1: React DnD Kit (Recommended)**

**Why Choose This:**
- Modern, performant, and actively maintained
- Built specifically for React applications
- Excellent TypeScript support
- Lightweight and flexible
- Works seamlessly with Next.js

**Implementation Strategy:**

```typescript
// Key dependencies to add
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Architecture:**
- **Component Palette**: Sidebar with draggable components (Chart, Table, Text, Image, Metrics Card)
- **Canvas Area**: Drop zone where components are placed and arranged
- **Properties Panel**: Right sidebar for editing selected component properties
- **Template Storage**: Save/load templates as JSON configuration

**Key Features:**
- Drag components from palette to canvas
- Resize and reposition components
- Nested component support
- Grid-based layout system
- Responsive preview
- Export template as JSON schema

**Pros:**
- ✅ Excellent performance with large component trees
- ✅ Built-in accessibility support
- ✅ Touch device support
- ✅ Minimal bundle size impact
- ✅ Active community and documentation

**Cons:**
- ⚠️ Requires more setup compared to simpler libraries
- ⚠️ Learning curve for complex interactions

---

#### **Option 2: React Beautiful DnD**

**Why Choose This:**
- Mature and battle-tested library
- Smooth animations out of the box
- Simple API for basic use cases

**Implementation Strategy:**

```typescript
npm install react-beautiful-dnd
```

**Pros:**
- ✅ Easy to get started
- ✅ Beautiful default animations
- ✅ Good documentation

**Cons:**
- ⚠️ Limited React 18+ support (may require workarounds)
- ⚠️ Less flexible for complex layouts
- ⚠️ Larger bundle size
- ⚠️ No longer actively maintained

---

#### **Option 3: Custom Implementation with HTML5 Drag and Drop API**

**Why Choose This:**
- No external dependencies
- Full control over behavior
- Minimal bundle size

**Implementation Strategy:**
- Use native HTML5 drag events
- Implement custom state management
- Build layout engine from scratch

**Pros:**
- ✅ Zero dependencies
- ✅ Complete customization
- ✅ Smallest bundle size

**Cons:**
- ⚠️ Significant development time
- ⚠️ Need to handle edge cases manually
- ⚠️ Accessibility concerns
- ⚠️ Mobile device limitations

---

### 1.3 Recommended Solution: React DnD Kit Implementation

#### **Component Structure**

```
src/
├── app/
│   └── (dashboard)/
│       └── admin/
│           ├── reports/
│           │   ├── create/
│           │   │   └── page.tsx          # Create Report Page
│           │   └── update/
│           │       └── [id]/
│           │           └── page.tsx      # Update Report Page
│           └── task-management/
│               └── page.tsx              # Task Management with Report Buttons
├── components/
│   └── ReportBuilder/
│       ├── ReportCanvas.tsx              # Main canvas area
│       ├── ComponentPalette.tsx          # Draggable component list
│       ├── PropertiesPanel.tsx           # Component property editor
│       ├── ReportComponents/
│       │   ├── ChartComponent.tsx        # Chart component
│       │   ├── TableComponent.tsx        # Table component
│       │   ├── TextComponent.tsx         # Text block
│       │   ├── ImageComponent.tsx        # Image component
│       │   └── MetricsCard.tsx          # Metrics display
│       └── TemplateManager.tsx           # Save/load templates
└── lib/
    └── reportBuilder/
        ├── types.ts                       # TypeScript types
        ├── templateEngine.ts              # Template rendering engine
        └── storage.ts                    # Template persistence
```

#### **Implementation Steps**

1. **Setup Dependencies**
   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   npm install @dnd-kit/modifiers  # For grid snapping
   ```

2. **Create Base Types**
   ```typescript
   // lib/reportBuilder/types.ts
   export type ComponentType = 'chart' | 'table' | 'text' | 'image' | 'metrics';
   
   export interface ReportComponent {
     id: string;
     type: ComponentType;
     position: { x: number; y: number };
     size: { width: number; height: number };
     props: Record<string, any>;
   }
   
   export interface ReportTemplate {
     id: string;
     name: string;
     components: ReportComponent[];
     createdAt: string;
     updatedAt: string;
   }
   ```

3. **Build Component Palette**
   - List of available components
   - Drag handle for each component
   - Visual preview/icons

4. **Implement Canvas**
   - Drop zone with grid system
   - Component rendering
   - Selection and editing
   - Resize handles

5. **Properties Panel**
   - Dynamic form based on selected component
   - Real-time preview updates
   - Validation

6. **Template Persistence**
   - Save to backend API
   - Load existing templates
   - Version control support

#### **Integration with Existing Export System**

The template system should integrate with the existing export functionality (`src/app/(dashboard)/export/page.tsx`):

- Templates define the structure
- Export engine uses templates to generate PDF/Excel
- Dynamic data binding from forecast/explainability results

---

### 1.4 Alternative: Low-Code Platform Approach

If building from scratch is not feasible, consider integrating:

- **Retool** - Low-code platform with drag-and-drop
- **Appsmith** - Open-source alternative
- **Tooljet** - Self-hosted option

**Pros:**
- ✅ Faster time to market
- ✅ Pre-built components
- ✅ Less development effort

**Cons:**
- ⚠️ Less customization
- ⚠️ Vendor lock-in (for commercial options)
- ⚠️ May not match exact requirements

---

## 2. AWS-Supported AI Systems for AI Assistance

### 2.1 Overview

The project requires AI implementations to assist users with forecasting, data analysis, and decision-making. AWS provides a comprehensive suite of AI/ML services that can be integrated into the platform.

### 2.2 Recommended AWS AI Services

#### **Option 1: Amazon Bedrock (Recommended for AI Assistance)**

**What It Is:**
- Fully managed service for building generative AI applications
- Access to foundation models (Claude, Llama, Titan, etc.)
- Serverless, pay-per-use pricing

**Use Cases in This Project:**
- **Natural Language Queries**: Users can ask questions about forecasts in plain English
  - "Why did the forecast increase this month?"
  - "What factors contributed to this prediction?"
  - "Explain the SHAP values in simple terms"

- **Report Generation**: AI-powered report summaries and insights
- **Data Analysis Assistance**: Help users understand complex forecasting metrics
- **Anomaly Explanation**: Explain unusual patterns in data

**Implementation:**
```typescript
// Example: AI-powered explanation assistant
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function explainForecast(forecastData: any, userQuestion: string) {
  const prompt = `You are an AI assistant for a forecasting platform. 
  Analyze this forecast data and answer: ${userQuestion}
  
  Forecast Data: ${JSON.stringify(forecastData)}
  SHAP Values: ${JSON.stringify(forecastData.shapValues)}
  
  Provide a clear, concise explanation.`;

  const response = await client.send(new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    body: JSON.stringify({
      prompt,
      max_tokens: 1000,
    }),
  }));
  
  return JSON.parse(response.body.toString());
}
```

**Pros:**
- ✅ Multiple model options (Claude, Llama, Titan)
- ✅ No infrastructure management
- ✅ Built-in safety and guardrails
- ✅ Cost-effective for variable workloads
- ✅ Easy integration via SDK

**Cons:**
- ⚠️ Requires AWS account and setup
- ⚠️ API costs can add up with high usage
- ⚠️ Model responses may need validation

---

#### **Option 2: Amazon SageMaker**

**What It Is:**
- Fully managed machine learning platform
- Build, train, and deploy ML models
- Supports custom model training

**Use Cases in This Project:**
- **Custom Forecasting Models**: Train domain-specific models beyond LSTM/XGBoost
- **Model Fine-tuning**: Improve existing models with new data
- **Automated Model Selection**: AI that recommends best model for dataset
- **Hyperparameter Optimization**: Auto-tune model parameters

**Implementation:**
```typescript
// Example: Automated model training
import { SageMakerClient, CreateTrainingJobCommand } from "@aws-sdk/client-sagemaker";

async function trainCustomModel(datasetId: string, modelType: string) {
  const client = new SageMakerClient({ region: "us-east-1" });
  
  // Use SageMaker built-in algorithms or custom containers
  // Integrate with existing model training pipeline
}
```

**Pros:**
- ✅ Full ML lifecycle management
- ✅ Built-in algorithms and frameworks
- ✅ Scalable training infrastructure
- ✅ Model versioning and monitoring
- ✅ Integration with other AWS services

**Cons:**
- ⚠️ More complex setup
- ⚠️ Higher costs for training jobs
- ⚠️ Requires ML expertise
- ⚠️ Overkill for simple AI assistance

---

#### **Option 3: Amazon Comprehend**

**What It Is:**
- Natural Language Processing (NLP) service
- Text analysis, sentiment, entity extraction
- Pre-trained models, no ML expertise needed

**Use Cases in This Project:**
- **User Feedback Analysis**: Analyze user comments and feedback
- **Report Text Analysis**: Extract key insights from text-based reports
- **Sentiment Analysis**: Understand user satisfaction

**Pros:**
- ✅ Simple API-based service
- ✅ No model training required
- ✅ Cost-effective
- ✅ Quick to implement

**Cons:**
- ⚠️ Limited to text analysis
- ⚠️ Less flexible than custom models
- ⚠️ May not cover all use cases

---

#### **Option 4: Amazon Forecast (Specialized Service)**

**What It Is:**
- Fully managed time-series forecasting service
- Built specifically for forecasting use cases
- Automatic model selection and training

**Use Cases in This Project:**
- **Alternative Forecasting Engine**: Use alongside existing LSTM/XGBoost models
- **Baseline Comparison**: Compare custom models with Amazon Forecast
- **Automated Forecasting**: For users who want quick forecasts without model training

**Pros:**
- ✅ Purpose-built for forecasting
- ✅ Automatic feature engineering
- ✅ Handles missing data automatically
- ✅ No ML expertise required
- ✅ Built-in accuracy metrics

**Cons:**
- ⚠️ Less control over model architecture
- ⚠️ Data must be uploaded to AWS
- ⚠️ May not match custom model performance
- ⚠️ Additional service to manage

---

#### **Option 5: Amazon Textract + Comprehend (Document Intelligence)**

**What It Is:**
- Textract: Extract text and data from documents
- Comprehend: Analyze extracted text

**Use Cases in This Project:**
- **Data Import**: Extract data from uploaded PDF/Excel reports
- **Historical Data Extraction**: Parse legacy reports automatically
- **Smart Data Entry**: Convert unstructured documents to structured data

**Pros:**
- ✅ Automates manual data entry
- ✅ Handles various document formats
- ✅ High accuracy for structured documents

**Cons:**
- ⚠️ Cost per page processed
- ⚠️ May require post-processing
- ⚠️ Limited to document processing use cases

---

### 2.3 Recommended Implementation Strategy

#### **Phase 1: AI-Powered Explanations (Amazon Bedrock)**

**Priority: High**
- Implement natural language explanations for SHAP values
- Answer user questions about forecasts
- Generate report summaries

**Integration Points:**
- Extend `src/app/(dashboard)/explainability/page.tsx` with AI assistant
- Add chat interface for user queries
- Enhance export reports with AI-generated insights

#### **Phase 2: Intelligent Model Recommendations (SageMaker or Custom Logic)**

**Priority: Medium**
- Analyze dataset characteristics
- Recommend best model type (LSTM vs XGBoost vs Ensemble)
- Suggest optimal hyperparameters

**Integration Points:**
- Enhance `src/app/(dashboard)/models/page.tsx`
- Add recommendation engine
- Display AI suggestions during model training

#### **Phase 3: Automated Anomaly Detection (SageMaker or Amazon Lookout for Metrics)**

**Priority: Medium**
- Detect unusual patterns in forecasts
- Alert users to potential data quality issues
- Suggest data preprocessing steps

**Integration Points:**
- Add to dashboard alerts
- Integrate with data management page

#### **Phase 4: Smart Report Generation (Bedrock + Template System)**

**Priority: Low (After drag-and-drop system)**
- AI suggests report layouts based on data
- Auto-generate report sections
- Intelligent chart type selection

---

### 2.4 Implementation Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Dashboard  │  │ Explainability│  │   Reports    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │      Backend API (Node.js)         │
          │  ┌──────────────────────────────┐  │
          │  │   AI Service Layer           │  │
          │  │  - Bedrock Client            │  │
          │  │  - SageMaker Client          │  │
          │  │  - Comprehend Client         │  │
          │  └──────────────┬───────────────┘  │
          └─────────────────┼──────────────────┘
                            │
          ┌─────────────────┴─────────────────┐
          │         AWS AI Services            │
          │  ┌──────────┐  ┌──────────────┐  │
          │  │ Bedrock  │  │  SageMaker   │  │
          │  │ Comprehend│  │  Forecast    │  │
          │  └──────────┘  └──────────────┘  │
          └───────────────────────────────────┘
```

### 2.5 Cost Considerations

**Amazon Bedrock:**
- Pay per token (input + output)
- Claude 3 Sonnet: ~$3-15 per 1M input tokens, ~$15-75 per 1M output tokens
- Estimate: $0.01-0.10 per user query (depending on complexity)

**Amazon SageMaker:**
- Training: $0.10-3.00 per hour (instance-dependent)
- Inference: $0.0001-0.01 per prediction
- Estimate: $50-500/month for moderate usage

**Amazon Forecast:**
- $0.0001-0.001 per forecast
- Training: $0.60-2.40 per hour
- Estimate: $100-1000/month depending on volume

**Recommendation:** Start with Bedrock for AI assistance (lowest barrier, pay-per-use), then add SageMaker for custom models if needed.

---

### 2.6 Security and Compliance

- **IAM Roles**: Use least-privilege access for AWS services
- **Data Encryption**: Enable encryption at rest and in transit
- **VPC Endpoints**: Use private endpoints for sensitive data
- **Audit Logging**: Enable CloudTrail for all AI service calls
- **Data Residency**: Consider region selection for compliance

---

## 3. Integration Plan

### 3.1 Drag-and-Drop Report System Integration

1. **Week 1-2**: Setup React DnD Kit, create base components
2. **Week 3-4**: Build component palette and canvas
3. **Week 5-6**: Implement properties panel and template storage
4. **Week 7**: Integrate with existing export system
5. **Week 8**: Testing and refinement

### 3.2 AWS AI Systems Integration

1. **Week 1**: Setup AWS account, configure IAM, install SDKs
2. **Week 2**: Implement Bedrock client for AI explanations
3. **Week 3**: Add AI assistant UI to explainability page
4. **Week 4**: Implement model recommendation system
5. **Week 5**: Testing and optimization
6. **Week 6**: Deploy and monitor

---

## 4. Dependencies to Add

### For Drag-and-Drop System:
```json
{
  "@dnd-kit/core": "^6.0.8",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.1",
  "@dnd-kit/modifiers": "^1.0.0"
}
```

### For AWS AI Integration:
```json
{
  "@aws-sdk/client-bedrock-runtime": "^3.490.0",
  "@aws-sdk/client-sagemaker": "^3.490.0",
  "@aws-sdk/client-comprehend": "^3.490.0"
}
```

---

## 5. Conclusion

### Drag-and-Drop Report System
**Recommended Solution**: React DnD Kit
- Best balance of features, performance, and maintainability
- Excellent Next.js compatibility
- Active development and community support

### AWS AI Systems
**Recommended Solution**: Amazon Bedrock (Primary) + SageMaker (Secondary)
- Bedrock for AI assistance and explanations (quick wins)
- SageMaker for advanced custom model training (if needed)
- Cost-effective, scalable, and well-integrated with AWS ecosystem

Both solutions can be implemented incrementally, allowing for iterative development and user feedback. The drag-and-drop system will significantly enhance user experience for report customization, while AWS AI services will provide intelligent assistance throughout the forecasting workflow.

---

## 6. Next Steps

1. **Immediate Actions:**
   - Review and approve recommended approaches
   - Setup AWS account and configure services
   - Install required npm packages

2. **Short-term (1-2 months):**
   - Implement drag-and-drop report builder
   - Integrate Amazon Bedrock for AI explanations
   - Create admin pages for report management

3. **Long-term (3-6 months):**
   - Enhance AI capabilities with SageMaker
   - Add advanced template features
   - Implement AI-powered model recommendations
   - Optimize costs and performance

---

**Document Version**: 1.0  
**Last Updated**: January 26, 2026  
**Author**: AI Assistant  
**Project**: Forecasting & XAI Platform
