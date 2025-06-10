import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Trash2 } from "lucide-react";

const LinkCard = ({ link, onDelete }) => {
  const handleVisit = () => {
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group relative overflow-hidden animate-fade-in hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-linkify-400/10 to-linkify-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-gray-800 group-hover:text-linkify-700 transition-colors">
            {link.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(link.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {link.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {link.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(link.createdAt)}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-linkify-600 font-medium bg-linkify-50 px-2 py-1 rounded-full">
              {link.group || "Ungrouped"}
            </div>

            <Button
              onClick={handleVisit}
              variant="gradient"
              size="sm"
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit
            </Button>
          </div>

          <div className="text-xs text-muted-foreground truncate bg-gray-50 px-2 py-1 rounded">
            {link.url}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
