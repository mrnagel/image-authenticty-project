
import threading
from typing import Dict, Literal, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from coordinator import Coordinator
import uuid

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

jobs: Dict[str, Job] = {}

@app.get("/")
def root():
    return {"Hello": "World"}

def _run_analysis_job(job_id: str, detached: bool = True):
    job = jobs[job_id]
    try:
        coordinator.analyzeImages(detached=detached)
        jobs[job_id].status = "running" if detached else "completed"
    except Exception as e:
        jobs[job_id].status = "failed"
        jobs[job_id].error = str(e)
    


@app.post("/upload-image/", response_model = Job)
async def upload_image(image: UploadFile = File(...)):
    job_id = uuid.uuid4().hex

    jobs[job_id] = Job(
        jobId = job_id,
        status="queued",
        filename =image.filename,
        startedAt=time.time()
    )

    t = threading.Thread(target=_run_analysis_job, args=(job_id, True), daemon=True)
    t.start()
    print(image.filename)
    return jobs[job_id]

@app.get("/job-status/{job_id}", response_model=Job)
def job_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Unknown jobId")
    return job