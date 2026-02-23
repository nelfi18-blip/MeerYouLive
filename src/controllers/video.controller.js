import Purchase from "../models/Purchase.js";
import Video from "../models/Video.js";

export const listVideos = async (req, res) => {
  try {
    const videos = await Video.find().select("-url").sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Vídeo no encontrado" });
    if (video.isPrivate) {
      const bought = await Purchase.findOne({ user: req.userId, video: video._id });
      if (!bought) {
        const { url, ...videoData } = video.toObject();
        return res.json({ ...videoData, url: null });
      }
    }
    res.json(video);
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
