# 📚 Swagger API Documentation

## Overview

The Plant Disease Medicine Marketplace API now includes comprehensive **Swagger/OpenAPI 3.0** documentation with an interactive UI for testing and exploring all endpoints.

## 🚀 Quick Access

### Interactive Documentation
- **Swagger UI**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
- **API Overview**: [http://localhost:4000/api](http://localhost:4000/api)
- **Health Check**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

## 📋 Features

### 🎯 **Comprehensive Coverage**
- ✅ All AI endpoints documented
- ✅ Deep Learning integration workflows
- ✅ Request/response schemas
- ✅ Interactive testing interface
- ✅ Example requests and responses
- ✅ Error handling documentation

### 🔧 **Interactive Features**
- **Try It Out**: Test endpoints directly from the documentation
- **Request Examples**: Pre-filled examples for each endpoint
- **Response Schemas**: Detailed response structure documentation
- **Authentication**: API key handling (when implemented)
- **Filtering**: Search and filter endpoints by tags

## 📖 API Categories

### 🏥 **Health**
- `GET /health` - API health check and status

### 🤖 **AI - General**
- `POST /ai/prompt` - General plant disease AI consultation

### 🔬 **AI - DL Integration** 
- `POST /ai/disease-info` - Get disease info from DL model detection
- `POST /ai/ai-treatment` - Get treatment for DL detected disease

### 🩺 **AI - Specialized**
- `POST /ai/diagnose` - Disease diagnosis based on symptoms
- `POST /ai/treatment` - Treatment recommendations for specific diseases
- `POST /ai/prevention` - Prevention strategies for plant diseases

### 📊 **AI - Data**
- `GET /ai/prompts` - Get all AI prompts with pagination
- `GET /ai/prompts/{id}` - Get specific prompt by ID
- `DELETE /ai/prompts/{id}` - Delete prompt by ID

### 🛒 **Marketplace**
- Various marketplace endpoints for medicine trading

## 🔄 Deep Learning Integration Workflow

The documentation includes a complete workflow for integrating with your DL model:

```mermaid
graph LR
    A[Frontend] --> B[DL Model]
    B --> C[Disease Detection]
    C --> D[/api/ai/disease-info]
    D --> E[Comprehensive Analysis]
    E --> F[/api/ai/ai-treatment]
    F --> G[Treatment Plan]
    G --> H[Marketplace Integration]
```

### Step-by-Step Process:
1. **Image Upload**: Frontend sends plant image to DL model
2. **Disease Detection**: DL model returns disease name and confidence
3. **Disease Analysis**: Send detection to `/api/ai/disease-info`
4. **Treatment Planning**: Get specific treatment with `/api/ai/ai-treatment`
5. **Marketplace**: Link to relevant medicines

## 📝 Example Usage

### Disease Information Request
```bash
curl -X POST http://localhost:4000/api/ai/disease-info \
  -H "Content-Type: application/json" \
  -d '{
    "diseaseName": "Early Blight",
    "plantType": "Tomato",
    "confidence": 87.5,
    "additionalInfo": "Detected from leaf image analysis"
  }'
```

### AI Treatment Request
```bash
curl -X POST http://localhost:4000/api/ai/ai-treatment \
  -H "Content-Type: application/json" \
  -d '{
    "diseaseName": "Late Blight",
    "plantType": "Potato",
    "confidence": 92.3,
    "severity": "Moderate",
    "organicPreference": true,
    "location": "Humid climate region"
  }'
```

## 🛠️ Technical Implementation

### Swagger Configuration
- **Framework**: swagger-ui-express + swagger-jsdoc
- **Specification**: OpenAPI 3.0
- **Documentation**: JSDoc comments in route files
- **Schemas**: Comprehensive request/response models

### Key Files
- `config/swagger.js` - Swagger configuration and schemas
- `routes/*.js` - JSDoc documentation in route files
- `app.js` - Swagger UI middleware setup

### Custom Features
- **Custom CSS**: Clean, professional appearance
- **Explorer Mode**: Easy endpoint discovery
- **Request Duration**: Performance monitoring
- **Filtering**: Quick endpoint search

## 🎨 Customization

### Swagger UI Options
```javascript
{
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Plant Disease API Documentation',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true
  }
}
```

### Adding New Endpoints
1. Add JSDoc comments to route handlers
2. Define request/response schemas in `config/swagger.js`
3. Use appropriate tags for categorization
4. Include examples for better usability

## 🔍 Schema Definitions

### Core Schemas
- **DiseaseDetection**: DL model output structure
- **TreatmentRequest**: Treatment recommendation input
- **DiagnosisRequest**: Symptom-based diagnosis input
- **PromptItem**: AI consultation record structure
- **SuccessResponse**: Standard success response format
- **ErrorResponse**: Standard error response format

## 📱 Frontend Integration

### JavaScript Example
```javascript
// Get disease information after DL detection
const diseaseInfo = await fetch('/api/ai/disease-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    diseaseName: dlResult.diseaseName,
    plantType: dlResult.plantType,
    confidence: dlResult.confidence
  })
});

const result = await diseaseInfo.json();
console.log(result.data.diseaseInfo);
```

## 🚀 Benefits

### For Developers
- **Interactive Testing**: No need for external tools like Postman
- **Clear Documentation**: Comprehensive endpoint descriptions
- **Schema Validation**: Request/response structure clarity
- **Example Requests**: Ready-to-use code samples

### For Frontend Teams
- **API Contract**: Clear interface definitions
- **Integration Guide**: Step-by-step workflow documentation
- **Error Handling**: Comprehensive error response documentation
- **Type Safety**: Detailed schema definitions for TypeScript

### For QA/Testing
- **Manual Testing**: Direct endpoint testing from browser
- **Test Case Generation**: Example requests for test scenarios
- **Response Validation**: Expected response structures
- **Error Scenarios**: Documented error conditions

## 🔧 Development

### Local Development
1. Start the server: `npm run dev`
2. Open Swagger UI: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
3. Test endpoints directly from the interface

### Production Deployment
- Update server URLs in `config/swagger.js`
- Ensure proper CORS configuration
- Consider authentication integration
- Monitor API performance metrics

## 📈 Next Steps

### Potential Enhancements
- **Authentication**: API key or JWT integration
- **Rate Limiting**: Request throttling documentation
- **Webhooks**: Event notification endpoints
- **File Upload**: Image upload endpoint documentation
- **Batch Operations**: Bulk processing endpoints

The Swagger documentation provides a professional, interactive interface for exploring and testing the Plant Disease API, making it easier for developers to integrate with your system and understand the complete workflow from image analysis to treatment recommendations.
