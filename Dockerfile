# Use official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies (needed for PostgreSQL)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY backend/ /app/

# Expose port (Hugging Face expects 7860 by default for Gradio/Docker spaces)
EXPOSE 7860

# Run gunicorn (you might need to run migrations first in a real CI/CD pipeline)
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "config.wsgi:application"]
