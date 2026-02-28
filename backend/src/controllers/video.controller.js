import Purchase from "../models/Purchase.js";
import Video from "../models/Video.js";

export const createVideo = async (req, res) => {
  const { title, description, url, isPrivate, price } = req.body;
  if (!title || !url) {
    return res.status(400).json({ message: "title y url son requeridos" });
  }
  try {
    const video = await Video.create({
      user: req.userId,
      title,
      description,
      url,
      isPrivate: isPrivate || false,
      price: price || 0,
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideos = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = Math.max(parseInt(req.query.skip) || 0, 0);
  try {
    const videos = await Video.find({ isPrivate: false })
      .populate("user", "username name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("user", "username name");
    if (!video) return res.status(404).json({ message: "Vídeo no encontrado" });

    if (video.isPrivate) {
      const userId = req.userId;
      const isOwner = userId && String(video.user._id) === String(userId);
      if (!isOwner) {
        const bought = userId ? await Purchase.findOne({ user: userId, video: video._id }) : null;
        if (!bought) return res.status(403).json({ message: "Acceso denegado" });
      }
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!video) return res.status(404).json({ message: "Vídeo no encontrado" });
    res.json({ message: "Vídeo eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const canWatchVideo = async (req, res) => {
  try {
    const bought = await Purchase.findOne({
      user: req.userId,
      video: req.params.videoId,
    });
    res.json({ access: !!bought });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
