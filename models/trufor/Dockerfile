FROM python

WORKDIR /backend
RUN mkdir -p /model_outputs /saved_photo

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN wget -q -c https://www.grip.unina.it/download/prog/TruFor/TruFor_weights.zip
RUN unzip -q -o TruFor_weights.zip && rm TruFor_weights.zip 

COPY . .

CMD ["python", "trufor_model.py", "-in", "/saved_photo", "-out", "/model_outputs", "-exp", "trufor_ph3", "TEST.MODEL_FILE", "weights/trufor.pth.tar"]