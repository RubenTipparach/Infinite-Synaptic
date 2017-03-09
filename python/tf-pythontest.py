# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

from sklearn import preprocessing

import os
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow.contrib.learn as learn
from sklearn import metrics

from IPython.display import display

from sklearn.model_selection  import train_test_split #model_selection 
from tensorflow.contrib.learn.python.learn.metric_spec import MetricSpec
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import KFold  #model_selection 

#%matplotlib inline
import matplotlib.pyplot as plt

def encode_text_index(df,name):
    le = preprocessing.LabelEncoder()
    df[name] = le.fit_transform(df[name])
    return le.classes_

def encode_numeric_zscore(df,name,mean=None,sd=None):
    if mean is None:
        mean = df[name].mean()

    if sd is None:
        sd = df[name].std()

    df[name] = (df[name]-mean)/sd
    
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



path = "./data/"

filename_read = os.path.join(path,"iris.csv")
df = pd.read_csv(filename_read,na_values=['NA','?'])

encode_numeric_zscore(df,'sepal_l')
encode_numeric_zscore(df,'sepal_w')
encode_numeric_zscore(df,'petal_l')
encode_numeric_zscore(df,'petal_w')
species = encode_text_index(df,'species')
num_classes = len(species)

x,y = to_xy(df,'species')

model_dir = 'tmp/iris' 

feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]
classifier = learn.DNNClassifier(
    model_dir= model_dir,
    hidden_units=[10, 20, 5], n_classes=num_classes, feature_columns=feature_columns)

classifier.fit(x, y, steps=1000)

pred = list(classifier.predict(x, as_iterable=True))
score = metrics.accuracy_score(y, pred)
print("Final score: {}".format(score))

pred = list(classifier.predict(x, as_iterable=True))
predDF = pd.DataFrame(pred)
pred_nameDF = pd.DataFrame(species[pred])
actual_nameDF = pd.DataFrame(species[df['species']])

df2 = pd.concat([df,predDF,pred_nameDF,actual_nameDF],axis=1)
df2.columns = ['sepal_l','sepal_w','petal_l','petal_w','expected','predicted','expected_str','predicted_str']

#df2


tf.logging.set_verbosity(tf.logging.ERROR)

sample_flower = np.array( [[5.0,3.0,4.0,2.0]], dtype=float)
pred = list(classifier.predict(sample_flower, as_iterable=True))
print("Ad hoc prediction - Predict that {} is: {}".format(sample_flower,species[pred]))

sample_flower = np.array( [[5.0,3.0,4.0,2.0],[5.2,3.5,1.5,0.8]], dtype=float)
pred = list(classifier.predict(sample_flower, as_iterable=True))
print("Two sample flower predictions - Predict that {} is: {}".format(sample_flower,species[pred]))


###########################################



tf.logging.set_verbosity(tf.logging.ERROR)

path = "./data/"

filename_read = os.path.join(path,"iris.csv")
df = pd.read_csv(filename_read,na_values=['NA','?'])

encode_numeric_zscore(df,'sepal_l')
encode_numeric_zscore(df,'sepal_w')
encode_numeric_zscore(df,'petal_l')
encode_numeric_zscore(df,'petal_w')
species = encode_text_index(df,'species')
num_classes = len(species)

x,y = to_xy(df,'species')

model_dir = 'tmp/iris' 

feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]
classifier = learn.DNNClassifier(
    model_dir= model_dir,
    hidden_units=[10, 20, 5], n_classes=num_classes, feature_columns=feature_columns)

classifier.fit(x, y, steps=1000)

pred = list(classifier.predict(x, as_iterable=True))
score = metrics.accuracy_score(y, pred)
print("Accuarcy before save: {}".format(score))


##################################################




tf.logging.set_verbosity(tf.logging.ERROR)

path = "./data/"
    
filename = os.path.join(path,"iris.csv")    
df = pd.read_csv(filename,na_values=['NA','?'])

encode_numeric_zscore(df,'petal_w')
encode_numeric_zscore(df,'petal_l')
encode_numeric_zscore(df,'sepal_w')
encode_numeric_zscore(df,'sepal_l')
species = encode_text_index(df,"species")
num_classes = len(species)

x, y = to_xy(df,'species')
    
x_train, x_test, y_train, y_test = train_test_split(    
    x, y, test_size=0.25, random_state=45)

model_dir = 'tmp/iris' 

feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]
classifier = learn.DNNClassifier(
    model_dir= model_dir,
    config=tf.contrib.learn.RunConfig(save_checkpoints_secs=1),
    hidden_units=[10, 20, 5], n_classes=num_classes, feature_columns=feature_columns)

validation_monitor = tf.contrib.learn.monitors.ValidationMonitor(
    x_test,
    y_test,
    every_n_steps=500,
    early_stopping_metric="loss",
    early_stopping_metric_minimize=True,
    early_stopping_rounds=50)
    
classifier.fit(x_train, y_train,monitors=[validation_monitor],steps=10000)
    
pred = list(classifier.predict(x_test, as_iterable=True))
score = metrics.accuracy_score(y_test, pred)
print("Accuarcy before save: {}".format(score))  


###############################################

tf.logging.set_verbosity(tf.logging.ERROR)

np.set_printoptions(precision=4)
np.set_printoptions(suppress=True)

pred = list(classifier.predict_proba(x_test, as_iterable=True))

print("As percent probability")
print(pred[0]*100)

print("Numpy array of predictions")
display(pred[0:5])

score = metrics.log_loss(y_test, pred)
print("Log loss score: {}".format(score))


###############################################
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
    
###############################################

tf.logging.set_verbosity(tf.logging.ERROR)

path = "./data/"
    
filename = os.path.join(path,"iris.csv")    
df = pd.read_csv(filename,na_values=['NA','?'])

encode_numeric_zscore(df,'petal_w')
encode_numeric_zscore(df,'petal_l')
encode_numeric_zscore(df,'sepal_w')
encode_numeric_zscore(df,'sepal_l')
species = encode_text_index(df,"species")
num_classes = len(species)

x, y = to_xy(df,'species')
    
x_train, x_test, y_train, y_test = train_test_split(    
    x, y, test_size=0.25, random_state=45)

model_dir = 'tmp/iris' 

feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]
classifier = learn.DNNClassifier(
    model_dir= model_dir,
    config=tf.contrib.learn.RunConfig(save_checkpoints_secs=1),
    hidden_units=[10, 20, 5], n_classes=num_classes, feature_columns=feature_columns)

validation_monitor = tf.contrib.learn.monitors.ValidationMonitor(
    x_test,
    y_test,
    every_n_steps=500,
    early_stopping_metric="loss",
    early_stopping_metric_minimize=True,
    early_stopping_rounds=50)
    
classifier.fit(x_train, y_train,monitors=[validation_monitor],steps=10000)
    
pred = list(classifier.predict(x_test, as_iterable=True))
cm = confusion_matrix(y_test, pred)
np.set_printoptions(precision=2)
print('Confusion matrix')
print(cm)
plt.figure()
plot_confusion_matrix(cm, species)
plt.show()


###############################################

tf.logging.set_verbosity(tf.logging.ERROR)

path = "./data/"
filename_read = os.path.join(path,"iris.csv")
df = pd.read_csv(filename_read,na_values=['NA','?'])

encode_numeric_zscore(df,'sepal_l')
encode_numeric_zscore(df,'sepal_w')
encode_numeric_zscore(df,'petal_l')
encode_numeric_zscore(df,'petal_w')
species = encode_text_index(df,'species')
num_classes = len(species)

x,y = to_xy(df,'species')

kf = KFold(5)
    
all_y_test = []
all_y_pred = []
fold = 0
for train, test in kf.split(x):        
    fold+=1
    print("Fold #{}".format(fold))
        
    x_train = x[train]
    y_train = y[train]
    x_test = x[test]
    y_test = y[test]
    
    model_dir = 'tmp/irisKF' + str(fold)

    feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]
    classifier = learn.DNNClassifier(
    model_dir= model_dir,
    hidden_units=[10, 20, 5], n_classes=num_classes, feature_columns=feature_columns)

    validation_monitor = tf.contrib.learn.monitors.ValidationMonitor(
        x_test,
        y_test,
        every_n_steps=50,
        early_stopping_metric="loss",
        early_stopping_metric_minimize=True,
        early_stopping_rounds=50)
    
    classifier.fit(x, y, steps=1000)

    pred = list(classifier.predict(x_test, as_iterable=True))
    
    all_y_test.append(y_test)
    all_y_pred.append(pred)        

    score = np.sqrt(metrics.accuracy_score(pred,y_test))
    print("Fold score (Accuracy): {}".format(score))


all_y_test = np.concatenate(all_y_test)
all_y_pred = np.concatenate(all_y_pred)
score = np.sqrt(metrics.accuracy_score(all_y_pred,all_y_test))
print()
print("Cross-validated score (Accuracy): {}".format(score))    
    