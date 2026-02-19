import subprocess
import os

try:
    os.chdir('backend')
except:
    pass

cmd = "docker compose -f docker-compose.yml up"
#detached_cmd = "docker compose -f docker-compose.yml up -d"
#single_cmd = "docker compose -f docker-compose.yml up --build trufor"

subprocess.run(cmd.split(" "))