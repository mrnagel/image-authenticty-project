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
            npz_file = list(pathlib.Path(f'{self._modelPath}/{i}').glob('*.npz'))
            if not npz_file:
                continue
            
            with np.load(npz_file[0]) as data:
                return_json[i] = {key: data[key].tolist() for key in data.files}
        
        return json.dumps(return_json, indent=4)

    def calculateConfidence(self, data_json):
        def inverse_h(p: np.array):
            '''
            Binary Entropy Function
            https://en.wikipedia.org/wiki/Binary_entropy_function
            '''
            h_x = (-p*np.log2(p)) - (1-p)*np.log2(1-p)
            # 1- h_x to invert the outputs, meaning 0.5 is 0 not 1
            return 1 - h_x
        
        data = json.loads(data_json)
        models = data.keys()

        p_fake = np.array([])
        for i in models:
            p_fake = np.append(p_fake, data[i].get('p_fake', -1))

        if -1 in p_fake:
            raise ValueError('Not all models have p_fake!')
        
        # False if model predicts real, True if fake
        preds = np.array([True if i > 0.5 else False for i in p_fake])
        init_confidence = inverse_h(p_fake)

        if np.all(preds == True) or np.all(preds == False):
            # Case where all models agree
            conf = np.average(init_confidence)
            pred = preds[0]
        else:
            # TODO: create a penalizer function
            conf = 0
            pred = True
        
        return pred, conf, p_fake.tolist()
    
def main():
    aggregator = reportAggregator()
    json_data = aggregator.aggregateResults()
    print(aggregator.calculateConfidence(json_data))

if __name__ == "__main__":
    main()
