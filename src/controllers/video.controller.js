import Purchase from "../models/Purchase.js";

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
