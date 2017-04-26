# -*- coding: utf-8 -*-
"""
Created on Wed Apr 26 00:55:20 2017

@author: Ruben
"""
# -*- coding: utf-8 -*-
"""
Created on Thu Mar  9 00:42:21 2017

@author: Ruben
"""


from sklearn import preprocessing

import os
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow.contrib.learn as learn
from sklearn import metrics
from IPython.display import display
from sklearn.model_selection  import train_test_split
from tensorflow.contrib.learn.python.learn.metric_spec import MetricSpec
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import KFold

import matplotlib.pyplot as plt
import shutil
# Summary:
#   Encodes the columns.
# Parameters:
#   df - the dataframe
#   name - the name
def encode_text_index(df,name):
    le = preprocessing.LabelEncoder()
    df[name] = le.fit_transform(df[name])
    return le.classes_

# Summary:
#   Gets the zscore or something.
# Parameters:
#   df - the dataframe
#   name - the name
#   [mean] - the mean column
#   [sd] - the standard deviation
def encode_numeric_zscore(df,name,mean=None,sd=None):
    if mean is None:
        mean = df[name].mean()

    if sd is None:
        sd = df[name].std()

    df[name] = (df[name]-mean)/sd

# Summary:
#   Transforms the data into training sets - input/output.
# Parameters:
#   df - the dataframe
#   target - the name of the output column
def to_xy(df,target):
    result = []
    for x in df.columns:
        if x != target:
            result.append(x)

    target_type = df[target].dtypes
    target_type = target_type[0] if hasattr(target_type, '__iter__') else target_type

    if target_type in (np.int64, np.int32):
        return df.as_matrix(result).astype(np.float32),df.as_matrix([target]).astype(np.int32)
    else:
        return df.as_matrix(result).astype(np.float32),df.as_matrix([target]).astype(np.float32)

 # Summary:
#   Transforms the data into training sets - input only.
# Parameters:
#   df - the dataframe
def to_x(df):
    result = []
    for x in df.columns:
        result.append(x)
        
    return df.as_matrix(result).astype(np.float32)

        
# Summary:
#   Plots a confusing confusion matrix.
# Parameters:
#   names - the names of the classes
#   title - the confuing title
#   cmap - the color
def plot_confusion_matrix(cm, names, title='Confusion matrix', cmap=plt.cm.Blues):
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(names))
    plt.xticks(tick_marks, names, rotation=45)
    plt.yticks(tick_marks, names)
    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')

#options
tf.logging.set_verbosity(tf.logging.INFO)
pd.options.display.encoding = 'utf-8'

path = "./kdata/"
filename_read = os.path.join(path,"test.csv")
df = pd.read_csv(filename_read,na_values=['NA','?'])

#print(df);

#PURELLY FOR PICKING AN EXISITING MODEL
print('************** Actual Test commencing ****************');

###Setting the encoding rules here.
encode_numeric_zscore(df,'A1')
encode_numeric_zscore(df,'A2')
encode_numeric_zscore(df,'A3')
encode_numeric_zscore(df,'A4')

encode_numeric_zscore(df,'A5')
encode_numeric_zscore(df,'A6')
encode_numeric_zscore(df,'A7')
encode_numeric_zscore(df,'A8')

encode_numeric_zscore(df,'A9')
encode_numeric_zscore(df,'A10')
encode_numeric_zscore(df,'A11')
encode_numeric_zscore(df,'A12')

encode_numeric_zscore(df,'A13')
encode_numeric_zscore(df,'A14')
encode_numeric_zscore(df,'A15')
encode_numeric_zscore(df,'A16')
encode_numeric_zscore(df,'A17')
encode_numeric_zscore(df,'A18')
encode_numeric_zscore(df,'A19')


x = to_x(df)

model_dir = 'tmp/kaggle' #1,2,3,4?

print('ID,Outcome');

i = 1;
#print (list(classifier.predict(x, as_iterable=True)))
plist = list(classifier.predict(x, as_iterable=True))
for p in plist:
    print(str(i) + ',' + str(p))
    i += 1