import numpy as np
import pathlib
import json
from collections import Counter

class reportAggregator:
    '''
    Class that captures results and calculates confidence
    '''
    def __init__(self, modelPath='./model_outputs'):
        self._modelPath = modelPath
    
    def aggregateResults(self):
        '''
        Collects results of all models from model_outputs folder, calculate confidence
        '''
        path = pathlib.Path(self._modelPath)
        folders = [i.name for i in path.iterdir() if i.is_dir()]
        return_json = {}

        # Finds all .npz files in model folders
        for i in folders:
            npz_file = list(pathlib.Path(f'{self._modelPath}/{i}').glob('*.npz'))
            if not npz_file:
                continue
            
            with np.load(npz_file[0]) as data:
                # Adds the data in the return json
                return_json[i] = {key: data[key].tolist() for key in data.files if data[key].ndim == 0}

        if not return_json:
            raise RuntimeError("Analysis models failed to produce output. No report can be generated.")

        prediction, confidence = self.calculateConfidence(json.dumps(return_json))

        print(type(prediction), type(confidence))
        return_json['predictions'] = {
            'prediction': prediction,
            'confidence': confidence
        }
        return json.dumps(return_json, indent=4)
    
    def calculateConfidence(self, data_json):
        '''
        Calculates confidence using Binary Entropy
        Args:
            data_json: json string of model outputs, must contain p_fake for each model
        '''
        data = json.loads(data_json)
        models = data.keys()

        p_fake = np.array([])
        for i in models:
            p_fake = np.append(p_fake, data[i].get('p_fake', -1))

        # Throws error if any model has p_fake. Could be changed in future
        if -1 in p_fake:
            raise ValueError('Not all models have p_fake!')
        
        # False if model predicts real, True if fake
        preds = np.array([True if i > 0.5 else False for i in p_fake])

        # Removes issues with log(1) and log(0)
        p_fake = np.clip(p_fake, 1e-10, 1-1e-10)
        p = np.average(p_fake)
        
        #Binary Entropy Function (https://en.wikipedia.org/wiki/Binary_entropy_function)
        h_x = (-p*np.log2(p)) - (1-p)*np.log2(1-p)
        conf = 1 - h_x

        pred = Counter(preds).most_common(1)[0][0]

        return bool(pred), float(conf)
    
    def calculateMetrics(self):
        json_data = self.aggregateResults()
        return self.calculateConfidence(json_data)
    
def main():
    aggregator = reportAggregator()
    print(aggregator.aggregateResults())

if __name__ == "__main__":
    main()
