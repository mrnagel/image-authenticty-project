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
            npz_files = list(pathlib.Path(f'{self._modelPath}/{i}').glob('*.npz'))
            if not npz_files:
                continue
            latest = max(npz_files, key=lambda f: f.stat().st_mtime)
            with np.load(latest) as data:
                return_json[i] = {key: data[key].tolist() for key in data.files if data[key].ndim == 0}
        
        return json.dumps(return_json, indent=4)

if __name__ == "__main__":
    aggregator = reportAggregator()
    aggregator.aggregateResults()