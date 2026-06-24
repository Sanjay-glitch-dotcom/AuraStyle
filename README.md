# AuraStyle

AuraStyle is a cutting-edge, AI-powered fashion discovery platform that helps users find clothing and fashion products using natural language, images, or voice search. By leveraging state-of-the-art multimodal AI, AuraStyle understands nuanced styles and visual preferences to recommend semantically and visually similar products, making fashion shopping smarter, faster, and deeply personalized.

## ✨ Features

- **Multimodal Search:**
  - **Text Search:** Describe what you're looking for (e.g., "Minimalist beige office wear").
  - **Image Search:** Upload a photo of a clothing item to find visually similar pieces.
  - **Hybrid Search:** Upload a photo *and* type a keyword to narrow down the exact match (e.g., uploading a patterned shirt and typing "dress").
- **AI-Powered Vector Matching:** Powered by OpenAI's CLIP model and `pgvector` for lightning-fast semantic and visual similarity searches.
- **Smart Autocomplete:** Real-time debounced search suggestions and popular trends right in the search bar.
- **Dynamic User Interface:** Modern, glassmorphism-inspired UI with dark mode support, smooth horizontal scrolling, and fluid micro-animations.
- **User Authentication:** Secure JWT-based login, registration, and profile management.
- **Personalized Experience:** Wishlists, favorites, and "Recent Searches" history saved securely to your account.

## 🛠️ Technology Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3, Bootstrap 5.
- **Backend:** Python, Django, Django Rest Framework.
- **AI / Machine Learning:** OpenAI CLIP model (`clip-vit-base-patch32`), PyTorch, HuggingFace Transformers.
- **Database:** PostgreSQL with `pgvector` extension for high-performance HNSW index vector similarity search.
- **Data:** ~7,000+ fashion products seamlessly seeded into the local environment.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- PostgreSQL database with `pgvector` extension installed.

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sanjay-glitch-dotcom/AuraStyle.git
   cd AuraStyle
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your database configuration:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/aurastyle
   SECRET_KEY=your_secure_secret_key
   DEBUG=True
   ```

4. **Run Migrations & Start Server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

5. **Frontend Setup:**
   Serve the `frontend` folder using any static file server, for example:
   ```bash
   cd ../frontend
   npx serve .
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
