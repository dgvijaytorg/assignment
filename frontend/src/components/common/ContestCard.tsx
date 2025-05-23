import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Calendar, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from "recoil";
import user from "@/store/user_atom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { ContestType } from "@/types/contest_type";

const platformGradients: Record<string, string> = {
  LeetCode: "from-[#1A1A1A] via-[#2D2D2D] to-[#FFA116]",
  Codeforces: "from-[#1A1A1A] via-[#2D2D2D] to-[#1F8ACB]",
  CodeChef: "from-[#1A1A1A] via-[#2D2D2D] to-[#5C2C06]",
};

export default function ContestCard({ contest }: { contest: ContestType }) {
  const curr_user = useRecoilValue(user);
  const [open, setOpen] = useState(false);
  const [videoLink, setVideoLink] = useState("");

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    await axios.post(
      `${import.meta.env.VITE_PROD_BACKEND_URL}/user/bookmarks`,
      { contestData: contest },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert(`Bookmarked ${contest.title}`);
  };

  const handleSaveLink = async () => {
    await axios.post(
      `${import.meta.env.VITE_PROD_BACKEND_URL}/contests/upload_solution`,
      { contestId: contest.id, videoSolution: videoLink },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert("Video Solution Link Saved");
    setOpen(false);
  };

  return (
    <>
      <Card
        className={`bg-gradient-to-br ${
          platformGradients[contest.type] ||
          "from-[#1A1A1A] via-[#2D2D2D] to-[#444]"
        } border border-[#2A2A2A] hover:scale-[1.02] transition-transform duration-300 rounded-2xl shadow-lg`}
      >
        <CardContent className="p-6 space-y-5 text-white">
          {/* Title + Link */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold leading-tight">
              {contest.title}
            </h3>
            <a href={contest.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-5 h-5 text-gray-300 hover:text-white" />
            </a>
          </div>

          {/* Platform Badge */}
          <Badge className="w-fit bg-black/40 border border-[#3E3E3E] rounded-lg text-sm px-3 py-1">
            {contest.type}
          </Badge>

          {/* Date & Duration */}
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(contest.start_date).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              {contest.duration >= 1440 ? (
                <span>{(contest.duration / 1440).toFixed(1)} days</span>
              ) : (
                <span>{(contest.duration / 60).toFixed(1)} hrs</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {contest.video_solution ? (
              <Button
                asChild
                className="bg-[#1F1F1F] border border-[#333] text-gray-200 
                         hover:bg-[#2A2A2A] hover:shadow-lg hover:shadow-green-500/30 
                         rounded-xl px-5 py-3 backdrop-blur 
                         transition-all duration-300 ease-in-out"
              >
                <a
                  href={contest.video_solution}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="text-green-400">Watch Solution</span>
                </a>
              </Button>
            ) : (
              curr_user.isAdmin && (
                <Button
                  className="bg-[#1F1F1F] border border-[#333] text-gray-200 
             hover:bg-[#2A2A2A] hover:shadow-lg hover:shadow-blue-600/30 
             rounded-xl px-5 py-3 backdrop-blur 
             transition-all duration-300 ease-in-out"
                  onClick={() => setOpen(true)}
                >
                  ➕ Add Solution
                </Button>
              )
            )}

            {curr_user.email && (
              <Button
                className="bg-[#1F1F1F] border border-[#333] text-gray-200 
                         hover:bg-[#2A2A2A] hover:shadow-lg hover:shadow-yellow-500/30 
                         rounded-xl px-5 py-3 backdrop-blur 
                         flex items-center gap-2 transition-all duration-300 ease-in-out"
                onClick={handleBookmark}
              >
                <Bookmark className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400">Bookmark</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Solution Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1A1A1A] border border-[#333] text-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Add Video Solution Link</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Paste YouTube link..."
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="bg-[#2A2A2A] text-white border border-[#444]"
          />
          <DialogFooter>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={handleSaveLink}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
