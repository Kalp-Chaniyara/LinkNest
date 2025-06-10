import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, ExternalLink, Trash2 } from "lucide-react";
import LinkCard from "./LinkCard";

const GroupCard = ({
  group,
  links,
  onDeleteLink,
  onDeleteGroup,
  viewMode = "grid",
}) => {
  const groupLinks = links.filter((link) => link.group === group.name);

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: group.color }}
            />
            <Folder className="h-5 w-5 text-linkify-600" />
            {group.name}
            <span className="text-sm text-slate-600 font-normal">
              ({groupLinks.length} links)
            </span>
          </CardTitle>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteGroup(group.id)}
            className="hover:bg-red-100 hover:text-red-600 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {groupLinks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No links in this group yet</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {groupLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={onDeleteLink}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupCard;
