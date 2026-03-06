
import threading
from typing import Dict, Literal, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from coordinator import Coordinator
import uuid
import shutil
import pathlib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
coordinator = Coordinator() #only one for lifetime

JobStatus = Literal["queued", "running", "completed", "failed"]

class Job(BaseModel):
    jobId: str
    status: JobStatus
    filename: str
    startedAt: float
    error: Optional[str] = None
    result: Optional[str] = None

jobs: Dict[str, Job] = {}


def _run_analysis_job(job_id: str):
    jobs[job_id].status = "running"
    try:
        result = coordinator.analyzeImages(detached=False)
        jobs[job_id].result = result
        jobs[job_id].status = "completed"
    except Exception as e:
        jobs[job_id].status = "failed"
        jobs[job_id].error = str(e)
    
SAVE_DIR = pathlib.Path('./saved_photo')
SAVE_DIR.mkdir(exist_ok=True)

@app.post("/upload-image/", response_model = Job)
async def upload_image(image: UploadFile = File(...)):
    job_id = uuid.uuid4().hex

    save_path = SAVE_DIR / image.filename
    with save_path.open('wb') as f:
        shutil.copyfileobj(image.file, f)

    jobs[job_id] = Job(
        jobId = job_id,
        status="queued",
        filename=image.filename,
        startedAt=time.time()
    )

    t = threading.Thread(target=_run_analysis_job, args=(job_id,), daemon=True)
    t.start()
    return jobs[job_id]

@app.get("/job-status/{job_id}", response_model=Job)
def job_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Unknown jobId")
    return job