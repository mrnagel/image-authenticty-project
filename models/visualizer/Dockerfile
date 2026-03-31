FROM python

WORKDIR /backend

RUN pip install --no-cache-dir matplotlib numpy pillow

COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]