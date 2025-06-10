import React from "react";
import GroupCard from "./GroupCard";
import LinkCard from "./LinkCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Folder } from "lucide-react";

const GroupGrid = ({
  groups,
  links,
  onDeleteLink,
  onDeleteGroup,
  viewMode = "grid",
}) => {
  const ungroupedLinks = links.filter((link) => !link.group);

  return (
    <div className="space-y-8">
      {/* Grouped Links */}
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          links={links}
          onDeleteLink={onDeleteLink}
          onDeleteGroup={onDeleteGroup}
          viewMode={viewMode}
        />
      ))}

      {/* Ungrouped Links */}
      {ungroupedLinks.length > 0 && (
        <Card className="w-full animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Link2 className="h-5 w-5 text-gray-500" />
              Ungrouped Links
              <span className="text-sm text-slate-600 font-normal">
                ({ungroupedLinks.length} links)
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-3"
              }
            >
              {ungroupedLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={onDeleteLink}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {groups.length === 0 && ungroupedLinks.length === 0 && (
        <Card className="w-full animate-fade-in">
          <CardContent className="text-center py-16">
            <Folder className="h-16 w-16 mx-auto mb-4 text-slate-400 opacity-50" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No links yet
            </h3>
            <p className="text-slate-600">
              Start by adding your first link using the form above
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupGrid;
