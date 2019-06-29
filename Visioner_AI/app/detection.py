import tensorflow as tf
import numpy as np
import cv2

class Detector(object):
    def __init__(self,
                 model_path='./model/',
                 threshold=0.4,
                 gpu_fraction=0.4):
        self.threshold = threshold
        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        config.gpu_options.per_process_gpu_memory_fraction = gpu_fraction

        # load mobilessd model
        ssd_graph = tf.Graph()

        with ssd_graph.as_default():
            ssd_od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(model_path + "model.pb", 'rb') as fid:
                general_serialized_graph = fid.read()
                ssd_od_graph_def.ParseFromString(general_serialized_graph)
                tf.import_graph_def(ssd_od_graph_def, name='')
            sess_ssd = tf.Session(graph=ssd_graph, config=config)

        image_tensor = ssd_graph.get_tensor_by_name('image_tensor:0')
        boxes_tensor = ssd_graph.get_tensor_by_name('detection_boxes:0')
        scores_tensor = ssd_graph.get_tensor_by_name('detection_scores:0')
        classes_tensor = ssd_graph.get_tensor_by_name('detection_classes:0')
        num_detections_tensor = ssd_graph.get_tensor_by_name('num_detections:0')

        self.fd = lambda img: sess_ssd.run((boxes_tensor, scores_tensor, classes_tensor, num_detections_tensor),
                                     feed_dict={image_tensor: img})


    def detect(self, img):
        [h, w] = img.shape[:2]
        image_np = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        image_np_expanded = np.expand_dims(image_np, axis=0)
        (boxes, scores, classes, num_detections) = self.fd(image_np_expanded)
        b = np.array(boxes)
        s = np.array(scores)
        c = np.array(classes)
        res = np.concatenate((np.squeeze(b), s.T, c.T), axis=1)
        bboxes = np.array(
            [(x[1] * w, x[0] * h, x[3] * w, x[2] * h, x[4]) for x in res if x[4] >= self.threshold and int(x[5]) == 1])
        if len(bboxes) > 0:
            pick = self.nms(bboxes.copy(), 0.7, 'Min')
            bboxes = bboxes[pick, :]

            return len(bboxes)

        else:
            return 0

    @staticmethod
    def nms(boxes, threshold, method):
        if boxes.size == 0:
            return np.empty((0, 3))
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 2]
        y2 = boxes[:, 3]
        s = boxes[:, 4]
        area = (x2 - x1 + 1) * (y2 - y1 + 1)
        I = np.argsort(s)
        pick = np.zeros_like(s, dtype=np.int16)
        counter = 0
        while I.size > 0:
            i = I[-1]
            pick[counter] = i
            counter += 1
            idx = I[0:-1]
            xx1 = np.maximum(x1[i], x1[idx])
            yy1 = np.maximum(y1[i], y1[idx])
            xx2 = np.minimum(x2[i], x2[idx])
            yy2 = np.minimum(y2[i], y2[idx])
            w = np.maximum(0.0, xx2 - xx1 + 1)
            h = np.maximum(0.0, yy2 - yy1 + 1)
            inter = w * h
            if method is 'Min':
                o = inter / np.minimum(area[i], area[idx])
            else:
                o = inter / (area[i] + area[idx] - inter)
            I = I[np.where(o <= threshold)]
        pick = pick[0:counter]
        return pick

