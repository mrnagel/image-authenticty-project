# AIGIgator

**A multi-model web platform for detecting AI-generated and manipulated images.**

AIGIgator aggregates the outputs of multiple forensic image analysis and AI-generated image (AIGI) detection models into a single, exportable authenticity report. Rather than relying on any one model, the platform runs an ensemble of specialized detectors simultaneously and combines their predictions using a mathematically-grounded confidence score derived from the binary entropy function.

> Built as a capstone project for CSCI 483R at Montana State University | Gianforte School of Computing.

---

## Overview

The barrier to creating realistic fake images has dropped significantly in recent years, allowing almost anyone to generate or modify convincing images. In a May 2025 study of 12,500 participants, humans distinguished real images from AI-generated ones at only a 62% success rate, which is hardly better than chance.

No single detection model provides complete coverage across a range of generation and manipulation techniques. AIGIgator addresses this by:

- Running **three independent detection models** against an uploaded image
- Producing a **per-model probability score** (`p_fake`) for each analysis
- Aggregating scores into a **group confidence score** using an inverted binary entropy function
- Generating an **exportable PDF report** with a heatmap overlay, entropy chart, and a table showing outputs per model.

The goal is not to render a verdict but to **inform human judgment** through multiple different methods of analysis.

---

## Models

| Model | Type | Method |
|---|---|---|
| **TruFor** | Forensic manipulation detection | Noiseprint++: detects localized, pixel-level anomalies within an image |
| **B-Free** | AIGI detection | Fine-tuned Vision Transformer (ViT) trained on AI-manipulated real images |
| **DDA (Dual Data Alignment)** | AIGI detection | VAE reconstruction + frequency-level and pixel-level alignment |

Each model runs in its own isolated Docker container and outputs results in `.npz` format via a shared Docker volume. The system depends only on the agreed output format, not on any model's dependencies or implementation.

> TruFor is specialized for **localized manipulation**. B-Free and DDA are specialized for **fully AI-generated images**. Note, however, that any combination of models can be used to fit the user's needs or compensate for rapidly evolving AI generative technologies as necessary.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, TypeScript 5.9, PrimeNG 21, Chart.js 4.5, RxJS 7.8 |
| Backend | Python 3.10, FastAPI 0.129, Uvicorn 0.40, Pydantic 2.12, NumPy 1.26 |
| Models Containerization | Docker, Docker Compose, Bash entrypoints |

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Node.js and Angular CLI (for frontend development)
- Python 3.10+ (for backend development)

### Installation

```bash
# Clone the repository
git clone https://github.com/mrnagel/image-authenticty-project
cd image-authenticty-project
```

### Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn APIController:app --reload
```

The Coordinator will automatically discover available model containers on startup.

### Running the Frontend

```bash
cd client
npm install
ng serve
```

Navigate to `http://localhost:4200`.

> **Note:** The models used rely heavily on NVIDIA's CUDA compute platform. As such, GPU availability significantly affects analysis time. A fixed timeout is not enforced, as slow hardware environments could be incorrectly flagged as failures. Images are capped at 5MB to prevent unbounded memory usage.

---

## Usage

1. Open the web app and select a `.jpg` or `.png` image (≤ 5MB).
2. The frontend validates the file type and initializes the model suite.
3. All model containers launch **simultaneously**. The frontend polls job status every 2 seconds.
4. Once analysis is complete, the report viewer displays:
   - An **aggregate verdict** and confidence score
   - A **per-model prediction confidence** chart (inverted binary entropy curve)
   - A **heatmap overlay** from TruFor showing potential manipulation regions
   - A **per-model table** with `p_fake`, confidence percentage, and verdict
5. Click **Export PDF** to download the full report.

---

## Confidence Scoring

All models output `p_fake` (the probability that an image is fake) which follows a Bernoulli distribution. AIGIgator maps this to a confidence score using the **inverted binary entropy function**:

```
H(X) = -p·log₂(p) - (1-p)·log₂(1-p)
Confidence = 1 - H(p_fake)
```

Confidence is highest when `p_fake` is near 0 or 1 and lowest when `p_fake` = 0.5. The aggregate confidence is calculated from the average `p_fake` across all models, then mapped to the curve.

> A `p_fake` of 0.895 may still yield only ~51% confidence. Rather than reward high raw probabilities, the system is desingned to penalize uncertain scores.

When models disagree, overall confidence drops and the chart makes the disagreement visually apparent. This can also be helpful in determing the nature of manipulation uesd, depending on which models are used to detect it.

---

## Authors

**Matthew Nagel:** Frontend Development (Angular UI, file upload, report viewer, binary entropy chart, navbar, FastAPI integration, polling)

**Alexander Ellingsen:** Backend / ML Engineering (Docker containerization, backend coordinator, report aggregator, model integration, confidence algorithm, heatmap visualizer)

Montana State University | Gianforte School of Computing  
CSCI 483R: Interdisciplinary Project | May 2026

---

## References

- Guillaro et al. (2023). [TruFor: Leveraging all-round clues for trustworthy image forgery detection and localization.](https://arxiv.org/abs/2212.10957)
- Guillaro et al. (2025). [A Bias-Free Training Paradigm for More General AI-generated Image Detection.](https://arxiv.org/abs/2412.17671)
- Chen et al. (2025). [Dual Data Alignment Makes AI-Generated Image Detector Easier Generalizable.](https://arxiv.org/abs/2505.14359)
- Roca et al. (2025). [How good are humans at detecting AI-generated images?](https://arxiv.org/abs/2507.18640)
