FROM python:3.10

WORKDIR /backend
RUN mkdir -p /model_outputs /saved_photo

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN wget -q -c https://www.grip.unina.it/download/prog/B-Free/weights/BFREE_dino2reg4.zip
RUN mkdir -p weights
RUN unzip -q -o BFREE_dino2reg4.zip && mv BFREE_dino2reg4 weights/BFREE_dino2reg4 && rm BFREE_dino2reg4.zip

COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]