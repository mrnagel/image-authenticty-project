import main_bfree_single
import argparse
import numpy as np
import os

                

def sigmoid(x: float):
    return 1 / (1+np.exp(-x))

def main():
    # Arguments taken from bfree_single
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_image", '-i', type=str, help="The path of the input image")
    parser.add_argument("--model"      , '-m', type=str, help="Model to test", default='BFREE_dino2reg4')
    parser.add_argument("--device"     , '-d', type=str, help="Torch device", default='cuda:0')
    args = vars(parser.parse_args())

    logit = main_bfree_single.running_test(args['input_image'], args['model'], args['device'])
    p_fake = sigmoid(logit)
    p_real = 1 - p_fake

    os.makedirs(os.path.dirname('/model_outputs/bfree/results.npz'), exist_ok=True)
    np.savez('/model_outputs/bfree/results.npz', p_fake=p_fake, p_real=p_real)

if __name__ == "__main__":
    main()