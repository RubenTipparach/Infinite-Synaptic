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
tf.logging.set_verbosity(tf.logging.ERROR)
pd.options.display.encoding = 'utf-8'


path = "./kdata/"
filename_read = os.path.join(path,"train.csv")
df = pd.read_csv(filename_read,na_values=['NA','?'])

#print(df);

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


classOfWine = encode_text_index(df,"Outcome")
num_classes = len(classOfWine)

x, y = to_xy(df,'Outcome')


# The standard training set.
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.25)#, random_state=45) #<---- Can modify the seed here whenever

model_dir = 'tmp/kaggle'

feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]

opt = tf.train.AdagradOptimizer(learning_rate=0.01)

classifier = learn.DNNClassifier(
     optimizer=opt,
     model_dir= model_dir,
     hidden_units=[200, 100, 50],
     n_classes=num_classes,
     feature_columns=feature_columns)


validation_monitor = tf.contrib.learn.monitors.ValidationMonitor(
    x_test,
    y_test,
    every_n_steps=500,
    early_stopping_metric="loss",
    early_stopping_metric_minimize=True,
    early_stopping_rounds=50)

classifier.fit(x_train, y_train,monitors=[validation_monitor],steps=30000)

###############################################

pred = list(classifier.predict(x_test, as_iterable=True))
score = metrics.accuracy_score(y_test, pred)
print("Accuarcy before save: {}".format(score))

cm = confusion_matrix(y_test, pred)
np.set_printoptions(precision=2)
print('Confusion matrix')
print(cm)
plt.figure()
plot_confusion_matrix(cm, classOfWine)
plt.show()


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

# K-Fold Section

kf = KFold(5)

all_y_test = []
all_y_pred = []
fold = 0

#shutil.rmtree('tmp', ignore_errors=True)

for train, test in kf.split(x):
    fold+=1
    print("Fold #{}".format(fold))

    x_train = x[train]
    y_train = y[train]
    x_test = x[test]
    y_test = y[test]

    model_dir = 'tmp/kaggle' + str(fold)

    feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]

    opt = tf.train.AdagradOptimizer(learning_rate=0.01)
    
    classifier = learn.DNNClassifier(
         optimizer=opt,
         model_dir= model_dir,
         hidden_units=[200, 100, 50],
         n_classes=num_classes,
         feature_columns=feature_columns)

    validation_monitor = tf.contrib.learn.monitors.ValidationMonitor(
        x_test,
        y_test,
        every_n_steps=50,
        early_stopping_metric="loss",
        early_stopping_metric_minimize=True,
        early_stopping_rounds=50)

    classifier.fit(x_train, y_train, monitors=[validation_monitor],steps=30000)


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



############ generate data ############

filename_read = os.path.join(path,"test.csv")
df = pd.read_csv(filename_read,na_values=['NA','?'])

#print(df);

print('************** Actual Test commencing ****************');

###Setting the encoding rules here.
encode_numeric_zscore(df,'A1')
encode_numeric_zscore(df,'A2')
encode_numeric_zscore(df,'A3')
encode_numeric_zscore(df,'A4')

encode_numeric_zscore(df,'A5')
#encode_numeric_zscore(df,'A6')
encode_numeric_zscore(df,'A7')
encode_numeric_zscore(df,'A8')

encode_numeric_zscore(df,'A9')
encode_numeric_zscore(df,'A10')
#encode_numeric_zscore(df,'A11')
encode_numeric_zscore(df,'A12')

encode_numeric_zscore(df,'A13')
encode_numeric_zscore(df,'A14')
encode_numeric_zscore(df,'A15')
encode_numeric_zscore(df,'A16')
encode_numeric_zscore(df,'A17')
encode_numeric_zscore(df,'A18')
#encode_numeric_zscore(df,'A19')


x = to_x(df)

model_dir = 'tmp/kaggle' + str(fold)

feature_columns = [tf.contrib.layers.real_valued_column("", dimension=x.shape[0])]

opt = tf.train.AdagradOptimizer(learning_rate=0.1)
classifier = learn.DNNClassifier(
     optimizer=opt,
     model_dir= model_dir,
     hidden_units=[100, 50, 20],
     n_classes=num_classes,
     feature_columns=feature_columns)

classifier.fit(x, y, steps=1000)
print('ID,Outcome');

i = 1;
#print (list(classifier.predict(x, as_iterable=True)))
plist = list(classifier.predict(x, as_iterable=True))
for p in plist:
    print(str(i) + ',' + str(p))
    i += 1