import subprocess
import pathlib

class ModelContainer():
    def __init__(self, name, detached=True):
        self.name = name
        if detached == True:
            self.detached = ' -d'
        else:
            self.detached = ''
        
    def runAnalysis(self):
        cmd = f'docker compose -f docker-compose.yml up --build {self.name}{self.detached}'
        print(subprocess.run(cmd.split(' ')))



class Coordinator():
    def __init__(self):
        self.model_names = []
        self.models = []
        self._modelPath = '../models'
        self._dockerPath = './'

        self._initModels()

    def _initModels(self):
        path = pathlib.Path(self._modelPath)
        folders = [i.name for i in path.iterdir() if i.is_dir()]
        self.model_names = folders
        
        for i in self.model_names:
            self.models.append(ModelContainer(i))

        print(f'Models available: {self.model_names}')

    def analyzeImages(self, models=None, detached=True):
        if detached: flag = ' -d'
        else: flag = ''

        if models:
            # TODO: Implement individual running and running in non-detached mode
            # This will involve the runAnalysis function
            print('Not Implemented')
            exit()
        else:
            cmd = f'docker compose -f {self._dockerPath}docker-compose.yml up{flag}'
            subprocess.run(cmd.split(" "))

if __name__ == '__main__':
    x = Coordinator()
    x.analyzeImages()
