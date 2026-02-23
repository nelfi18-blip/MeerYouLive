import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      reporter: req.userId,
      reportedUser: req.body.reportedUser,
      video: req.body.video,
      reason: req.body.reason
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reporter reportedUser video");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: "Reporte no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
