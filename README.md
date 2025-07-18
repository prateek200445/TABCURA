# 🩺 Tabcura – AI-Powered Medical Prescription Reader

**Tabcura** is a real-time AI system designed to digitize handwritten medical prescriptions, intelligently structure healthcare data, and enable personalized health monitoring and medicine ordering. Built during the Reckon 6.0 Hackathon, Tabcura showcases the application of OCR, NLP, and data science pipelines in healthcare automation.

---

## 🚀 Features

- 🔍 **OCR-Based Text Extraction**: Extracts text from handwritten prescriptions using image processing and Gemini API.
- 🧠 **AI-Driven Entity Recognition**: Identifies key medical entities like drug names, dosages, frequencies, and treatment durations using custom classification models.
- 📊 **Data Structuring**: Converts unstructured text into clean, structured medical records (JSON/DB format).
- 🏥 **Categorization by Context**: Sorts patient records based on hospital, doctor, disease, and treatment history.
- 🍽️ **Personalized Recommendations**: Suggests diet and follow-up treatment based on past data and current prescriptions.
- 💊 **1-Tap Medicine Ordering**: Enables users to reorder medicines directly from the structured output.

---

## 🧪 Tech Stack

| Area           | Tools / Technologies                             |
|----------------|--------------------------------------------------|
| Languages      | Python, JavaScript, HTML/CSS                     |
| Frontend       | React                                            |
| Backend        | Node.js, Express                                 |
| Data Science   | Pandas, NumPy, Regex, Scikit-learn               |
| OCR & NLP      | Tesseract OCR, Gemini API, Regex, spaCy (planned)|
| Database       | MongoDB                                          |
| AI Assistant   | GitHub Copilot                                   |
| Dev Tools      | Git, Jupyter, GitHub Actions, Streamlit (PoC)   |

---

## 🧠 Data Science Workflow

1. **Image Preprocessing**: Resizing, grayscale, noise removal using OpenCV.
2. **OCR Text Extraction**: Gemini Vision API to extract raw text from prescription images.
3. **Text Cleaning & Tokenization**: Removed irrelevant characters, split into semantic units.
4. **Entity Classification**: Custom rule-based and ML-based models to classify dosage, medicine name, frequency.
5. **Data Structuring**: Transformed classified data into JSON documents.
6. **Insight Generation**: Derived treatment patterns for disease tracking and recommendations.
7. **User-Level Forecasting** *(Future Scope)*: Use LSTM/Time Series to predict future prescription needs.

---

## 📦 Sample Output

```json
{
  "patient": "John Doe",
  "hospital": "XYZ Medical Centre",
  "doctor": "Dr. Sharma",
  "disease": "Diabetes",
  "prescription": [
    {"medicine": "Metformin", "dosage": "500mg", "frequency": "2 times/day"},
    {"medicine": "Glimipiride", "dosage": "1mg", "frequency": "Once before breakfast"}
  ],
  "dietRecommendation": "Low sugar, high fiber, no alcohol",
  "reorderOption": "Available"
}
**Future Enhancements**
 Named Entity Recognition using spaCy/BERT for better context extraction

 Integration with government APIs (e.g., Ayushman Bharat) for verification

 Time series forecasting for refill predictions

 Doctor authentication and QR-based record access

👨‍💻 **Contributors**
Prateek Lachwani – LinkedIn | GitHub

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Tabcura bridges the gap between unstructured handwritten prescriptions and structured digital healthcare — powered by AI, backed by data.
