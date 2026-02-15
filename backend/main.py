from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

@app.post("/upload-image/")
async def upload_image(image: UploadFile = File(...)):
    print(image.filename)
    return {
        "jobId": "99999"
    }