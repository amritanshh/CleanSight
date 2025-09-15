# Object Detection with YOLOv5 🚀

This project demonstrates a **simple Object Detection pipeline** using **YOLOv5** on the **COCO128 dataset**.  
It is designed to show dataset handling, preprocessing, model training, and evaluation on **Google Colab**.  

---

## 📂 Dataset
- **Dataset Used**: [COCO128](https://github.com/ultralytics/yolov5/releases/download/v1.0/coco128.zip) (a smaller subset of the COCO dataset with 128 training images).  
- Contains labeled images of everyday objects like people, cars, dogs, bottles, etc.  
- Used here for quick training and testing within limited time and compute.  

---

## ⚙️ Preprocessing
1. Downloaded the dataset directly in Colab.  
2. Extracted and organized into `train` and `val` directories.  
3. Images were resized and normalized automatically by YOLOv5’s dataloader.  
4. Labels were parsed into YOLO format (`.txt` files containing class + bounding box coordinates).  

---

## 🔄 Workflow
1. **Dataset Loading** – Downloaded and extracted COCO128 dataset.  
2. **Preprocessing** – Handled by YOLOv5: image resizing, normalization, label parsing.  
3. **Model Setup** – Used a pre-trained YOLOv5s model (small, lightweight).  
4. **Training** – Fine-tuned on COCO128 dataset for a few epochs.  
5. **Inference** – Ran detection on sample images and user-uploaded images.  
6. **Visualization** – Output bounding boxes drawn on detected objects with confidence scores.  

---

## 📊 Results
- The model was able to correctly identify and classify objects in images.  
- Example: People, cars, dogs, and bottles were detected with **bounding boxes and confidence scores**.  
- Training on COCO128 achieved quick results with decent accuracy for a demo.  

Example output (sample detection):  

<p align="center">
  <img src="https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/zidane.jpg" width="400">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/zidane_pred.jpg" width="400">
</p>

*(Above: YOLOv5 detects "person" and "sports ball" with bounding boxes + labels + confidence scores.)*

# Object Detection with YOLOv5 🚀

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1AzVggbcobyOBEyg8zTk-FKMfZ8t9dF_D?usp=sharing)

This repository demonstrates a **Computer Vision project** that combines **Object Detection** with a conceptual CleanSight frontend for AI-powered litter detection.



---

## 🌍 CleanSight Frontend (Extra Files in Repository)

Along with the object detection pipeline, this repository also contains extra files for a prototype **CleanSight application frontend**.

- **Purpose**: Demonstrates how object detection can be integrated into a real-world solution.  
- **Functionality**: 
  - Detects litter (wrappers, bottles, cans) from CCTV or edge devices using YOLO.  
  - Sends **geo-tagged alerts** to notify about detected litter.  
  - Provides a simple **frontend interface** (included in the repo) where detection results could be displayed.  

The frontend is not the main focus of this task but shows how the detection model could be extended into a working application.


## 📌 Key Takeaways
- Pre-trained models like YOLOv5 can be quickly fine-tuned on small datasets.  
- Even with minimal training, object detection works well for demo purposes.  
- Colab provides a GPU environment suitable for running such models without local setup.  

---

## 🛠️ Tech Stack
- **Python**  
- **PyTorch**  
- **YOLOv5**  
- **Google Colab**  

---


