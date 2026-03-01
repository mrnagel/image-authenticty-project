import numpy as np
import pathlib
import json


class reportAggregator:
    def __init__(self):
        self._modelPath = './model_outputs'
    
    def aggregateResults(self):
        path = pathlib.Path(self._modelPath)
        folders = [i.name for i in path.iterdir() if i.is_dir()]
        return_json = {}
        for i in folders:
            with np.load(f'{self._modelPath}/{i}/results.npz') as data:
                return_json[i] = {key: data[key].tolist() for key in data.files if type(data[key]) == np.ndarray}
        
        return json.dumps(return_json, indent=4)

if __name__ == "__main__":
    aggregator = reportAggregator()
    aggregator.aggregateResults()