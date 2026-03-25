FROM python:3.10

WORKDIR /backend
RUN mkdir -p /model_outputs /saved_photo

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN wget -q -c https://huggingface.co/Junwei-Xi/Dual-Data-Alignment/resolve/main/DDA_ckpt.pth
RUN mkdir -p pretrained
RUN mv DDA_ckpt.pth pretrained/ckpt.pth 

RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]