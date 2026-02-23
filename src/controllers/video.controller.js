import Video from "../models/Video.js";

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ningún vídeo" });
    }

    const video = await Video.create({
      title: req.body.title,
      description: req.body.description,
      url: req.file.path,
      isPrivate: req.body.isPrivate === "true",
      price: req.body.price || 0,
      owner: req.userId
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al subir el vídeo" });
  }
};

export const getPublicVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPrivate: false }).populate("owner", "name");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al obtener los vídeos" });
  }
};
